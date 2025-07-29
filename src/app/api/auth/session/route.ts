// src/app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { cookies } from 'next/headers';

// --- Firebase Admin Init ---
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json({ error: 'ID token not found.' }, { status: 400 });
    }

    // Skapa session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dagar i millisekunder
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Sätt cookien i headern
    cookies().set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn,
      path: '/',
    });

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Session login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create session', details: errorMessage }, { status: 401 });
  }
}
