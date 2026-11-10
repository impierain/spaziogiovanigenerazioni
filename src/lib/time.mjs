const romeParts = new Intl.DateTimeFormat('en-GB', {
 timeZone: 'Europe/Rome', hourCycle: 'h23',
 year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
});

// Scarto di Europe/Rome rispetto a UTC, in millisecondi, per un istante.
export function romeOffset(ms) {
 const p = Object.fromEntries(romeParts.formatToParts(new Date(ms)).map(x => [x.type, x.value]));
 const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
 return wall - Math.floor(ms / 1000) * 1000;
}

// Ora "a muro" di Roma espressa come se fosse UTC: comodo per giorno, ora, settimana.
export const romeWall = ms => new Date(ms + romeOffset(ms));

// Giorno della settimana con lunedì = 0.
export const romeWeekday = ms => (romeWall(ms).getUTCDay() + 6) % 7;
export const romeHour = ms => romeWall(ms).getUTCHours();
export const romeDay = ms => romeWall(ms).toISOString().slice(0, 10);
export const romeMonth = ms => romeWall(ms).toISOString().slice(0, 7);

// Inizio (lunedì alle 00:00 di Roma) della settimana che contiene l'istante, in secondi.
export function romeWeekStart(ms) {
 const wall = romeWall(ms);
 const mondayWall = Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate()) - romeWeekday(ms) * 86400000;
 let guess = mondayWall - romeOffset(mondayWall);
 guess = mondayWall - romeOffset(guess);
 return Math.floor(guess / 1000);
}

// Inizio del giorno di Roma in secondi.
export function romeDayStart(ms) {
 const wall = romeWall(ms);
 const dayWall = Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate());
 let guess = dayWall - romeOffset(dayWall);
 guess = dayWall - romeOffset(guess);
 return Math.floor(guess / 1000);
}
