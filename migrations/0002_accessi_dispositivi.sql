-- Dispositivi (ESP32 con lettore) legati a un referente approvato.
-- La chiave del dispositivo è salvata solo come hash SHA-256.
CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 64),
  organizer_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Token QR per socio: salvato come hash, rigenerabile.
CREATE TABLE member_qr (
  member_id TEXT PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  rotated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Ingressi e uscite per calcolare le ore in sede.
CREATE TABLE accessi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES devices(id),
  direction TEXT NOT NULL CHECK (direction IN ('IN', 'OUT')),
  at INTEGER NOT NULL,
  activity_id TEXT REFERENCES activities(id),
  UNIQUE (device_id, member_id, at)
);

CREATE INDEX accessi_member_at ON accessi(member_id, at);
