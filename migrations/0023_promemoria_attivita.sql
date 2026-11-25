-- Fino a due promemoria personalizzati per attività, in minuti prima dell'inizio (vuoto = nessuno).
-- Senza promemoria personalizzati resta quello automatico del giorno prima.
ALTER TABLE activities ADD COLUMN reminder1_min INTEGER CHECK (reminder1_min IS NULL OR reminder1_min BETWEEN 5 AND 20160);
ALTER TABLE activities ADD COLUMN reminder2_min INTEGER CHECK (reminder2_min IS NULL OR reminder2_min BETWEEN 5 AND 20160);
