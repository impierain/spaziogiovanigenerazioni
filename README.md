# Gestionale Spazio Giovani - Backend

## 1. Installazione locale (per provare prima di mettere online)

```bash
npm install
cp .env.example .env
```

## 2. Creare il database gratuito su Turso

1. Crea un account su https://turso.tech (gratuito)
2. Installa la CLI di Turso e fai login (istruzioni sul loro sito)
3. Crea il database:
   ```bash
   turso db create spazio-giovani
   turso db show spazio-giovani --url
   turso db tokens create spazio-giovani
   ```
4. Copia l'URL e il token ottenuti dentro il file `.env`:
   ```
   TURSO_DATABASE_URL=libsql://...
   TURSO_AUTH_TOKEN=...
   ```

## 3. Creare il primo amministratore

```bash
ADMIN_NOME="Piero" ADMIN_EMAIL="piero@esempio.it" ADMIN_PASSWORD="scegli_una_password_sicura" npm run seed-admin
```

## 4. Provare in locale

```bash
npm start
```
Il server parte su http://localhost:3000. Prova con:
```bash
curl http://localhost:3000/api/health
```

## 5. Mettere online gratis con Render

1. Carica questa cartella su un repository GitHub (Render si collega da lì)
2. Su https://render.com crea un "New Web Service" collegato al repository
3. Build command: `npm install` — Start command: `npm start`
4. Nelle Environment Variables del pannello Render, inserisci le stesse
   variabili del file `.env` (PORT, SESSION_SECRET, ESP32_API_KEY,
   TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
5. Deploy. Render ti darà un indirizzo tipo `https://spazio-giovani.onrender.com`

Nota: sul piano gratuito, il servizio "si addormenta" dopo 15 minuti di
inattività e il primo accesso successivo impiega qualche secondo in più.
I dati non si perdono comunque, perché sono su Turso e non sul server.

**Attenzione:** le sessioni di login sono tenute in memoria del server.
Ogni volta che Render riavvia il servizio (dopo un periodo di inattività,
o un nuovo deploy), tutti gli utenti collegati dovranno rifare il login.
Non è un problema per l'uso quotidiano, ma se un domani servisse evitarlo
del tutto si può spostare lo storage delle sessioni su Turso (si può fare
in un secondo momento, non blocca l'uso adesso).

## 6. Collegare il firmware ESP32

Nel file `.ino`, imposta:
```cpp
const char* SERVER_URL = "https://spazio-giovani.onrender.com/api/attendance";
```
E aggiungi l'header con la chiave API (da fare nella funzione `inviaLog`,
te lo sistemiamo insieme quando testiamo l'hardware).

## Struttura delle API

| Metodo | Percorso              | Chi può usarla       | A cosa serve |
|--------|-----------------------|-----------------------|--------------|
| POST   | /api/login             | tutti                 | login guest/admin |
| POST   | /api/logout            | loggati               | logout |
| GET    | /api/me                | loggati               | dati utente corrente |
| POST   | /api/attendance        | ESP32 (chiave API)    | registra ingresso/uscita da RFID/QR |
| POST   | /api/qr-checkin         | loggati               | check-in/out dalla pagina QR personale |
| GET    | /api/status             | loggati               | chi c'è dentro adesso |
| GET    | /api/logs               | admin                 | storico presenze |
| POST   | /api/chores             | loggati               | registra una faccenda fatta |
| GET    | /api/chores             | loggati               | elenco faccende (proprie o di tutti se admin) |
| GET    | /api/admin/users        | admin                 | elenco soci |
| POST   | /api/admin/users        | admin                 | crea socio |
| PUT    | /api/admin/users/:id    | admin                 | modifica socio |
| DELETE | /api/admin/users/:id    | admin                 | disattiva socio |
| GET    | /api/admin/unknown-cards| admin                 | tessere/QR non riconosciuti |
