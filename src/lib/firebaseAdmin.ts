import admin from 'firebase-admin';

// Denna kod körs bara en gång när modulen först importeras av servern.
if (!admin.apps.length) {
  try {
    // Vi förlitar oss nu på GOOGLE_APPLICATION_CREDENTIALS som pekar på serviceAccountKey.json
    // Detta är den rekommenderade metoden för server-miljöer.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error.stack);
    // Kasta felet vidare för att förhindra att appen körs med en trasig konfiguration.
    throw new Error('Could not initialize Firebase Admin SDK. Check server logs.');
  }
}

export default admin;
