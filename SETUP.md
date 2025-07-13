# ByggPilot - Miljövariabler Setup Guide

## Netlify Environment Variables

Följ dessa steg för att säkert konfigurera dina API-nycklar i Netlify:

### 1. Firebase Configuration

I Netlify Dashboard, gå till Site settings > Build & deploy > Environment variables och lägg till:

```
VITE_FIREBASE_API_KEY=din_firebase_api_key_här
VITE_FIREBASE_AUTH_DOMAIN=ditt_projekt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ditt_firebase_projekt_id
VITE_FIREBASE_STORAGE_BUCKET=ditt_projekt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=ditt_sender_id
VITE_FIREBASE_APP_ID=din_app_id
```

### 2. Google API Keys

```
GOOGLE_API_KEY=din_google_gemini_api_nyckel
OPENAI_API_KEY=din_openai_api_nyckel (valfritt, för alternativ AI)
```

### 3. Firestore Security Rules

Klistra in dessa regler i Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tillåt ENDAST en inloggad användare att läsa/skriva sin egen data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Lokala Utvecklingsmiljön

Skapa en `.env` fil i projektets root med samma variabler:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
GOOGLE_API_KEY=
```

## Installation och körning

1. Installera dependencies:
```bash
npm install
```

2. Starta utvecklingsservern:
```bash
npm run dev
```

3. Bygg för produktion:
```bash
npm run build
```

## Implementerade Funktioner

### ✅ Fas 1: Stabilisera och Säkra Grunden
- [x] Miljövariabler för Firebase konfiguration
- [x] Firestore säkerhetsregler implementerade
- [x] Korrekt hantering av API-nycklar

### ✅ Fas 2: Datapersistens
- [x] Realtid projekt-laddning från Firestore
- [x] Realtid uppgifts-laddning från Firestore
- [x] Realtid chat-meddelanden från Firestore
- [x] Funktioner för att skapa projekt
- [x] Funktioner för att uppdatera uppgifter
- [x] Automatisk sparning av chat-meddelanden

### ✅ Fas 3: Onboarding och UX
- [x] Interaktiv onboarding modal
- [x] Första projekt-skapande guided
- [x] Google-knapp med korrekt styling
- [x] Onboarding checklista

### 🚧 Fas 4: AI & Automation (Påbörjad)
- [x] AI-chat backend funktion (Google Gemini)
- [x] Google Workspace integration struktur
- [ ] Fullständig Google API authentication
- [ ] Automatisk Google Sheets uppdatering
- [ ] Google Drive fil-synkronisering

## Nästa Steg

1. **Konfigurera miljövariabler** enligt instruktionerna ovan
2. **Testa onboarding-flödet** med en ny användare
3. **Implementera fullständig Google OAuth** för Workspace-integration
4. **Testa AI-chatten** när API-nycklar är konfigurerade

## Säkerhetsnoteringar

- ✅ API-nycklar exponeras inte i koden
- ✅ Firestore-regler skyddar användardata
- ✅ Miljövariabler används korrekt
- ✅ CORS-headers konfigurerade för Netlify Functions

## Troubleshooting

### Om Firebase anslutning misslyckas:
1. Kontrollera att alla miljövariabler är korrekt uppsatta
2. Verifiera att Firestore-reglerna är publicerade
3. Kolla browser console för felmeddelanden

### Om AI-chatten inte fungerar:
1. Kontrollera att GOOGLE_API_KEY är uppsatt i Netlify
2. Verifiera att Gemini API är aktiverat i Google Cloud Console
3. Se Netlify Functions logs för detaljerade felmeddelanden
