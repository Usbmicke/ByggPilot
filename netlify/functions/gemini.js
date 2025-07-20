/**
 * Netlify Function: Gemini AI-chat för ByggPilot
 * Använder Google Secret Manager för säker API-nyckel hantering
 */
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('🤖 Gemini AI request received');
    
    // Hämta Firebase service account från Netlify environment
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    
    if (!serviceAccountBase64) {
      console.log('❌ FIREBASE_SERVICE_ACCOUNT_BASE64 not found');
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Firebase configuration not available',
          details: 'FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable not set'
        })
      };
    }

    // Dekoda service account
    const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));
    
    // Skapa Secret Manager client
    const client = new SecretManagerServiceClient({
      credentials: serviceAccount,
      projectId: serviceAccount.project_id
    });

    console.log('🗝️ Fetching Gemini API key from Secret Manager...');
    
    // Hämta API-nyckel från Secret Manager
    const secretName = `projects/${serviceAccount.project_id}/secrets/GEMINI_API_KEY/versions/latest`;
    
    const [version] = await client.accessSecretVersion({
      name: secretName
    });

    const apiKey = version.payload?.data?.toString();
    
    if (!apiKey) {
      console.log('❌ Gemini API key not found in Secret Manager');
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'AI service not configured',
          details: 'Gemini API key not found in Google Secret Manager'
        })
      };
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { message, context: chatContext, messages, prompt } = body;

    // Support both formats: { message } and { messages, prompt }
    const userMessage = message || prompt || (messages && messages[messages.length - 1]?.content);

    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    console.log('📝 Processing message:', userMessage.substring(0, 100) + '...');

    // Make request to Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const geminiPayload = {
      contents: [{
        parts: [{
          text: `Du är ByggPilot, en intelligent AI-assistent för svenska byggföretag. Svara kort och praktiskt på svenska.

Användarens meddelande: ${userMessage}`
        }]
      }]
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload)
    });

    if (!response.ok) {
      console.error('❌ Gemini API error:', response.status, response.statusText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'AI service error',
          details: `Gemini API returned ${response.status}: ${response.statusText}`
        })
      };
    }

    const data = await response.json();
    console.log('✅ Gemini AI response generated successfully');

    // Extract the response text
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Ingen respons från AI:n';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        success: true,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Error in gemini function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
