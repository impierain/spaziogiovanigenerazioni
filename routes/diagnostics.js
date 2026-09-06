// routes/diagnostics.js
// Riceve un "battito" periodico da ogni stazione ESP32 e lo mostra
// nel pannello admin, per capire a colpo d'occhio se qualcosa è offline
// o sta accumulando errori, senza dover leggere il monitor seriale.

const express = require('express');
const { db } = require('../db');
const { richiediChiaveEsp32, richiediAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/diagnostics', richiediChiaveEsp32, async (req, res) => {
  const { station_id, wifi_connesso, rssi, pendenti, presenti_locali, ultimo_errore } = req.body;
  if (!station_id) {
    return res.status(400).json({ errore: 'station_id obbligatorio.' });
  }

  await db.execute({
    sql: `INSERT INTO diagnostica (station_id, timestamp, wifi_connesso, rssi, pendenti, presenti_locali, ultimo_errore)
          VALUES (?, datetime('now'), ?, ?, ?, ?, ?)
          ON CONFLICT(station_id) DO UPDATE SET
            timestamp = excluded.timestamp,
            wifi_connesso = excluded.wifi_connesso,
            rssi = excluded.rssi,
            pendenti = excluded.pendenti,
            presenti_locali = excluded.presenti_locali,
            ultimo_errore = excluded.ultimo_errore`,
    args: [station_id, wifi_connesso ? 1 : 0, rssi ?? null, pendenti ?? null, presenti_locali ?? null, ultimo_errore || null],
  });

  res.status(201).json({ ok: true });
});

router.get('/admin/diagnostics', richiediAdmin, async (req, res) => {
  const result = await db.execute(`
    SELECT *, (strftime('%s','now') - strftime('%s', timestamp)) AS secondi_fa
    FROM diagnostica ORDER BY station_id
  `);
  res.json(result.rows);
});

module.exports = router;
