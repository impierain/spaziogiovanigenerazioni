// routes/stationlog.js
// Log eventi delle stazioni ESP32, visibile dal sito - sostituisce la
// necessità di tenere il monitor seriale aperto su un computer.

const express = require('express');
const { db } = require('../db');
const { richiediChiaveEsp32, richiediAdmin } = require('../middleware/auth');

const router = express.Router();

// L'ESP32 manda un gruppetto di righe alla volta (accumulate mentre era
// offline, o semplicemente per non fare una richiesta per ogni singola riga).
router.post('/station-log', richiediChiaveEsp32, async (req, res) => {
  const { station_id, righe } = req.body;
  if (!station_id || !Array.isArray(righe)) {
    return res.status(400).json({ errore: 'station_id e righe (array) sono obbligatori.' });
  }

  for (const riga of righe.slice(0, 50)) { // limite di sicurezza per richiesta
    await db.execute({
      sql: 'INSERT INTO station_logs (station_id, timestamp, messaggio) VALUES (?, ?, ?)',
      args: [station_id, riga.ts || new Date().toISOString(), String(riga.testo).slice(0, 200)],
    });
  }

  res.status(201).json({ ok: true });
});

router.get('/admin/station-log', richiediAdmin, async (req, res) => {
  const stationId = req.query.station_id;
  let sql = 'SELECT station_id, timestamp, messaggio FROM station_logs';
  const args = [];
  if (stationId) { sql += ' WHERE station_id = ?'; args.push(stationId); }
  sql += ' ORDER BY id DESC LIMIT 100';

  const result = await db.execute({ sql, args });
  res.json(result.rows);
});

module.exports = router;
