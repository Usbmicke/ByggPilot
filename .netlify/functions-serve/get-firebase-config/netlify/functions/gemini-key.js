/**
 * Netlify Function: Hämta Gemini API-nyckel för frontend
 * Använder get-secret funktionen för att hämta från Secret Manager
 */
export async function handler(event, context) {
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

  // Endast GET requests tillåtna för denna endpoint
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed', 
        details: 'Only GET requests are supported for this endpoint' 
      })
    };
  }

  try {
    console.log('🔍 Fetching Gemini API key via get-secret function');
    
    // Försök först med environment variable som backup
    const envApiKey = process.env.GEMINI_API_KEY;
    if (envApiKey) {
      console.log('✅ Using GEMINI_API_KEY from environment variable');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          apiKey: envApiKey,
          source: 'environment-variable',
          success: true
        })
      };
    }
    
    // Anropa get-secret funktionen internt
    const secretEvent = {
      httpMethod: 'GET',
      queryStringParameters: { secret: 'GEMINI_API_KEY' }
    };
    
    // Importera och kör get-secret handler
    const { handler: getSecretHandler } = await import('./get-secret.js');
    const secretResponse = await getSecretHandler(secretEvent, context);
    
    if (secretResponse.statusCode !== 200) {
      console.error('Failed to get Gemini API key from Secret Manager');
      
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Gemini API key not available',
          details: 'Neither Secret Manager nor environment variable contains GEMINI_API_KEY'
        })
      };
    }
      
      // Fallback till environment variable
      const fallbackApiKey = process.env.GEMINI_API_KEY;
      if (fallbackApiKey) {
        console.log('⚠️  Using fallback GEMINI_API_KEY from environment');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            apiKey: fallbackApiKey,
            source: 'environment-variable',
            fallback: true
          })
        };
      }
      
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Gemini API key not available',
          details: 'Neither Secret Manager nor environment variable contains GEMINI_API_KEY'
        })
      };
    }

    const secretData = JSON.parse(secretResponse.body);
    const apiKey = secretData.value;

    console.log('✅ Gemini API key retrieved successfully from Secret Manager');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        apiKey: apiKey,
        source: 'secret-manager',
        success: true
      })
    };

  } catch (error) {
    console.error('Error in gemini-key function:', error);
    
    // Fallback till environment variable vid fel
    const fallbackApiKey = process.env.GEMINI_API_KEY;
    if (fallbackApiKey) {
      console.log('⚠️  Using emergency fallback GEMINI_API_KEY');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          apiKey: fallbackApiKey,
          source: 'emergency-fallback',
          error: 'Secret Manager unavailable'
        })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Failed to retrieve API key'
      })
    };
  }
}
