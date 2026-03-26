import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/attendance': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/subjects': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
