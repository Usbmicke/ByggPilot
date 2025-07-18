// Firebase Initialization Module
// Proper Firebase setup with error handling and logging

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { firebaseConfig } from './config';

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
  return new Promise((resolve, reject) => {
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

      console.log('Firebase config object:', firebaseConfig);
      console.log('Current origin for OAuth:', window.location.origin);
      console.log('Required redirect URI:', window.location.origin);
      console.log('Required Firebase redirect URI:', `https://${firebaseConfig.authDomain}/__/auth/handler`);

      // Initialize Firebase
      console.log('Initializing Firebase app...');
      firebaseApp = initializeApp(firebaseConfig);
      console.log('Firebase app initialized:', firebaseApp);

      // Initialize Auth
      console.log('Initializing Firebase Auth...');
      auth = getAuth(firebaseApp);
      console.log('Firebase Auth initialized:', auth);

      // Initialize Firestore
      console.log('Initializing Firestore...');
      db = getFirestore(firebaseApp);
      console.log('Firestore initialized:', db);

      // Initialize Analytics (optional, may fail in development)
      try {
        analytics = getAnalytics(firebaseApp);
        console.log('Firebase Analytics initialized:', analytics);
      } catch (analyticsError) {
        console.warn('Firebase Analytics failed to initialize (this is normal in development):', analyticsError);
        analytics = null;
      }

      console.log('✅ Firebase initialization complete!');
      
      resolve({ 
        app: firebaseApp, 
        auth: auth!, 
        db: db!, 
        analytics 
      });

    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      reject(error);
    }
  });
};

// Export individual services (will be null until initialized)
export const getFirebaseApp = () => firebaseApp;
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
export const getFirebaseAnalytics = () => analytics;
