'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../../../firebase/init';

function CallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      signInWithCustomToken(auth, token)
        .then(() => {
          // Omdirigera till dashboarden efter lyckad inloggning.
          // Session-cookien kommer att sättas automatiskt av onAuthStateChanged-lyssnaren.
          router.push('/dashboard');
        })
        .catch((error) => {
          console.error('Error signing in with custom token:', error);
          // Omdirigera till startsidan med ett felmeddelande om något går fel.
          router.push('/?error=signin_failed');
        });
    } else {
      // Om ingen token finns, skicka tillbaka till startsidan.
      console.error('No custom token found in URL.');
      router.push('/?error=no_token');
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-xl">Loggar in och ansluter till Google...</p>
        {/* Här kan du lägga till en snyggare laddningsspinner */}
        <div className="mt-4 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400 mx-auto"></div>
      </div>
    </div>
  );
}

// Använd Suspense för att säkerställa att useSearchParams fungerar korrekt
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackComponent />
    </Suspense>
  );
}
