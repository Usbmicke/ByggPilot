import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const handler: Handler = async (event) => {
  const { message } = JSON.parse(event.body || '{}');
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return { statusCode: 500, body: 'Missing API key' };

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: { systemInstruction: 'ByggPilot v2.0 - Den Intelligenta Byggpartnern' }
    });
    const response = await chat.sendMessage({ message });
    return {
      statusCode: 200,
      body: JSON.stringify({ text: response.text }),
    };
  } catch (err) {
    return { statusCode: 500, body: 'AI error: ' + (err as Error).message };
  }
};

export { handler };
