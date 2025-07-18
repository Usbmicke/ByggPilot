# ByggPilot v2.0 - Den Intelligenta Byggpartnern

ByggPilot är en intelligent webbapplikation som automatiserar administrativa processer för småföretag inom bygg- och hantverksbranschen. Med djup integration till Google Workspace (Drive, Gmail, Kalender) och AI-driven automation, fungerar ByggPilot som din digitala projektledare.

## 🚀 Funktioner

### ✅ Google OAuth 2.0 Integration (Implementerat)
- **Säker autentisering** via Authorization Code Flow
- **Automatisk tokenhantering** med refresh tokens
- **Minimal scope-strategi** för bästa säkerhet och användartillit

### ✅ Google Drive Integration (Implementerat)
- **Automatisk projektmappskapande** för varje nytt projekt
- **Filuppladdning och -hantering** direkt från applikationen
- **Inbyggd filhanterare** med förhandsgranskning
- **Säker fildelning** med kunder och leverantörer

### ✅ Gmail Integration (Implementerat)
- **Skicka e-post** på användarens vägnar med bilagor
- **Automatisk översikt** av inkommande svar och förfrågningar
- **RFC 2822-kompatibel** e-posthantering
- **Smart filtrering** av projektrelaterad korrespondens

### ✅ Modern UI/UX Design (Implementerat)
- **60-30-10 färgregel** för professionell visuell hierarki
- **WCAG AA-kompatibel** kontrastförhållanden
- **Responsiv design** för alla enheter
- **Smooth animationer** och mikrointeraktioner

### 🔄 Dashboard & Projekthantering
- **Integrerad chattfunktion** med ByggPilot AI
- **Realtidsöversikt** av projekt, uppgifter och händelser
- **Intelligent tidloggning** med projektautomation
- **Demo-läge** för utforskning utan inloggning

## 🛠️ Installation och Konfiguration

### Förutsättningar
- Node.js 18+ och npm
- Google Cloud Console-konto
- Google Workspace eller Gmail-konto

### 1. Klona och Installera
```bash
git clone <repository-url>
cd byggpilot-nya
npm install
```

### 2. Google Cloud Console Konfiguration

#### A. Skapa OAuth 2.0 Credentials
1. Gå till [Google Cloud Console](https://console.cloud.google.com/)
2. Skapa ett nytt projekt eller välj befintligt
3. Aktivera följande APIs:
   - Google Drive API
   - Gmail API
   - Google OAuth2 API
4. Gå till "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Välj "Web application"
6. Lägg till följande Authorized redirect URIs:
   - `http://localhost:3001/auth/callback` (utveckling)
   - `https://yourdomain.com/auth/callback` (produktion)

#### B. Konfigurera Consent Screen
1. Gå till "OAuth consent screen"
2. Välj "External" för publik app eller "Internal" för Workspace
3. Fyll i applikationsinformation:
   - **App name**: ByggPilot
   - **User support email**: Din e-post
   - **Developer contact**: Din e-post
4. Lägg till följande scopes:
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.metadata`

### 3. Miljökonfiguration
1. Kopiera `.env.example` till `.env`
2. Fyll i dina Google OAuth credentials:

```env
# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=3001

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Starta Applikationen

#### Utvecklingsläge
```bash
# Terminal 1: Starta backend
node server.js

# Terminal 2: Starta frontend
npm run dev
```

#### Produktionsbygge
```bash
npm run build
node server.js
```

## 🔒 Säkerhet och Compliance

### OAuth 2.0 Implementation
- **Authorization Code Flow** med PKCE för maximal säkerhet
- **Refresh tokens** lagras krypterat server-side
- **Access tokens** har begränsad livslängd (60 min)
- **Automatisk token-förnyelse** utan användarinteraktion

### Scope Minimering
Enligt specifikationen begär vi endast minimal nödvändig behörighet:
- **drive.file**: Endast filer skapade/öppnade av appen
- **gmail.send**: Endast för sändning, inte läsning
- **gmail.metadata**: Endast för att kontrollera svar, inte läsa innehåll

### Google App Verification
För känsliga scopes krävs Googles appverifiering:
1. **Utvecklingsfas**: Tillåter upp till 100 testanvändare
2. **Verifieringsfas**: Krävs för publik lansering
3. **Säkerhetsrevision**: För känsliga/begränsade scopes

## 📋 API Endpoints

### Autentisering
- `GET /auth/google` - Initiera OAuth-flöde
- `GET /auth/callback` - Hantera Google callback
- `GET /api/user` - Hämta användarinfo
- `POST /api/logout` - Logga ut användare

### Google Drive
- `POST /api/drive/create-folder` - Skapa projektmapp
- `POST /api/drive/upload-file` - Ladda upp fil till projekt
- `GET /api/drive/list-files/:folderId` - Lista projektfiler

### Gmail
- `POST /api/gmail/send` - Skicka e-post med bilagor
- `GET /api/gmail/messages` - Lista meddelanden med filter

## 🎨 UI/UX Design System

### Färgschema (60-30-10 Regel)
- **60% Dominant**: Mörka bakgrunder (#0F0F0F, #1A1A1A)
- **30% Sekundär**: Grå moduler och kort (#2A2A2A, #333333)
- **10% Accent**: Cyan CTA (#00D4FF) och grön bekräftelse (#00FF87)

### Komponentbibliotek
- **Knappar**: Primär (cyan), Sekundär (grön), Standard (grå)
- **Formulär**: Fokusglöd med primärfärg
- **Modaler**: Konsekvent layout med header/body/footer
- **Filvisning**: Ikonbaserad med hover-effekter

## 🚦 Utvecklingsstatus

### ✅ Färdigt
- OAuth 2.0 Authorization Code Flow
- Google Drive projektmappar och filhantering
- Gmail e-postsändning med bilagor
- Modern UI med 60-30-10 färgschema
- Responsiv design och tillgänglighet

### 🔄 Pågående
- AI-integration för automatiska arbetsflöden
- Avancerad projekthantering
- Kalenderintegration
- Offline-stöd

### 📋 Kommande
- Fortnox-integration för fakturering
- Mobilapp (React Native)
- Teamsamarbetsverktyg
- Avancerad rapportering

## 🤝 Bidrag

För att bidra till projektet:
1. Forka repository
2. Skapa feature-branch (`git checkout -b feature/amazing-feature`)
3. Commita ändringar (`git commit -m 'Add amazing feature'`)
4. Pusha till branch (`git push origin feature/amazing-feature`)
5. Öppna Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 🆘 Support

För support och frågor:
- 📧 E-post: support@byggpilot.se
- 📖 Dokumentation: [docs.byggpilot.se](https://docs.byggpilot.se)
- 🐛 Rapportera buggar: Öppna issue på GitHub

---

**ByggPilot v2.0** - Byggare kan bygga™
