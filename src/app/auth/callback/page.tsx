'use client';
import { useEffect } from 'react';
import { useAuth } from '../../AuthContext'; // Korrekt sökväg
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Vänta tills vi har ett definitivt svar från Firebase
    if (!loading) {
      if (user) {
        // Användaren är nu bekräftat inloggad, skicka till dashboarden
        router.push('/dashboard');
      } else {
        // Något gick fel, skicka tillbaka till landningssidan för att försöka igen
        router.push('/');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background-color text-text-color">
      <p>Slutför inloggning, vänligen vänta...</p>
    </div>
  );
}
