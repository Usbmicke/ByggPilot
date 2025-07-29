// src/app/api/auth/google/callback/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import admin from '@/lib/firebaseAdmin'; // Använd alias

const firestore = admin.firestore();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXT_PUBLIC_URL) {
    console.error("Missing Google OAuth environment variables");
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.id || !userInfo.email) {
      throw new Error('Failed to retrieve user information from Google.');
    }

    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(userInfo.email);
      await admin.auth().updateUser(userRecord.uid, {
        displayName: userInfo.name,
        photoURL: userInfo.picture,
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await admin.auth().createUser({
          email: userInfo.email,
          emailVerified: !!userInfo.verified_email, // Fix: Garantera boolean
          displayName: userInfo.name,
          photoURL: userInfo.picture,
        });
      } else {
        throw error;
      }
    }

    if (tokens.refresh_token) {
      const userDocRef = firestore.collection('users').doc(userRecord.uid);
      await userDocRef.set({
        refreshToken: tokens.refresh_token,
        googleId: userInfo.id,
      }, { merge: true });
    }

    // Skapa en anpassad token för att logga in användaren på klienten
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    // Omdirigera till en specifik callback-sida på klienten som kan hantera inloggningen
    const redirectUrl = new URL('/auth/callback', process.env.NEXT_PUBLIC_URL);
    redirectUrl.searchParams.set('token', customToken);
    
    return NextResponse.redirect(redirectUrl);

  } catch (error: any) {
    console.error('Callback error:', error);
    const errorRedirect = new URL('/', process.env.NEXT_PUBLIC_URL);
    errorRedirect.searchParams.set('error', 'auth_failed');
    return NextResponse.redirect(errorRedirect);
  }
}
