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
        <div className="flex-1 relative overflow-y-auto">
          <main className="p-6 md:p-10 pb-[95px]">
            {children}
          </main>
          {/* Chatten läggs tillbaka här för att fungera korrekt på dashboarden */}
          <Chat />
        </div>
      </div>
    </div>
  )
}
