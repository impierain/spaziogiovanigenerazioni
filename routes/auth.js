// routes/auth.js
// Login/logout per guest e admin.

const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ errore: 'Email e password sono obbligatorie.' });
  }

  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ? AND attivo = 1',
    args: [email],
  });
  const utente = result.rows[0];

  if (!utente || !utente.password_hash) {
    return res.status(401).json({ errore: 'Credenziali non valide.' });
  }

  const passwordOk = bcrypt.compareSync(password, utente.password_hash);
  if (!passwordOk) {
    return res.status(401).json({ errore: 'Credenziali non valide.' });
  }

  req.session.user = { id: utente.id, nome: utente.nome, ruolo: utente.ruolo, qr_token: utente.qr_token };
  res.json({ ok: true, utente: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ errore: 'Non autenticato.' });
  res.json(req.session.user);
});

module.exports = router;
