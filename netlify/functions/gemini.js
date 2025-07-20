const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

let secretClient;
const secretCache = new Map();

// Initialisera Secret Manager klienten
function initializeSecretManagerClient() {
  try {
    if (process.env.GOOGLE_CREDENTIALS) {
      console.log('🔧 Using GOOGLE_CREDENTIALS from environment');
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      secretClient = new SecretManagerServiceClient({
        credentials: credentials,
        projectId: credentials.project_id
      });
      console.log('✅ Secret Manager client initialized with provided credentials');
    } else {
      console.log('🔧 Using default Google credentials (local development)');
      secretClient = new SecretManagerServiceClient();
      console.log('✅ Secret Manager client initialized with default credentials');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Secret Manager client:', error.message);
    secretClient = new SecretManagerServiceClient();
  }
}

// Hämta hemlig nyckel från Secret Manager med cache
async function getSecret(secretName) {
  if (secretCache.has(secretName)) {
    return secretCache.get(secretName);
  }

  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'digi-dan';
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    
    const [version] = await secretClient.accessSecretVersion({ name });
    const secretValue = version.payload.data.toString();
    
    secretCache.set(secretName, secretValue);
    setTimeout(() => secretCache.delete(secretName), 5 * 60 * 1000);
    
    return secretValue;
  } catch (error) {
    console.error(`Error accessing secret ${secretName}:`, error);
    
    // Fallback endast i development
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

// Huvudfunktion för Gemini API-anrop
export const handler = async (event, context) => {
  // Initialisera Secret Manager om inte redan gjort
  if (!secretClient) {
    initializeSecretManagerClient();
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Hantera preflight CORS-förfrågan
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Endast POST tillåtet
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        message: 'Only POST requests are supported'
      })
    };
  }

  try {
    console.log('🤖 Processing Gemini API request');

    // Hämta Gemini API-nyckel från Secret Manager
    const apiKey = await getSecret('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error('Gemini API key not found in Secret Manager');
    }

    // Läs förfrågan från klienten
    const requestBody = JSON.parse(event.body || '{}');
    const { messages, prompt, model = 'gemini-1.5-pro' } = requestBody;

    if (!messages && !prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Bad request',
          message: 'Either messages or prompt is required'
        })
      };
    }

    // Bygg Gemini API-förfrågan
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    let geminiRequestBody;
    
    if (messages) {
      // Chat-format (med historik)
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      
      geminiRequestBody = {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048
        }
      };
    } else {
      // Enkel prompt-format
      geminiRequestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048
        }
      };
    }

    console.log('📡 Calling Gemini API...');
    
    // Anropa Gemini API
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const geminiResponse = await response.json();
    
    // Extrahera svar från Gemini-responsen
    const content = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 
                   'Inga svar från Gemini API';

    console.log('✅ Gemini API call successful');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response: content,
        model: model,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Error in Gemini function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to process AI request',
        timestamp: new Date().toISOString()
      })
    };
  }
};
