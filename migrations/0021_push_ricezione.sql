-- Il dispositivo segnala da solo di aver ricevuto la notifica di prova.
ALTER TABLE push_subscriptions ADD COLUMN received_at INTEGER;
