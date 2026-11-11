import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarStreak} from '../src/routes/engagement.mjs';
import {streakDays} from '../src/routes/stats.mjs';

test('daily openings deduplicate across the spring clock change',()=>{
 assert.deepEqual(calendarStreak(['2026-03-28','2026-03-29','2026-03-29','2026-03-30'],'2026-03-30'),{current:3,best:3});
});
test('missed days end the current series but preserve its record',()=>{
 assert.deepEqual(calendarStreak(['2026-10-24','2026-10-25'],'2026-10-27'),{current:0,best:2});
 assert.deepEqual(calendarStreak(['2026-10-24','2026-10-25'],'2026-10-26'),{current:2,best:2});
});
test('closed weekend does not break the series of visits',()=>{
 const now=Date.parse('2026-11-09T12:00:00+01:00');
 assert.deepEqual(streakDays(new Set(['2026-11-05','2026-11-06','2026-11-09']),now),{current:3,best:3});
});
test('no previous visits produce no invented series',()=>{
 assert.deepEqual(calendarStreak([],'2026-11-11'),{current:0,best:0});
});
