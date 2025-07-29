// src/app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const options = {
    name: 'session',
    value: '',
    maxAge: -1,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  const response = NextResponse.json({ status: 'success' });
  response.cookies.set(options);

  return response;
}
