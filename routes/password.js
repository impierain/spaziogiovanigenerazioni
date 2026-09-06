// routes/password.js
// Impostazione password tramite il link ricevuto via email. Pubblica
// (nessun login: chi ha il link è, per definizione, chi deve impostarla).

const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');

const router = express.Router();

router.post('/imposta-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ errore: 'Token e password sono obbligatori.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ errore: 'La password deve avere almeno 8 caratteri.' });
  }

  const result = await db.execute({
    sql: 'SELECT id, reset_scadenza FROM users WHERE reset_token = ?',
    args: [token],
  });
  const utente = result.rows[0];

  if (!utente) {
    return res.status(400).json({ errore: 'Link non valido o già usato.' });
  }
  if (new Date(utente.reset_scadenza) < new Date()) {
    return res.status(400).json({ errore: 'Link scaduto. Chiedi all\'admin di generarne uno nuovo.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  await db.execute({
    sql: `UPDATE users SET password_hash = ?, reset_token = NULL, reset_scadenza = NULL WHERE id = ?`,
    args: [passwordHash, utente.id],
  });

  res.json({ ok: true });
});

module.exports = router;
