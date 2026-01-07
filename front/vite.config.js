import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permettre l'accès depuis tous les réseaux
    proxy: {
      '/api': {
        target: 'https://localhost:5001', // HTTPS pour tester avec NODE_ENV=production
        changeOrigin: true,
        secure: false, // Accepter les certificats auto-signés
      },
    },
  },
})
