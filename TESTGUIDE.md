# ByggPilot - Testguide

## 🚀 Kom igång
1. Kör `npm run dev` 
2. Öppna http://localhost:5173
3. Testa alla funktioner enligt denna guide

## ✅ Testlista

### 1. **Landningssida** (För icke-inloggade användare)
- [ ] Landningssidan visas när man inte är inloggad
- [ ] "Testa ByggPilot Gratis" knappen fungerar
- [ ] "Logga in med Google" knappen fungerar
- [ ] Responsiv design på mobil

### 2. **Demo-läge**
- [ ] Klicka "Testa Demo" - ska logga in som demo-användare
- [ ] Dashboard visas efter demo-start
- [ ] Chat expanderas automatiskt med välkomstmeddelande
- [ ] Alla navigation-ikoner fungerar

### 3. **Navigation** 
- [ ] Dashboard - visar projekt och widgets
- [ ] Projekt - visar "Skapa nytt projekt" knapp
- [ ] Kalender - visar demo med resursplanering
- [ ] Dokument - visar demo med dokument-hantering  
- [ ] Fakturering - visar demo med faktura-statistik
- [ ] Inställningar - visar anpassningsalternativ

### 4. **Resursplanering** (I Kalender-demo)
- [ ] Personal-lista visas till vänster
- [ ] Drag personal till tidsluckor fungerar
- [ ] Schema-grid visar befintliga uppdrag
- [ ] Responsiv design på mobil/tablet

### 5. **Inställningar**
- [ ] Navigation-toggles fungerar (döljer/visar meny-objekt)
- [ ] Dashboard-toggles fungerar (för framtida widgets)
- [ ] Ändringar sparas och påverkar navigationen

### 6. **Chat-funktionalitet**
- [ ] Chat-ikonen expanderar/kollapsar chatten
- [ ] Automatiskt välkomstmeddelande vid demo-start
- [ ] AI svarar på meddelanden (mock-svar)
- [ ] Chat overlay fungerar
- [ ] Stäng-knapp stänger chatten

### 7. **Projekthantering**
- [ ] "Skapa nytt projekt" knapp fungerar
- [ ] Formulär för projektnamn och kund visas
- [ ] Mock-bekräftelse visas efter skapande

### 8. **Demo-läge funktioner**
- [ ] "Lämna Demo" knapp visas i navigation för demo-användare
- [ ] "Lämna Demo" loggar ut och återgår till landningssida
- [ ] Demo-content visas endast för demo-användare
- [ ] Reguljära användare ser "Kommer snart"

### 9. **Responsiv design**
- [ ] Desktop (1920x1080) - allt fungerar
- [ ] Tablet (768x1024) - layout anpassas
- [ ] Mobil (375x667) - navigation och content fungerar
- [ ] Resursplanering anpassas på mindre skärmar

### 10. **Allmänna funktioner**
- [ ] Alla knappar är klickbara och responsiva
- [ ] Hover-effekter fungerar
- [ ] Färgschema (mörkt tema) konsistent
- [ ] Ikoner (Material Symbols) laddas korrekt
- [ ] Inga JavaScript-fel i konsolen

## 🎯 Huvudfunktioner

### **Demo-läge innehåll:**

**Kalender:**
- Kommande händelser med realistisk data
- Resursplanering med drag-and-drop personal
- Projektschema för veckan
- Statistik för kapacitet och projekthantering

**Dokument:**
- Senaste dokument med filtyper och tidsstämplar
- Populära mallar för byggbranschen
- Dokumentstatistik med lagring och antal

**Fakturering:**
- Månadens översikt med omsättning
- Senaste fakturor med status
- Prestanda-data och tillväxtstatistik

### **Tekniska funktioner:**
- Mock Firebase/Google AI för offline-användning
- Drag-and-drop resursplanering
- State management för inställningar
- Responsiv CSS Grid/Flexbox
- TypeScript för typsäkerhet

## 🐛 Felsökning

Om sidan är vit:
1. Kontrollera konsolen för JavaScript-fel
2. Verifiera att CSS-filen laddas (`app-exact.css`)
3. Kontrollera att `main.tsx` importerar rätt komponent

Om navigation inte fungerar:
1. Kontrollera att `navigationSettings` state fungerar
2. Verifiera att view-names matchar i `renderCurrentView`

Om demo-content inte visas:
1. Kontrollera att `isDemoMode` är true
2. Verifiera att view-names matchar i `renderPlaceholderView`

## 📱 Testscenarier

### **Scenario 1: Ny användare**
1. Öppna sidan → Landningssida visas
2. Klicka "Testa Demo" → Loggas in som demo
3. Testa alla navigation-flikar → Demo-content visas
4. Testa resursplanering → Dra personal i kalendern
5. Klicka "Lämna Demo" → Återgår till landningssida

### **Scenario 2: Inställningar**
1. Starta demo-läge
2. Gå till Inställningar
3. Stäng av några navigation-objekt → Menyn uppdateras
4. Stäng av dashboard-widgets → Toggles sparas
5. Navigera mellan vyer → Inställningar kvarstår

### **Scenario 3: Responsivitet**
1. Starta demo på desktop → Allt fungerar
2. Ändra till tablet-storlek → Layout anpassas
3. Ändra till mobil → Navigation och content anpassas
4. Testa resursplanering på mobil → Grid anpassas

## 🎉 Framgång!

När alla checkboxar är ikryssade har du verifierat att ByggPilot fungerar komplett enligt specifikationen!
