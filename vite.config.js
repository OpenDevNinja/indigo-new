import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: "https://api.gestion-digitale.com",
        changeOrigin: true,
        secure: false, // Important si vous avez des problèmes de certificat SSL
        rewrite: (path) => path.replace(/^\/api/, ''),
        // Configuration supplémentaire pour le débogage
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy Error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxy Request:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Proxy Response:', proxyRes.statusCode);
          });
        }
      }
    }
  }
});