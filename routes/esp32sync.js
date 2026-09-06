// routes/esp32sync.js
// Endpoint che l'ESP32 chiama per scaricare l'elenco soci aggiornato,
// invece di doverlo scrivere a mano su ogni scheda. Risolve alla radice
// "tessera sconosciuta anche se registrata" e "presenti sempre a zero":
// prima le schede non avevano MAI un modo per sapere chi fosse chi.

const express = require('express');
const { db } = require('../db');
const { richiediChiaveEsp32 } = require('../middleware/auth');

const router = express.Router();

router.get('/esp32/users', richiediChiaveEsp32, async (req, res) => {
  const result = await db.execute(
    'SELECT id, nome, uid_tessera, qr_token FROM users WHERE attivo = 1'
  );
  res.json(result.rows);
});

module.exports = router;
