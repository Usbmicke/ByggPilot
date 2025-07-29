// src/app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin'; // Använd alias

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return new Response('ID token is required', { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 dagar

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set(options);

    return response;
  } catch (error) {
    console.error('Session login error:', error);
    return new Response('Failed to create session', { status: 401 });
  }
}
