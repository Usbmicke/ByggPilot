import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_API_KEY),
    'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
  }
})
