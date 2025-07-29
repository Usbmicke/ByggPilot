// src/app/api/auth/google/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google Client ID or Secret not configured');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // Denna URL måste exakt matcha en av dina "Authorized redirect URIs" i Google Cloud Console
    `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`
  );

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.readonly',
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Viktigt för att få en refresh_token
    scope: scopes,
    prompt: 'consent', // Tvinga fram medgivandeskärmen varje gång för att säkerställa refresh_token
  });

  return NextResponse.redirect(authorizationUrl);
}
