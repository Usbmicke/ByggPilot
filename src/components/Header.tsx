// src/components/Header.tsx
'use client';
import { useAuth } from '../app/AuthContext';
import React from 'react';

// Ikoner
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

export const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="flex-shrink-0 flex justify-end items-center py-3 px-6 bg-secondary-bg border-b border-border-color">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => console.log('Skapa Nytt klickad!')}
                    className="bg-card-background-color text-text-color font-bold py-2 px-4 rounded-md flex items-center transition-all hover:bg-gray-600">
                    <AddIcon /> Skapa Nytt
                </button>
                <button className="relative p-2 hover:bg-card-background-color rounded-full hover:shadow-glow transition-all">
                    <BellIcon />
                    <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="relative group">
                    <button className="flex items-center gap-3 p-2 hover:bg-card-background-color rounded-md">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profilbild" className="h-8 w-8 rounded-full" />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-primary-accent-color flex items-center justify-center text-text-dark font-bold">
                                {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                            </div>
                        )}
                        <span className="hidden md:block">{user?.displayName || 'Gäst'}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-card-background-color border border-border-color rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <a href="#" className="block px-4 py-2 text-sm text-text-muted hover:bg-secondary-bg hover:text-text-color">Inställningar</a>
                        <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-text-muted hover:bg-secondary-bg hover:text-text-color">Logga ut</button>
                    </div>
                </div>
            </div>
        </header>
    );
};
