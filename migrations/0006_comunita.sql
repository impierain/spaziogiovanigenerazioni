-- Comunità: trofei, Putìa (premi), banca del tempo, proposte con voto, promemoria.

-- Premi extra (scambi di tempo, proposte accolte) che si sommano ai totali.
CREATE TABLE awards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('scambio', 'proposta')),
  ref TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL CHECK (length(title) <= 120),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp BETWEEN 0 AND 500),
  cheese INTEGER NOT NULL DEFAULT 0 CHECK (cheese BETWEEN 0 AND 200),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX awards_member ON awards(member_id, source, created_at);

CREATE TABLE trophies_awarded (
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  trophy_id TEXT NOT NULL,
  awarded_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (member_id, trophy_id)
);

CREATE TABLE rewards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
  description TEXT NOT NULL DEFAULT '' CHECK (length(description) <= 300),
  cost INTEGER NOT NULL CHECK (cost BETWEEN 1 AND 5000),
  quantity INTEGER CHECK (quantity IS NULL OR quantity >= 0),
  art TEXT NOT NULL DEFAULT 'star',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reward_id TEXT NOT NULL REFERENCES rewards(id),
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  cost INTEGER NOT NULL CHECK (cost >= 1),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'cancelled')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  decided_at INTEGER,
  decided_by TEXT REFERENCES members(id) ON DELETE SET NULL
);
CREATE INDEX redemptions_member ON redemptions(member_id, status);
CREATE INDEX redemptions_reward ON redemptions(reward_id, status);

CREATE TRIGGER redemption_delivery_valid
BEFORE UPDATE OF status ON redemptions
WHEN NEW.status = 'delivered'
BEGIN
  SELECT CASE WHEN
    OLD.status <> 'pending'
    OR NEW.decided_by IS NULL
    OR NEW.decided_by = NEW.member_id
    OR NOT EXISTS (SELECT 1 FROM members WHERE id = NEW.decided_by AND role = 'organizer' AND status = 'approved')
  THEN RAISE(ABORT, 'redemption_not_authorized') END;
END;

CREATE TABLE time_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 80),
  description TEXT NOT NULL DEFAULT '' CHECK (length(description) <= 400),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX time_offers_status ON time_offers(status, created_at);

CREATE TABLE time_exchanges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  offer_id INTEGER NOT NULL REFERENCES time_offers(id) ON DELETE CASCADE,
  requester_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  note TEXT NOT NULL DEFAULT '' CHECK (length(note) <= 300),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'declined', 'done', 'cancelled')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  decided_at INTEGER,
  done_at INTEGER
);
CREATE UNIQUE INDEX time_exchange_active ON time_exchanges(offer_id, requester_id) WHERE status IN ('requested', 'accepted');
CREATE INDEX time_exchange_requester ON time_exchanges(requester_id, status);

CREATE TABLE proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 100),
  description TEXT NOT NULL DEFAULT '' CHECK (length(description) <= 600),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'scheduled', 'declined')),
  activity_id TEXT REFERENCES activities(id),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX proposals_status ON proposals(status, created_at);

CREATE TABLE proposal_votes (
  proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (proposal_id, member_id)
);

-- Promemoria e riepiloghi già inviati (evita doppioni).
CREATE TABLE reminders_sent (
  kind TEXT NOT NULL,
  ref TEXT NOT NULL,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  sent_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (kind, ref, member_id)
);

-- Totali: presenze, missioni e premi extra; i Formaggi spesi nella Putìa si sottraggono dal saldo.
DROP VIEW member_totals;
CREATE VIEW member_totals AS
SELECT m.id AS member_id,
  COALESCE((SELECT SUM(xp) FROM attendance WHERE member_id = m.id), 0)
    + COALESCE((SELECT SUM(xp) FROM chore_logs WHERE member_id = m.id AND status = 'verified'), 0)
    + COALESCE((SELECT SUM(xp) FROM awards WHERE member_id = m.id), 0) AS xp,
  COALESCE((SELECT SUM(cheese) FROM attendance WHERE member_id = m.id), 0)
    + COALESCE((SELECT SUM(cheese) FROM chore_logs WHERE member_id = m.id AND status = 'verified'), 0)
    + COALESCE((SELECT SUM(cheese) FROM awards WHERE member_id = m.id), 0) AS cheese_earned,
  COALESCE((SELECT SUM(cost) FROM redemptions WHERE member_id = m.id AND status <> 'cancelled'), 0) AS cheese_spent
FROM members m;

-- Premi iniziali della Putìa (i referenti possono cambiarli).
INSERT INTO rewards (id, name, description, cost, quantity, art) VALUES
  ('adesivi', 'Sticker pixel art', 'Una piccola collezione di simboli di Cca Siemmu.', 10, 12, 'star'),
  ('spille', 'Spille e magneti', 'Due modi per portare con te un pezzo dello spazio.', 25, 8, 'pin'),
  ('zine', 'Mini-zine artistica', 'Una piccola pubblicazione illustrata.', 35, 6, 'book'),
  ('shopper', 'Tote bag Cca Siemmu', 'Una borsa per libri, zine e materiali.', 100, 4, 'bag'),
  ('maglietta', 'Maglietta Cca Siemmu', 'Una maglietta con il simbolo del progetto.', 200, 3, 'shirt');
