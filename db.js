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
      reset_token TEXT UNIQUE,
      reset_scadenza TEXT,
      creato_il TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    // tipo include anche DUPLICATO (stessa tessera letta due volte troppo
    // vicine) e ANOMALIA (letture incoerenti). event_id serve a scartare
    // automaticamente un evento reinviato due volte dall'ESP32 durante
    // una sincronizzazione offline interrotta a metà.
    `CREATE TABLE IF NOT EXISTS attendance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('IN','OUT','DUPLICATO','ANOMALIA')),
      fonte TEXT NOT NULL DEFAULT 'rfid',
      event_id TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_event_id ON attendance_logs(event_id)`,
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
      timestamp TEXT NOT NULL,
      assegnata INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      temperatura REAL,
      umidita REAL
    )`,
    // Una riga per stazione (RFID, camera, ecc.), sempre sovrascritta con
    // l'ultimo stato ricevuto: è la base della pagina di diagnostica.
    `CREATE TABLE IF NOT EXISTS diagnostica (
      station_id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      wifi_connesso INTEGER,
      rssi INTEGER,
      pendenti INTEGER,
      presenti_locali INTEGER,
      ultimo_errore TEXT
    )`,
  ], 'write');
}

module.exports = { db, initDb };
