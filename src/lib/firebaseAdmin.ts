import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Prioritera servicekontot från .env.local om det finns (för lokal utveckling/Codespaces)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
      });
      console.log('Firebase Admin SDK initialized using environment variable.');
    } else {
      // Annars, använd Application Default Credentials (för produktion i Google Cloud/Vercel)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
      });
      console.log('Firebase Admin SDK initialized using Application Default Credentials.');
    }
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
  }
}

export default admin;
