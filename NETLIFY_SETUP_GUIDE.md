# Netlify Environment Setup Guide

## Steg 1: Skapa Service Account JSON

Använd denna template och fyll i din riktiga private key:

```json
{
  "type": "service_account",
  "project_id": "byggpilot-dashboard",
  "private_key_id": "DIN_PRIVATE_KEY_ID_FRÅN_BILDEN",
  "private_key": "-----BEGIN PRIVATE KEY-----\nDIN_RIKTIGA_PRIVATE_KEY_FRÅN_BILDEN_HELA_NYCKELN\n-----END PRIVATE KEY-----\n",
  "client_email": "byggpilot-service@byggpilot-dashboard.iam.gserviceaccount.com",
  "client_id": "DIN_CLIENT_ID_FRÅN_BILDEN",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/byggpilot-service%40byggpilot-dashboard.iam.gserviceaccount.com"
}
```

## Steg 2: Konvertera till Base64

Spara JSON:en som `service-account.json` och kör:

```powershell
$json = Get-Content -Path "service-account.json" -Raw
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$base64 = [System.Convert]::ToBase64String($bytes)
Write-Output $base64
```

## Steg 3: Netlify Environment Variables

Gå till: **Netlify Dashboard → Site Settings → Environment variables**

Lägg till:
- **Key:** `GOOGLE_CREDENTIALS_BASE64`
- **Value:** [Base64-strängen från steg 2]

## Steg 4: Deploy

Kör `npm run build` och deploya till Netlify.

---

## VIKTIGT: Ersätt dessa värden från din Service Account bild:
- `private_key_id`: Hela ID:t
- `private_key`: Hela private key (inklusive BEGIN/END)
- `client_id`: Client ID nummer
