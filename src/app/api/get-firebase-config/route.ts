// src/app/api/get-firebase-config/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Här hämtar vi konfigurationen från miljövariabler på servern.
    // Detta är säkert eftersom denna kod aldrig körs i klientens webbläsare.
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Validera att alla nödvändiga variabler finns
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error('Firebase environment variables are not set correctly.');
    }

    return NextResponse.json(firebaseConfig);
  } catch (error) {
    console.error('Error fetching Firebase config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
