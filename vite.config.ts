import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // ÄNDRAR TILLBAKA TILL 'dist' FÖR NETLIFY
    rollupOptions: {
      output: {
        // HELT NYA FILNAMN SOM ALDRIG FUNNITS
        entryFileNames: `v2/[name]-[hash]-FIREBASE-FIXED-2025.js`,
        chunkFileNames: `v2/[name]-[hash]-NEW-ARCH.js`,
        assetFileNames: `v2/[name]-[hash]-FINAL.[ext]`
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8888', // Netlify dev server
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:8888', // Netlify dev server
        changeOrigin: true
      },
      '/.netlify': {
        target: 'http://localhost:8888', // Proxy alla Netlify Functions
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
