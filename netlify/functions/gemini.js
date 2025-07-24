// Plats: netlify/functions/gemini.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Förbättrad: Hantera både Netlify och lokal utveckling
const getSecret = async (secretName) => {
  let credentials = null;
  let projectId = null;
  let secretClient = null;
  try {
    if (process.env.GOOGLE_CREDENTIALS) {
      // Netlify/produktion: credentials från miljövariabel
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      projectId = credentials.project_id;
      secretClient = new SecretManagerServiceClient({ credentials });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Lokal utveckling: credentials från fil
      secretClient = new SecretManagerServiceClient();
      // Försök hämta projektId från filen
      try {
        const credFile = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        projectId = credFile.project_id;
      } catch (e) {
        console.error('❌ Kunde inte läsa GOOGLE_APPLICATION_CREDENTIALS-filen:', e);
        return null;
      }
    } else {
      console.error('❌ Inga Google credentials hittades i miljövariablerna.');
      return null;
    }
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await secretClient.accessSecretVersion({ name });
    return version.payload.data.toString();
  } catch (error) {
    console.error(`❌ Failed to fetch secret: ${secretName}`, error);
    return null;
  }
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { systemPrompt, messages, newMessage } = JSON.parse(event.body);
    
    const geminiApiKey = await getSecret('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error("CRITICAL: GEMINI_API_KEY not found in Secret Manager eller permissions saknas.");
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error: Missing Gemini API key' })};
    }
    // Initiera Google Generative AI
    let genAI, model;
    try {
      genAI = new GoogleGenerativeAI(geminiApiKey);
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (err) {
      console.error('❌ Fel vid initiering av GoogleGenerativeAI:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to initialize Gemini AI', details: err.message })};
    }

    // Bygg konversationshistorik för Gemini
    const history = [];
    
    // Lägg till systemprompten som första meddelande
    if (systemPrompt) {
      history.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
      history.push({
        role: 'model',
        parts: [{ text: 'Jag förstår. Jag är ByggPilot, din digitala kollega i byggbranschen. Jag kommer att agera som en expert projektledare och intelligent assistent som hjälper dig med administrativa uppgifter, regelverket och praktiska byggfrågor. Hur kan jag hjälpa dig idag?' }]
      });
    }
    
    // Lägg till befintlig chatthistorik
    if (messages && messages.length > 0) {
      history.push(...messages);
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
      body: JSON.stringify({ 
        success: true, 
        response: aiResponse 
      }),
    };

  } catch (error) {
    console.error('❌ Unhandled exception in gemini function:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ 
      error: 'Internal Server Error',
      details: error.message 
    }) };
  }
};
