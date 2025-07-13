# Utvecklingsdomän Setup för ByggPilot

## Snabbstart

### 1. Sätt upp lokal domän
Högerklicka på PowerShell och välj "Kör som administratör", kör sedan:
```powershell
cd "C:\Micke\ByggPilot MICKE NYA"
.\setup-dev-domain.ps1
```

### 2. Konfigurera Firebase
1. Gå till [Firebase Console](https://console.firebase.google.com)
2. Välj ditt ByggPilot-projekt
3. Gå till **Authentication > Settings > Authorized domains**
4. Klicka **"Add domain"**
5. Lägg till: `byggpilot.dev`
6. Spara

### 3. Starta utvecklingsservern
```bash
npm run dev
```

### 4. Öppna appen
Gå till: http://byggpilot.dev:5173

## Manuell hosts-fil setup (om scriptet inte fungerar)

1. Öppna Anteckningar som administratör
2. Öppna filen: `C:\Windows\System32\drivers\etc\hosts`
3. Lägg till denna rad längst ner:
   ```
   127.0.0.1 byggpilot.dev
   ```
4. Spara filen

## Felsökning

### Problem: "byggpilot.dev kan inte nås"
- Kontrollera att hosts-filen är uppdaterad
- Starta om webbläsaren
- Kör `ipconfig /flushdns` i kommandotolken

### Problem: "Unauthorized domain" i Firebase
- Kontrollera att `byggpilot.dev` är tillagd i Firebase Console
- Vänta några minuter för att ändringarna ska träda i kraft

### Problem: Utvecklingsservern startar inte
- Kontrollera att port 5173 inte används av något annat
- Prova `npm run dev -- --port 3000` för alternativ port

## Återgå till localhost
Om du vill gå tillbaka till localhost, ändra i `vite.config.ts`:
```typescript
server: {
  host: 'localhost',
  port: 5173,
  strictPort: true
}
```
