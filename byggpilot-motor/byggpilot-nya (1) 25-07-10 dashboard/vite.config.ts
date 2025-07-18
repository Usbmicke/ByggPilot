import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'build', // ÄNDRAR FRÅN 'dist' TILL 'build' FÖR ATT BRYTA CACHE
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
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:3001',
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
