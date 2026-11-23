-- Ricompense solo da dati del server; una chiave impedisce doppie assegnazioni.
CREATE TABLE joy_rewards (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('greeting','weekly','bundle','bundle_use','critical','team_party','receipt','micro')),
 ref TEXT NOT NULL,
 xp INTEGER NOT NULL DEFAULT 0 CHECK(xp BETWEEN 0 AND 500),
 cheese INTEGER NOT NULL DEFAULT 0 CHECK(cheese BETWEEN 0 AND 20),
 cost INTEGER NOT NULL DEFAULT 0 CHECK(cost BETWEEN 0 AND 3),
 payload TEXT NOT NULL DEFAULT '{}',
 created_at INTEGER NOT NULL DEFAULT(unixepoch()),
 seen_at INTEGER,
 UNIQUE(member_id,kind,ref)
);
CREATE INDEX joy_unseen ON joy_rewards(member_id,seen_at,id);
CREATE UNIQUE INDEX joy_bonus_once ON joy_rewards(member_id,ref) WHERE kind IN ('critical','bundle_use');
CREATE UNIQUE INDEX joy_bundle_used_once ON joy_rewards(member_id,json_extract(payload,'$.bundleId')) WHERE kind='bundle_use';
CREATE TABLE joy_marks(member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,mark TEXT NOT NULL,PRIMARY KEY(member_id,mark));
CREATE TABLE joy_cosmetic(member_id TEXT PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,decoration TEXT NOT NULL DEFAULT '');
CREATE TABLE team_party_roll(quest_id TEXT PRIMARY KEY REFERENCES team_quests(id),won INTEGER NOT NULL CHECK(won IN (0,1)));
DROP VIEW member_totals;
CREATE VIEW member_totals AS SELECT m.id AS member_id,
 COALESCE((SELECT SUM(xp) FROM attendance WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(xp) FROM chore_logs WHERE member_id=m.id AND status='verified'),0)
 +COALESCE((SELECT SUM(xp) FROM awards WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(xp) FROM bonus_xp WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(xp) FROM joy_rewards WHERE member_id=m.id),0) AS xp,
 COALESCE((SELECT SUM(cheese) FROM attendance WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(cheese) FROM chore_logs WHERE member_id=m.id AND status='verified'),0)
 +COALESCE((SELECT SUM(cheese) FROM awards WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(cheese) FROM joy_rewards WHERE member_id=m.id),0) AS cheese_earned,
 COALESCE((SELECT SUM(cost) FROM redemptions WHERE member_id=m.id AND status<>'cancelled'),0)
 +COALESCE((SELECT SUM(cost) FROM joy_rewards WHERE member_id=m.id),0) AS cheese_spent FROM members m;
CREATE TRIGGER joy_balance_guard BEFORE INSERT ON joy_rewards WHEN NEW.cost>0 BEGIN
 SELECT CASE WHEN NEW.cost>(SELECT cheese_earned-cheese_spent FROM member_totals WHERE member_id=NEW.member_id)
 THEN RAISE(ABORT,'joy_insufficient_balance') END;
END;
CREATE TRIGGER joy_team_party AFTER UPDATE OF status ON team_quests WHEN NEW.status='completed' AND OLD.status<>'completed' BEGIN
 INSERT INTO team_party_roll(quest_id,won) VALUES(NEW.id,(random() & 2147483647)%100<20);
 INSERT INTO joy_rewards(member_id,kind,ref,cheese,payload)
 SELECT member_id,'team_party',NEW.id,5,json_object('title','Festa di Paese','quest',NEW.title)
 FROM team_signups WHERE quest_id=NEW.id AND (SELECT won FROM team_party_roll WHERE quest_id=NEW.id)=1;
 INSERT INTO joy_rewards(member_id,kind,ref,payload)
 SELECT member_id,'receipt','team:'||NEW.id,json_object('title',NEW.title,'xp',NEW.xp,'cheese',0,'stamp','IMPRESA COMPIUTA') FROM team_signups WHERE quest_id=NEW.id;
END;
CREATE TRIGGER joy_chore_award AFTER UPDATE OF status ON chore_logs WHEN NEW.status='verified' AND OLD.status='pending' BEGIN
 INSERT INTO joy_rewards(member_id,kind,ref,payload) VALUES(NEW.member_id,'receipt','chore:'||NEW.id,json_object('title',(SELECT name FROM chore_types WHERE id=NEW.chore_type_id),'xp',NEW.xp,'cheese',NEW.cheese,'stamp','CONFERMATO'));
 INSERT INTO joy_rewards(member_id,kind,ref,xp,payload)
 SELECT NEW.member_id,CASE WHEN (SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1) IS NOT NULL THEN 'bundle_use' ELSE 'critical' END,'chore:'||NEW.id,MIN(NEW.xp,50),
 json_object('title',CASE WHEN (SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1) IS NOT NULL THEN 'Il fagotto dà una mano!' ELSE 'Colpo critico!' END,'bundleId',(SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1))
 WHERE NEW.xp>0 AND NOT EXISTS(SELECT 1 FROM daily_wheel w WHERE w.member_id=NEW.member_id AND w.kind='boost' AND unixepoch()>=w.claimed_at AND unixepoch()<w.expires_at) AND ((SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1) IS NOT NULL OR (random() & 2147483647)%100<15);
END;
CREATE TRIGGER joy_attendance_award AFTER INSERT ON attendance WHEN 1 BEGIN
 INSERT INTO joy_rewards(member_id,kind,ref,payload) VALUES(NEW.member_id,'receipt','attendance:'||NEW.activity_id,json_object('title',(SELECT name FROM activities WHERE id=NEW.activity_id),'xp',NEW.xp,'cheese',NEW.cheese,'stamp','CONFERMATO'));
 INSERT INTO joy_rewards(member_id,kind,ref,xp,payload)
 SELECT NEW.member_id,CASE WHEN (SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1) IS NOT NULL THEN 'bundle_use' ELSE 'critical' END,'attendance:'||NEW.activity_id,MIN(NEW.xp,50),
 json_object('title',CASE WHEN (SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1) IS NOT NULL THEN 'Il fagotto dà una mano!' ELSE 'Colpo critico!' END,'bundleId',(SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1))
 WHERE NEW.xp>0 AND 1 AND ((SELECT b.id FROM joy_rewards b WHERE b.member_id=NEW.member_id AND b.kind='bundle' AND json_extract(b.payload,'$.prize')='boost' AND b.created_at>unixepoch()-604800 AND NOT EXISTS(SELECT 1 FROM joy_rewards u WHERE u.member_id=NEW.member_id AND u.kind='bundle_use' AND json_extract(u.payload,'$.bundleId')=b.id) ORDER BY b.id LIMIT 1) IS NOT NULL OR (random() & 2147483647)%100<15);
END;
CREATE TRIGGER joy_award_receipt AFTER INSERT ON awards BEGIN
 INSERT INTO joy_rewards(member_id,kind,ref,payload) VALUES(NEW.member_id,'receipt','award:'||NEW.id,json_object('title',NEW.title,'xp',NEW.xp,'cheese',NEW.cheese,'stamp','CONTRIBUTO CONFERMATO'));
END;
