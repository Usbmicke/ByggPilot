# Google Cloud Console Secret Manager Setup

## 🔐 Secrets som behöver konfigureras

### 1. GEMINI_API_KEY
```bash
# Skapa secret för Gemini API
gcloud secrets create GEMINI_API_KEY --data-file=-
# Klistra in din Gemini API-nyckel och tryck Ctrl+D
```

### 2. GOOGLE_CLIENT_ID
```bash
# OAuth 2.0 Client ID från Google Cloud Console
gcloud secrets create GOOGLE_CLIENT_ID --data-file=-
# Klistra in ditt Client ID
```

### 3. GOOGLE_CLIENT_SECRET
```bash
# OAuth 2.0 Client Secret
gcloud secrets create GOOGLE_CLIENT_SECRET --data-file=-
# Klistra in ditt Client Secret
```

### 4. GOOGLE_REDIRECT_URI
```bash
# Redirect URI för OAuth callback
gcloud secrets create GOOGLE_REDIRECT_URI --data-file=-
# För utveckling: http://localhost:3001/auth/callback
# För produktion: https://yourdomain.com/auth/callback
```

## 🚀 Snabb Setup via Console

### Alternativ 1: Google Cloud Console Web UI
1. Gå till [Secret Manager](https://console.cloud.google.com/security/secret-manager)
2. Klicka "CREATE SECRET" för varje secret:
   - **Name**: `GEMINI_API_KEY`, **Value**: Din Gemini API-nyckel
   - **Name**: `GOOGLE_CLIENT_ID`, **Value**: Ditt OAuth Client ID
   - **Name**: `GOOGLE_CLIENT_SECRET`, **Value**: Ditt OAuth Client Secret
   - **Name**: `GOOGLE_REDIRECT_URI`, **Value**: `http://localhost:3001/auth/callback`

### Alternativ 2: Terraform (Rekommenderat för produktion)
```hcl
resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "GEMINI_API_KEY"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "gemini_api_key_version" {
  secret      = google_secret_manager_secret.gemini_api_key.id
  secret_data = var.gemini_api_key
}

# Repetera för andra secrets...
```

## 🔑 Service Account Permissions

Se till att din applikation har rätt behörigheter:

```bash
# Lägg till Secret Manager Accessor-rollen
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:your-service-account@your-project.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 🔧 Miljövariabler för applikationen

```bash
# Sätt projekt-ID för Secret Manager
export GOOGLE_CLOUD_PROJECT_ID=your-project-id

# För lokal utveckling med service account
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

## ✅ Testa konfigurationen

```bash
# Testa att hämta en secret
gcloud secrets versions access latest --secret="GEMINI_API_KEY"
```

## 🚨 Säkerhetsrekommendationer

1. **Aldrig commit secrets** till version control
2. **Använd olika projekt** för utveckling/test/produktion
3. **Rotera API-nycklar** regelbundet
4. **Monitora secret access** via Cloud Audit Logs
5. **Använd IAM** för minimal behörighet

## 🔄 För lokal utveckling

Om Secret Manager inte är tillgängligt lokalt, skapar applikationen fallback till miljövariabler:

```bash
# .env för lokal utveckling (endast som backup)
GEMINI_API_KEY=your_local_gemini_key
GOOGLE_CLIENT_ID=your_local_client_id
GOOGLE_CLIENT_SECRET=your_local_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/callback
NODE_ENV=development
```
