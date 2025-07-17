// Firebase configuration for ByggPilot
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase config - replace with your actual config values
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase config object:', firebaseConfig)

// Log the current origin for OAuth configuration
console.log('Current origin for OAuth:', window.location.origin)
console.log('Required redirect URI:', `${window.location.origin}`)
console.log('Required Firebase redirect URI:', `https://${firebaseConfig.authDomain}/__/auth/handler`)

// Google OAuth scopes för ByggPilot - Fullständig Google Workspace-integration
export const googleScopes = [
  // Drive - Fullständig åtkomst för att skapa mappar och hantera projektfiler
  'https://www.googleapis.com/auth/drive',
  
  // Calendar - Läsåtkomst för att visa kommande möten och deadlines  
  'https://www.googleapis.com/auth/calendar.readonly',
  
  // Gmail - Läsåtkomst för att visa nya meddelanden från kunder
  'https://www.googleapis.com/auth/gmail.readonly',
  
  // Gmail - Skicka mail (för att skicka rapporter och offerter)
  'https://www.googleapis.com/auth/gmail.send',
  
  // Profil och email - Grundläggande användarinfo
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

// Konfigurera Google Auth Provider med alla scopes
export const setupGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  
  // Lägg till alla Google Workspace scopes
  googleScopes.forEach(scope => {
    provider.addScope(scope);
  });
  
  // Tvinga användaren att välja konto för att säkerställa rätt behörigheter
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  return provider;
};

// Initialize Firebase
console.log('Initializing Firebase app...')
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app)

// Initialize Auth
console.log('Initializing Firebase Auth...')
export const auth = getAuth(app);
console.log('Firebase Auth initialized:', auth)

// Configure Google Auth Provider
console.log('Configuring Google Auth Provider...')
export const googleProvider = new GoogleAuthProvider();

// Add scopes first
googleScopes.forEach(scope => googleProvider.addScope(scope));

// Set custom parameters for better OAuth experience
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add Client ID if provided
if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  // Don't override the client_id in custom parameters - let Firebase handle it
}

console.log('Google Auth Provider configured')
// export const googleProvider = new GoogleAuthProvider();
// 
// googleScopes.forEach(scope => {
//   googleProvider.addScope(scope);
// }); 