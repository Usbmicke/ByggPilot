import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Exclude problematic directories
      deny: ['**/byggpilot-motor/**']
    }
  }
})
