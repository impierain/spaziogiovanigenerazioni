// routes/stats.js
// Statistiche aggregate per la dashboard admin.

const express = require('express');
const { db } = require('../db');
const { richiediAdmin } = require('../middleware/auth');

const router = express.Router();

// Ore in cui la sede è risultata "aperta" (almeno un socio dentro) per giorno,
// unendo gli intervalli di ingresso/uscita di tutti i soci.
router.get('/stats/apertura', richiediAdmin, async (req, res) => {
  const giorni = Number(req.query.giorni) === 30 ? 30 : 7;

  const result = await db.execute({
    sql: `SELECT timestamp, tipo FROM attendance_logs
          WHERE timestamp >= datetime('now', ?)
          ORDER BY timestamp ASC`,
    args: [`-${giorni} days`],
  });

  let inCorso = 0;
  let inizioFascia = null;
  const minutiPerGiorno = {};

  for (const riga of result.rows) {
    if (riga.tipo === 'IN') {
      if (inCorso === 0) inizioFascia = riga.timestamp;
      inCorso++;
    } else if (riga.tipo === 'OUT') {
      inCorso = Math.max(0, inCorso - 1);
      if (inCorso === 0 && inizioFascia) {
        const giorno = inizioFascia.slice(0, 10);
        const minuti = (new Date(riga.timestamp) - new Date(inizioFascia)) / 60000;
        minutiPerGiorno[giorno] = (minutiPerGiorno[giorno] || 0) + Math.max(0, minuti);
        inizioFascia = null;
      }
    }
  }

  const dati = Object.entries(minutiPerGiorno).map(([giorno, minuti]) => ({
    giorno,
    ore_apertura: Math.round((minuti / 60) * 10) / 10,
  }));

  res.json(dati);
});

// Letture ambientali (temperatura/umidità) delle ultime N ore, per il grafico
router.get('/stats/ambiente', richiediAdmin, async (req, res) => {
  const ore = Number(req.query.ore) || 48;
  const result = await db.execute({
    sql: `SELECT timestamp, temperatura, umidita FROM sensor_readings
          WHERE timestamp >= datetime('now', ?)
          ORDER BY timestamp ASC`,
    args: [`-${ore} hours`],
  });
  res.json(result.rows);
});

module.exports = router;
