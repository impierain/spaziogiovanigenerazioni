# Pubblicare dalla stessa versione di GitHub

La sorgente del sito è il ramo `main` di questo repository. Grafica, font, paesaggi,
interfaccia, Worker e migrazioni sono tutti versionati insieme.

1. Unire le modifiche in `main`, dopo i controlli della PR.
2. Aggiornare la copia locale da GitHub e verificare che sia pulita.
3. Controllare le migrazioni D1 mancanti e applicare soltanto quelle necessarie.
4. Usare Node.js 22 o successivo e `npm run deploy`.
5. Verificare che `/release.json` online riporti lo stesso `sourceCommit` di GitHub.

Il comando di pubblicazione rifiuta modifiche locali non salvate, file non
versionati e copie diverse dal `main` remoto. Genera `dist/release.json` con il
commit, l’albero sorgente e le impronte degli asset. Questo file è un artefatto
generato e non va aggiunto a Git: inserire il commit dentro se stesso non sarebbe
possibile. Le notifiche push usano `sw.js` soltanto per le notifiche, senza cache
delle pagine o delle risorse.

Non pubblicare direttamente con `wrangler deploy`: aggirerebbe il controllo.
`CCA_WRANGLER_PATH` può indicare il file CLI di Wrangler se non è nel PATH.
I segreti email e VAPID rimangono in Cloudflare o nel database, mai nel repository.
