// src/app/dashboard/_components/Header.tsx
'use client';
import React from 'react';
import { useAuth } from '../../AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <div>
        {user && (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user.displayName}</span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
