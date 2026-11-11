CREATE TABLE app_visit_days (
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 day TEXT NOT NULL,
 PRIMARY KEY (member_id, day)
);
CREATE TABLE achievement_sharing (
 member_id TEXT PRIMARY KEY NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 enabled_at INTEGER NOT NULL DEFAULT (unixepoch())
);
