# ByggPilot - Din digitala kollega i byggbranschen

ByggPilot är en intelligent AI-assistent som fungerar som ett smart lager ovanpå din befintliga Google Workspace (Gmail, Drive, Kalender). Målet är att eliminera administrativt arbete för småföretagare i byggbranschen.

## 🚀 Funktioner

- **AI-chatt med ByggPilot-personlighet** - Expert på svensk byggbransch
- **Google Workspace-integration** - Automatisk projekthantering
- **Firebase-autentisering** - Säker inloggning med Google
- **Responsiv design** - Fungerar på både dator och mobil
- **Netlify-deployment** - Enkel hosting och serverless functions

## 🛠️ Setup

### 1. Miljövariabler

Skapa en `.env`-fil i projektets rot med följande variabler:

```env
# Google API Keys
GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Google OAuth (for backend server)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Gmail Integration (for backend)
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token_here
MIN_EMAIL_ADRESS=your_email@example.com
```

### 2. Installation

```bash
npm install
```

### 3. Utveckling

```bash
npm run dev
```

### 4. Build för produktion

```bash
npm run build
```

## 🔧 Konfiguration

### Firebase Setup

1. Skapa ett Firebase-projekt på [Firebase Console](https://console.firebase.google.com/)
2. Aktivera Google Authentication
3. Kopiera konfigurationsvärdena till `.env`-filen

### Google API Setup

1. Skapa ett Google Cloud-projekt
2. Aktivera Gemini API
3. Skapa API-nycklar
4. Konfigurera OAuth 2.0 för Google Workspace-integration

### Netlify Deployment

1. Koppla ditt GitHub-repo till Netlify
2. Sätt miljövariablerna i Netlify Dashboard
3. Deploy automatiskt vid push till main

## 📁 Projektstruktur

```
byggpilot-nya/
├── index.tsx                 # Huvudapp-komponent
├── firebase-config.js        # Firebase-konfiguration
├── netlify/
│   └── functions/
│       └── chatt.js         # AI-chatt serverless function
├── byggpilot-motor/         # Backend server (optional)
└── package.json
```

## 🤖 ByggPilot AI-personlighet

ByggPilot är konfigurerad med en specifik AI-personlighet som är expert på:

- Svensk bygg- och installationsbransch
- Plan- och bygglagen (PBL) & Boverkets byggregler (BBR)
- Arbetsmiljölagen (AML) och AFS-föreskrifter
- Standardavtal (AB 04, ABT 06, etc.)
- KMA-planer och riskanalys
- Kalkylering och projektledning

## 🔐 Säkerhet

- Alla API-nycklar lagras i miljövariabler
- Firebase hanterar autentisering säkert
- Netlify Functions körs i isolerad miljö
- Google OAuth med specifika scopes för Workspace-integration

## 🌐 Deployment

Appen är konfigurerad för deployment på Netlify med:
- Automatisk build från GitHub
- Serverless functions för AI-chatt
- Miljövariabler för säker konfiguration
- Custom domain support (loopia.se)

## 📞 Support

För support eller frågor, kontakta utvecklingsteamet.
