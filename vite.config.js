import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  preview: {
    port: 9090,
    strictPort: true,
   },
  server: {
    proxy: {
      '/snowstorm': {
        target: 'https://snowstorm-test.msal.gob.ar',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/snowstorm/, ''),
        secure: false
      },
    },
    port: 9090,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:9090",
  },
});

