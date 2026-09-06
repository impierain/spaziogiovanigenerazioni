// scripts/seed-admin.js
// Crea il primo utente amministratore. Da lanciare una sola volta con:
//   ADMIN_NOME="Piero" ADMIN_EMAIL="piero@esempio.it" ADMIN_PASSWORD="scegli_una_password" npm run seed-admin

require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db, initDb } = require('../db');

async function main() {
  const nome = process.env.ADMIN_NOME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!nome || !email || !password) {
    console.error('Devi passare ADMIN_NOME, ADMIN_EMAIL e ADMIN_PASSWORD come variabili d\'ambiente.');
    process.exit(1);
  }

  await initDb();

  const passwordHash = bcrypt.hashSync(password, 10);
  const qrToken = crypto.randomBytes(16).toString('hex');

  await db.execute({
    sql: `INSERT INTO users (nome, email, password_hash, ruolo, qr_token) VALUES (?, ?, ?, 'admin', ?)`,
    args: [nome, email, passwordHash, qrToken],
  });

  console.log(`Admin "${nome}" creato con successo (${email}).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
