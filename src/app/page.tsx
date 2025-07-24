// src/app/page.tsx
'use client';
import React from 'react';
import { useAuth } from './AuthContext';

// --- SVG Ikoner och Komponenter för Landningssidan ---
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,34.556,44,29.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);
const Header = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-border-color">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <a href="#" className="flex items-center gap-3 text-text-color">
                        <img src="/byggpilot-logga-vit.png" alt="ByggPilot Logotyp" className="h-8 w-auto" />
                        <span className="font-bold text-xl">ByggPilot</span>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={onLoginClick} className="text-text-muted hover:text-text-color transition-colors">Logga in</button>
                    <button onClick={onLoginClick} className="bg-primary-accent-color text-text-dark font-semibold px-4 py-2 rounded-md hover:bg-primary-accent-hover transition-colors">Testa ByggPilot Gratis</button>
                </div>
            </div>
        </div>
    </header>
);
const HeroSection = ({ onLoginClick }: { onLoginClick: () => void }) => (
    <section className="text-center py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-color tracking-tight">Mindre papperskaos. <br /> Mer tid att bygga.</h1>
            <div className="mt-10 flex justify-center">
                <button onClick={onLoginClick} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-200 transition-all">
                    <GoogleIcon />
                    Logga in med Google
                </button>
            </div>
        </div>
    </section>
);

const LandingPage = () => {
    const { login } = useAuth();
    return (
        <div>
            <Header onLoginClick={login} />
            <main>
                <HeroSection onLoginClick={login} />
            </main>
        </div>
    );
};

export default function App() {
  return <LandingPage />;
}
