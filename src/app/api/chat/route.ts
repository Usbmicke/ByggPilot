// src/app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Läs in data från request body
    const body = await request.json();
    const { prompt, demo } = body;

    // Här skulle din logik för att kalla på Gemini eller annan AI-motor ligga.
    // För nu skickar vi bara tillbaka en enkel bekräftelse.

    console.log("Mottog chattmeddelande:", prompt);
    console.log("Demo-läge:", demo);

    // Skicka tillbaka ett simpelt svar för att testa att routen fungerar
    return NextResponse.json({
      text: "Tack för ditt meddelande! Denna API-rutt fungerar nu.",
      // KORRIGERING: Använd backticks för flerradig sträng
      checklist: `[ ] Detta är en test-checklista
[ ] En annan testpunkt`
    });

  } catch (error) {
    console.error("Fel i /api/chat route:", error);
    return NextResponse.json({ error: "Internt serverfel" }, { status: 500 });
  }
}

// Du kan också lägga till andra HTTP-metoder här (GET, PUT, DELETE, etc.) om de behövs
// export async function GET(request: Request) { ... }
