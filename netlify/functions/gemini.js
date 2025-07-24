// Plats: netlify/functions/gemini.js
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Förbättrad klient- och hemlighets-hantering ---

let secretClient;
let googleCredentials;

// Initiera klienten en gång, utanför handler-funktionen.
// Detta är en "best practice" för serverlösa funktioner för att återanvända anslutningar.
try {
  if (process.env.GOOGLE_CREDENTIALS) {
    googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    secretClient = new SecretManagerServiceClient({
      credentials: googleCredentials,
      projectId: googleCredentials.project_id,
    });
    console.log('✅ Secret Manager client initialized successfully.');
  } else {
    console.error('❌ CRITICAL: GOOGLE_CREDENTIALS environment variable not set.');
  }
} catch (e) {
  console.error('❌ CRITICAL: Failed to parse GOOGLE_CREDENTIALS or initialize client.', e);
}

// Cache för att minska antalet anrop till Secret Manager
const secretCache = new Map();

const getSecret = async (secretName) => {
  if (secretCache.has(secretName)) {
    console.log(`⚡️ Using cached secret for: ${secretName}`);
    return secretCache.get(secretName);
  }

  if (!secretClient || !googleCredentials) {
    throw new Error('Secret Manager client is not initialized.');
  }

  try {
    const name = `projects/${googleCredentials.project_id}/secrets/${secretName}/versions/latest`;
    console.log(`🔍 Fetching secret: ${secretName}`);
    const [version] = await secretClient.accessSecretVersion({ name });
    const secretValue = version.payload.data.toString();

    // Cachea hemligheten i 5 minuter för att minska anrop
    secretCache.set(secretName, secretValue);
    setTimeout(() => secretCache.delete(secretName), 5 * 60 * 1000);

    console.log(`✅ Successfully fetched secret: ${secretName}`);
    return secretValue;
  } catch (error) {
    console.error(`❌ Failed to fetch secret: ${secretName}`, error);
    throw new Error(`Could not retrieve secret '${secretName}'. Please check permissions and if the secret exists. Original error: ${error.message}`);
  }
};

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  if (!secretClient) {
    return { statusCode: 503, headers, body: JSON.stringify({ error: 'Server configuration error: Secret Manager client not initialized.' })};
  }

  try {
    // Säkrare destrukturering med standardvärden för valfria fält
    const { systemPrompt = null, messages = [], newMessage } = JSON.parse(event.body);

    // --- VALIDERING ---
    // Om `newMessage` saknas eller är tomt (t.ex. vid initAI-anropet), returnera ett lyckat men tomt svar.
    if (typeof newMessage !== 'string' || newMessage.trim() === '') {
      console.log('ℹ️ Received request with empty newMessage. Likely an init call. Returning empty success.');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, response: '' }),
      };
    }

    const geminiApiKey = await getSecret('GEMINI_API_KEY');

    // Initiera Google Generative AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Bygg konversationshistorik för Gemini
    const history = [];

    // Lägg till systemprompten som första meddelande om den finns
    if (systemPrompt) {
      history.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
      // Lägg till ett "förstått"-svar från modellen för att sätta tonen
      history.push({
        role: 'model',
        parts: [{ text: 'Jag förstår. Jag är ByggPilot, din digitala kollega i byggbranschen. Jag kommer att agera som en expert projektledare och intelligent assistent som hjälper dig med administrativa uppgifter, regelverket och praktiska byggfrågor. Hur kan jag hjälpa dig idag?' }]
      });
    }

    // Lägg till befintlig chatthistorik, och sanera den för säkerhets skull
    if (messages && messages.length > 0) {
      const sanitizedHistory = messages.filter(
        msg => msg && msg.role && msg.parts && Array.isArray(msg.parts) &&
               msg.parts.every(part => part && typeof part.text === 'string' && part.text.trim() !== '')
      );
      history.push(...sanitizedHistory);
    }

    // Starta chat-session med historik
    const chat = model.startChat({ history });

    // Skicka det nya meddelandet som en array av parts (Gemini standard format)
    const result = await chat.sendMessage([{ text: newMessage }]);
    const response = await result.response;
    const aiResponse = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, response: aiResponse }),
    };

  } catch (error) {
    console.error('❌ Unhandled exception in gemini function:', error);
    return { statusCode: 500, headers, body: JSON.stringify({
      error: 'Internal Server Error',
      details: error.message
    })};
  }
};
