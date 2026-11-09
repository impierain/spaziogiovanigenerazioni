
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  pseudonym TEXT NOT NULL CHECK (length(trim(pseudonym)) BETWEEN 1 AND 28),
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'organizer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'disabled')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE invitations (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER
);

CREATE TABLE login_links (
  token_hash TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE INDEX sessions_member ON sessions(member_id);

CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  starts_at INTEGER NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  verification_rule TEXT NOT NULL CHECK (length(trim(verification_rule)) > 0),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp BETWEEN 0 AND 500),
  cheese INTEGER NOT NULL DEFAULT 0 CHECK (cheese BETWEEN 0 AND 200)
);

CREATE TABLE bookings (
  activity_id TEXT NOT NULL REFERENCES activities(id),
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (activity_id, member_id)
);

CREATE INDEX bookings_activity_status ON bookings(activity_id, status);

CREATE TRIGGER booking_capacity_insert
BEFORE INSERT ON bookings
WHEN NEW.status IN ('pending','confirmed')
BEGIN
  SELECT CASE WHEN
    NOT EXISTS (SELECT 1 FROM activities WHERE id=NEW.activity_id AND status='published' AND starts_at>unixepoch())
    OR NOT EXISTS (SELECT 1 FROM members WHERE id=NEW.member_id AND status='approved')
    OR (SELECT COUNT(*) FROM bookings WHERE activity_id=NEW.activity_id AND status IN ('pending','confirmed'))
       >= (SELECT capacity FROM activities WHERE id=NEW.activity_id)
    THEN RAISE(ABORT,'booking_unavailable') END;
END;

CREATE TRIGGER booking_capacity_reopen
BEFORE UPDATE OF status ON bookings
WHEN NEW.status IN ('pending','confirmed') AND OLD.status NOT IN ('pending','confirmed')
BEGIN
  SELECT CASE WHEN
    NOT EXISTS (SELECT 1 FROM activities WHERE id=NEW.activity_id AND status='published' AND starts_at>unixepoch())
    OR NOT EXISTS (SELECT 1 FROM members WHERE id=NEW.member_id AND status='approved')
    OR (SELECT COUNT(*) FROM bookings WHERE activity_id=NEW.activity_id AND status IN ('pending','confirmed'))
       >= (SELECT capacity FROM activities WHERE id=NEW.activity_id)
    THEN RAISE(ABORT,'booking_unavailable') END;
END;

CREATE TRIGGER activity_capacity_floor
BEFORE UPDATE OF capacity ON activities
WHEN NEW.capacity < (
  SELECT COUNT(*) FROM bookings WHERE activity_id=OLD.id AND status IN ('pending','confirmed')
)
BEGIN
  SELECT RAISE(ABORT,'capacity_below_bookings');
END;

CREATE TABLE attendance (
  activity_id TEXT NOT NULL REFERENCES activities(id),
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  verified_by TEXT REFERENCES members(id) ON DELETE SET NULL,
  verified_at INTEGER NOT NULL DEFAULT (unixepoch()),
  xp INTEGER NOT NULL CHECK (xp BETWEEN 0 AND 500),
  cheese INTEGER NOT NULL CHECK (cheese BETWEEN 0 AND 200),
  PRIMARY KEY (activity_id, member_id)
);

CREATE TRIGGER attendance_valid
BEFORE INSERT ON attendance
BEGIN
  SELECT CASE WHEN
    NEW.member_id=NEW.verified_by
    OR NOT EXISTS (SELECT 1 FROM members WHERE id=NEW.verified_by AND role='organizer' AND status='approved')
    OR NOT EXISTS (SELECT 1 FROM members WHERE id=NEW.member_id AND status='approved')
    OR NOT EXISTS (
      SELECT 1 FROM activities
      WHERE id=NEW.activity_id AND status='published' AND starts_at<=unixepoch()
      AND xp=NEW.xp AND cheese=NEW.cheese
    )
    THEN RAISE(ABORT,'attendance_not_authorized') END;
END;

CREATE VIEW member_progress AS
SELECT m.id AS member_id, COALESCE(SUM(a.xp),0) AS xp, COALESCE(SUM(a.cheese),0) AS cheese_earned
FROM members m LEFT JOIN attendance a ON a.member_id=m.id GROUP BY m.id;
