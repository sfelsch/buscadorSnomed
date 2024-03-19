import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/snowstorm': {
        target: 'https://snowstorm-test.msal.gob.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/snowstorm/, ''),
      },
    },
    port: 9090, // Cambiar el puerto a 9090
  },
});
