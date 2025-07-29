// src/app/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase/init';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // Hantera session cookie
      if (user) {
        try {
          const idToken = await user.getIdToken(true);
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });
          console.log('Session cookie created successfully.');
        } catch (error) {
          console.error('Failed to create session cookie:', error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    // Lägg till scopes för Google Drive och Calendar
    provider.addScope('https://www.googleapis.com/auth/drive');
    provider.addScope('https://www.googleapis.com/auth/calendar');
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    
    try {
      await signInWithPopup(auth, provider);
      // Sessionhantering sker nu i onAuthStateChanged
    } catch (error) {
      console.error("Popup login failed:", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      console.log('Session cookie cleared successfully.');
    } catch (error) {
      console.error('Failed to clear session cookie:', error);
    }
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};