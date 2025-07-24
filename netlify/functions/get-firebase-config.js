// netlify/functions/get-firebase-config.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Ändra till din domän i produktion för ökad säkerhet
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

  console.log('🔧 Initializing Firebase config retrieval from Secret Manager');

  // Försök att läsa och parsa credentials
  let credentials;
  if (!process.env.GOOGLE_CREDENTIALS) {
    console.error('❌ GOOGLE_CREDENTIALS environment variable not found');
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ 
        error: 'Server configuration error',
        details: 'Google credentials not configured'
      }) 
    };
  }

  try {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log('✅ Successfully parsed Google credentials');
  } catch (e) {
    console.error('❌ Failed to parse GOOGLE_CREDENTIALS:', e.message);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ 
        error: 'Server configuration error',
        details: 'Invalid credentials format'
      }) 
    };
  }

  try {
    // Skapa klienten
    const secretClient = new SecretManagerServiceClient({ 
      credentials: credentials,
      projectId: credentials.project_id
    });
    const projectId = credentials.project_id;
    
    console.log(`✅ Secret Manager client initialized for project: ${projectId}. Fetching config...`);

    // Hämta hela konfigurationsobjektet från en enda hemlighet
    const secretName = 'FIREBASE_CONFIG_JSON';
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await secretClient.accessSecretVersion({ name });
    const firebaseConfigString = version.payload.data.toString();

    // Validera att vi fick en giltig JSON-sträng
    const firebaseConfig = JSON.parse(firebaseConfigString);

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error('Fetched Firebase config is missing required fields (e.g., apiKey, projectId).');
    }

    console.log('✅ Successfully retrieved and parsed Firebase configuration.');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...firebaseConfig,
      })
    };

  } catch (error) {
    console.error('❌ Unexpected error in get-firebase-config:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Failed to retrieve or parse Firebase configuration',
        timestamp: new Date().toISOString()
      })
    };
  }
};
