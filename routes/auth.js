// routes/auth.js
// Login/logout. Al primo accesso (nessuna password impostata), il socio
// viene reindirizzato a sceglierla direttamente, senza link via email.

const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ errore: 'Email obbligatoria.' });
  }

  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ? AND attivo = 1',
    args: [email],
  });
  const utente = result.rows[0];

  if (!utente) {
    return res.status(401).json({ errore: 'Credenziali non valide.' });
  }

  // Primo accesso: nessuna password impostata ancora.
  // Lasciamo passare il login (senza controllare la password) e
  // segnaliamo al frontend di portare l'utente alla pagina di setup.
  if (!utente.password_hash) {
    req.session.user = {
      id: Number(utente.id),
      nome: utente.nome,
      ruolo: utente.ruolo,
      qr_token: utente.qr_token,
      primoAccesso: true,
    };
    return res.json({ ok: true, primoAccesso: true, utente: req.session.user });
  }

  if (!password) {
    return res.status(400).json({ errore: 'Password obbligatoria.' });
  }

  const passwordOk = bcrypt.compareSync(password, utente.password_hash);
  if (!passwordOk) {
    return res.status(401).json({ errore: 'Credenziali non valide.' });
  }

  req.session.user = {
    id: Number(utente.id),
    nome: utente.nome,
    ruolo: utente.ruolo,
    qr_token: utente.qr_token,
  };
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
