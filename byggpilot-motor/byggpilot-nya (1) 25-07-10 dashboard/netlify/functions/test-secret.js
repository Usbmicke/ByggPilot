/**
 * Netlify Function: Test get-secret funktionalitet
 * Denna funktion testar att Secret Manager fungerar korrekt
 */
export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Only GET requests allowed' })
    };
  }

  try {
    console.log('🧪 Testing get-secret functionality');
    
    // Test 1: Kontrollera att GOOGLE_CREDENTIALS finns
    const hasCredentials = !!process.env.GOOGLE_CREDENTIALS;
    console.log(`Environment check - GOOGLE_CREDENTIALS exists: ${hasCredentials}`);
    
    let credentialsParsed = false;
    let projectId = null;
    
    if (hasCredentials) {
      try {
        const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
        credentialsParsed = true;
        projectId = creds.project_id;
        console.log(`✅ Credentials parsed successfully, project: ${projectId}`);
      } catch (e) {
        console.error('❌ Failed to parse GOOGLE_CREDENTIALS');
      }
    }
    
    // Test 2: Försök hämta en test secret (GEMINI_API_KEY)
    let secretTestResult = null;
    try {
      const { handler: getSecretHandler } = await import('./get-secret.js');
      const testEvent = {
        httpMethod: 'GET',
        queryStringParameters: { secret: 'GEMINI_API_KEY' }
      };
      
      const result = await getSecretHandler(testEvent, context);
      secretTestResult = {
        statusCode: result.statusCode,
        success: result.statusCode === 200,
        hasValue: result.statusCode === 200 && JSON.parse(result.body).value?.length > 0
      };
      
      console.log(`Secret test result: ${JSON.stringify(secretTestResult)}`);
    } catch (error) {
      console.error('Secret test failed:', error.message);
      secretTestResult = { error: error.message };
    }
    
    // Test 3: Lista vanliga secrets som borde finnas
    const commonSecrets = ['GEMINI_API_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
    const secretTests = [];
    
    for (const secretName of commonSecrets) {
      try {
        const { handler: getSecretHandler } = await import('./get-secret.js');
        const testEvent = {
          httpMethod: 'GET',
          queryStringParameters: { secret: secretName }
        };
        
        const result = await getSecretHandler(testEvent, context);
        secretTests.push({
          name: secretName,
          statusCode: result.statusCode,
          available: result.statusCode === 200,
          hasValue: result.statusCode === 200 ? JSON.parse(result.body).value?.length > 0 : false
        });
      } catch (error) {
        secretTests.push({
          name: secretName,
          available: false,
          error: error.message
        });
      }
    }
    
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleCredentials: hasCredentials,
        credentialsParsedSuccessfully: credentialsParsed,
        projectId: projectId
      },
      secretManagerTest: secretTestResult,
      commonSecrets: secretTests,
      summary: {
        totalSecretsChecked: commonSecrets.length,
        availableSecrets: secretTests.filter(s => s.available).length,
        unavailableSecrets: secretTests.filter(s => !s.available).length
      }
    };
    
    console.log('🧪 Test complete:', JSON.stringify(testResults, null, 2));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(testResults, null, 2)
    };
    
  } catch (error) {
    console.error('❌ Test function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Test function failed',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}
