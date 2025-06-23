// Fil: /netlify/functions/chatt.js

exports.handler = async function(event) {
    // 1. Hämta användarens meddelande från anropet
    const { message } = JSON.parse(event.body);
  
    // 2. Hämta din hemliga API-nyckel
    const apiKey = process.env.GOOGLE_API_KEY;
  
    // 3. Om nyckeln eller meddelandet saknas, skicka ett fel
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "API-nyckel saknas." })
      };
    }
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Inget meddelande skickades." })
      };
    }
  
    // 4. Bygg upp anropet till Google Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: message
        }]
      }]
    };
  
    // 5. Skicka anropet till Google och vänta på svar
    try {
      const googleResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!googleResponse.ok) {
          // Om Google svarar med ett fel, skicka vidare det
          const errorData = await googleResponse.json();
          return { statusCode: googleResponse.status, body: JSON.stringify(errorData) };
      }
  
      const responseData = await googleResponse.json();
      const aiResponseText = responseData.candidates[0].content.parts[0].text;
  
      // 6. Skicka tillbaka AI-svaret till din hemsida
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: aiResponseText }),
      };
  
    } catch (error) {
      // Om något annat går fel
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Ett fel uppstod vid anrop till Google." }),
      };
    }
  };