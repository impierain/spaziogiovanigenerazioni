// routes/attendance.js
// Riceve i log di ingresso/uscita dall'ESP32 (RFID o QR) e mostra chi c'è dentro.

const express = require('express');
const { db } = require('../db');
const { richiediChiaveEsp32, richiediLogin, richiediAdmin } = require('../middleware/auth');

const router = express.Router();

// Chiamata dall'ESP32 per ogni evento (tessera RFID o QR scansionato).
// event_id è opzionale ma fortemente consigliato: se lo stesso evento
// arriva due volte (es. l'ESP32 non ha ricevuto la conferma e riprova),
// l'indice unico su event_id fa scartare in silenzio il duplicato.
router.post('/attendance', richiediChiaveEsp32, async (req, res) => {
  const { uid, tipo, timestamp, fonte, event_id } = req.body;
  if (!uid || !tipo || !timestamp) {
    return res.status(400).json({ errore: 'uid, tipo e timestamp sono obbligatori.' });
  }

  const utenteRes = await db.execute({
    sql: 'SELECT id FROM users WHERE uid_tessera = ? OR qr_token = ?',
    args: [uid, uid],
  });

  if (utenteRes.rows.length === 0) {
    // Tessera/QR non riconosciuto: lo mettiamo da parte per revisione admin
    await db.execute({
      sql: 'INSERT INTO unknown_cards (uid_tessera, timestamp) VALUES (?, ?)',
      args: [uid, timestamp],
    });
    return res.status(201).json({ ok: true, sconosciuto: true });
  }

  const userId = utenteRes.rows[0].id;
  await db.execute({
    sql: `INSERT OR IGNORE INTO attendance_logs (user_id, timestamp, tipo, fonte, event_id)
          VALUES (?, ?, ?, ?, ?)`,
    args: [userId, timestamp, tipo, fonte || 'rfid', event_id || null],
  });

  res.status(201).json({ ok: true });
});

// Check-in/check-out dalla pagina QR personale (utente loggato dal proprio telefono)
router.post('/qr-checkin', richiediLogin, async (req, res) => {
  const userId = req.session.user.id;

  const ultimo = await db.execute({
    sql: `SELECT tipo FROM attendance_logs WHERE user_id = ? AND tipo IN ('IN','OUT') ORDER BY id DESC LIMIT 1`,
    args: [userId],
  });
  const nuovoTipo = ultimo.rows[0]?.tipo === 'IN' ? 'OUT' : 'IN';
  const timestamp = new Date().toISOString();
  const eventId = 'qr-' + userId + '-' + Date.now();

  await db.execute({
    sql: `INSERT OR IGNORE INTO attendance_logs (user_id, timestamp, tipo, fonte, event_id)
          VALUES (?, ?, ?, 'qr', ?)`,
    args: [userId, timestamp, nuovoTipo, eventId],
  });

  res.json({ ok: true, tipo: nuovoTipo });
});

// Chi c'è dentro adesso (visibile anche ai guest). Ignora DUPLICATO/ANOMALIA
// nel determinare l'ultimo stato, altrimenti un doppio scan farebbe
// "sparire" qualcuno che è ancora dentro.
router.get('/status', richiediLogin, async (req, res) => {
  const result = await db.execute(`
    SELECT u.id, u.nome, al.timestamp AS dal
    FROM users u
    JOIN attendance_logs al ON al.id = (
      SELECT id FROM attendance_logs
      WHERE user_id = u.id AND tipo IN ('IN','OUT')
      ORDER BY id DESC LIMIT 1
    )
    WHERE al.tipo = 'IN'
    ORDER BY al.timestamp ASC
  `);
  res.json(result.rows);
});

// Storico log, solo admin, con filtri opzionali ?da=&a=
router.get('/logs', richiediAdmin, async (req, res) => {
  const { da, a } = req.query;
  let sql = `
    SELECT al.id, al.user_id, u.nome, al.timestamp, al.tipo, al.fonte
    FROM attendance_logs al
    JOIN users u ON u.id = al.user_id
    WHERE 1=1
  `;
  const args = [];
  if (da) { sql += ' AND al.timestamp >= ?'; args.push(da); }
  if (a)  { sql += ' AND al.timestamp <= ?'; args.push(a); }
  sql += ' ORDER BY al.timestamp ASC LIMIT 1000';

  const result = await db.execute({ sql, args });

  // Costruiamo una frase leggibile per ogni riga, e per le uscite
  // calcoliamo quanto tempo la persona è rimasta dentro.
  const ultimoIngresso = {}; // per utente: timestamp dell'ultimo IN visto
  const righeConDettaglio = result.rows.map((r) => {
    const ora = r.timestamp.slice(11, 16); // HH:MM
    let descrizione;

    if (r.tipo === 'IN') {
      ultimoIngresso[r.user_id] = r.timestamp;
      descrizione = `Entrata alle ${ora}`;
    } else if (r.tipo === 'OUT') {
      const inTs = ultimoIngresso[r.user_id];
      if (inTs) {
        const minuti = Math.round((new Date(r.timestamp) - new Date(inTs)) / 60000);
        const h = Math.floor(minuti / 60);
        const m = minuti % 60;
        const durata = h > 0 ? `${h}h ${m}min` : `${m} min`;
        descrizione = `Uscita alle ${ora} (dentro ${durata})`;
        delete ultimoIngresso[r.user_id];
      } else {
        descrizione = `Uscita alle ${ora}`;
      }
    } else if (r.tipo === 'DUPLICATO') {
      descrizione = `Tessera letta due volte alle ${ora}`;
    } else {
      descrizione = `Anomalia alle ${ora}`;
    }

    return { ...r, descrizione };
  });

  // Il più recente per primo, come si aspetta il pannello
  righeConDettaglio.reverse();
  res.json(righeConDettaglio);
});

module.exports = router;
