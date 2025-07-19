// Netlify Function som hämtar secrets från Google Secret Manager
// Detta är HUVUDFUNKTIONEN för att hämta API-nycklar (Firebase, Gemini, etc.)
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Endast GET requests tillåtna
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        details: 'Only GET requests are supported'
      })
    };
  }

  try {
    // Hämta Service Account credentials från environment variable
    let credentials;
    
    if (process.env.GOOGLE_CREDENTIALS) {
      console.log('🔧 Using GOOGLE_CREDENTIALS from Netlify environment');
      try {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        console.log('✅ Successfully parsed Google credentials');
      } catch (parseError) {
        console.error('❌ Failed to parse GOOGLE_CREDENTIALS:', parseError.message);
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid credentials configuration',
            details: 'GOOGLE_CREDENTIALS environment variable contains invalid JSON'
          })
        };
      }
    } else {
      console.error('❌ GOOGLE_CREDENTIALS environment variable not found');
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Credentials not configured',
          details: 'GOOGLE_CREDENTIALS environment variable is required'
        })
      };
    }

    // Skapa Secret Manager klient med credentials
    const secretClient = new SecretManagerServiceClient({
      credentials: credentials,
      projectId: credentials.project_id
    });

    console.log(`✅ Secret Manager client initialized for project: ${credentials.project_id}`);
    
    // Hämta secret name från query parameters
    const { secret } = event.queryStringParameters || {};
    
    if (!secret) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Secret name required',
          details: 'Provide secret name as query parameter: ?secret=SECRET_NAME',
          examples: [
            'GEMINI_API_KEY',
            'GOOGLE_CLIENT_ID', 
            'GOOGLE_CLIENT_SECRET'
          ]
        })
      };
    }

    // Validera secret name (säkerhet)
    if (!/^[A-Z_][A-Z0-9_]*$/.test(secret)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid secret name format',
          details: 'Secret names must contain only uppercase letters, numbers, and underscores'
        })
      };
    }

    console.log(`🔍 Attempting to retrieve secret: ${secret}`);
    
    const projectId = credentials.project_id;
    const name = `projects/${projectId}/secrets/${secret}/versions/latest`;
    
    // Hämta secret från Secret Manager
    const [version] = await secretClient.accessSecretVersion({ name });
    const secretValue = version.payload.data.toString();
    
    console.log(`✅ Successfully retrieved secret: ${secret} (length: ${secretValue.length})`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        secretName: secret,
        value: secretValue,
        project: projectId,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('❌ Error in get-secret function:', error);
    
    // Specifik felhantering för olika Google Cloud fel
    if (error.code === 5) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          error: 'Secret not found',
          details: `The requested secret does not exist in Google Secret Manager`
        })
      };
    }
    
    if (error.code === 7) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          error: 'Access denied',
          details: 'The service account does not have permission to access this secret'
        })
      };
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('network')) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Network error',
          details: 'Unable to connect to Google Secret Manager'
        })
      };
    }
    
    // Allmänt fel
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Failed to retrieve secret',
        timestamp: new Date().toISOString()
      })
    };
  }
};

export { handler };
