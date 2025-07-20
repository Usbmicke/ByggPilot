/**
 * Netlify Function: Hämta Gemini API-nyckel från Google Secret Manager
 * Använder Firebase-konfiguration som redan finns på Netlify
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

  try {
    console.log('🔍 Initializing Secret Manager client...');
    
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
    
    // Skapa Secret Manager client med service account credentials
    const client = new SecretManagerServiceClient({
      credentials: serviceAccount,
      projectId: serviceAccount.project_id
    });

    console.log('🗝️ Fetching Gemini API key from Secret Manager...');
    
    // Hämta Gemini API-nyckel från Secret Manager
    const secretName = `projects/${serviceAccount.project_id}/secrets/GEMINI_API_KEY/versions/latest`;
    
    const [version] = await client.accessSecretVersion({
      name: secretName
    });

    const apiKey = version.payload?.data?.toString();
    
    if (apiKey) {
      console.log('✅ Successfully retrieved Gemini API key from Secret Manager');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          apiKey: apiKey,
          source: 'google-secret-manager',
          success: true
        })
      };
    }

    console.log('❌ Gemini API key not found in Secret Manager');
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ 
        error: 'Gemini API key not available',
        details: 'Secret not found in Google Secret Manager'
      })
    };

  } catch (error) {
    console.error('❌ Error accessing Secret Manager:', error);
    
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
