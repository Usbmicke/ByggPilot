'use client';

import { AuthProvider } from './AuthContext';
import { AuthGuard } from './AuthGuard';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
