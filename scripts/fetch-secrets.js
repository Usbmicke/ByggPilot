#!/usr/bin/env node
// scripts/fetch-secrets.js

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const path = require('path');

async function fetchSecretAndWriteFile() {
  // 1. Läs inloggningsuppgifterna från Netlifys miljövariabel
  const gcpCredentials = process.env.GOOGLE_CREDENTIALS;
  if (!gcpCredentials) {
    console.log('GOOGLE_CREDENTIALS not set. Skipping secret fetch.');
    return;
  }

  // 2. Skapa en temporär fil för att autentisera Secret Manager-klienten
  const tempCredentialsPath = path.join(__dirname, 'temp-gcp-creds.json');
  fs.writeFileSync(tempCredentialsPath, gcpCredentials);

  // 3. Initiera Secret Manager-klienten med dessa temporära uppgifter
  const secretManagerClient = new SecretManagerServiceClient({
    keyFilename: tempCredentialsPath,
  });

  // 4. Hämta den riktiga servicekontonyckeln från Secret Manager
  const secretName = 'projects/digi-dan/secrets/FIREBASE_SERVICE_ACCOUNT_KEY_JSON/versions/latest';
  
  try {
    console.log(`Fetching secret: ${secretName}`);
    const [version] = await secretManagerClient.accessSecretVersion({
      name: secretName,
    });

    const payload = version.payload.data.toString('utf8');
    
    // 5. Skriv den hämtade hemligheten till serviceAccountKey.json
    const outputPath = path.join(process.cwd(), 'serviceAccountKey.json');
    fs.writeFileSync(outputPath, payload);
    console.log(`Successfully wrote secret to ${outputPath}`);

  } catch (error) {
    console.error('Failed to fetch secret from Google Secret Manager:', error);
    process.exit(1); // Avsluta med felkod för att stoppa bygget
  } finally {
    // 6. Städa upp den temporära filen
    fs.unlinkSync(tempCredentialsPath);
  }
}

fetchSecretAndWriteFile();
