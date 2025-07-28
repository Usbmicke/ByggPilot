// Plats: netlify/functions/chatt.js

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  // Hantera bara POST-requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  
  // Kontrollera om en body ens existerar
  if (!event.body) {
    return {
      statusCode: 400, // Bad Request
      body: JSON.stringify({ error: 'Request body is missing' }),
    };
  }

  let data;
  try {
    // Försök att parsa datan
    data = JSON.parse(event.body);
  } catch (error) {
    // Fånga felet om body inte är giltig JSON
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON format in request body' }),
    };
  }

  // Här lägger du din logik för att hantera chatten...
  // ...använd "data"-objektet...

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, received_message: data.message || 'No message found' }),
  };
};
