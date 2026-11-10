-- Impostazioni testuali dell'app: per ora il codice segreto del QR d'ingresso (lo cambiano i referenti).
CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  text_value TEXT NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
