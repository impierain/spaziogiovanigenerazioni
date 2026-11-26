-- Pulizia della vecchia parte ESP32: tessere e QR personali non si usano più (tutti vuoti in produzione).
-- La tabella devices resta perché accessi.device_id vi fa riferimento (sempre vuoto): toglierla richiederebbe ricreare accessi.
DROP INDEX IF EXISTS members_uid_tessera;
ALTER TABLE members DROP COLUMN uid_tessera;
DROP TABLE IF EXISTS member_qr;
