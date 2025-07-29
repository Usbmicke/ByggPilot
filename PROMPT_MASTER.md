Hej, jag behöver din hjälp med mitt projekt ByggPilot. För att du ska ha full kontext, här är en komplett sammanfattning av projektet, dess mål, tekniska arkitektur och arbetsmetod. Läs igenom detta noggrant innan vi börjar.

**1. Övergripande Mål & Vision**
ByggPilot är en avancerad AI-assistent för små och medelstora företag i den svenska byggbranschen. Målet är att agera som ett Large Action Model (LAM) för att automatisera administrativa uppgifter. Den fungerar som ett intelligent lager ovanpå användarens befintliga Google Workspace (Gmail, Drive, Kalender).

**2. Bekräftad Teknisk Arkitektur**
* **Frontend:** Next.js 14 (App Router), skriven i TypeScript och stylad med Tailwind CSS. Hostas på Netlify.
* **Backend:** För lokal utveckling använder vi inbyggda Next.js API Routes (i `src/app/api/`). Målarkitekturen är separata, serverlösa Google Cloud Functions.
* **Hantering av Hemligheter:** Miljövariabler används.
    * **Frontend:** `.env.local`-filen. Alla nycklar som ska vara tillgängliga i webbläsaren MÅSTE ha prefixet `NEXT_PUBLIC_`.
    * **Backend:** `.env.local`-filen. Nycklar som endast används på serversidan (som `GEMINI_API_KEY`) ska INTE ha `NEXT_PUBLIC_` prefixet.
* **Databas & Autentisering:** Firebase.
    * Firebase Authentication för "Logga in med Google".
    * Cloud Firestore för all applikationsdata.
* **AI-Motor:** Google Gemini API, anropas via vår säkra backend (Next.js API Route).

**3. Viktigaste Arbetsregeln (Läs Noga!)**
Din absolut viktigaste regel är att du **ALDRIG ska ändra mina filer direkt**. Du ska agera som en co-pilot som ger förslag. Varje gång jag ber dig skriva eller ändra kod, ska du avsluta ditt svar med att ge mig den **fullständiga, uppdaterade koden för de relevanta filerna i ett kodblock**. Jag kommer själv att granska, kopiera och klistra in koden. Fråga alltid om du är osäker.

Bekräfta att du har läst och förstått allt detta.