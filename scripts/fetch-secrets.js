#!/usr/bin/env node
// scripts/fetch-secrets.js

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const path = require('path');

// Lista över hemligheter att hämta från Google Secret Manager
// Notera: Dessa är namnen som de har i Secret Manager
const secretsToFetch = [
  'FIREBASE_SERVICE_ACCOUNT_KEY_JSON',
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GEMINI_API_KEY',
];

// Lista över de hemligheter som ska ha NEXT_PUBLIC_ prefixet i .env-filen
const publicSecrets = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

async function fetchSecretsAndCreateEnvFile() {
  const gcpCredentials = process.env.GOOGLE_CREDENTIALS;
  if (!gcpCredentials) {
    console.log('GOOGLE_CREDENTIALS not set. Skipping secret fetch.');
    return;
  }

  const tempCredentialsPath = path.join(__dirname, 'temp-gcp-creds.json');
  fs.writeFileSync(tempCredentialsPath, gcpCredentials);

  const secretManagerClient = new SecretManagerServiceClient({
    keyFilename: tempCredentialsPath,
  });

  try {
    console.log('Fetching secrets from Google Secret Manager...');
    let envFileContent = '';

    for (const secretId of secretsToFetch) {
      const secretName = `projects/digi-dan/secrets/${secretId}/versions/latest`;
      console.log(`- Fetching ${secretId}...`);
      
      const [version] = await secretManagerClient.accessSecretVersion({ name: secretName });
      const payload = version.payload.data.toString('utf8');

      if (secretId === 'FIREBASE_SERVICE_ACCOUNT_KEY_JSON') {
        const outputPath = path.join(process.cwd(), 'serviceAccountKey.json');
        fs.writeFileSync(outputPath, payload);
        console.log(`  ✓ Wrote ${secretId} to serviceAccountKey.json`);
        envFileContent += `GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"\n`;
      } else {
        // Lägg till NEXT_PUBLIC_ prefixet om det behövs
        const envVarName = publicSecrets.includes(secretId) ? `NEXT_PUBLIC_${secretId}` : secretId;
        envFileContent += `${envVarName}="${payload}"\n`;
      }
    }

    const envOutputPath = path.join(process.cwd(), '.env.production');
    fs.writeFileSync(envOutputPath, envFileContent);
    console.log(`\nSuccessfully created .env.production file with all secrets.`);

  } catch (error) {
    console.error('Failed to fetch secrets from Google Secret Manager:', error);
    process.exit(1);
  } finally {
    fs.unlinkSync(tempCredentialsPath);
  }
}

fetchSecretsAndCreateEnvFile();
