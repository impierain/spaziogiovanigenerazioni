// server.js
// Punto di ingresso dell'app: monta le rotte e avvia il server.

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const { initDb } = require('./db');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const choresRoutes = require('./routes/chores');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');
const sensorsRoutes = require('./routes/sensors');
const diagnosticsRoutes = require('./routes/diagnostics');
const esp32syncRoutes = require('./routes/esp32sync');
const passwordRoutes = require('./routes/password');
const stationlogRoutes = require('./routes/stationlog');

const app = express();

// Render (come quasi tutti gli hosting gratuiti) sta dietro un proxy HTTPS:
// senza questa riga, Express non capisce che la connessione è già sicura
// e il cookie di sessione con "secure" non verrebbe mai salvato dal browser,
// rendendo impossibile restare loggati in produzione.
app.set('trust proxy', 1);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'cambia_questo_valore',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 giorni
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));

app.use('/api', authRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', choresRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', statsRoutes);
app.use('/api', sensorsRoutes);
app.use('/api', diagnosticsRoutes);
app.use('/api', esp32syncRoutes);
app.use('/api', passwordRoutes);
app.use('/api', stationlogRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server avviato sulla porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Errore inizializzazione database:', err);
    process.exit(1);
  });
