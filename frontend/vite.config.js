import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    allowedHosts: [
      '.ngrok-free.app' // note le point au début pour tous les sous-domaines
    ]
  }
})
