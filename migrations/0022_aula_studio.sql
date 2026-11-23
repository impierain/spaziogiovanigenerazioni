-- Preferenza per l'avviso «l'aula studio è aperta»: nessuna riga = mai chiesto; enabled 1 = lo vuole.
-- asked_at serve a riproporre la domanda ogni mese a chi non l'ha attivato.
CREATE TABLE aula_preferences (
  member_id TEXT PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  asked_at INTEGER NOT NULL DEFAULT (unixepoch())
);
