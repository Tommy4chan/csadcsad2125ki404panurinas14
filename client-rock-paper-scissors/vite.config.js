import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',  // Vitest needs this to simulate browser-like environments
    setupFiles: './tests/setup.js'  // Optional, for setting up test environments
  },
})
