const functions = require('@google-cloud/functions-framework');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Instantiate clients once to leverage connection pooling.
const secretClient = new SecretManagerServiceClient();
let genAI;
let model;

// Cache for secrets to avoid fetching them on every invocation.
const secretCache = {};

/**
 * Fetches a secret from Google Cloud Secret Manager with caching.
 * @param {string} secretName The name of the secret to fetch.
 * @returns {Promise<string|null>} The secret value or null if an error occurs.
 */
async function getSecret(secretName) {
  if (secretCache[secretName]) {
    return secretCache[secretName];
  }

  try {
    const projectId = await secretClient.getProjectId();
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await secretClient.accessSecretVersion({ name });
    const secretValue = version.payload.data.toString('utf8');
    secretCache[secretName] = secretValue;
    return secretValue;
  } catch (error) {
    console.error(`❌ Failed to fetch secret: ${secretName}`, error);
    // In a real-world scenario, you might want to throw the error
    // to cause a cold start on the next invocation to retry initialization.
    return null;
  }
}

/**
 * Initializes the Generative AI model.
 * Fetches the API key from Secret Manager and configures the AI client.
 */
async function initializeAiModel() {
  if (model) return; // Already initialized

  const geminiApiKey = await getSecret('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('CRITICAL: GEMINI_API_KEY not found in Secret Manager or permissions are missing.');
  }
  genAI = new GoogleGenerativeAI(geminiApiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// Register an HTTP function
functions.http('gemini', async (req, res) => {
  // Set CORS headers for preflight and actual requests
  res.set('Access-Control-Allow-Origin', '*'); // Be more specific in production!
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Send response to preflight OPTIONS requests
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ensure the AI model is initialized.
    await initializeAiModel();

    const { systemPrompt, messages, newMessage } = req.body;

    if (!newMessage) {
      return res.status(400).json({ error: 'Bad Request: newMessage is required.' });
    }

    const history = [];
    if (systemPrompt) {
      history.push({ role: 'user', parts: [{ text: systemPrompt }] });
      history.push({ role: 'model', parts: [{ text: 'Jag förstår. Jag är ByggPilot, din digitala kollega i byggbranschen. Jag kommer att agera som en expert projektledare och intelligent assistent som hjälper dig med administrativa uppgifter, regelverket och praktiska byggfrågor. Hur kan jag hjälpa dig idag?' }] });
    }
    if (messages && Array.isArray(messages) && messages.length > 0) {
      history.push(...messages);
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    const aiResponse = response.text();
    
    res.status(200).json({ success: true, response: aiResponse });
  } catch (error) {
    console.error('❌ Unhandled exception in gemini function:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});