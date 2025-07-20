console.log("--- LOADING firebase/init.ts MODULE ---");

// Denna fil hanterar anslutningen till Firebase på ett säkert sätt.

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export const initializeFirebase = async () => {
  // Om redan initialiserad, returnera den befintliga anslutningen
  if (firebaseApp) {
    return { firebaseApp, auth, db };
  }

  try {
    console.log("--- 1. ENTERING initializeFirebase function ---");
    console.log("🔧 Fetching Firebase configuration from server...");

    // Anropa din säkra Netlify-funktion för att hämta konfigurationen
    const response = await fetch('/.netlify/functions/get-firebase-config');
    if (!response.ok) {
      throw new Error(`Server responded with an error: ${response.statusText}`);
    }
    const firebaseConfig = await response.json();

    // Kontrollera att vi fick en giltig konfiguration
    if (!firebaseConfig || !firebaseConfig.apiKey) {
      console.error("❌ Invalid Firebase config received from server", firebaseConfig);
      throw new Error("Invalid Firebase config received from server");
    }
    console.log("✅ Firebase config retrieved successfully!");

    // Initialisera Firebase med den hämtade konfigurationen
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    
    console.log("🎉 Firebase initialization complete!");
    return { firebaseApp, auth, db };

  } catch (error) {
    console.error("❌ CRITICAL: Firebase initialization failed:", error);
    // Kasta om felet så att appen vet att något gick fel
    throw error;
  }
};

// Exportera funktioner för att säkert hämta anslutningarna i andra delar av appen
export const getFirebaseAuth = () => {
  if (!auth) throw new Error("Firebase Auth has not been initialized yet.");
  return auth;
};

export const getFirebaseDb = () => {
  if (!db) throw new Error("Firestore has not been initialized yet.");
  return db;
};
