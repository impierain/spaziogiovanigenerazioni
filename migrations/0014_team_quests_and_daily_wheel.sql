CREATE TABLE team_quests (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 100),
 description TEXT NOT NULL DEFAULT '',
 needed INTEGER NOT NULL CHECK(needed BETWEEN 2 AND 20),
 xp INTEGER NOT NULL CHECK(xp BETWEEN 0 AND 100),
 badge TEXT NOT NULL CHECK(length(badge) BETWEEN 1 AND 60),
 status TEXT NOT NULL DEFAULT 'forming' CHECK(status IN ('forming','ready','completed','cancelled')),
 created_by TEXT NOT NULL REFERENCES members(id),
 verified_by TEXT REFERENCES members(id),
 completed_at INTEGER
);
CREATE TABLE team_signups (
 quest_id TEXT NOT NULL REFERENCES team_quests(id),
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 joined_at INTEGER NOT NULL DEFAULT(unixepoch()),
 PRIMARY KEY(quest_id,member_id)
);
CREATE TABLE daily_wheel (
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 day TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('xp','curiosity','boost')),
 curiosity INTEGER NOT NULL DEFAULT 0,
 claimed_at INTEGER NOT NULL DEFAULT(unixepoch()),
 expires_at INTEGER NOT NULL,
 PRIMARY KEY(member_id,day)
);
CREATE TABLE bonus_xp (
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 source TEXT NOT NULL CHECK(source IN ('wheel','boost','team')),
 ref TEXT NOT NULL,
 xp INTEGER NOT NULL CHECK(xp BETWEEN 0 AND 100),
 awarded_at INTEGER NOT NULL DEFAULT(unixepoch()),
 PRIMARY KEY(member_id,source,ref)
);
CREATE TABLE team_badges (
 member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 quest_id TEXT NOT NULL REFERENCES team_quests(id),
 name TEXT NOT NULL,
 awarded_at INTEGER NOT NULL DEFAULT(unixepoch()),
 PRIMARY KEY(member_id,quest_id)
);
CREATE TRIGGER team_signup_guard BEFORE INSERT ON team_signups BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM team_quests WHERE id=NEW.quest_id AND status='forming')
 OR NOT EXISTS(SELECT 1 FROM members WHERE id=NEW.member_id AND status='approved')
 OR (SELECT COUNT(*) FROM team_signups WHERE quest_id=NEW.quest_id)>=(SELECT needed FROM team_quests WHERE id=NEW.quest_id)
 THEN RAISE(ABORT,'team_full') END;
END;
CREATE TRIGGER team_signup_ready AFTER INSERT ON team_signups BEGIN
 UPDATE team_quests SET status='ready' WHERE id=NEW.quest_id AND status='forming'
 AND (SELECT COUNT(*) FROM team_signups WHERE quest_id=NEW.quest_id)=needed;
END;
CREATE TRIGGER team_leave_reopen AFTER DELETE ON team_signups BEGIN
 UPDATE team_quests SET status='forming' WHERE id=OLD.quest_id AND status='ready';
END;
CREATE TRIGGER team_completion_guard BEFORE UPDATE OF status ON team_quests WHEN NEW.status='completed' BEGIN
 SELECT CASE WHEN OLD.status<>'ready' OR NEW.verified_by IS NULL
 OR NOT EXISTS(SELECT 1 FROM members WHERE id=NEW.verified_by AND status='approved' AND role='organizer')
 OR EXISTS(SELECT 1 FROM team_signups WHERE quest_id=NEW.id AND member_id=NEW.verified_by)
 OR (SELECT COUNT(*) FROM team_signups s JOIN members m ON m.id=s.member_id WHERE s.quest_id=NEW.id AND m.status='approved')<>NEW.needed
 THEN RAISE(ABORT,'team_not_verifiable') END;
END;
CREATE TRIGGER team_completed_awards AFTER UPDATE OF status ON team_quests WHEN NEW.status='completed' AND OLD.status<>'completed' BEGIN
 INSERT INTO bonus_xp(member_id,source,ref,xp) SELECT member_id,'team',NEW.id,NEW.xp FROM team_signups WHERE quest_id=NEW.id;
 INSERT INTO team_badges(member_id,quest_id,name) SELECT member_id,NEW.id,NEW.badge FROM team_signups WHERE quest_id=NEW.id;
END;
CREATE TRIGGER wheel_xp_award AFTER INSERT ON daily_wheel WHEN NEW.kind='xp' BEGIN
 INSERT INTO bonus_xp(member_id,source,ref,xp) VALUES(NEW.member_id,'wheel',NEW.day,5);
END;
CREATE TRIGGER wheel_boost_award AFTER UPDATE OF status ON chore_logs WHEN NEW.status='verified' AND OLD.status='pending' BEGIN
 INSERT INTO bonus_xp(member_id,source,ref,xp)
 SELECT NEW.member_id,'boost',CAST(NEW.id AS TEXT),MIN(NEW.xp,MAX(0,50-COALESCE((SELECT SUM(b.xp) FROM bonus_xp b WHERE b.member_id=NEW.member_id AND b.source='boost' AND b.awarded_at>=w.claimed_at AND b.awarded_at<w.expires_at),0)))
 FROM daily_wheel w WHERE w.member_id=NEW.member_id AND w.kind='boost'
 AND NEW.decided_at>=w.claimed_at AND NEW.decided_at<w.expires_at;
END;
DROP VIEW member_totals;
CREATE VIEW member_totals AS SELECT m.id AS member_id,
 COALESCE((SELECT SUM(xp) FROM attendance WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(xp) FROM chore_logs WHERE member_id=m.id AND status='verified'),0)
 +COALESCE((SELECT SUM(xp) FROM awards WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(xp) FROM bonus_xp WHERE member_id=m.id),0) AS xp,
 COALESCE((SELECT SUM(cheese) FROM attendance WHERE member_id=m.id),0)
 +COALESCE((SELECT SUM(cheese) FROM chore_logs WHERE member_id=m.id AND status='verified'),0)
 +COALESCE((SELECT SUM(cheese) FROM awards WHERE member_id=m.id),0) AS cheese_earned,
 COALESCE((SELECT SUM(cost) FROM redemptions WHERE member_id=m.id AND status<>'cancelled'),0) AS cheese_spent
 FROM members m;
