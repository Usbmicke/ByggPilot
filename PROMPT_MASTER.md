**Projekt: ByggPilot - Handover & Nästa Steg**

**1. Projektöversikt & Mål**

ByggPilot är en AI-assistent för byggbranschen, byggd som ett intelligent lager ovanpå användarens Google Workspace. Målet är att automatisera administration. Vi har precis slutfört en stor implementation av Google OAuth 2.0 och en ny design för dashboarden.

**2. Teknisk Arkitektur (VIKTIGT!)**

*   **Framework:** Next.js 14 (App Router). All kod är skriven i **TypeScript**.
*   **Styling:** Tailwind CSS. Ingen vanlig CSS eller HTML ska användas.
*   **Backend:** Next.js API Routes i `src/app/api/`.
*   **Autentisering:**
    *   **Firebase Authentication** för grundläggande inloggning med Google.
    *   **Google OAuth 2.0** (via `googleapis`-paketet) för att få behörighet till användarens Google-tjänster.
    *   **Sessionhantering:** Säkra, `httpOnly` session-cookies som skapas och verifieras av våra API-routes (`/api/auth/session`, `/api/auth/status`).
*   **Databas:** Cloud Firestore. Används just nu för att säkert lagra användarens `refreshToken` för Google API:er.
*   **Chatt:** Byggd med Vercel AI SDK (`useChat`-hooken). Chatten är komplex och kan rendera interaktiva knappar som triggar funktioner.

**3. Nuvarande Status**

*   **Fullt fungerande autentiseringsflöde:** En användare kan logga in, bli ombedd att ge Google-behörighet, godkänna via Googles skärm, och bli korrekt omdirigerad tillbaka till appen.
*   **`refreshToken` sparas korrekt:** Backend-logiken för att ta emot och spara `refreshToken` i Firestore fungerar.
*   **Ny Dashboard-UI:** Hela dashboarden har fått en ny, professionell design med en tvåkolumns-layout och flera nya komponenter (`RecentEventsWidget`, `TodoWidget`, `ProjectCard` med väder-API, etc.).

**4. Kvarstående Problem & Nästa Steg (Högsta Prioritet)**

**Problem 1: Chatten frågar om behörighet i en loop.**
*   **Orsak:** Chatten är "dum". Den kollar bara om användaren är inloggad (`user` finns), inte om användaren redan har slutfört Google-anslutningen (`isGoogleConnected` är `true`). Därför startar den om onboarding-flödet varje gång.
*   **Lösning:**
    1.  **Uppdatera `src/app/AuthContext.tsx`:** Se till att den hämtar status från `/api/auth/status` och gör `isGoogleConnected`-värdet tillgängligt i hela appen.
    2.  **Uppdatera `src/app/dashboard/_components/Chat.tsx`:** Använd `isGoogleConnected` från `useAuth()`. I `useEffect`-hooken för onboarding, lägg till en `if/else`-sats:
        *   `if (user && !isGoogleConnected)`: Visa meddelandet "[Ja, ge behörighet]".
        *   `else if (user && isGoogleConnected)`: Visa ett "Välkommen tillbaka! Jag är redo att hjälpa dig."-meddelande istället.

**Problem 2: UI-bugg på Projektkorten.**
*   **Orsak:** Knapparna "Skapa Slutfaktura" och "Skapa Revisorsunderlag" tar för mycket plats och kan hamna utanför kortet på vissa skärmstorlekar.
*   **Lösning:**
    1.  **Uppdatera `src/app/dashboard/_components/ProjectCard.tsx`**.
    2.  Ta bort de två befintliga knapparna.
    3.  Lägg till en liten ikon-knapp (t.ex. en "+"-ikon eller tre prickar "...") i det övre högra hörnet på kortet.
    4.  När man klickar på ikonen ska en liten dropdown-meny visas med alternativen "Skapa Slutfaktura" och "Skapa Revisorsunderlag".

**Nästa Stora Funktion: Implementera den första riktiga AI-åtgärden.**
*   **Mål:** Få chatten att kunna läsa ett mail och skapa en kalenderhändelse.
*   **Uppdrag:**
    1.  Skapa en ny API-route, t.ex. `src/app/api/gmail/read-and-plan/route.ts`.
    2.  Denna route ska:
        a. Verifiera användarens session-cookie.
        b. Hämta användarens `refreshToken` från Firestore.
        c. Använda `refreshToken` för att skapa en autentiserad Google API-klient för både Gmail och Calendar.
        d. Anropa Gmail API för att hitta det senaste mailet som matchar en sökfråga (t.ex. "jobb").
        e. Anropa Calendar API för att skapa en händelse baserat på innehållet i mailet.
    3.  Koppla denna API-route till en ny knapp eller ett kommando i chatten.