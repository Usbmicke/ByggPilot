import { google } from 'googleapis';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Initialize Secret Manager client with proper credentials
let secretClient;

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

// Cache för secrets
const secretCache = new Map();

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

/**
 * Netlify Function: Chat/AI funktionalitet med robust felhantering
 * Följer Netlify's best practices för error handling
 */
export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

  // Endast POST requests för chat
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed', 
        details: 'This endpoint only supports POST requests',
        supportedMethods: ['POST', 'OPTIONS']
      })
    };
  }

  // 1. Kontrollera om en body ens existerar (Netlify's rekommendation)
  if (!event.body) {
    return {
      statusCode: 400, // 400 betyder "Bad Request"
      headers,
      body: JSON.stringify({ 
        error: 'Request body is missing',
        details: 'Chat requests must include a JSON body with message data'
      })
    };
  }

  let data;
  try {
    // 2. Försök att parsa datan (Netlify's rekommendation)
    data = JSON.parse(event.body);
  } catch (parseError) {
    // 3. Fånga felet om body inte är giltig JSON (Netlify's rekommendation)
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Invalid JSON format in request body',
        details: 'Request body must contain valid JSON data'
      })
    };
  }

  // 4. Validera att required fields finns
  if (!data.message || typeof data.message !== 'string') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'Invalid message format',
        details: 'Request must include a "message" field with string content'
      })
    };
  }

  // 5. Validera message längd för säkerhet
  if (data.message.length > 10000) {
    return {
      statusCode: 413, // Payload Too Large
      headers,
      body: JSON.stringify({ 
        error: 'Message too long',
        details: 'Messages must be less than 10,000 characters',
        maxLength: 10000,
        receivedLength: data.message.length
      })
    };
  }

  try {
    // Initiera Secret Manager klient om det inte gjorts
    if (!secretClient) {
      initializeSecretManagerClient();
    }

    // Hämta Gemini API key säkert
    let geminiApiKey;
    try {
      geminiApiKey = await getSecret('GEMINI_API_KEY');
      console.log('✅ Gemini API key loaded from Secret Manager for chat');
    } catch (secretError) {
      console.log('⚠️  Gemini API key not found in Secret Manager, using environment variable');
      geminiApiKey = process.env.GEMINI_API_KEY;
    }

    if (!geminiApiKey) {
      return {
        statusCode: 503, // Service Unavailable
        headers,
        body: JSON.stringify({ 
          error: 'AI service not configured',
          details: 'Chat functionality requires proper API configuration'
        })
      };
    }

    // Här skulle du integrera med Gemini AI API
    // För nu returnerar vi en mock response
    const mockResponse = {
      success: true,
      message: `Du skrev: "${data.message}". AI-svar kommer snart implementeras.`,
      timestamp: new Date().toISOString(),
      messageLength: data.message.length,
      apiConfigured: true
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockResponse)
    };

  } catch (error) {
    console.error('Unexpected error in chat function:', error);
    
    // Olika felmeddelanden för development vs production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: isDevelopment ? error.message : 'Something went wrong processing your chat request',
        timestamp: new Date().toISOString()
      })
    };
  }
}
