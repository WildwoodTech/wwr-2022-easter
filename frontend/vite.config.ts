import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4010,
    proxy: {
      '/': {
        target: 'http://localhost:4015',
        changeOrigin: true,
      },
    },
  },
});
