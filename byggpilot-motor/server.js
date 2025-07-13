// =======================================================================
//          BYGGPILOT MOTOR - VERSION 1.3 (REN KOPIA)
// =======================================================================
require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const { JSONFile, Low } = require('lowdb');

// ---- GRUNDINSTÄLLNINGAR ----
const app = express();
const port = 8080;

// ---- KONFIGURERA DATABASEN ----
const file = new JSONFile('db.json');
const db = new Low(file);
db.read();
db.data = db.data || { tokens: null };

// ---- KONFIGURERA GOOGLE-ANSLUTNINGEN ----
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `http://localhost:${port}/auth/google/callback`
);

const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
];

// =======================================================================
//                          API-ENDPOINTS
// =======================================================================

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);

    db.data.tokens = tokens;
    await db.write();
    console.log('Tokens sparade i databasen!');

    res.send('<h1>Inloggning lyckades!</h1><p>Tokens är nu sparade permanent. Du kan stänga detta fönster.</p>');

  } catch (error) {
    console.error('Fel vid autentisering:', error);
    res.status(500).send('Något gick fel under inloggningen.');
  }
});

app.get('/api/check-status', (req, res) => {
    if (db.data.tokens) {
        res.json({ status: 'Du är inloggad och tokens finns sparade i databasen!' });
    } else {
        res.json({ status: 'Du är inte inloggad.' });
    }
});

// ---- RUM 4: Skapa en kalenderhändelse ----
app.post('/api/create-calendar-event', async (req, res) => {
    await db.read();
    if (!db.data.tokens) {
        return res.status(401).json({ message: 'Du är inte inloggad.' });
    }

    try {
        oauth2Client.setCredentials(db.data.tokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const event = {
            'summary': 'Möte med kund från ByggPilot',
            'description': 'Diskutera nytt projekt.',
            'start': {
                'dateTime': '2025-06-30T09:00:00+02:00',
                'timeZone': 'Europe/Stockholm',
            },
            'end': {
                'dateTime': '2025-06-30T10:00:00+02:00',
                'timeZone': 'Europe/Stockholm',
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        console.log('Event skapat: ', response.data.htmlLink);
        res.json({ success: true, message: 'Händelsen har skapats i din kalender!', link: response.data.htmlLink });

    } catch (error) {
        console.error('Kunde inte skapa kalenderhändelse:', error);
        res.status(500).send('Något gick fel med kalendern.');
    }
});

// =======================================================================
//                          STARTA MOTORN
// =======================================================================
app.listen(port, () => {
  console.log(`ByggPilots motor är igång på http://localhost:${port}`);
});