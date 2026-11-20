-- Valutazioni della webapp e suggerimenti di modifica dei soci.
CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('rating', 'suggestion', 'snooze')),
  rating INTEGER CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  category TEXT CHECK (category IS NULL OR category IN ('modifica', 'problema', 'idea', 'critica')),
  message TEXT NOT NULL DEFAULT '' CHECK (length(message) <= 600),
  anonymous INTEGER NOT NULL DEFAULT 0 CHECK (anonymous IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  CHECK ((kind = 'rating') = (rating IS NOT NULL))
);
CREATE INDEX feedback_member ON feedback(member_id, kind, created_at);
CREATE INDEX feedback_kind ON feedback(kind, created_at);
