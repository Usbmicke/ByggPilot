// Plats: netlify/functions/gemini.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

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
    const geminiApiKey = await getSecret('GEMINI_API_KEY');

    if (!geminiApiKey) {
      console.error("CRITICAL: GEMINI_API_KEY not found in Secret Manager or permissions are missing.");
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error: Missing Gemini API key' })};
    }
    
    // HÄR KOMMER DIN RIKTIGA GEMINI-LOGIK SENARE.
    // Vi simulerar ett lyckat anrop och svar.
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        response: "AI-systemet är nu online och svarar korrekt." 
      }),
    };

  } catch (error) {
    console.error('❌ Unhandled exception in gemini function:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error' }) };
  }
};
