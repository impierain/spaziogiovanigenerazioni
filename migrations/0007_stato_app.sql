-- Piccolo registro di stato dell'app (es. data dell'ultimo invio email riuscito, per l'avviso di inattività).
CREATE TABLE app_state (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
