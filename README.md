# CCA SIEMMU — Spazio Giovani Generazioni

Sito dei soci: presenze, calendario, missioni, Banca del tempo, notifiche. Gira su Cloudflare
(Worker in `src/`, pagine statiche in `dist/`, database D1 con le migrazioni in `migrations/`).

- Pubblicazione: vedi `DEPLOYMENT.md`.
- Prova in locale: `npm install`, poi `npm run dev`.
- Controlli: `for t in tests/*.integration.mjs; do node "$t"; done` e `node --test tests/*.test.mjs`.

## Ingresso e uscita

Un solo codice segreto (che i referenti possono cambiare dal pannello) vale per il QR e per i tag NFC
all'ingresso: entrambi aprono `https://<sito>/#ingresso/<codice>`, che registra ingresso o uscita.
Le istruzioni per scrivere i tag sono nel pannello dei referenti, sezione «Tag NFC all'ingresso».
Non ci sono lettori hardware né tessere: la parte ESP32 è stata tolta.

## Struttura del sito

- `dist/app/01-…07-*.js`: il sito, diviso per area (base, home, pagine, profilo e impostazioni, referenti, router, azioni).
  Si caricano in ordine da `index.html` e condividono le variabili globali: una funzione definita in un file
  si può usare negli altri, ma solo dopo il caricamento (non durante).
- `grafiche/`: immagini originali non pubblicate (social, PNG sorgenti).
- Alla pubblicazione `scripts/minify.mjs` compatta script e stili.
- Prove: `tests/*.integration.mjs` (server), `tests/*.test.mjs`, `tests/pagine.e2e.py` (pagine in un browser, serve Playwright).
- Errori in produzione: Cloudflare → Workers → spaziogiovanigenerazioni → Logs (cerca «Errore nel sito» o «Errore API»).
