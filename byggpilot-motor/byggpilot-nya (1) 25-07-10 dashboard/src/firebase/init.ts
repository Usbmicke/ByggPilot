// Firebase Initialization Module
// Updated to use Netlify Function for configuration retrieval

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

export const initializeFirebase = (): Promise<{
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics: Analytics | null;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Only initialize once
      if (firebaseApp) {
        resolve({ 
          app: firebaseApp, 
          auth: auth!, 
          db: db!, 
          analytics 
        });
        return;
      }

      console.log('🔧 Fetching Firebase configuration from Secret Manager...');
      
      // Hämta Firebase config från vår nya Netlify Function
      const response = await fetch('/.netlify/functions/get-firebase-config');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Firebase config: ${response.status} ${response.statusText}`);
      }
      
      const firebaseConfig = await response.json();
      
      // Kontrollera att vi fick en giltig config
      if (!firebaseConfig.apiKey) {
        throw new Error("Received invalid Firebase config from server");
      }

      console.log('✅ Firebase config retrieved from Secret Manager');
      console.log('Firebase config object:', {
        ...firebaseConfig,
        apiKey: `${firebaseConfig.apiKey.substring(0, 10)}...` // Dölj API key i loggar
      });
      console.log('Current origin for OAuth:', window.location.origin);
      console.log('Auth domain:', firebaseConfig.authDomain);

      // Initialize Firebase
      console.log('🔧 Initializing Firebase app...');
      firebaseApp = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized successfully');

      // Initialize Auth
      console.log('🔧 Initializing Firebase Auth...');
      auth = getAuth(firebaseApp);
      console.log('✅ Firebase Auth initialized successfully');

      // Initialize Firestore
      console.log('🔧 Initializing Firestore...');
      db = getFirestore(firebaseApp);
      console.log('✅ Firestore initialized successfully');

      // Initialize Analytics (optional, may fail in development)
      try {
        analytics = getAnalytics(firebaseApp);
        console.log('✅ Firebase Analytics initialized successfully');
      } catch (analyticsError) {
        console.warn('⚠️ Firebase Analytics failed to initialize (this is normal in development):', analyticsError);
        analytics = null;
      }

      console.log('🎉 Firebase initialization complete!');
      console.log('✅ All Firebase services ready');
      
      resolve({ 
        app: firebaseApp, 
        auth: auth!, 
        db: db!, 
        analytics 
      });

    } catch (error) {
      console.error('❌ Critical Firebase initialization failed:', error);
      console.error('   This usually means:');
      console.error('   1. Firebase secrets are missing in Secret Manager');
      console.error('   2. Network connection to Secret Manager failed');
      console.error('   3. Invalid Firebase configuration values');
      reject(error);
    }
  });
};

// Export individual services (will be null until initialized)
export const getFirebaseApp = () => firebaseApp;
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
export const getFirebaseAnalytics = () => analytics;
