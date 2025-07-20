/// <reference types="vite/client" />

// SÄKERHET: Frontend får ALDRIG ha direktåtkomst till API-nycklar.
// Alla hemliga nycklar hanteras via Netlify Functions och Google Secret Manager.

interface ImportMetaEnv {
  // Inga hemliga API-nycklar tillåtna här!
  // All kommunikation med externa APIs sker via /api/-endpoints
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
