// src/app/AuthGuard.tsx
'use client';
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = protectedRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!user && isProtectedRoute) {
      router.push('/');
    }

    if (user && isPublicRoute) {
      router.push('/dashboard');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background-color text-text-color">Laddar...</div>;
  }

  // Om vi är på en skyddad route och inte har en användare, rendera ingenting (eftersom vi omdirigerar)
  if (!user && protectedRoutes.includes(pathname)) {
    return null; 
  }

  // Om vi är på en publik route och har en användare, rendera ingenting (eftersom vi omdirigerar)
  if (user && publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}