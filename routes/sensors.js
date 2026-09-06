// routes/sensors.js
// Riceve le letture di temperatura/umidità dalla stazione ambientale (ESP32 + DHT11)
// e le espone per la dashboard admin.

const express = require('express');
const { db } = require('../db');
const { richiediChiaveEsp32, richiediLogin } = require('../middleware/auth');

const router = express.Router();

// Chiamata dalla stazione ambientale ogni tot minuti
router.post('/sensors', richiediChiaveEsp32, async (req, res) => {
  const { timestamp, temperatura, umidita } = req.body;
  if (!timestamp) {
    return res.status(400).json({ errore: 'timestamp obbligatorio.' });
  }

  await db.execute({
    sql: 'INSERT INTO sensor_readings (timestamp, temperatura, umidita) VALUES (?, ?, ?)',
    args: [timestamp, temperatura ?? null, umidita ?? null],
  });

  res.status(201).json({ ok: true });
});

// Ultima lettura disponibile (per la dashboard)
router.get('/sensors/latest', richiediLogin, async (req, res) => {
  const result = await db.execute(
    'SELECT timestamp, temperatura, umidita FROM sensor_readings ORDER BY id DESC LIMIT 1'
  );
  res.json(result.rows[0] || null);
});

// Storico ultime N ore, per un grafico (default 24h)
// Nota: il confronto usa l'orario UTC del server; con i timestamp locali
// italiani della stazione ambientale può esserci uno scarto di 1-2 ore
// sui bordi dell'intervallo. Ininfluente per un grafico indicativo.
router.get('/sensors/storico', richiediLogin, async (req, res) => {
  const ore = Number(req.query.ore) || 24;
  const result = await db.execute({
    sql: `SELECT timestamp, temperatura, umidita FROM sensor_readings
          WHERE timestamp >= datetime('now', ?)
          ORDER BY timestamp ASC`,
    args: [`-${ore} hours`],
  });
  res.json(result.rows);
});

module.exports = router;
