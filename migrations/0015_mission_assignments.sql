CREATE TABLE chore_assignments (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 type_id TEXT NOT NULL REFERENCES chore_types(id),
 state TEXT NOT NULL DEFAULT 'in_progress' CHECK(state IN ('in_progress','submitted','completed','rejected','abandoned')),
 note TEXT NOT NULL DEFAULT '' CHECK(length(note)<=500),
 log_id INTEGER UNIQUE REFERENCES chore_logs(id),
 taken_at INTEGER NOT NULL DEFAULT(unixepoch()),
 submitted_at INTEGER
);
CREATE UNIQUE INDEX chore_assignment_open ON chore_assignments(member_id,type_id) WHERE state IN ('in_progress','submitted');
CREATE TRIGGER assignment_take_guard BEFORE INSERT ON chore_assignments BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM chore_types WHERE id=NEW.type_id AND active=1)
 OR NOT EXISTS(SELECT 1 FROM members WHERE id=NEW.member_id AND status='approved')
 OR EXISTS(SELECT 1 FROM chore_logs WHERE member_id=NEW.member_id AND chore_type_id=NEW.type_id AND status='pending')
 THEN RAISE(ABORT,'assignment_unavailable') END;
END;
CREATE TRIGGER assignment_submit_guard BEFORE UPDATE OF state ON chore_assignments WHEN NEW.state='submitted' BEGIN
 SELECT CASE WHEN OLD.state<>'in_progress' OR NOT EXISTS(
  SELECT 1 FROM accessi WHERE id=(SELECT id FROM accessi WHERE member_id=NEW.member_id ORDER BY at DESC,id DESC LIMIT 1)
  AND direction='IN' AND at>unixepoch()-57600 AND at<=unixepoch()
 ) THEN RAISE(ABORT,'assignment_checkin_required') END;
END;
CREATE TRIGGER assignment_submitted AFTER UPDATE OF state ON chore_assignments WHEN NEW.state='submitted' AND OLD.state='in_progress' BEGIN
 INSERT INTO chore_logs(chore_type_id,member_id,note) VALUES(NEW.type_id,NEW.member_id,NEW.note);
 UPDATE chore_assignments SET log_id=last_insert_rowid(),submitted_at=unixepoch() WHERE id=NEW.id;
END;
CREATE TRIGGER assignment_decided AFTER UPDATE OF status ON chore_logs WHEN OLD.status='pending' AND NEW.status IN ('verified','rejected') BEGIN
 UPDATE chore_assignments SET state=CASE WHEN NEW.status='verified' THEN 'completed' ELSE 'rejected' END WHERE log_id=NEW.id;
END;
