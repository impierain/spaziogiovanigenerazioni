# Passaggio alla versione reale

Il sito attuale resta una demo separata. Questo schema è il primo passo per il pilota con inviti via email. Non è ancora collegato a Sites o alla webapp.

## Flusso previsto

1. Il referente crea un invito associato all'indirizzo del partecipante.
2. Un'email inviata dal dominio dell'organizzazione contiene un link monouso a scadenza. Il server conserva l'impronta del token. L'apertura del link mostra una conferma. Il consumo avviene alla conferma, così l'anteprima automatica dei client email non esaurisce il link.
3. Il server apre una sessione mediante un cookie protetto. Il referente approva l'iscrizione e ogni operazione verifica ruolo e stato sul server.
4. Una prenotazione riserva un posto. Una convalida dopo l'attività registra XP e Formaggi una sola volta per persona e attività.

## Prima del lancio

- Scegliere il servizio d'invio e verificare il mittente dell'organizzazione. Stabilire l'indirizzo HTTPS per i link.
- Configurare il database di produzione e il primo referente senza inserire recapiti o segreti nel codice.
- Collegare l'interfaccia al server, separare i dati dimostrativi e completare le funzioni che trattano dati personali. Il limite settimanale dei Formaggi, i trofei e i riscatti richiedono ancora regole lato server.
- Concordare con l'organizzazione recapito privacy, tempi di conservazione, accesso dei minorenni e gestione delle segnalazioni. Configurare e testare recupero, revoca e cancellazione degli account.
- Inserire almeno un'attività reale con data, capienza e criterio di convalida. Provare il percorso con due account e due dispositivi prima della pubblicazione.

Lo schema protegge le capienze e impedisce la doppia convalida a livello di database. Le autorizzazioni di lettura e le transizioni delle prenotazioni devono essere applicate anche dal server. La demo privata resta disponibile per le prove locali.

## Dati ricevuti per il pilota

Il mittente indicato e il recapito privacy coincidono. I dettagli dell'attività sono in `pilota.json`. L’attività inizia alle 17:30 (Europe/Rome). Il recapito del primo referente è nella configurazione locale riservata, esclusa dal repository. Per il lancio va impostato come variabile server `CCA_FIRST_ORGANIZER_EMAIL`.

`participation.mjs` contiene la gestione server per elenco attività, richiesta e decisione sulle prenotazioni, annullamento e convalida in giornata nel fuso Europe/Rome. Richiede un database D1 con lo schema applicato e sessioni già emesse dal server. Il modulo non è ancora collegato al sito pubblico o alla schermata referenti.
