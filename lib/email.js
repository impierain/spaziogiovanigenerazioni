// lib/email.js
// Invio email tramite Resend (https://resend.com) - piano gratuito,
// fino a 3000 email al mese, nessuna carta di credito richiesta.
// Serve solo creare un account e prendere la API key.

async function inviaEmail({ a, oggetto, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non impostata: email NON inviata a', a);
    return false;
  }

  try {
    const risposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_MITTENTE || 'Spazio Giovani <onboarding@resend.dev>',
        to: [a],
        subject: oggetto,
        html,
      }),
    });

    if (!risposta.ok) {
      console.error('Invio email fallito:', await risposta.text());
      return false;
    }
    return true;
  } catch (err) {
    // Un problema di rete/DNS nell'invio email non deve MAI far fallire
    // la creazione del socio: logghiamo e basta.
    console.error('Errore imprevisto nell\'invio email:', err.message);
    return false;
  }
}

module.exports = { inviaEmail };
