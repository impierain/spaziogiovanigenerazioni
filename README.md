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
