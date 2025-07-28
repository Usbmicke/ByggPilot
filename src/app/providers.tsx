'use client';

import { AuthProvider } from './AuthContext';
import AuthGuard from './AuthGuard';
import { ChatProvider } from './ChatContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChatProvider>
        <AuthGuard>{children}</AuthGuard>
      </ChatProvider>
    </AuthProvider>
  );
}
