#!/usr/bin/env node
// scripts/fetch-secrets.js

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const path = require('path');

// Lista över ALLA hemligheter som behövs för bygget
const secretsToFetch = [
  'FIREBASE_SERVICE_ACCOUNT_KEY_JSON',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GEMINI_API_KEY',
  'GOOGLE_GENERATIVE_AI_API_KEY'
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
        // Skriv denna specifika hemlighet till sin egen fil för Firebase Admin SDK
        const outputPath = path.join(process.cwd(), 'serviceAccountKey.json');
        fs.writeFileSync(outputPath, payload);
        console.log(`  ✓ Wrote ${secretId} to serviceAccountKey.json`);
        // Lägg till pekaren i .env-filen
        envFileContent += `GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"\n`;
      } else {
        // Lägg till andra hemligheter i .env-filen
        envFileContent += `${secretId}="${payload}"\n`;
      }
    }

    // Skriv den samlade .env-filen som Next.js kommer att använda
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
