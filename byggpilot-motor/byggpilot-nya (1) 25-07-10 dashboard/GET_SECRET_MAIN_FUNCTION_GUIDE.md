# 🔑 GET-SECRET FUNCTION - HUVUDFUNKTIONEN FÖR API-NYCKLAR

## ✅ DETTA ÄR DIN HUVUDFUNKTION FÖR SECRET MANAGER

### 📋 Funktionsöversikt:

**`get-secret.js`** är nu din **centrala funktion** för att hämta alla API-nycklar från Google Secret Manager:

```javascript
// Endpoints denna funktion hanterar:
/.netlify/functions/get-secret?secret=GEMINI_API_KEY
/.netlify/functions/get-secret?secret=GOOGLE_CLIENT_ID  
/.netlify/functions/get-secret?secret=GOOGLE_CLIENT_SECRET
```

### 🔧 Vad get-secret.js GÖR:

#### **1. Läser dina Google Credentials:**
```javascript
// Använder GOOGLE_CREDENTIALS environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Skapar Secret Manager klient
const secretClient = new SecretManagerServiceClient({
  credentials: credentials,
  projectId: credentials.project_id  // "digi-dan"
});
```

#### **2. Hämtar secrets säkert:**
```javascript
// Bygger secret path för ditt projekt
const name = `projects/digi-dan/secrets/GEMINI_API_KEY/versions/latest`;

// Hämtar secret från Google Cloud
const [version] = await secretClient.accessSecretVersion({ name });
const secretValue = version.payload.data.toString();
```

#### **3. Robust felhantering:**
- ✅ **404** - Secret finns inte
- ✅ **403** - Ingen åtkomst till secret  
- ✅ **503** - Credentials saknas
- ✅ **400** - Invalid secret namn
- ✅ **500** - Oväntat fel

## 🚀 DEPLOYMENT & TEST PLAN:

### **Steg 1: Deploy funktionerna**
```bash
git add .
git commit -m "Add robust get-secret function for Secret Manager"
git push origin main
```

### **Steg 2: Vänta på Netlify deployment** 
- Dashboard → Functions → Se att functions laddas
- **Vänta 3-5 minuter** för full deployment

### **Steg 3: Testa get-secret funktionen**

#### **Test A: Kör test-funktionen först**
```
https://your-site.netlify.app/.netlify/functions/test-secret
```
**Förväntat resultat:**
```json
{
  "environment": {
    "hasGoogleCredentials": true,
    "projectId": "digi-dan"  
  },
  "commonSecrets": [
    {"name": "GEMINI_API_KEY", "available": true},
    {"name": "GOOGLE_CLIENT_ID", "available": true}
  ]
}
```

#### **Test B: Testa direkt secret hämtning**
```
https://your-site.netlify.app/.netlify/functions/get-secret?secret=GEMINI_API_KEY
```
**Förväntat resultat:**
```json
{
  "success": true,
  "secretName": "GEMINI_API_KEY", 
  "value": "AIza...",
  "project": "digi-dan"
}
```

#### **Test C: Testa gemini-key (använder get-secret)**
```
https://your-site.netlify.app/.netlify/functions/gemini-key
```
**Förväntat resultat:**
```json
{
  "apiKey": "AIza...",
  "source": "secret-manager",
  "success": true
}
```

## 🐛 TROUBLESHOOTING:

### **Problem 1: Environment variable saknas**
**Symptom:** `"Credentials not configured"`
**Lösning:** 
- Netlify Dashboard → Site Settings → Environment variables
- Kontrollera att `GOOGLE_CREDENTIALS` finns och innehåller korrekt JSON

### **Problem 2: Secret finns inte**
**Symptom:** `"Secret not found"`
**Lösning:**
- Gå till Google Cloud Console → Secret Manager
- Skapa secrets: `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, etc.

### **Problem 3: Permission denied**  
**Symptom:** `"Access denied"`
**Lösning:**
- Kontrollera att din Service Account har "Secret Manager Secret Accessor" rollen

### **Problem 4: Invalid JSON credentials**
**Symptom:** `"Invalid credentials configuration"`
**Lösning:**
- Environment variable innehåller felaktig JSON
- Kopiera Service Account JSON igen till Netlify

## 🎯 SUCCESS KRITERIA:

När get-secret funktionen fungerar ska du se:

### **✅ I Function Logs:**
```
🔧 Using GOOGLE_CREDENTIALS from Netlify environment
✅ Successfully parsed Google credentials  
✅ Secret Manager client initialized for project: digi-dan
🔍 Attempting to retrieve secret: GEMINI_API_KEY
✅ Successfully retrieved secret: GEMINI_API_KEY (length: 39)
```

### **✅ I Frontend (Firebase fixed):**
- Inga `auth/invalid-api-key` fel
- Firebase authentication fungerar
- Gemini AI får korrekt API key

### **✅ I Browser Network Tab:**
- `/gemini-key` ger 200 response
- Response innehåller giltig `apiKey`
- Inga CORS fel

---

## 🚀 NÄSTA STEG EFTER GET-SECRET FUNGERAR:

1. **✅ Firebase** - Kommer fungera automatiskt
2. **🔧 Chat funktionen** - Använder Gemini API key från get-secret  
3. **🔧 Google Workspace** - Använder OAuth credentials från get-secret

**GET-SECRET ÄR GRUNDEN - FIX DENNA FÖRST! 🔑**
