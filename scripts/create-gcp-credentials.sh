#!/bin/bash
# scripts/create-gcp-credentials.sh

# Kontrollera om miljövariabeln GOOGLE_CREDENTIALS finns
if [ -z "$GOOGLE_CREDENTIALS" ]; then
  echo "GOOGLE_CREDENTIALS is not set. Skipping file creation."
  exit 0
fi

# Skapa serviceAccountKey.json-filen med innehållet från miljövariabeln
echo "Creating serviceAccountKey.json from GOOGLE_CREDENTIALS..."
echo "$GOOGLE_CREDENTIALS" > serviceAccountKey.json
echo "serviceAccountKey.json created successfully."
