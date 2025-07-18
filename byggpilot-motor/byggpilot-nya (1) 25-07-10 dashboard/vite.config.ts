import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // AGGRESSIVE CACHE BUSTING - FORCE NETLIFY REBUILD WITHOUT FIREBASE
        entryFileNames: `assets/[name]-[hash]-NOFIREBASE-2025.js`,
        chunkFileNames: `assets/[name]-[hash]-FIREBASEREMOVED.js`,
        assetFileNames: `assets/[name]-[hash]-CLEAN-NOFB.[ext]`
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
