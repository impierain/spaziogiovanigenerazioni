// public/js/api.js
// Piccolo helper per chiamare le API del backend (stesso dominio, con cookie di sessione)

async function apiCall(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let dati = null;
  try { dati = await res.json(); } catch (e) { /* risposta vuota */ }
  if (!res.ok) {
    throw new Error(dati?.errore || 'Errore di comunicazione con il server.');
  }
  return dati;
}

async function utenteCorrente() {
  try {
    return await apiCall('/api/me');
  } catch (e) {
    return null;
  }
}
