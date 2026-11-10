ALTER TABLE activities ADD COLUMN access_mode TEXT NOT NULL DEFAULT 'booking'
  CHECK (access_mode IN ('booking', 'open'));
ALTER TABLE activities ADD COLUMN public_event INTEGER NOT NULL DEFAULT 0
  CHECK (public_event IN (0, 1));

CREATE TRIGGER activity_open_requires_no_bookings
BEFORE UPDATE OF access_mode ON activities
WHEN NEW.access_mode = 'open' AND EXISTS (
  SELECT 1 FROM bookings WHERE activity_id = OLD.id AND status IN ('pending', 'confirmed')
)
BEGIN
  SELECT RAISE(ABORT, 'activity_has_bookings');
END;

CREATE TABLE assembly_decisions (
  id INTEGER PRIMARY KEY,
  decided_on TEXT NOT NULL,
  title TEXT NOT NULL,
  decision TEXT NOT NULL,
  reason TEXT NOT NULL,
  responsible TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'done')),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
