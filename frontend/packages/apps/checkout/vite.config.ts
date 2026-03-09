import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/checkout/',
  server: {
    port: 3002
  },
  preview: {
    port: 3002
  },
  build: {
    outDir: '../../../dist/checkout',
    emptyOutDir: true,
  },
})
