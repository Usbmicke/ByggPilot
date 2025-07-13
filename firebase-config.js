// Firebase configuration for ByggPilot
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Log environment variables for debugging
console.log('Firebase config loading...')
console.log('API Key exists:', !!import.meta.env.VITE_FIREBASE_API_KEY)
console.log('API Key value:', import.meta.env.VITE_FIREBASE_API_KEY)
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID)
console.log('Google Client ID from env:', import.meta.env.VITE_GOOGLE_CLIENT_ID)

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

// Google OAuth scopes for ByggPilot
export const googleScopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

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

// Add Client ID if provided - TEMPORARY DISABLE
if (false && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.log('Setting custom Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
  // Don't override the client_id in custom parameters - let Firebase handle it
}

console.log('Google Auth Provider configured:', googleProvider)
// export const googleProvider = new GoogleAuthProvider();
// 
// googleScopes.forEach(scope => {
//   googleProvider.addScope(scope);
// }); 