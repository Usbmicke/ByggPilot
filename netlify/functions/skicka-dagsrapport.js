// Fil: /netlify/functions/skicka-dagsrapport.js

// Vi importerar ett bibliotek från Google som hjälper till med säker inloggning.
const { OAuth2Client } = require('google-auth-library');

exports.handler = async function(event, context) {
  // Hämta dina hemligheter från Netlifys miljövariabler.
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, MIN_EMAIL_ADRESS } = process.env;

  // Skapa en ny OAuth2-klient.
  const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  
  // Ladda klienten med ditt långlivade "lösenord" (Refresh Token).
  oAuth2Client.setCredentials({
    refresh_token: GMAIL_REFRESH_TOKEN,
  });

  try {
    // Använd ditt Refresh Token för att hämta ett nytt, kortlivat Access Token.
    // Detta är nyckeln som ger tillgång till ditt Gmail just nu.
    const { token: accessToken } = await oAuth2Client.getAccessToken();

    // -- Bygg ditt e-postmeddelande --
    const mailSubject = `Daglig rapport från Byggpilot - ${new Date().toLocaleDateString('sv-SE')}`;
    const mailBody = 'Hej! Här är din dagliga rapport.\n\nAllt ser bra ut.\n\nHälsningar,\nByggpilot';
    const mailTo = MIN_EMAIL_ADRESS; // Din e-postadress från miljövariablerna.
    const mailFrom = 'Byggpilot AI <me>'; // "me" betyder det konto som är inloggat.

    // Gmail API kräver att mejlet är i ett speciellt format (Base64).
    const mailParts = [
      `From: ${mailFrom}`,
      `To: ${mailTo}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${mailSubject}`,
      '',
      mailBody,
    ];
    const rawMail = Buffer.from(mailParts.join('\n')).toString('base64url');

    // -- Skicka mejlet med Gmail API --
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Använd ditt nya Access Token här.
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: rawMail,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gmail API Error: ${JSON.stringify(errorData)}`);
    }
    
    console.log('Daglig rapport skickad!');
    return { statusCode: 200, body: 'Mail sent successfully.' };

  } catch (error) {
    console.error('Kunde inte skicka rapport:', error);
    return { statusCode: 500, body: error.toString() };
  }
};