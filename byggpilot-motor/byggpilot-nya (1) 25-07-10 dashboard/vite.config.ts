import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Force new filenames to break cache
        entryFileNames: `assets/[name]-[hash]-clean.js`,
        chunkFileNames: `assets/[name]-[hash]-clean.js`,
        assetFileNames: `assets/[name]-[hash]-clean.[ext]`
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
