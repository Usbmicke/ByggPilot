import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import './app.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export default function ByggPilotApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined
        });
        setShowOnboarding(true);
        setIsConnecting(false);
      } else {
        setUser(null);
        setIsConnecting(false);
      }
    });

    // Check for redirect result
    getRedirectResult(auth).then((result) => {
      if (result) {
        console.log('Successfully signed in via redirect:', result.user);
      }
    }).catch((error) => {
      console.error('Redirect result error:', error);
      setIsConnecting(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    try {
      await signInWithRedirect(auth, provider);
      console.log('Redirecting to Google sign-in...');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderOnboardingModal = () => {
    if (!showOnboarding || !user) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Välkommen till ByggPilot!</h2>
          <p>Hej {user.displayName}! Du är nu inloggad och kan börja använda ByggPilot.</p>
          <div className="modal-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowOnboarding(false)}
            >
              Kom igång
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div>
      <h1>ByggPilot Dashboard</h1>
      {user ? (
        <div>
          <p>Välkommen, {user.displayName}!</p>
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => alert('Nytt projekt - kommer snart!')}>
              Nytt Projekt
            </button>
            <button className="btn" onClick={() => alert('Visa uppgifter - kommer snart!')}>
              Visa Uppgifter
            </button>
            <button className="btn" onClick={() => alert('Tidloggning - kommer snart!')}>
              Tidloggning
            </button>
            <button className="btn" onClick={handleSignOut}>
              Logga ut
            </button>
          </div>
          
          <div className="content-card">
            <h3>Senaste Projekt</h3>
            <div>
              <div className="project-item">
                <strong>Villa Andersson</strong> - Kund: Familjen Andersson - Status: <span className="status-success">✅ I fas</span>
              </div>
              <div className="project-item">
                <strong>Kontorsrenovering</strong> - Kund: TechCorp AB - Status: <span className="status-warning">⚠️ Försenat</span>
              </div>
              <div className="project-item">
                <strong>Badrumsrenovering</strong> - Kund: Anna Andersson - Status: <span className="status-success">✅ Nästan klart</span>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h3>Senaste Uppgifter</h3>
            <div>
              <div className="task-item">
                <input type="checkbox" onChange={(e) => e.target.checked && alert('Uppgift markerad som klar!')} />
                <span>Beställ material för Villa Andersson</span>
              </div>
              <div className="task-item">
                <input type="checkbox" defaultChecked disabled />
                <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Boka inspektion för kontorsrenovering</span>
              </div>
              <div className="task-item">
                <input type="checkbox" onChange={(e) => e.target.checked && alert('Uppgift markerad som klar!')} />
                <span>Skicka faktura till Anna Andersson</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>Välkommen till ByggPilot - Din digitala kollega i byggbranschen</p>
          <div className="button-group">
            <button className="google-signin-btn" onClick={handleGoogleSignIn} disabled={isConnecting}>
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
              <span>{isConnecting ? 'Ansluter...' : 'Logga in med Google'}</span>
            </button>
            <button className="btn btn-primary" onClick={() => alert('Demo-läge aktiverat! Prova funktionerna nedan.')}>
              Demo-läge
            </button>
          </div>
          
          <div className="content-card">
            <h3>Demo Projekt (utan inloggning)</h3>
            <div>
              <div className="project-item">
                <strong>Villa Nygren</strong> - Kund: Familjen Nygren - Status: <span className="status-success">✅ I fas (75%)</span>
              </div>
              <div className="project-item">
                <strong>Kontorsrenovering</strong> - Kund: TechCorp AB - Status: <span className="status-warning">⚠️ Försenat (45%)</span>
              </div>
              <div className="project-item">
                <strong>Badrumsrenovering</strong> - Kund: Anna Andersson - Status: <span className="status-success">✅ Nästan klart (90%)</span>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h3>Demo Uppgifter</h3>
            <div>
              <div className="task-item">
                <input type="checkbox" onChange={(e) => e.target.checked && alert('Demo: Uppgift markerad som klar!')} />
                <span>Beställ material för Villa Nygren</span>
              </div>
              <div className="task-item">
                <input type="checkbox" defaultChecked disabled />
                <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>Boka inspektion för kontorsrenovering</span>
              </div>
              <div className="task-item">
                <input type="checkbox" onChange={(e) => e.target.checked && alert('Demo: Uppgift markerad som klar!')} />
                <span>Skicka faktura till Anna Andersson</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 10.5V12h-2v-1.5c0-2.06-1.35-3.83-3.27-4.58l-1.32-.51-.49-1.4A5.002 5.002 0 0 0 10.23 2H10c-2.76 0-5 2.24-5 5v1.5c0 .83.67 1.5 1.5 1.5S8 9.33 8 8.5V7c0-1.1.9-2 2-2h.23c1.12 0 2.1.75 2.47 1.81l.49 1.4 1.32.51C16.65 9.17 18 10.94 18 13v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V13h2v-1.5c0-1.74-1.43-3.15-3.17-3.15A3.18 3.18 0 0 0 18 10.5zM12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zM6.5 16h11c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5h-11C5.67 10 5 10.67 5 11.5v3c0 .83.67 1.5 1.5 1.5z"/>
            </svg>
          </div>
          <span>ByggPilot</span>
        </div>
      </div>

      <div className="main-content">
        <div className="main-header">
          <div className="header-title">
            <div className="greeting">Hej, {user?.displayName || 'Användare'}!</div>
            <div className="sub-greeting">Vad vill du göra idag?</div>
          </div>
        </div>

        <div className="page-content">
          {renderDashboard()}
        </div>

        {renderOnboardingModal()}
      </div>
    </div>
  );
}
