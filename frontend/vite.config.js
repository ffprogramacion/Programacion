import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Útil si levantas con Docker localmente
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Tu backend de Django local
        changeOrigin: true,
      },
    },
  },
})