import { google } from 'googleapis';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// --- Förbättrad klient- och hemlighets-hantering ---

let secretClient;
let googleCredentials;

// Initiera klienten en gång, utanför handler-funktionen.
try {
  if (process.env.GOOGLE_CREDENTIALS) {
    googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    secretClient = new SecretManagerServiceClient({
      credentials: googleCredentials,
      projectId: googleCredentials.project_id,
    });
    console.log('✅ Secret Manager client initialized successfully for auth.');
  } else {
    console.error('❌ CRITICAL (auth.js): GOOGLE_CREDENTIALS environment variable not set.');
  }
} catch (e) {
  console.error('❌ CRITICAL (auth.js): Failed to parse GOOGLE_CREDENTIALS or initialize client.', e);
}

// Cache för att minska antalet anrop till Secret Manager
const secretCache = new Map();

async function getSecret(secretName) {
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
    
    // Cachea hemligheten i 5 minuter
    secretCache.set(secretName, secretValue);
    setTimeout(() => secretCache.delete(secretName), 5 * 60 * 1000);
    
    console.log(`✅ Successfully fetched secret: ${secretName}`);
    return secretValue;
  } catch (error) {
    console.error(`❌ Failed to fetch secret: ${secretName}`, error);
    throw new Error(`Could not retrieve secret '${secretName}'. Please check permissions and if the secret exists. Original error: ${error.message}`);
  }
}

async function initializeOAuth() {
  try {
    let clientId, clientSecret, redirectUri;
    
    clientId = await getSecret('GOOGLE_CLIENT_ID');
    clientSecret = await getSecret('GOOGLE_CLIENT_SECRET');
    redirectUri = await getSecret('GOOGLE_REDIRECT_URI');
    console.log('✅ OAuth credentials loaded successfully');
    
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    console.log('✅ OAuth2 client initialized successfully');
    return oauth2Client;
  } catch (error) {
    console.error('❌ Failed to initialize OAuth2 client:', error.message);
    return null;
  }
}

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.metadata'
];

/**
 * Netlify Function: Google OAuth Authorization
 */
export async function handler(event, context) {
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

  try {
    if (!secretClient) {
      return { statusCode: 503, headers, body: JSON.stringify({ error: 'Server configuration error: Secret Manager client not initialized.' })};
    }

    const oauth2Client = await initializeOAuth();
    
    if (!oauth2Client) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'OAuth not configured',
          details: 'Google OAuth credentials not available in Secret Manager or environment variables'
        })
      };
    }

    if (event.httpMethod === 'GET') {
      try {
        // Generera OAuth URL
        const authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
          prompt: 'consent'
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            authUrl,
            scopes: SCOPES.length,
            configured: true
          })
        };
      } catch (authError) {
        console.error('Error generating auth URL:', authError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to generate authorization URL',
            details: process.env.NODE_ENV === 'development' ? authError.message : 'OAuth configuration error'
          })
        };
      }
    }

    if (event.httpMethod === 'POST') {
      // Kontrollera om request body existerar
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Request body is missing',
            details: 'POST requests must include a JSON body with authorization code'
          })
        };
      }

      let data;
      try {
        // Försök parsa JSON data
        data = JSON.parse(event.body);
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid JSON format in request body',
            details: 'Request body must be valid JSON'
          })
        };
      }

      // Validera att authorization code finns
      if (!data.code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Authorization code missing',
            details: 'Request must include "code" field with authorization code from Google'
          })
        };
      }

      try {
        // Byta authorization code mot tokens
        const { tokens } = await oauth2Client.getToken(data.code);
        oauth2Client.setCredentials(tokens);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            hasAccessToken: !!tokens.access_token,
            hasRefreshToken: !!tokens.refresh_token
          })
        };

      } catch (tokenError) {
        console.error('Error exchanging code for tokens:', tokenError);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Invalid authorization code',
            details: process.env.NODE_ENV === 'development' ? tokenError.message : 'Failed to exchange authorization code'
          })
        };
      }
    }

    // Unsupported HTTP method
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        details: `${event.httpMethod} method is not supported. Use GET or POST.`
      })
    };

  } catch (error) {
    console.error('Unexpected error in auth function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      })
    };
  }
}
