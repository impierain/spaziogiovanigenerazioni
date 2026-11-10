-- Interessi del socio (percorsi, separati da virgola) per consigliare missioni e attività;
-- percorso facoltativo delle attività.
ALTER TABLE members ADD COLUMN interests TEXT NOT NULL DEFAULT '';
ALTER TABLE activities ADD COLUMN path TEXT;
