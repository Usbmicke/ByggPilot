// src/components/Sidebar.tsx
'use client';
import { useAuth } from '../app/AuthContext';
import React from 'react';

// Ikoner
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ProjectsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const CustomersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export const Sidebar = () => {
    const { logout } = useAuth();

    return (
        <aside className="w-64 bg-secondary-bg border-r border-border-color p-6 flex-col hidden md:flex">
            <div className="flex items-center gap-3 mb-10">
                <img src="/byggpilot-logga-vit.png" alt="ByggPilot Logotyp" className="h-8 w-auto" />
                <span className="font-bold text-xl">ByggPilot</span>
            </div>
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {/* Aktiv länk med konstant glow */}
                    <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md bg-primary-accent text-text-dark font-semibold shadow-glow transition-all"><HomeIcon /> Översikt</a></li>
                    {/* Inaktiva länkar med glow vid hover */}
                    <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-card-background-color text-text-muted hover:text-text-color hover:shadow-glow transition-all"><ProjectsIcon /> Projekt</a></li>
                    <li><a onClick={() => window.open('https://drive.google.com', '_blank')} className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md hover:bg-card-background-color text-text-muted hover:text-text-color hover:shadow-glow transition-all"><DocumentIcon /> Dokument</a></li>
                    <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-card-background-color text-text-muted hover:text-text-color hover:shadow-glow transition-all"><CustomersIcon /> Kunder</a></li>
                </ul>
            </nav>
            <div className="pt-4 border-t border-border-color space-y-2">
                 <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-card-background-color text-text-muted hover:text-text-color hover:shadow-glow transition-all"><SettingsIcon /> Inställningar</a>
                 <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-card-background-color text-text-muted hover:text-text-color hover:shadow-glow transition-all"><HelpIcon /> Hjälp & Guider</a>
                <button onClick={logout} className="flex items-center w-full gap-3 px-4 py-2 rounded-md hover:bg-red-500/20 text-text-muted hover:text-text-color hover:shadow-glow transition-all">
                    <LogoutIcon /> Logga ut
                </button>
            </div>
        </aside>
    );
};
