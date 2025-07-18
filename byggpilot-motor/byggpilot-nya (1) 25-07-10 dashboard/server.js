import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Secret Manager client
const secretClient = new SecretManagerServiceClient();

// CORS konfiguration
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());
app.use(express.static('dist'));

// Cache för secrets för att minska API-anrop
const secretCache = new Map();

/**
 * Hämta secret från Google Secret Manager
 */
async function getSecret(secretName) {
  if (secretCache.has(secretName)) {
    return secretCache.get(secretName);
  }

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'digi-dan';
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    
    const [version] = await secretClient.accessSecretVersion({ name });
    const secretValue = version.payload.data.toString();
    
    // Cache secret i 5 minuter
    secretCache.set(secretName, secretValue);
    setTimeout(() => secretCache.delete(secretName), 5 * 60 * 1000);
    
    return secretValue;
  } catch (error) {
    console.error(`Error accessing secret ${secretName}:`, error);
    
    // Fallback till miljövariabler för lokal utveckling
    if (process.env.NODE_ENV === 'development') {
      const envValue = process.env[secretName];
      if (envValue) {
        console.log(`Using fallback environment variable for ${secretName}`);
        return envValue;
      }
    }
    
    throw new Error(`Could not retrieve secret: ${secretName}`);
  }
}

// Hämta Google OAuth-konfiguration från Secret Manager eller miljövariabler
let oauth2Client;

async function initializeOAuth() {
  try {
    let clientId, clientSecret, redirectUri;
    
    // Försök Secret Manager först
    try {
      clientId = await getSecret('GOOGLE_CLIENT_ID');
      clientSecret = await getSecret('GOOGLE_CLIENT_SECRET');
      redirectUri = await getSecret('GOOGLE_REDIRECT_URI');
      console.log('✅ OAuth credentials loaded from Secret Manager');
    } catch (secretError) {
      // Fallback till miljövariabler för lokal utveckling
      console.log('🔄 Secret Manager not available, using environment variables for development');
      clientId = process.env.GOOGLE_CLIENT_ID;
      clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/callback';
      
      if (!clientId || !clientSecret) {
        console.log('⚠️  OAuth credentials not found. Google integration will be disabled.');
        console.log('   Configure Secret Manager or set environment variables for full functionality.');
        return;
      }
    }
    
    oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    console.log('✅ OAuth2 client initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize OAuth2 client:', error.message);
  }
}

// Initiera OAuth vid serverstart
initializeOAuth().catch(console.error);

// Scopes enligt specifikationen
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.metadata'
];

// Temporär lagring för användarsessioner (i produktion ska detta vara en databas)
const userSessions = new Map();

/**
 * Hämta Gemini API-nyckel för frontend
 */
app.get('/api/config/gemini-key', async (req, res) => {
  try {
    let geminiApiKey;
    
    try {
      geminiApiKey = await getSecret('GEMINI_API_KEY');
      console.log('✅ Gemini API key loaded from Secret Manager');
    } catch (secretError) {
      // Fallback till miljövariabel för lokal utveckling
      geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey) {
        console.log('🔄 Using Gemini API key from environment variable');
      } else {
        throw new Error('Gemini API key not found in Secret Manager or environment variables');
      }
    }
    
    res.json({ apiKey: geminiApiKey });
  } catch (error) {
    console.error('❌ Error retrieving Gemini API key:', error.message);
    res.status(500).json({ 
      error: 'Could not retrieve API configuration',
      details: 'Configure GEMINI_API_KEY in Secret Manager or environment variables'
    });
  }
});

/**
 * STEG 1: Skapa OAuth 2.0 auktoriserings-URL
 */
app.get('/auth/google', (req, res) => {
  if (!oauth2Client) {
    return res.status(500).json({ error: 'OAuth client not initialized' });
  }
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    include_granted_scopes: true,
    prompt: 'consent' // Säkerställer att vi får refresh_token
  });

  res.json({ authUrl });
});

/**
 * STEG 2: Hantera callback från Google och byta code mot tokens
 */
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Byt authorization code mot access_token och refresh_token
    const { tokens } = await oauth2Client.getAccessToken(code);
    oauth2Client.setCredentials(tokens);

    // Hämta användarinformation
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const userData = {
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.name,
      picture: userInfo.data.picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token, // I produktion: kryptera och lagra säkert
      tokenExpiry: tokens.expiry_date
    };

    // Lagra användarsession (i produktion: använd säker session management)
    const sessionId = generateSessionId();
    userSessions.set(sessionId, userData);

    // Omdirigera tillbaka till frontend med session ID
    res.redirect(`${process.env.FRONTEND_URL}?session=${sessionId}&auth=success`);

  } catch (error) {
    console.error('Error during token exchange:', error);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
  }
});

/**
 * STEG 3: Hämta användarinformation baserat på session
 */
app.get('/api/user', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const userData = userSessions.get(sessionId);
  
  // Returnera endast säker information (inte refresh_token)
  res.json({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    picture: userData.picture,
    isAuthenticated: true
  });
});

/**
 * STEG 4: Google Drive - Skapa projektmapp
 */
app.post('/api/drive/create-folder', async (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  const { folderName } = req.body;

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  try {
    const userData = userSessions.get(sessionId);
    
    // Förnya access token om nödvändigt
    await refreshTokenIfNeeded(userData);
    
    oauth2Client.setCredentials({
      access_token: userData.accessToken,
      refresh_token: userData.refreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const folderMetadata = {
      name: `Projekt: ${folderName}`,
      mimeType: 'application/vnd.google-apps.folder'
    };

    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id, name, webViewLink'
    });

    res.json({
      folderId: folder.data.id,
      folderName: folder.data.name,
      webViewLink: folder.data.webViewLink
    });

  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

/**
 * STEG 5: Google Drive - Ladda upp fil till projektmapp
 */
app.post('/api/drive/upload-file', async (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  const { fileName, fileContent, mimeType, folderId } = req.body;

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  try {
    const userData = userSessions.get(sessionId);
    
    await refreshTokenIfNeeded(userData);
    
    oauth2Client.setCredentials({
      access_token: userData.accessToken,
      refresh_token: userData.refreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType: mimeType,
      body: Buffer.from(fileContent, 'base64')
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink'
    });

    res.json({
      fileId: file.data.id,
      fileName: file.data.name,
      webViewLink: file.data.webViewLink
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

/**
 * STEG 6: Google Drive - Lista filer i projektmapp
 */
app.get('/api/drive/list-files/:folderId', async (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  const { folderId } = req.params;

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  try {
    const userData = userSessions.get(sessionId);
    
    await refreshTokenIfNeeded(userData);
    
    oauth2Client.setCredentials({
      access_token: userData.accessToken,
      refresh_token: userData.refreshToken
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, modifiedTime, webViewLink, iconLink)',
      orderBy: 'modifiedTime desc'
    });

    res.json({ files: response.data.files });

  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

/**
 * STEG 7: Gmail - Skicka e-post
 */
app.post('/api/gmail/send', async (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  const { to, subject, body, attachments } = req.body;

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  try {
    const userData = userSessions.get(sessionId);
    
    await refreshTokenIfNeeded(userData);
    
    oauth2Client.setCredentials({
      access_token: userData.accessToken,
      refresh_token: userData.refreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Skapa RFC 2822-kompatibelt MIME-meddelande
    const mimeMessage = createMimeMessage(userData.email, to, subject, body, attachments);
    
    // Koda till base64url
    const encodedMessage = Buffer.from(mimeMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    res.json({
      messageId: response.data.id,
      success: true
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

/**
 * STEG 8: Gmail - Lista meddelanden (för att leta efter svar)
 */
app.get('/api/gmail/messages', async (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  const { query } = req.query;

  if (!sessionId || !userSessions.has(sessionId)) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  try {
    const userData = userSessions.get(sessionId);
    
    await refreshTokenIfNeeded(userData);
    
    oauth2Client.setCredentials({
      access_token: userData.accessToken,
      refresh_token: userData.refreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query || 'is:unread',
      maxResults: 10
    });

    // Hämta metadata för varje meddelande
    const messages = [];
    if (response.data.messages) {
      for (const message of response.data.messages) {
        const messageData = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date']
        });
        
        const headers = messageData.data.payload.headers;
        messages.push({
          id: message.id,
          from: headers.find(h => h.name === 'From')?.value,
          subject: headers.find(h => h.name === 'Subject')?.value,
          date: headers.find(h => h.name === 'Date')?.value,
          snippet: messageData.data.snippet
        });
      }
    }

    res.json({ messages });

  } catch (error) {
    console.error('Error listing messages:', error);
    res.status(500).json({ error: 'Failed to list messages' });
  }
});

/**
 * Logga ut användare
 */
app.post('/api/logout', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (sessionId && userSessions.has(sessionId)) {
    userSessions.delete(sessionId);
  }
  
  res.json({ success: true });
});

// Hjälpfunktioner

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function refreshTokenIfNeeded(userData) {
  if (Date.now() >= userData.tokenExpiry - 60000) { // Förnya 1 minut innan utgång
    try {
      oauth2Client.setCredentials({
        refresh_token: userData.refreshToken
      });
      
      const { credentials } = await oauth2Client.refreshAccessToken();
      userData.accessToken = credentials.access_token;
      userData.tokenExpiry = credentials.expiry_date;
      
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }
}

function createMimeMessage(from, to, subject, body, attachments = []) {
  const boundary = `boundary_${Date.now()}_${Math.random()}`;
  
  let message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    '',
    body,
    ''
  ];

  // Lägg till bilagor om de finns
  attachments.forEach(attachment => {
    message.push(
      `--${boundary}`,
      `Content-Type: ${attachment.mimeType}`,
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      `Content-Transfer-Encoding: base64`,
      '',
      attachment.data,
      ''
    );
  });

  message.push(`--${boundary}--`);
  
  return message.join('\r\n');
}

// Serve frontend för alla routes som inte matchar API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ByggPilot backend server running on port ${PORT}`);
});
