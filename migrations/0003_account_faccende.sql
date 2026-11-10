-- Account con password, tessere NFC, token per impostare la password,
-- limite ai tentativi di accesso, faccende con XP e Formaggi.

ALTER TABLE members ADD COLUMN full_name TEXT;
ALTER TABLE members ADD COLUMN phone TEXT;
ALTER TABLE members ADD COLUMN password_hash TEXT;
ALTER TABLE members ADD COLUMN uid_tessera TEXT;
CREATE UNIQUE INDEX members_uid_tessera ON members(uid_tessera) WHERE uid_tessera IS NOT NULL;

-- Link monouso per impostare o reimpostare la password. Salvato solo l'hash.
CREATE TABLE password_tokens (
  token_hash TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('invito', 'reset')),
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER
);
CREATE INDEX password_tokens_member ON password_tokens(member_id);

-- Tentativi di accesso falliti, per limitare i tentativi a forza bruta.
CREATE TABLE auth_attempts (
  email TEXT NOT NULL COLLATE NOCASE,
  at INTEGER NOT NULL
);
CREATE INDEX auth_attempts_email_at ON auth_attempts(email, at);

-- Ingressi e uscite: la tabella della migrazione 0002 era vuota, la ricreo
-- per ammettere anche le registrazioni manuali dei referenti (senza dispositivo).
DROP TABLE accessi;
CREATE TABLE accessi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('IN', 'OUT')),
  at INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('pannello', 'dispositivo')),
  device_id TEXT REFERENCES devices(id),
  recorded_by TEXT REFERENCES members(id) ON DELETE SET NULL,
  activity_id TEXT REFERENCES activities(id),
  CHECK (source <> 'dispositivo' OR device_id IS NOT NULL),
  UNIQUE (member_id, at, direction)
);
CREATE INDEX accessi_member_at ON accessi(member_id, at);
CREATE INDEX accessi_at ON accessi(at);

-- Faccende: catalogo e registro. Come le missioni, una faccenda verificata
-- dal referente assegna XP e Formaggi.
CREATE TABLE chore_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
  description TEXT NOT NULL DEFAULT '' CHECK (length(description) <= 400),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp BETWEEN 0 AND 500),
  cheese INTEGER NOT NULL DEFAULT 0 CHECK (cheese BETWEEN 0 AND 200),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE chore_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chore_type_id TEXT NOT NULL REFERENCES chore_types(id),
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  note TEXT NOT NULL DEFAULT '' CHECK (length(note) <= 500),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp BETWEEN 0 AND 500),
  cheese INTEGER NOT NULL DEFAULT 0 CHECK (cheese BETWEEN 0 AND 200),
  requested_at INTEGER NOT NULL DEFAULT (unixepoch()),
  decided_at INTEGER,
  decided_by TEXT REFERENCES members(id) ON DELETE SET NULL
);
CREATE INDEX chore_logs_member ON chore_logs(member_id, status);
CREATE INDEX chore_logs_status ON chore_logs(status, requested_at);

-- Solo un referente approvato, diverso dal socio, decide su una faccenda in attesa.
CREATE TRIGGER chore_decision_valid
BEFORE UPDATE OF status ON chore_logs
WHEN NEW.status <> OLD.status
BEGIN
  SELECT CASE WHEN
    OLD.status <> 'pending'
    OR NEW.status NOT IN ('verified', 'rejected')
    OR NEW.decided_by IS NULL
    OR NEW.decided_by = NEW.member_id
    OR NOT EXISTS (SELECT 1 FROM members WHERE id = NEW.decided_by AND role = 'organizer' AND status = 'approved')
  THEN RAISE(ABORT, 'chore_not_authorized') END;
END;

-- Totali per socio: presenze convalidate e faccende verificate.
CREATE VIEW member_totals AS
SELECT m.id AS member_id,
  COALESCE((SELECT SUM(xp) FROM attendance WHERE member_id = m.id), 0)
    + COALESCE((SELECT SUM(xp) FROM chore_logs WHERE member_id = m.id AND status = 'verified'), 0) AS xp,
  COALESCE((SELECT SUM(cheese) FROM attendance WHERE member_id = m.id), 0)
    + COALESCE((SELECT SUM(cheese) FROM chore_logs WHERE member_id = m.id AND status = 'verified'), 0) AS cheese_earned
FROM members m;
