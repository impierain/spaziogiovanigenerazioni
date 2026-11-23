-- Verifica delle notifiche push: una notifica di prova con un codice che solo il dispositivo riceve.
ALTER TABLE push_subscriptions ADD COLUMN test_token TEXT;
ALTER TABLE push_subscriptions ADD COLUMN confirmed_at INTEGER;
