// middleware/auth.js
// Piccole funzioni di controllo accessi basate sulla sessione.

function richiediLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ errore: 'Devi effettuare il login.' });
  }
  next();
}

function richiediAdmin(req, res, next) {
  if (!req.session.user || req.session.user.ruolo !== 'admin') {
    return res.status(403).json({ errore: 'Accesso riservato agli amministratori.' });
  }
  next();
}

// Verifica la chiave condivisa che usa l'ESP32 per parlare col backend
function richiediChiaveEsp32(req, res, next) {
  const chiave = req.headers['x-api-key'];
  if (!chiave || chiave !== process.env.ESP32_API_KEY) {
    return res.status(401).json({ errore: 'Chiave API non valida.' });
  }
  next();
}

module.exports = { richiediLogin, richiediAdmin, richiediChiaveEsp32 };
