/**
 * Netlify Function: Hämta Gemini API-nyckel för frontend
 * Enkel fallback som bara använder environment variables
 */
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
    console.log('🔍 Looking for Gemini API key in environment variables');
    
    // Använd environment variable som finns på Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (apiKey) {
      console.log('✅ Found GEMINI_API_KEY in environment variables');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          apiKey: apiKey,
          source: 'environment-variable',
          success: true
        })
      };
    }

    console.log('❌ GEMINI_API_KEY not found in environment variables');
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ 
        error: 'Gemini API key not available',
        details: 'GEMINI_API_KEY environment variable not set'
      })
    };

  } catch (error) {
    console.error('❌ Error in gemini-key function:', error);
    
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
