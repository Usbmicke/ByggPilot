// Plats: netlify/functions/gemini.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initiera Secret Manager-klienten. 
// Denna kommer automatiskt använda Application Default Credentials (ADC)
// som du har konfigurerat i Netlify's miljövariabler.
const secretManagerClient = new SecretManagerServiceClient();
const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Hämtar API-nyckeln säkert från Google Secret Manager.
 * @returns {Promise<string>} En Promise som resolvar till API-nyckeln.
 */
async function getApiKey(): Promise<string> {
    const secretName = 'projects/926688825334/secrets/GEMINI_API_KEY/versions/latest';
    console.log(`GEMINI_FN: Försöker hämta hemlighet: ${secretName}`);
    
    try {
        const [version] = await secretManagerClient.accessSecretVersion({
            name: secretName,
        });

        const apiKey = version.payload?.data?.toString();
        if (!apiKey) {
            console.error('GEMINI_FN: FEL - Nyckeln hittades inte i Secret Manager payload.');
            throw new Error('API-nyckel saknas i payload.');
        }
        console.log('GEMINI_FN: API-nyckel hämtad framgångsrikt.');
        return apiKey;
    } catch (error) {
        console.error('GEMINI_FN: FEL vid hämtning från Secret Manager:', error);
        // Kasta ett nytt, mer informativt fel
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Kunde inte hämta API-nyckel från Secret Manager. Kontrollera att Netlify-funktionen har rätt IAM-behörigheter för 'Secret Manager Secret Accessor' på hemligheten '${secretName}'. Detaljer: ${errorMessage}`);
    }
}

export const handler = async (event: any) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', // Justera vid behov för produktion
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Svara på pre-flight OPTIONS-requests för CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Metod ej tillåten. Endast POST är accepterat.' }),
        };
    }

    try {
        const apiKey = await getApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        if (!event.body) {
             throw new Error("Request body is missing");
        }

        const { history, message } = JSON.parse(event.body);

        if (!message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Fältet "message" saknas i request body.' }),
            };
        }

        const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 8192,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ text }),
        };

    } catch (error) {
        console.error('GEMINI_FN: KRITISKT FEL i handler:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'AI-tjänsten är för närvarande inte tillgänglig.',
                details: errorMessage,
            }),
        };
    }
};
