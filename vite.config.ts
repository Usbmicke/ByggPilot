import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_API_KEY),
    'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
  }
})
