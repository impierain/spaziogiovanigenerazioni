// db.js
// Connessione al database Turso (SQLite compatibile, in cloud, gratuito)
// e creazione delle tabelle se non esistono già.

const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT,
      ruolo TEXT NOT NULL DEFAULT 'guest' CHECK(ruolo IN ('guest','admin')),
      uid_tessera TEXT UNIQUE,
      qr_token TEXT UNIQUE,
      attivo INTEGER NOT NULL DEFAULT 1,
      creato_il TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS attendance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      tipo TEXT NOT NULL,
      fonte TEXT NOT NULL DEFAULT 'rfid',
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS chores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      tipo_faccenda TEXT NOT NULL,
      note TEXT,
      creato_il TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS unknown_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid_tessera TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      temperatura REAL,
      umidita REAL
    )`,
    `CREATE TABLE IF NOT EXISTS diagnostica (
      station_id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      wifi_connesso INTEGER,
      rssi INTEGER,
      pendenti INTEGER,
      presenti_locali INTEGER,
      ultimo_errore TEXT
    )`,
    // Log eventi "tipo monitor seriale", ma visibile dal sito: così non
    // serve più il computer collegato via USB per sapere cosa sta
    // facendo la scheda.
    `CREATE TABLE IF NOT EXISTS station_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      messaggio TEXT NOT NULL
    )`,
  ], 'write');

  // ---------------------------------------------------------------
  // MIGRAZIONI: ogni colonna/indice nuovo aggiunto dopo la prima
  // versione va qui, non più a mano su Drizzle Studio. Se la colonna
  // esiste già, l'errore viene semplicemente ignorato: è normale e
  // succede ogni volta tranne la prima.
  // ---------------------------------------------------------------
  const migrazioni = [
    `ALTER TABLE attendance_logs ADD COLUMN event_id TEXT`,
    `ALTER TABLE unknown_cards ADD COLUMN assegnata INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN reset_token TEXT`,
    `ALTER TABLE users ADD COLUMN reset_scadenza TEXT`,
  ];
  for (const sql of migrazioni) {
    try {
      await db.execute(sql);
    } catch (err) {
      // "duplicate column name" = migrazione già applicata in passato, va bene così
    }
  }

  // Indici e vincoli si possono ricreare sempre con IF NOT EXISTS, quindi
  // questi restano nel batch principale invece che tra le migrazioni:
  try {
    await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_event_id ON attendance_logs(event_id)`);
  } catch (err) { /* indice già presente */ }
}

module.exports = { db, initDb };
