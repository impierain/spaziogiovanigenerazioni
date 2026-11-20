-- Correzioni dell'audit di sicurezza (novembre 2026).

-- Il blocco dei login falliti conta per email e per indirizzo di rete: chi non conosce
-- la password non può più impedire a un'altra persona di accedere al proprio account.
ALTER TABLE auth_attempts ADD COLUMN ip TEXT NOT NULL DEFAULT '';
CREATE INDEX auth_attempts_email_ip_at ON auth_attempts(email, ip, at);

-- Un premio per socio, origine e riferimento (stessa proposta o stesso scambio).
CREATE UNIQUE INDEX awards_unico ON awards(member_id, source, ref);

-- Deve restare sempre almeno un referente attivo, anche con due richieste contemporanee.
CREATE TRIGGER ultimo_organizzatore BEFORE UPDATE OF role, status ON members
WHEN OLD.role = 'organizer' AND OLD.status = 'approved'
 AND (NEW.role <> 'organizer' OR NEW.status <> 'approved')
 AND NOT EXISTS (SELECT 1 FROM members WHERE role = 'organizer' AND status = 'approved' AND id <> OLD.id)
BEGIN
  SELECT RAISE(ABORT, 'ultimo_organizzatore');
END;
