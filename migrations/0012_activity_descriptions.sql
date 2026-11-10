ALTER TABLE activities ADD COLUMN description TEXT NOT NULL DEFAULT ''
  CHECK (length(description) <= 1600);
