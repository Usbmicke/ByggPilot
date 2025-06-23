// Fil: /index.tsx

import React, { useState } from 'react';

// Det här är din React-komponent för sidan
export default function HomePage() {
  const [inputValue, setInputValue] = useState(''); // Texten användaren skriver
  const [aiResponse, setAiResponse] = useState(''); // Svaret från AI:n
  const [isLoading, setIsLoading] = useState(false); // För att visa "Laddar..."
  const [error, setError] = useState(''); // För att visa felmeddelanden

  // Denna funktion körs när man klickar på knappen
  const handleSendMessage = async (event) => {
    event.preventDefault(); // Hindra sidan från att laddas om
    
    if (!inputValue.trim()) return; // Gör inget om fältet är tomt

    setIsLoading(true);
    setAiResponse('');
    setError('');

    try {
      // Anropa din säkra funktion på Netlify
      const response = await fetch('/.netlify/functions/chatt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Något gick fel med serveranropet.');
      }

      const data = await response.json();
      setAiResponse(data.reply); // Spara AI:ns svar

    } catch (err) {
      setError('Kunde inte få svar från chatten. Försök igen.'); // Spara felmeddelande
    } finally {
      setIsLoading(false); // Sluta ladda, oavsett resultat
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Byggpilot Chatt</h1>
      
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Skriv din fråga här..."
          style={{ width: 'calc(100% - 110px)', padding: '10px' }}
          disabled={isLoading}
        />
        <button type="submit" style={{ width: '100px', padding: '10px' }} disabled={isLoading}>
          {isLoading ? 'Laddar...' : 'Skicka'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {aiResponse && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
          <strong>Svar:</strong>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}