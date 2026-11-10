CREATE TABLE learning_journal (
  member_id TEXT PRIMARY KEY NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  goal TEXT NOT NULL CHECK (length(goal) <= 1000),
  evidence TEXT NOT NULL CHECK (length(evidence) <= 1000),
  reflection TEXT NOT NULL CHECK (length(reflection) <= 1000)
);
