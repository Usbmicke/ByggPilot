# ByggPilot - Snabb Startguide

ByggPilot körs nu på:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 🚀 Kom igång direkt

### 1. Testa Demo-läget
- Gå till http://localhost:5173
- Klicka på "Aktivera Demo-läge" 
- Utforska alla funktioner utan inloggning

### 2. Konfigurera AI-chat (Valfritt)
För att aktivera AI-chatten behöver du en Google Gemini API-nyckel:

1. Gå till [Google AI Studio](https://aistudio.google.com/)
2. Skapa en gratis API-nyckel
3. Öppna `.env`-filen
4. Ersätt `your_gemini_api_key_here` med din riktiga API-nyckel
5. Starta om servern (`npm run dev:full`)

### 3. Konfigurera Google Integration (För produktion)
För full Google Drive/Gmail-integration:

1. Gå till [Google Cloud Console](https://console.cloud.google.com/)
2. Skapa ett nytt projekt
3. Aktivera APIs:
   - Google Drive API
   - Gmail API  
   - Google OAuth2 API
4. Skapa OAuth 2.0 Credentials
5. Uppdatera `.env` med dina credentials

## 🛠️ Kommandon

```bash
# Starta både backend och frontend
npm run dev:full

# Eller separat:
npm run server  # Backend endast
npm run dev     # Frontend endast

# Bygg för produktion
npm run build
npm start
```

## 🎯 Funktioner att testa

### ✅ Fungerar direkt:
- Dashboard med projekt, uppgifter och händelser
- Integrerad AI-chat (med API-nyckel)
- Projekt-/uppgiftshantering
- Tidloggning
- Responsiv design
- Demo-läge

### 🔧 Kräver Google-konfiguration:
- Google OAuth inloggning
- Automatisk Google Drive projektmappar
- Gmail-integration för e-post
- Filhantering i molnet

## 💡 Tips

1. **Demo-läget** - Perfekt för att testa alla funktioner
2. **AI-chatten** - Prova kommandon som "skapa nytt projekt" eller "visa hjälp"
3. **Responsiv design** - Testa på mobil och desktop
4. **Mörkt tema** - Optimerat för långa arbetssessioner

Applikationen är byggd enligt modern säkerhetspraxis och följer Google's OAuth 2.0 best practices!
