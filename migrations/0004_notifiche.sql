-- Bacheca delle notifiche: esiti di invii email e avvisi per soci e referenti.
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'info' CHECK (level IN ('ok', 'error', 'info')),
  title TEXT NOT NULL CHECK (length(title) <= 120),
  body TEXT NOT NULL DEFAULT '' CHECK (length(body) <= 400),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  read_at INTEGER
);
CREATE INDEX notifications_member ON notifications(member_id, read_at, created_at);
