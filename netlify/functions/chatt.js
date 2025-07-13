// Fil: /netlify/functions/chatt.js

exports.handler = async function(event) {
    // 1. Hämta användarens meddelande och system prompt från anropet
    const { message, systemPrompt, userContext } = JSON.parse(event.body);
  
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
  
    // 4. Bygg upp anropet till Google Gemini API med ByggPilot system prompt
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    // Skapa kontextuell prompt baserat på användarens status
    let contextualPrompt = systemPrompt || '';
    
    if (userContext) {
      if (userContext.isGoogleConnected) {
        contextualPrompt += '\n\nANSLUTNING STATUS: ByggPilots avancerade Google-integrationer är nu aktiva. Du kan läsa mail, skapa kalenderhändelser och hantera Drive-filer.';
      } else {
        contextualPrompt += '\n\nANSLUTNING STATUS: Google Workspace-integrationen är inte aktiv. Du kan ge råd men inte automatiskt agera på Google-tjänster.';
      }
      
      if (userContext.userRole) {
        contextualPrompt += `\nANVÄNDARINFO: ${userContext.userRole}`;
      }
    }
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `${contextualPrompt}\n\nAnvändare: ${message}\n\nByggPilot:`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
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
  