// public/js/dashboard.js

let utente = null;

function formattaOra(iso) {
  const d = new Date(iso);
  return d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

async function init() {
  utente = await utenteCorrente();
  if (!utente) { window.location.href = '/index.html'; return; }

  document.getElementById('nome-utente').textContent = utente.nome;

  // QR personale: usiamo l'id sessione lato server per recuperare il token
  // (per semplicità, il token viene passato dal backend nella risposta /me
  // se lo aggiungi; qui mostriamo comunque un QR di esempio col nome utente
  // finché non colleghiamo il token reale nel prossimo passaggio)
  new QRCode(document.getElementById('qr'), {
    text: utente.qr_token || ('utente-' + utente.id),
    width: 180,
    height: 180,
  });

  await caricaPresenti();
  await caricaFaccende();
}

async function caricaPresenti() {
  const tbody = document.getElementById('tabella-presenti');
  try {
    const presenti = await apiCall('/api/status');
    if (presenti.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" class="text-dim">Non c\'è nessuno al momento.</td></tr>';
      return;
    }
    tbody.innerHTML = presenti.map(p => `
      <tr><td>${p.nome}</td><td>${formattaOra(p.dal)}</td></tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="2" class="error-msg">${e.message}</td></tr>`;
  }
}

async function caricaFaccende() {
  const tbody = document.getElementById('tabella-faccende');
  const mese = new Date().toISOString().slice(0, 7);
  try {
    const faccende = await apiCall('/api/chores?mese=' + mese);
    if (faccende.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-dim">Nessuna faccenda registrata questo mese.</td></tr>';
      return;
    }
    tbody.innerHTML = faccende.map(f => `
      <tr><td>${f.data}</td><td>${f.tipo_faccenda}</td><td>${f.note || '-'}</td></tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="3" class="error-msg">${e.message}</td></tr>`;
  }
}

document.getElementById('btn-checkin').addEventListener('click', async () => {
  try {
    const r = await apiCall('/api/qr-checkin', { method: 'POST' });
    await caricaPresenti();
    alert(r.tipo === 'IN' ? 'Ingresso registrato!' : 'Uscita registrata!');
  } catch (e) {
    alert(e.message);
  }
});

document.getElementById('form-faccenda').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errore = document.getElementById('errore-faccenda');
  errore.textContent = '';
  try {
    await apiCall('/api/chores', {
      method: 'POST',
      body: JSON.stringify({
        tipo_faccenda: document.getElementById('tipo-faccenda').value,
        note: document.getElementById('note-faccenda').value,
      }),
    });
    document.getElementById('note-faccenda').value = '';
    await caricaFaccende();
  } catch (err) {
    errore.textContent = err.message;
  }
});

document.getElementById('btn-logout').addEventListener('click', async () => {
  await apiCall('/api/logout', { method: 'POST' });
  window.location.href = '/index.html';
});

init();
