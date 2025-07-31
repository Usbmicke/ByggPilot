// src/app/dashboard/_components/Sidebar.tsx
'use client';
import React from 'react';

export const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 p-4">
      <h2 className="text-2xl font-bold mb-4">ByggPilot</h2>
      <nav>
        <ul>
          <li className="mb-2"><a href="/dashboard" className="hover:text-cyan-400">Dashboard</a></li>
          <li className="mb-2"><a href="#" className="hover:text-cyan-400">Projects</a></li>
          <li className="mb-2"><a href="#" className="hover:text-cyan-400">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
};
