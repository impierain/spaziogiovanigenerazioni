// routes/admin.js
// Gestione utenti (soci), tessere e QR personali - solo per admin.

const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db } = require('../db');
const { richiediAdmin } = require('../middleware/auth');
const { inviaEmail } = require('../lib/email');

const router = express.Router();
router.use(richiediAdmin);

// Elenco soci
router.get('/users', async (req, res) => {
  const result = await db.execute(
    'SELECT id, nome, email, ruolo, uid_tessera, qr_token, attivo FROM users ORDER BY nome'
  );
  res.json(result.rows);
});

// Crea un nuovo socio. La password NON si imposta qui: se c'è un'email,
// si manda un link per sceglierla; il socio intanto può già entrare con
// la tessera RFID o il QR, che non dipendono dalla password del sito.
router.post('/users', async (req, res) => {
  const { nome, email, ruolo, uid_tessera } = req.body;
  if (!nome) return res.status(400).json({ errore: 'Il nome è obbligatorio.' });

  const qrToken = crypto.randomBytes(16).toString('hex');
  let resetToken = null;
  let resetScadenza = null;

  if (email) {
    resetToken = crypto.randomBytes(24).toString('hex');
    resetScadenza = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 ore
  }

  let idNuovoSocio;
  try {
    const result = await db.execute({
      sql: `INSERT INTO users (nome, email, ruolo, uid_tessera, qr_token, reset_token, reset_scadenza)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [nome, email || null, ruolo || 'guest', uid_tessera || null, qrToken, resetToken, resetScadenza],
    });
    idNuovoSocio = Number(result.lastInsertRowid);
  } catch (err) {
    return res.status(400).json({ errore: 'Email o tessera già in uso.' });
  }

  // L'email è "a parte": se fallisce non deve far sembrare fallita la
  // creazione del socio, che a questo punto è già salvato correttamente.
  if (email) {
    const link = `${process.env.SITE_URL}/imposta-password.html?token=${resetToken}`;
    await inviaEmail({
      a: email,
      oggetto: 'Benvenuto su Spazio Giovani Generazioni',
      html: `<p>Ciao ${nome},</p>
             <p>Il tuo account per il sito dello Spazio Giovani è pronto.</p>
             <p><a href="${link}">Clicca qui per scegliere la tua password</a></p>
             <p>Il link scade tra 48 ore.</p>`,
    });
  }

  res.status(201).json({ ok: true, id: idNuovoSocio, qr_token: qrToken });
});

// Modifica un socio esistente
router.put('/users/:id', async (req, res) => {
  const { nome, email, ruolo, uid_tessera, attivo } = req.body;
  await db.execute({
    sql: `UPDATE users SET nome = ?, email = ?, ruolo = ?, uid_tessera = ?, attivo = ?
          WHERE id = ?`,
    args: [nome, email || null, ruolo, uid_tessera || null, attivo ? 1 : 0, req.params.id],
  });
  res.json({ ok: true });
});

// Toglie solo la tessera a un socio (es. persa/smarrita), senza toccare
// il resto: il socio resta attivo e può ricevere una nuova tessera dopo.
router.post('/users/:id/rimuovi-tessera', async (req, res) => {
  await db.execute({
    sql: 'UPDATE users SET uid_tessera = NULL WHERE id = ?',
    args: [req.params.id],
  });
  res.json({ ok: true });
});

// Elimina (disattiva) un socio - non cancelliamo mai lo storico presenze/faccende
router.delete('/users/:id', async (req, res) => {
  await db.execute({
    sql: 'UPDATE users SET attivo = 0 WHERE id = ?',
    args: [req.params.id],
  });
  res.json({ ok: true });
});

// Tessere/QR scansionati ma non riconosciuti, da assegnare a un socio
router.get('/unknown-cards', async (req, res) => {
  const result = await db.execute(
    'SELECT * FROM unknown_cards ORDER BY timestamp DESC LIMIT 100'
  );
  res.json(result.rows);
});

// Assegna un UID/QR sconosciuto a un socio esistente (senza toccare gli altri suoi dati)
router.post('/users/:id/assegna-tessera', async (req, res) => {
  const { uid_tessera } = req.body;
  if (!uid_tessera) return res.status(400).json({ errore: 'uid_tessera obbligatorio.' });

  try {
    await db.execute({
      sql: 'UPDATE users SET uid_tessera = ? WHERE id = ?',
      args: [uid_tessera, req.params.id],
    });
    await db.execute({
      sql: 'DELETE FROM unknown_cards WHERE uid_tessera = ?',
      args: [uid_tessera],
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ errore: 'Tessera già assegnata a un altro socio.' });
  }
});

// Media ore di apertura per giorno, negli ultimi N giorni (?giorni=7 o 30)
router.get('/stats/apertura', async (req, res) => {
  const giorni = Math.min(parseInt(req.query.giorni) || 7, 90);
  const dal = new Date();
  dal.setDate(dal.getDate() - giorni);

  const result = await db.execute({
    sql: `SELECT timestamp, tipo FROM attendance_logs WHERE timestamp >= ? ORDER BY timestamp ASC`,
    args: [dal.toISOString()],
  });

  const secondiPerGiorno = {};
  let presenti = 0;
  let inizioApertura = null;

  for (const riga of result.rows) {
    const ts = new Date(riga.timestamp);
    if (riga.tipo === 'IN') {
      if (presenti === 0) inizioApertura = ts;
      presenti++;
    } else if (riga.tipo === 'OUT') {
      presenti = Math.max(0, presenti - 1);
      if (presenti === 0 && inizioApertura) {
        const giornoKey = riga.timestamp.slice(0, 10);
        const secondi = (ts - inizioApertura) / 1000;
        secondiPerGiorno[giornoKey] = (secondiPerGiorno[giornoKey] || 0) + secondi;
        inizioApertura = null;
      }
    }
  }

  const risposta = Object.keys(secondiPerGiorno).map((giorno) => ({
    giorno,
    ore_apertura: +(secondiPerGiorno[giorno] / 3600).toFixed(2),
  }));
  res.json(risposta);
});

// Letture di temperatura/umidità delle ultime N ore (?ore=48)
router.get('/stats/ambiente', async (req, res) => {
  const ore = Math.min(parseInt(req.query.ore) || 48, 24 * 30);
  const dal = new Date();
  dal.setHours(dal.getHours() - ore);

  const result = await db.execute({
    sql: 'SELECT timestamp, temperatura, umidita FROM sensor_readings WHERE timestamp >= ? ORDER BY timestamp ASC',
    args: [dal.toISOString()],
  });
  res.json(result.rows);
});

module.exports = router;
