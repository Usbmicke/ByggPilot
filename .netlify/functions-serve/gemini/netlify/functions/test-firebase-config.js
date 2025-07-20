/**
 * Netlify Function: Test Firebase Configuration
 * Denna funktion verifierar att alla Firebase secrets finns och är korrekta
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
    console.log('🧪 Testing Firebase configuration from get-firebase-config function');
    
    // Test: Anropa get-firebase-config funktionen
    const { handler: getFirebaseConfigHandler } = await import('./get-firebase-config.js');
    const testEvent = {
      httpMethod: 'GET',
      queryStringParameters: {}
    };
    
    const configResponse = await getFirebaseConfigHandler(testEvent, context);
    
    let testResults = {
      timestamp: new Date().toISOString(),
      configRetrievalTest: {
        statusCode: configResponse.statusCode,
        success: configResponse.statusCode === 200
      },
      firebaseConfigValidation: {},
      summary: {}
    };

    if (configResponse.statusCode === 200) {
      try {
        const firebaseConfig = JSON.parse(configResponse.body);
        
        // Validera Firebase configuration struktur
        const requiredFields = [
          'apiKey',
          'authDomain', 
          'projectId',
          'storageBucket',
          'messagingSenderId',
          'appId'
        ];
        
        let validationResults = {};
        let validFields = 0;
        let totalFields = requiredFields.length;
        
        for (const field of requiredFields) {
          const value = firebaseConfig[field];
          const isValid = value && typeof value === 'string' && value.trim().length > 0;
          
          validationResults[field] = {
            present: !!value,
            valid: isValid,
            length: value ? value.length : 0,
            preview: value ? `${value.substring(0, 10)}...` : 'MISSING'
          };
          
          if (isValid) validFields++;
        }
        
        testResults.firebaseConfigValidation = {
          configStructure: validationResults,
          summary: {
            totalFields,
            validFields,
            invalidFields: totalFields - validFields,
            allFieldsValid: validFields === totalFields
          }
        };
        
        // Test specifika Firebase format requirements
        const formatTests = {
          apiKeyFormat: /^AIza[0-9A-Za-z_-]{35}$/.test(firebaseConfig.apiKey || ''),
          authDomainFormat: /^[a-z0-9-]+\.firebaseapp\.com$/.test(firebaseConfig.authDomain || ''),
          projectIdFormat: /^[a-z0-9-]+$/.test(firebaseConfig.projectId || ''),
          storageBucketFormat: /^[a-z0-9.-]+\.appspot\.com$/.test(firebaseConfig.storageBucket || ''),
          messagingSenderIdFormat: /^[0-9]+$/.test(firebaseConfig.messagingSenderId || ''),
          appIdFormat: /^1:[0-9]+:web:[a-f0-9]+$/.test(firebaseConfig.appId || '')
        };
        
        const validFormats = Object.values(formatTests).filter(Boolean).length;
        const totalFormats = Object.keys(formatTests).length;
        
        testResults.firebaseConfigValidation.formatValidation = {
          tests: formatTests,
          summary: {
            validFormats,
            totalFormats,
            allFormatsValid: validFormats === totalFormats
          }
        };
        
        // Overall summary
        testResults.summary = {
          overallSuccess: testResults.configRetrievalTest.success && 
                         testResults.firebaseConfigValidation.summary.allFieldsValid &&
                         testResults.firebaseConfigValidation.formatValidation.summary.allFormatsValid,
          configRetrievalWorking: testResults.configRetrievalTest.success,
          allSecretsPresent: testResults.firebaseConfigValidation.summary.allFieldsValid,
          allFormatsValid: testResults.firebaseConfigValidation.formatValidation.summary.allFormatsValid,
          readyForFirebaseInit: testResults.configRetrievalTest.success && 
                               testResults.firebaseConfigValidation.summary.allFieldsValid
        };
        
      } catch (parseError) {
        testResults.firebaseConfigValidation = {
          error: 'Failed to parse Firebase config response',
          details: parseError.message
        };
      }
    } else {
      testResults.firebaseConfigValidation = {
        error: 'Could not retrieve Firebase config',
        statusCode: configResponse.statusCode,
        response: JSON.parse(configResponse.body)
      };
    }
    
    console.log('🧪 Firebase config test complete:', JSON.stringify(testResults, null, 2));
    
    // Return appropriate status code based on results
    const overallSuccess = testResults.summary?.overallSuccess ?? false;
    
    return {
      statusCode: overallSuccess ? 200 : 500,
      headers,
      body: JSON.stringify(testResults, null, 2)
    };
    
  } catch (error) {
    console.error('❌ Firebase config test failed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Firebase config test function failed',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}
