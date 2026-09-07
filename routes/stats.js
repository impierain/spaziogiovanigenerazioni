// routes/stats.js
// Statistiche aggregate per la dashboard admin e per i singoli soci.

const express = require('express');
const { db } = require('../db');
const { richiediAdmin, richiediLogin } = require('../middleware/auth');

const router = express.Router();

// ================================================================
// STATISTICHE DELLA SEDE (solo admin)
// ================================================================
router.get('/stats/sede', richiediAdmin, async (req, res) => {
  const giorni = Number(req.query.giorni) === 30 ? 30 : 7;

  // -- Ore di apertura al giorno --
  const logApertura = await db.execute({
    sql: `SELECT timestamp, tipo FROM attendance_logs
          WHERE timestamp >= datetime('now', ?) AND tipo IN ('IN','OUT')
          ORDER BY timestamp ASC`,
    args: [`-${giorni} days`],
  });

  let inCorso = 0, inizioFascia = null;
  const minutiPerGiorno = {};
  for (const r of logApertura.rows) {
    if (r.tipo === 'IN') {
      if (inCorso === 0) inizioFascia = r.timestamp;
      inCorso++;
    } else {
      inCorso = Math.max(0, inCorso - 1);
      if (inCorso === 0 && inizioFascia) {
        const g = inizioFascia.slice(0, 10);
        const min = (new Date(r.timestamp) - new Date(inizioFascia)) / 60000;
        minutiPerGiorno[g] = (minutiPerGiorno[g] || 0) + Math.max(0, min);
        inizioFascia = null;
      }
    }
  }
  const oreApertura = Object.entries(minutiPerGiorno).map(([g, m]) => ({
    giorno: g,
    ore: Math.round((m / 60) * 10) / 10,
  })).sort((a, b) => a.giorno.localeCompare(b.giorno));
  const mediaOre = oreApertura.length
    ? Math.round((oreApertura.reduce((s, d) => s + d.ore, 0) / oreApertura.length) * 10) / 10 : 0;

  // -- Giorni della settimana più frequentati --
  const logSettimana = await db.execute(
    `SELECT strftime('%w', timestamp) AS dow, COUNT(*) AS n
     FROM attendance_logs WHERE tipo = 'IN'
     GROUP BY dow ORDER BY dow ASC`
  );
  const nomiGiorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const perGiornoSettimana = logSettimana.rows.map(r => ({
    giorno: nomiGiorni[parseInt(r.dow)],
    ingressi: r.n,
  }));

  // -- Fasce orarie più frequentate (raggruppate ogni 2 ore) --
  const logOrario = await db.execute(
    `SELECT CAST(strftime('%H', timestamp) AS INTEGER) AS ora, COUNT(*) AS n
     FROM attendance_logs WHERE tipo = 'IN'
     GROUP BY ora ORDER BY ora ASC`
  );
  const perFasceOrarie = logOrario.rows.map(r => ({
    fascia: `${String(r.ora).padStart(2,'0')}:00`,
    ingressi: r.n,
  }));

  // -- Trend mensile (ultimi 6 mesi) --
  const trendMensile = await db.execute(
    `SELECT strftime('%Y-%m', timestamp) AS mese, COUNT(*) AS ingressi
     FROM attendance_logs WHERE tipo = 'IN'
     AND timestamp >= datetime('now', '-6 months')
     GROUP BY mese ORDER BY mese ASC`
  );

  // -- Classifica soci più presenti (questo mese) --
  const classifica = await db.execute(
    `SELECT u.nome, COUNT(*) AS ingressi
     FROM attendance_logs al
     JOIN users u ON u.id = al.user_id
     WHERE al.tipo = 'IN' AND strftime('%Y-%m', al.timestamp) = strftime('%Y-%m', 'now')
     GROUP BY al.user_id ORDER BY ingressi DESC LIMIT 10`
  );

  // -- Confronto questo mese vs mese scorso --
  const confronto = await db.execute(
    `SELECT strftime('%Y-%m', timestamp) AS mese, COUNT(*) AS ingressi,
            SUM(CASE WHEN tipo = 'IN' THEN 1 ELSE 0 END) AS entrate
     FROM attendance_logs
     WHERE timestamp >= datetime('now', '-2 months') AND tipo IN ('IN','OUT')
     GROUP BY mese ORDER BY mese DESC LIMIT 2`
  );

  // -- Streak: giorni consecutivi in cui la sede è stata aperta --
  const giorniAperti = await db.execute(
    `SELECT DISTINCT DATE(timestamp) AS g FROM attendance_logs
     WHERE tipo = 'IN' ORDER BY g DESC`
  );
  let streak = 0;
  const oggi = new Date().toISOString().slice(0, 10);
  let atteso = oggi;
  for (const r of giorniAperti.rows) {
    if (r.g === atteso) {
      streak++;
      const d = new Date(atteso);
      d.setDate(d.getDate() - 1);
      atteso = d.toISOString().slice(0, 10);
    } else break;
  }

  // -- Durata media sessioni sede --
  const sessioniRaw = await db.execute(
    `SELECT timestamp, tipo, user_id FROM attendance_logs
     WHERE tipo IN ('IN','OUT') ORDER BY timestamp ASC`
  );
  let durataMin = 0, numSessioni = 0;
  const ultimoIn = {};
  for (const r of sessioniRaw.rows) {
    if (r.tipo === 'IN') {
      ultimoIn[r.user_id] = r.timestamp;
    } else if (r.tipo === 'OUT' && ultimoIn[r.user_id]) {
      durataMin += (new Date(r.timestamp) - new Date(ultimoIn[r.user_id])) / 60000;
      numSessioni++;
      delete ultimoIn[r.user_id];
    }
  }
  const durataMediaMin = numSessioni > 0 ? Math.round(durataMin / numSessioni) : 0;

  res.json({
    oreApertura, mediaOre,
    perGiornoSettimana,
    perFasceOrarie,
    trendMensile: trendMensile.rows,
    classifica: classifica.rows,
    confronto: confronto.rows,
    streak,
    durataMediaSessione: durataMediaMin,
  });
});

// ================================================================
// STATISTICHE DEL SINGOLO SOCIO
// Accessibile dall'admin (qualsiasi id) e dal socio stesso (solo il proprio)
// ================================================================
router.get('/stats/socio/:id', richiediLogin, async (req, res) => {
  const idRichiesto = parseInt(req.params.id);
  const { id: idSessione, ruolo } = req.session.user;

  if (ruolo !== 'admin' && idSessione !== idRichiesto) {
    return res.status(403).json({ errore: 'Puoi vedere solo le tue statistiche.' });
  }

  const utenteRes = await db.execute({
    sql: 'SELECT id, nome, email, ruolo, uid_tessera FROM users WHERE id = ?',
    args: [idRichiesto],
  });
  if (!utenteRes.rows[0]) return res.status(404).json({ errore: 'Socio non trovato.' });
  const utente = utenteRes.rows[0];

  // Storico ingressi/uscite
  const storico = await db.execute({
    sql: `SELECT timestamp, tipo, fonte FROM attendance_logs
          WHERE user_id = ? AND tipo IN ('IN','OUT')
          ORDER BY timestamp DESC LIMIT 100`,
    args: [idRichiesto],
  });

  // Ore totali in sede questo mese e in totale
  const logOre = await db.execute({
    sql: `SELECT timestamp, tipo FROM attendance_logs
          WHERE user_id = ? AND tipo IN ('IN','OUT')
          ORDER BY timestamp ASC`,
    args: [idRichiesto],
  });
  let minTotali = 0, minMese = 0, numSessPersonali = 0;
  const meseCorrente = new Date().toISOString().slice(0, 7);
  let lastIn = null;
  for (const r of logOre.rows) {
    if (r.tipo === 'IN') {
      lastIn = r.timestamp;
    } else if (r.tipo === 'OUT' && lastIn) {
      const dur = (new Date(r.timestamp) - new Date(lastIn)) / 60000;
      minTotali += dur;
      if (r.timestamp.slice(0, 7) === meseCorrente) minMese += dur;
      numSessPersonali++;
      lastIn = null;
    }
  }

  // Grafico presenze nel tempo (ultimo anno, per mese)
  const graficoPres = await db.execute({
    sql: `SELECT strftime('%Y-%m', timestamp) AS mese, COUNT(*) AS ingressi
          FROM attendance_logs WHERE user_id = ? AND tipo = 'IN'
          AND timestamp >= datetime('now', '-12 months')
          GROUP BY mese ORDER BY mese ASC`,
    args: [idRichiesto],
  });

  // Faccende fatte questo mese
  const faccende = await db.execute({
    sql: `SELECT data, tipo_faccenda, note FROM chores
          WHERE user_id = ? ORDER BY data DESC LIMIT 50`,
    args: [idRichiesto],
  });

  res.json({
    utente,
    oreTotali: Math.round(minTotali / 60 * 10) / 10,
    oreMese: Math.round(minMese / 60 * 10) / 10,
    mediaOrePerVisita: numSessPersonali > 0
      ? Math.round((minTotali / numSessPersonali / 60) * 10) / 10 : 0,
    numVisite: numSessPersonali,
    storico: storico.rows,
    graficoPres: graficoPres.rows,
    faccende: faccende.rows,
  });
});

// ================================================================
// Ore di apertura (endpoint legacy, per compatibilità con il vecchio codice)
// ================================================================
router.get('/stats/apertura', richiediAdmin, async (req, res) => {
  const giorni = Number(req.query.giorni) === 30 ? 30 : 7;
  const result = await db.execute({
    sql: `SELECT timestamp, tipo FROM attendance_logs
          WHERE timestamp >= datetime('now', ?) AND tipo IN ('IN','OUT')
          ORDER BY timestamp ASC`,
    args: [`-${giorni} days`],
  });
  let inCorso = 0, inizioFascia = null;
  const minutiPerGiorno = {};
  for (const r of result.rows) {
    if (r.tipo === 'IN') {
      if (inCorso === 0) inizioFascia = r.timestamp;
      inCorso++;
    } else {
      inCorso = Math.max(0, inCorso - 1);
      if (inCorso === 0 && inizioFascia) {
        const g = inizioFascia.slice(0, 10);
        const m = (new Date(r.timestamp) - new Date(inizioFascia)) / 60000;
        minutiPerGiorno[g] = (minutiPerGiorno[g] || 0) + Math.max(0, m);
        inizioFascia = null;
      }
    }
  }
  const dati = Object.entries(minutiPerGiorno).map(([g, m]) => ({
    giorno: g,
    ore_apertura: Math.round((m / 60) * 10) / 10,
  }));
  res.json(dati);
});

// Letture ambientali per il grafico
router.get('/stats/ambiente', richiediAdmin, async (req, res) => {
  const ore = Number(req.query.ore) || 48;
  const result = await db.execute({
    sql: `SELECT timestamp, temperatura, umidita FROM sensor_readings
          WHERE timestamp >= datetime('now', ?) ORDER BY timestamp ASC`,
    args: [`-${ore} hours`],
  });
  res.json(result.rows);
});

module.exports = router;
