// src/app/dashboard/layout.tsx
'use client';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Chat } from '../../components/Chat';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background-color text-text-color font-poppins overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {/* Denna div blir den scrollbara föräldern för både main och chatten */}
        <div className="flex-1 relative overflow-y-auto">
          {/* Main-innehållet behöver padding i botten för att inte döljas av chatten */}
          <main className="p-6 md:p-10 pb-[95px]">
            {children}
          </main>
          <Chat />
        </div>
      </div>
    </div>
  )
}
