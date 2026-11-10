-- Ogni faccenda appartiene a un percorso dell'albero delle competenze.
ALTER TABLE chore_types ADD COLUMN path TEXT NOT NULL DEFAULT 'solidarieta'
  CHECK (path IN ('studio', 'creativita', 'socialita', 'cittadinanza', 'solidarieta'));
