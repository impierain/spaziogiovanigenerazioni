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
  await caricaLog();

  // Aggiorna da sola le tessere sconosciute: così appoggiando una tessera
  // sul lettore la vedi comparire qui senza dover ricaricare la pagina
  setInterval(caricaSconosciute, 4000);
  setInterval(caricaDiagnostica, 15000);
  setInterval(caricaLog, 10000);
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
      <tr style="cursor:pointer;" onclick="window.location.href='/socio.html?id=${s.id}'">
        <td>${s.id}</td>
        <td><strong>${s.nome}</strong></td>
        <td>${s.email || '-'}</td>
        <td>${s.ruolo}</td>
        <td>${s.uid_tessera || '<span class="text-dim">nessuna</span>'}<br>
            <span class="text-dim" style="font-size:0.75em;">qr: ${s.qr_token}</span></td>
        <td>${s.attivo ? '<span class="badge in">attivo</span>' : '<span class="badge out">disattivo</span>'}</td>
        <td onclick="event.stopPropagation()">
          <button class="secondary small" onclick="rimuoviTessera(${s.id})" ${s.uid_tessera ? '' : 'disabled'}>Rimuovi tessera</button>
          <button class="secondary small" onclick="resetPassword(${s.id}, '${s.nome}')">Reset password</button>
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

async function resetPassword(id, nome) {
  if (!confirm(`Azzerare la password di ${nome}? Al prossimo login dovrà sceglierne una nuova.`)) return;
  await apiCall('/api/admin/users/' + id + '/reset-password', { method: 'POST' });
  alert('Password azzerata. ' + nome + ' dovrà impostarne una nuova al prossimo accesso.');
}

async function rimuoviTessera(id) {
  if (!confirm('Rimuovere la tessera da questo socio? Potrai assegnargliene una nuova, o dare questa a qualcun altro.')) return;
  await apiCall('/api/admin/users/' + id + '/rimuovi-tessera', { method: 'POST' });
  await caricaSoci();
}

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

let graficiSede = {};

function distruggiGrafici() {
  Object.values(graficiSede).forEach(g => { if (g) g.destroy(); });
  graficiSede = {};
}

async function caricaStatisticheSede() {
  try {
    const d = await apiCall('/api/stats/sede?giorni=' + periodoStatistiche);

    // Stat box
    document.getElementById('stat-media-ore').textContent = d.mediaOre + 'h';
    document.getElementById('stat-streak').textContent = d.streak + ' gg';
    const dm = d.durataMediaSessione;
    document.getElementById('stat-durata-media').textContent =
      (Math.floor(dm/60) > 0 ? Math.floor(dm/60) + 'h ' : '') + (dm % 60) + 'min';
    if (d.confronto.length >= 2) {
      const delta = d.confronto[0].entrate - d.confronto[1].entrate;
      document.getElementById('stat-confronto').textContent =
        (delta >= 0 ? '+' : '') + delta + ' ingressi';
    }

    // Grafico apertura al giorno
    const ctxA = document.getElementById('grafico-apertura');
    if (graficiSede.apertura) graficiSede.apertura.destroy();
    document.getElementById('media-apertura').textContent =
      `Media: ${d.mediaOre}h/giorno`;
    graficiSede.apertura = new Chart(ctxA, {
      type: 'bar',
      data: {
        labels: d.oreApertura.map(r => r.giorno.slice(5)),
        datasets: [{ data: d.oreApertura.map(r => r.ore), backgroundColor: '#e8380d88', borderColor: '#e8380d', borderWidth: 2, borderRadius: 4 }],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });

    // Grafico trend mensile
    const ctxT = document.getElementById('grafico-trend');
    if (graficiSede.trend) graficiSede.trend.destroy();
    graficiSede.trend = new Chart(ctxT, {
      type: 'line',
      data: {
        labels: d.trendMensile.map(r => r.mese),
        datasets: [{ label: 'Ingressi', data: d.trendMensile.map(r => r.ingressi), borderColor: '#e8380d', backgroundColor: '#e8380d22', tension: 0.3, fill: true }],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });

    // Grafico giorno della settimana
    const ctxD = document.getElementById('grafico-dow');
    if (graficiSede.dow) graficiSede.dow.destroy();
    graficiSede.dow = new Chart(ctxD, {
      type: 'bar',
      data: {
        labels: d.perGiornoSettimana.map(r => r.giorno),
        datasets: [{ data: d.perGiornoSettimana.map(r => r.ingressi), backgroundColor: '#ffb70388', borderColor: '#ffb703', borderWidth: 2, borderRadius: 4 }],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });

    // Grafico fasce orarie
    const ctxO = document.getElementById('grafico-orari');
    if (graficiSede.orari) graficiSede.orari.destroy();
    graficiSede.orari = new Chart(ctxO, {
      type: 'bar',
      data: {
        labels: d.perFasceOrarie.map(r => r.fascia),
        datasets: [{ data: d.perFasceOrarie.map(r => r.ingressi), backgroundColor: '#1d9e7588', borderColor: '#1d9e75', borderWidth: 2, borderRadius: 4 }],
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
    });

    // Classifica soci
    const tbody = document.getElementById('tbody-classifica');
    tbody.innerHTML = d.classifica.map((r, i) => `
      <tr><td>${i + 1}</td><td>${r.nome}</td><td>${r.ingressi}</td></tr>
    `).join('') || '<tr><td colspan="3" class="text-dim">Nessun ingresso questo mese.</td></tr>';

  } catch (e) {
    console.error('Errore statistiche sede:', e);
  }
}

// Grafico ambiente (separato perché non dipende dal periodo)
async function caricaStatisticheAmbiente() {
  try {
    const letture = await apiCall('/api/stats/ambiente?ore=48');
    if (letture.length === 0) {
      document.getElementById('stato-ambiente').textContent =
        'Nessun dato: collega la stazione con il sensore DHT11.';
      return;
    }
    document.getElementById('stato-ambiente').textContent =
      `Ultime ${letture.length} letture (48 ore)`;

    const ctx = document.getElementById('grafico-ambiente');
    if (graficiSede.ambiente) graficiSede.ambiente.destroy();
    graficiSede.ambiente = new Chart(ctx, {
      type: 'line',
      data: {
        labels: letture.map(l => l.timestamp.slice(11, 16)),
        datasets: [
          { label: 'Temperatura (°C)', data: letture.map(l => l.temperatura), borderColor: '#e8380d', tension: 0.3 },
          { label: 'Umidità (%)', data: letture.map(l => l.umidita), borderColor: '#ffb703', tension: 0.3 },
        ],
      },
    });
  } catch (e) {
    document.getElementById('stato-ambiente').textContent = e.message;
  }
}

// Alias per compatibilità con init() che chiama il vecchio nome
async function caricaStatisticheApertura() {
  await caricaStatisticheSede();
}

document.getElementById('btn-7gg').addEventListener('click', () => {
  periodoStatistiche = 7;
  document.getElementById('btn-7gg').classList.add('active');
  document.getElementById('btn-30gg').classList.remove('active');
  caricaStatisticheSede();
});
document.getElementById('btn-30gg').addEventListener('click', () => {
  periodoStatistiche = 30;
  document.getElementById('btn-30gg').classList.add('active');
  document.getElementById('btn-7gg').classList.remove('active');
  caricaStatisticheSede();
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

// ---------- LOG REMOTO (monitor seriale via sito) ----------
async function caricaLog() {
  const contenitore = document.getElementById('lista-log');
  if (!contenitore) return;

  try {
    const righe = await apiCall('/api/admin/station-log');
    if (righe.length === 0) {
      contenitore.innerHTML = '<span class="text-dim">Nessun log ricevuto ancora.</span>';
      return;
    }
    contenitore.innerHTML = righe.map(r => {
      const ora = r.timestamp.slice(11, 19) || r.timestamp;
      return `<div>[${ora}] <span class="text-dim">${r.station_id}</span> - ${r.messaggio}</div>`;
    }).join('');
  } catch (e) {
    contenitore.innerHTML = `<span class="error-msg">${e.message}</span>`;
  }
}
