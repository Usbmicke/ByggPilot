// Plats: netlify/functions/gemini.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const getSecret = async (secretName) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const projectId = credentials.project_id;
    const secretClient = new SecretManagerServiceClient({ credentials });
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
      console.error("CRITICAL: GEMINI_API_KEY not found in Secret Manager or permissions are missing.");
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error: Missing Gemini API key' })};
    }
    
    // Initiera Google Generative AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    
    // Skicka det nya meddelandet
    const result = await chat.sendMessage(newMessage);
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
