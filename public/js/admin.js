// public/js/admin.js

function formattaOra(iso) {
  const d = new Date(iso);
  return d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

let elencoSoci = [];
let periodoStatistiche = 7;
let graficoApertura = null;
let graficoAmbiente = null;

async function init() {
  const utente = await utenteCorrente();
  if (!utente) { window.location.href = '/index.html'; return; }
  if (utente.ruolo !== 'admin') { window.location.href = '/dashboard.html'; return; }
  document.getElementById('nome-utente').textContent = utente.nome;

  await caricaSoci();
  await caricaStorico();
  await caricaSconosciute();
  await caricaTutteFaccende();
  await caricaStatisticheApertura();
  await caricaStatisticheAmbiente();
  await caricaDiagnostica();

  // Aggiorna da sola le tessere sconosciute: così appoggiando una tessera
  // sul lettore la vedi comparire qui senza dover ricaricare la pagina
  setInterval(caricaSconosciute, 4000);
  setInterval(caricaDiagnostica, 15000);
}

// ---------- TABS ----------
document.querySelectorAll('.tab:not(.subtab)').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('[id^="tab-"]').forEach(s => s.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});

// ---------- SOCI ----------
async function caricaSoci() {
  const tbody = document.getElementById('tabella-soci');
  try {
    const soci = await apiCall('/api/admin/users');
    elencoSociCache = soci;
    popolaSelectSoci();
    elencoSoci = soci;

    const selettoreFaccenda = document.getElementById('fa-socio');
    if (selettoreFaccenda) {
      selettoreFaccenda.innerHTML = soci.filter(s => s.attivo).map(s =>
        `<option value="${s.id}">${s.nome}</option>`
      ).join('');
    }

    tbody.innerHTML = soci.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.nome}</td>
        <td>${s.email || '-'}</td>
        <td>${s.ruolo}</td>
        <td>${s.uid_tessera || '<span class="text-dim">nessuna</span>'}<br>
            <span class="text-dim" style="font-size:0.75em;">qr: ${s.qr_token}</span></td>
        <td>${s.attivo ? '<span class="badge in">attivo</span>' : '<span class="badge out">disattivo</span>'}</td>
        <td>
          <button class="secondary small" onclick="rimuoviTessera(${s.id})" ${s.uid_tessera ? '' : 'disabled'}>Rimuovi tessera</button>
          <button class="secondary small" onclick="disattivaSocio(${s.id})">Disattiva</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="error-msg">${e.message}</td></tr>`;
  }
}

async function disattivaSocio(id) {
  if (!confirm('Disattivare questo socio? Lo storico resta comunque salvato.')) return;
  await apiCall('/api/admin/users/' + id, { method: 'DELETE' });
  await caricaSoci();
}

async function rimuoviTessera(id) {
  if (!confirm('Rimuovere la tessera da questo socio? Potrai assegnargliene una nuova, o dare questa a qualcun altro.')) return;
  await apiCall('/api/admin/users/' + id + '/rimuovi-tessera', { method: 'POST' });
  await caricaSoci();
}

document.getElementById('btn-ascolta-tessera').addEventListener('click', async () => {
  const btn = document.getElementById('btn-ascolta-tessera');
  const stato = document.getElementById('stato-ascolto');
  const inizioAscolto = Date.now() - 5000; // 5s di margine per eventuali differenze di orologio

  btn.disabled = true;
  btn.textContent = 'In ascolto...';
  stato.textContent = 'Avvicina la tessera al lettore entro 30 secondi.';

  let secondiPassati = 0;
  const intervallo = setInterval(async () => {
    secondiPassati += 1.5;
    try {
      const righe = await apiCall('/api/admin/unknown-cards');
      const nuova = righe.find(r => new Date(r.timestamp).getTime() > inizioAscolto);
      if (nuova) {
        clearInterval(intervallo);
        document.getElementById('n-uid').value = nuova.uid_tessera;
        stato.textContent = 'Tessera rilevata: ' + nuova.uid_tessera;
        btn.disabled = false;
        btn.textContent = 'Ascolta tessera';
        return;
      }
    } catch (e) { /* riprova al prossimo giro */ }

    if (secondiPassati >= 30) {
      clearInterval(intervallo);
      stato.textContent = 'Nessuna tessera rilevata, riprova.';
      btn.disabled = false;
      btn.textContent = 'Ascolta tessera';
    }
  }, 1500);
});

document.getElementById('form-nuovo-socio').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errore = document.getElementById('errore-socio');
  errore.textContent = '';
  try {
    await apiCall('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        nome: document.getElementById('n-nome').value,
        email: document.getElementById('n-email').value || null,
        ruolo: document.getElementById('n-ruolo').value,
        uid_tessera: document.getElementById('n-uid').value || null,
      }),
    });
    e.target.reset();
    await caricaSoci();
  } catch (err) {
    errore.textContent = err.message;
  }
});

// ---------- STORICO ----------
async function caricaStorico() {
  const tbody = document.getElementById('tabella-storico');
  const da = document.getElementById('filtro-da').value;
  const a = document.getElementById('filtro-a').value;
  let url = '/api/logs?';
  if (da) url += 'da=' + da + '&';
  if (a) url += 'a=' + a + 'T23:59:59&';

  try {
    const logs = await apiCall(url);
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-dim">Nessun log trovato.</td></tr>';
      return;
    }
    tbody.innerHTML = logs.map(l => `
      <tr>
        <td>${l.nome}</td>
        <td>${l.timestamp.slice(0, 10)}</td>
        <td><span class="badge ${l.tipo === 'IN' ? 'in' : l.tipo === 'OUT' ? 'out' : ''}">${l.descrizione}</span></td>
        <td>${l.fonte}</td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" class="error-msg">${e.message}</td></tr>`;
  }
}
document.getElementById('btn-filtra-storico').addEventListener('click', caricaStorico);

// ---------- TESSERE SCONOSCIUTE ----------
async function caricaSconosciute() {
  const tbody = document.getElementById('tabella-sconosciute');
  try {
    const righe = await apiCall('/api/admin/unknown-cards');
    if (righe.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-dim">Nessuna tessera sconosciuta al momento. Prova ad appoggiarne una sul lettore.</td></tr>';
      return;
    }
    const opzioniSoci = elencoSoci.filter(s => s.attivo).map(s => `<option value="${s.id}">${s.nome}</option>`).join('');
    tbody.innerHTML = righe.map((r, i) => `
      <tr>
        <td>${r.uid_tessera}</td>
        <td>${formattaOra(r.timestamp)}</td>
        <td><select id="assegna-select-${i}">${opzioniSoci}</select></td>
        <td><button class="small" onclick="assegnaTessera('${r.uid_tessera}', document.getElementById('assegna-select-${i}').value)">Assegna</button></td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" class="error-msg">${e.message}</td></tr>`;
  }
}

async function assegnaTessera(uid, socioId) {
  if (!socioId) return;
  try {
    await apiCall('/api/admin/users/' + socioId + '/assegna-tessera', {
      method: 'POST',
      body: JSON.stringify({ uid_tessera: uid }),
    });
    await caricaSconosciute();
    await caricaSoci();
  } catch (e) {
    alert(e.message);
  }
}

// ---------- FACCENDE (admin per conto di altri) ----------
let elencoSociCache = [];

async function popolaSelectSoci() {
  const select = document.getElementById('fa-socio');
  select.innerHTML = elencoSociCache
    .filter(s => s.attivo)
    .map(s => `<option value="${s.id}">${s.nome}</option>`)
    .join('');
}

document.getElementById('form-faccenda-admin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errore = document.getElementById('errore-faccenda-admin');
  errore.textContent = '';
  try {
    await apiCall('/api/chores', {
      method: 'POST',
      body: JSON.stringify({
        user_id: document.getElementById('fa-socio').value,
        tipo_faccenda: document.getElementById('fa-tipo').value,
        note: document.getElementById('fa-note').value,
      }),
    });
    document.getElementById('fa-note').value = '';
    await caricaTutteFaccende();
  } catch (err) {
    errore.textContent = err.message;
  }
});

// ---------- FACCENDE (tutte) ----------
async function caricaTutteFaccende() {
  const tbody = document.getElementById('tabella-tutte-faccende');
  try {
    const faccende = await apiCall('/api/chores');
    if (faccende.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-dim">Nessuna faccenda registrata.</td></tr>';
      return;
    }
    tbody.innerHTML = faccende.map(f => `
      <tr><td>${f.data}</td><td>${f.nome}</td><td>${f.tipo_faccenda}</td><td>${f.note || '-'}</td></tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" class="error-msg">${e.message}</td></tr>`;
  }
}

document.getElementById('form-faccenda-admin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errore = document.getElementById('errore-faccenda-admin');
  errore.textContent = '';
  try {
    await apiCall('/api/chores', {
      method: 'POST',
      body: JSON.stringify({
        user_id: document.getElementById('fa-socio').value,
        tipo_faccenda: document.getElementById('fa-tipo').value,
        note: document.getElementById('fa-note').value,
      }),
    });
    document.getElementById('fa-note').value = '';
    await caricaTutteFaccende();
  } catch (err) {
    errore.textContent = err.message;
  }
});

// ---------- STATISTICHE ----------
function ultimiGiorni(n) {
  const giorni = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    giorni.push(d.toISOString().slice(0, 10));
  }
  return giorni;
}

async function caricaStatisticheApertura() {
  try {
    const dati = await apiCall('/api/admin/stats/apertura?giorni=' + periodoStatistiche);
    const mappa = {};
    dati.forEach(d => { mappa[d.giorno] = d.ore_apertura; });

    const giorni = ultimiGiorni(periodoStatistiche);
    const ore = giorni.map(g => mappa[g] || 0);
    const media = ore.reduce((a, b) => a + b, 0) / ore.length;

    document.getElementById('media-apertura').textContent =
      `Media: ${media.toFixed(1)} ore al giorno (ultimi ${periodoStatistiche} giorni)`;

    const ctx = document.getElementById('grafico-apertura');
    if (graficoApertura) graficoApertura.destroy();
    graficoApertura = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: giorni.map(g => g.slice(5)),
        datasets: [{ label: 'Ore aperta', data: ore, backgroundColor: '#ff2e2e' }],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });
  } catch (e) {
    document.getElementById('media-apertura').textContent = e.message;
  }
}

async function caricaStatisticheAmbiente() {
  try {
    const letture = await apiCall('/api/admin/stats/ambiente?ore=48');
    if (letture.length === 0) {
      document.getElementById('stato-ambiente').textContent =
        'Nessun dato ancora: serve la stazione ambientale (sensore temperatura/umidità) collegata.';
      return;
    }
    document.getElementById('stato-ambiente').textContent =
      `Ultime ${letture.length} letture (48 ore)`;

    const ctx = document.getElementById('grafico-ambiente');
    if (graficoAmbiente) graficoAmbiente.destroy();
    graficoAmbiente = new Chart(ctx, {
      type: 'line',
      data: {
        labels: letture.map(l => formattaOra(l.timestamp)),
        datasets: [
          { label: 'Temperatura (°C)', data: letture.map(l => l.temperatura), borderColor: '#ff2e2e', tension: 0.3 },
          { label: 'Umidità (%)', data: letture.map(l => l.umidita), borderColor: '#ff8a1e', tension: 0.3 },
        ],
      },
    });
  } catch (e) {
    document.getElementById('stato-ambiente').textContent = e.message;
  }
}

document.getElementById('btn-7gg').addEventListener('click', () => {
  periodoStatistiche = 7;
  document.getElementById('btn-7gg').classList.add('active');
  document.getElementById('btn-30gg').classList.remove('active');
  caricaStatisticheApertura();
});
document.getElementById('btn-30gg').addEventListener('click', () => {
  periodoStatistiche = 30;
  document.getElementById('btn-30gg').classList.add('active');
  document.getElementById('btn-7gg').classList.remove('active');
  caricaStatisticheApertura();
});

document.getElementById('btn-logout').addEventListener('click', async () => {
  await apiCall('/api/logout', { method: 'POST' });
  window.location.href = '/index.html';
});

init();

// ---------- DIAGNOSTICA ----------
const NOMI_STAZIONE = {
  'rfid-01': 'Stazione RFID + ambiente',
  'cam-01': 'Stazione QR (camera)',
};

async function caricaDiagnostica() {
  const contenitore = document.getElementById('lista-diagnostica');
  if (!contenitore) return; // tab non ancora nel DOM in versioni vecchie della pagina

  try {
    const righe = await apiCall('/api/admin/diagnostics');
    if (righe.length === 0) {
      contenitore.innerHTML = '<p class="text-dim">Nessuna stazione si è ancora fatta sentire.</p>';
      return;
    }

    contenitore.innerHTML = righe.map(r => {
      const secondiFa = r.secondi_fa ?? 999999;
      let colore = '#4ade80', stato = 'Online';
      if (secondiFa > 1800) { colore = '#e8380d'; stato = 'Offline'; }
      else if (secondiFa > 600) { colore = '#ffb703'; stato = 'In ritardo'; }

      const minutiFa = Math.round(secondiFa / 60);
      const nome = NOMI_STAZIONE[r.station_id] || r.station_id;

      return `
        <div class="stat-box" style="margin-bottom:12px; border-left-color:${colore};">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${nome}</strong>
            <span style="color:${colore}; font-weight:800;">&#9679; ${stato}</span>
          </div>
          <div class="text-dim" style="margin-top:6px;">
            Ultimo contatto: ${minutiFa} min fa &middot;
            Wi-Fi: ${r.wifi_connesso ? 'connesso' : 'offline'}${r.rssi ? ' (' + r.rssi + ' dBm)' : ''} &middot;
            Eventi in coda: ${r.pendenti ?? '-'} &middot;
            Presenti (locale): ${r.presenti_locali ?? '-'}
          </div>
          ${r.ultimo_errore ? `<div class="error-msg" style="margin-top:6px;">Ultimo errore: ${r.ultimo_errore}</div>` : ''}
        </div>
      `;
    }).join('');
  } catch (e) {
    contenitore.innerHTML = `<p class="error-msg">${e.message}</p>`;
  }
}
