// Plats: netlify/functions/gemini.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const getSecret = async (secretName: string) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS!);
    const projectId = credentials.project_id;
    
    const secretClient = new SecretManagerServiceClient({ credentials });
    
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await secretClient.accessSecretVersion({ name });
    
    return version.payload!.data!.toString();
  } catch (error) {
    console.error(`❌ Failed to fetch secret: ${secretName}`, error);
    return null;
  }
};

export const handler = async (_event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const geminiApiKey = await getSecret('GEMINI_API_KEY');

    if (!geminiApiKey) {
      console.error("CRITICAL: GEMINI_API_KEY not found in Secret Manager or permissions are missing.");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error: Missing API key' }),
      };
    }
    
    // Här lägger du din logik för att prata med Gemini API:et.
    // Just nu returnerar vi bara ett success-meddelande.
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "Gemini API key retrieved successfully." }),
    };

  } catch (error) {
    console.error('❌ Unhandled exception in gemini function:', error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: 'Internal Server Error' }) 
    };
  }
};
