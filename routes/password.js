// routes/password.js
// Due modi per impostare/cambiare la password:
// 1. Primo accesso: l'utente è già loggato (sessione primoAccesso=true),
//    imposta la password direttamente senza nessun link via email.
// 2. Reset admin: l'admin può azzerare la password di qualsiasi socio,
//    che al prossimo login userà di nuovo il flusso "primo accesso".

const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { richiediLogin, richiediAdmin } = require('../middleware/auth');

const router = express.Router();

// Primo accesso: sessione aperta, nessun token esterno necessario
router.post('/imposta-password-primo-accesso', richiediLogin, async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ errore: 'La password deve avere almeno 8 caratteri.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  await db.execute({
    sql: 'UPDATE users SET password_hash = ?, reset_token = NULL, reset_scadenza = NULL WHERE id = ?',
    args: [passwordHash, req.session.user.id],
  });

  // Aggiorniamo la sessione togliendo primoAccesso
  req.session.user.primoAccesso = false;
  res.json({ ok: true, utente: req.session.user });
});

// Cambio password dalla propria area personale (utente loggato)
router.post('/cambia-password', richiediLogin, async (req, res) => {
  const { vecchia_password, nuova_password } = req.body;
  if (!nuova_password || nuova_password.length < 8) {
    return res.status(400).json({ errore: 'La nuova password deve avere almeno 8 caratteri.' });
  }

  const result = await db.execute({
    sql: 'SELECT password_hash FROM users WHERE id = ?',
    args: [req.session.user.id],
  });
  const utente = result.rows[0];

  if (utente.password_hash && !bcrypt.compareSync(vecchia_password || '', utente.password_hash)) {
    return res.status(401).json({ errore: 'La vecchia password non è corretta.' });
  }

  const passwordHash = bcrypt.hashSync(nuova_password, 10);
  await db.execute({
    sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
    args: [passwordHash, req.session.user.id],
  });
  res.json({ ok: true });
});

// Reset password da parte dell'admin: azzera la password del socio, che
// al prossimo login userà il flusso "primo accesso" per sceglierne una nuova.
router.post('/admin/users/:id/reset-password', richiediAdmin, async (req, res) => {
  await db.execute({
    sql: 'UPDATE users SET password_hash = NULL, reset_token = NULL, reset_scadenza = NULL WHERE id = ?',
    args: [req.params.id],
  });
  res.json({ ok: true });
});

// Vecchio endpoint da link email (tenuto per compatibilità, ora redirige al flusso sessione)
router.post('/imposta-password', async (req, res) => {
  res.status(410).json({ errore: 'Questo metodo non è più supportato. Accedi con la tua email e imposta la password al primo accesso.' });
});

module.exports = router;
