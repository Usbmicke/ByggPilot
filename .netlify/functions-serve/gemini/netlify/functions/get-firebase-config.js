// netlify/functions/get-firebase-config.js
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// En hjälpfunktion för att hämta EN hemlighet
const fetchSecret = async (secretClient, projectId, secretName) => {
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  try {
    const [version] = await secretClient.accessSecretVersion({ name });
    return version.payload.data.toString();
  } catch (error) {
    console.error(`❌ Failed to fetch secret: ${secretName}`, error.message);
    // Returnera null om en enskild hemlighet inte hittas, så att vi kan ge ett bättre felmeddelande
    return null;
  }
};

export const handler = async (event, context) => {
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
    
    console.log(`✅ Secret Manager client initialized for project: ${projectId}`);
    
    // Lista över alla Firebase-nycklar vi behöver hämta
    const secretsToFetch = [
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'FIREBASE_MESSAGING_SENDER_ID',
      'FIREBASE_APP_ID'
    ];

    console.log('🔍 Fetching Firebase secrets:', secretsToFetch);

    // Hämta alla hemligheter parallellt
    const secretPromises = secretsToFetch.map(secretName => 
      fetchSecret(secretClient, projectId, secretName)
    );
    const resolvedSecrets = await Promise.all(secretPromises);
    
    // Kontrollera om någon hemlighet misslyckades att hämta
    const failedSecrets = secretsToFetch.filter((name, index) => resolvedSecrets[index] === null);
    
    if (failedSecrets.length > 0) {
      console.error('❌ Failed to retrieve secrets:', failedSecrets);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to retrieve all necessary Firebase secrets',
          details: `Missing secrets: ${failedSecrets.join(', ')}`,
          missingSecrets: failedSecrets
        })
      };
    }

    // Bygg det färdiga konfigurationsobjektet
    const firebaseConfig = {
      apiKey:            resolvedSecrets[0],
      authDomain:        resolvedSecrets[1],
      projectId:         resolvedSecrets[2],
      storageBucket:     resolvedSecrets[3],
      messagingSenderId: resolvedSecrets[4],
      appId:             resolvedSecrets[5]
    };

    // Validera att alla värden finns
    const missingValues = Object.entries(firebaseConfig)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingValues.length > 0) {
      console.error('❌ Firebase config has empty values:', missingValues);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Incomplete Firebase configuration',
          details: `Empty values for: ${missingValues.join(', ')}`,
          emptyFields: missingValues
        })
      };
    }

    console.log('✅ Successfully retrieved complete Firebase configuration');
    console.log(`   - API Key length: ${firebaseConfig.apiKey.length}`);
    console.log(`   - Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`   - Project ID: ${firebaseConfig.projectId}`);

    // Skicka det kompletta objektet till frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...firebaseConfig,
        // Lägg till metadata för debugging
        _metadata: {
          retrievedAt: new Date().toISOString(),
          project: projectId,
          secretsRetrieved: secretsToFetch.length
        }
      })
    };

  } catch (error) {
    console.error('❌ Unexpected error in get-firebase-config:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Failed to retrieve Firebase configuration',
        timestamp: new Date().toISOString()
      })
    };
  }
};
