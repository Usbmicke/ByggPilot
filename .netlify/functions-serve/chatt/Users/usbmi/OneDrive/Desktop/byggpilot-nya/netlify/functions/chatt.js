"use strict";

// ../../netlify/functions/chatt.js
exports.handler = async function(event) {
  const { message, systemPrompt, userContext } = JSON.parse(event.body);
  const apiKey = process.env.GOOGLE_API_KEY;
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
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  let contextualPrompt = systemPrompt || "";
  if (userContext) {
    if (userContext.isGoogleConnected) {
      contextualPrompt += "\n\nANSLUTNING STATUS: ByggPilots avancerade Google-integrationer \xE4r nu aktiva. Du kan l\xE4sa mail, skapa kalenderh\xE4ndelser och hantera Drive-filer.";
    } else {
      contextualPrompt += "\n\nANSLUTNING STATUS: Google Workspace-integrationen \xE4r inte aktiv. Du kan ge r\xE5d men inte automatiskt agera p\xE5 Google-tj\xE4nster.";
    }
    if (userContext.userRole) {
      contextualPrompt += `
ANV\xC4NDARINFO: ${userContext.userRole}`;
    }
  }
  const requestBody = {
    contents: [{
      parts: [{
        text: `${contextualPrompt}

Anv\xE4ndare: ${message}

ByggPilot:`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1e3
    }
  };
  try {
    const googleResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    if (!googleResponse.ok) {
      const errorData = await googleResponse.json();
      return { statusCode: googleResponse.status, body: JSON.stringify(errorData) };
    }
    const responseData = await googleResponse.json();
    const aiResponseText = responseData.candidates[0].content.parts[0].text;
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiResponseText })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ett fel uppstod vid anrop till Google." })
    };
  }
};
//# sourceMappingURL=chatt.js.map
