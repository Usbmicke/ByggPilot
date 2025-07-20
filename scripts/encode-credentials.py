# Google Credentials Encoder
# Använd detta för att konvertera din service account JSON till Base64

import base64
import json

def encode_credentials():
    # Lägg in din JSON här (ersätt detta med din riktiga service account JSON)
    credentials = {
        "type": "service_account",
        "project_id": "digi-dan",
        "private_key_id": "YOUR_PRIVATE_KEY_ID",
        "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
        "client_email": "YOUR_SERVICE_ACCOUNT_EMAIL",
        "client_id": "YOUR_CLIENT_ID",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "YOUR_CERT_URL"
    }
    
    # Konvertera till JSON string
    json_string = json.dumps(credentials)
    
    # Encode to Base64
    encoded = base64.b64encode(json_string.encode()).decode()
    
    print("Base64-encoded credentials:")
    print(encoded)
    
    return encoded

if __name__ == "__main__":
    encode_credentials()
