// routes/chores.js
// Registrazione faccende (spazzatura, pulizie, ecc.) dal sito, dopo login.

const express = require('express');
const { db } = require('../db');
const { richiediLogin, richiediAdmin } = require('../middleware/auth');

const router = express.Router();

const TIPI_FACCENDA = ['spazzatura', 'pulizia', 'sistemazione', 'altro'];

router.post('/chores', richiediLogin, async (req, res) => {
  const { tipo_faccenda, note, user_id } = req.body;
  if (!TIPI_FACCENDA.includes(tipo_faccenda)) {
    return res.status(400).json({ errore: 'Tipo faccenda non valido.', tipi_validi: TIPI_FACCENDA });
  }

  // Solo un admin può registrare una faccenda per conto di un altro socio
  const idDestinatario = (req.session.user.ruolo === 'admin' && user_id) ? user_id : req.session.user.id;

  const oggi = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  await db.execute({
    sql: 'INSERT INTO chores (user_id, data, tipo_faccenda, note) VALUES (?, ?, ?, ?)',
    args: [idDestinatario, oggi, tipo_faccenda, note || null],
  });

  res.status(201).json({ ok: true });
});

// Elenco faccende, filtrabile per mese (?mese=2026-09) e per utente (solo admin)
router.get('/chores', richiediLogin, async (req, res) => {
  const { mese, user_id } = req.query;
  let sql = `
    SELECT c.id, c.data, c.tipo_faccenda, c.note, u.nome
    FROM chores c
    JOIN users u ON u.id = c.user_id
    WHERE 1=1
  `;
  const args = [];

  // I guest vedono solo le proprie faccende, gli admin possono vedere tutti
  if (req.session.user.ruolo !== 'admin') {
    sql += ' AND c.user_id = ?';
    args.push(req.session.user.id);
  } else if (user_id) {
    sql += ' AND c.user_id = ?';
    args.push(user_id);
  }

  if (mese) {
    sql += " AND strftime('%Y-%m', c.data) = ?";
    args.push(mese);
  }

  sql += ' ORDER BY c.data DESC';

  const result = await db.execute({ sql, args });
  res.json(result.rows);
});

module.exports = router;
