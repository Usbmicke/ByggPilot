import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_API_KEY),
        'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          external: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore'
          ]
        }
      }
    };
});
