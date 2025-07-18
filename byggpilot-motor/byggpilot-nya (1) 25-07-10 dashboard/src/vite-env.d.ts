/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  // lägg till fler miljövariabler här vid behov
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
