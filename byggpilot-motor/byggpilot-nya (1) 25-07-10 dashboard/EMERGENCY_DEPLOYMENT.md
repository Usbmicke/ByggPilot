# ByggPilot - EMERGENCY CACHE BYPASS

## 🚨 Netlify CDN Cache Problem

Netlify serverar fortfarande gamla `index-DW5ZvK72.js` trots 6+ pushes med ny Firebase-kod.

## ✅ Lösning: Deploy på alternativ URL

### Steg 1: Vercel Deployment
1. Gå till: https://vercel.com/signup
2. Logga in med GitHub
3. Klicka "Add New" → "Project"  
4. Välj "Usbmicke/ByggPilot"
5. Klicka "Deploy"

### Steg 2: Railway Deployment  
1. Gå till: https://railway.app
2. Logga in med GitHub
3. Klicka "Start a New Project"
4. Välj "Deploy from GitHub repo"
5. Välj "Usbmicke/ByggPilot"

### Steg 3: GitHub Pages
1. Gå till: GitHub.com/Usbmicke/ByggPilot
2. Klicka "Settings" → "Pages"
3. Välj "Deploy from a branch" → "main" → "/dist"
4. Först bygga: `npm run build` och pusha dist-mappen

## 🎯 Resultat
Ny URL kommer ha: `index-DDQ-bsNf-NOFIREBASE-2025.js` med korrekt Firebase-config

## 💡 Temporär Fix
Använd lokal utveckling: `npm run dev` på http://localhost:5173
