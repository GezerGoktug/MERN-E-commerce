import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/admin/",
  server: {
    port: 3001
  },
  preview: {
    port: 3001
  },
  build: {
    outDir: '../../../dist/admin',
    emptyOutDir: true,
  },
})
