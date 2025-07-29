// src/app/api/auth/google/callback/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// --- Firebase Admin Init ---
// Säkerställ att denna konfiguration finns i dina miljövariabler
try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON as string
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found.' }, { status: 400 });
  }

  try {
    // 1. Initiera OAuth2Client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // 2. Byt ut koden mot tokens
    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token, scope } = tokens;

    console.log('Successfully exchanged code for tokens.');
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token); // Kan vara undefined om användaren redan gett samtycke
    console.log('Scopes:', scope);

    if (!refresh_token) {
        // Detta händer om användaren redan har godkänt appen tidigare.
        // I en produktionsapp skulle du här kunna meddela användaren att anslutningen redan finns.
        console.warn('No refresh token received. User might have already authorized the app.');
        // Omdirigera ändå, eftersom vi troligtvis har en giltig anslutning.
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 3. Verifiera Firebase-sessionen och hämta användar-ID
    const sessionCookie = cookies().get('__session')?.value || '';
    if (!sessionCookie) {
        return NextResponse.json({ error: 'User session not found. Please log in.' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    // 4. Spara refresh_token i Firestore
    const userDocRef = admin.firestore().collection('users').doc(userId);
    
    await userDocRef.set({
        googleRefreshToken: refresh_token,
        googleScopes: scope,
        googleIntegrationActive: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`Successfully saved refresh token for user: ${userId}`);

    // 5. Omdirigera till dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));

  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Omdirigera till en felsida eller dashboard med ett felmeddelande
    const errorUrl = new URL('/dashboard', req.url);
    errorUrl.searchParams.set('error', 'google_auth_failed');
    errorUrl.searchParams.set('error_details', errorMessage);
    return NextResponse.redirect(errorUrl);
  }
}
