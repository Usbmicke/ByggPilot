import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const handler: Handler = async (event) => {
  const { message } = JSON.parse(event.body || '{}');
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return { statusCode: 500, body: 'Missing API key' };

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    return { statusCode: 500, body: 'AI error: ' + (err as Error).message };
  }
};

export { handler };
