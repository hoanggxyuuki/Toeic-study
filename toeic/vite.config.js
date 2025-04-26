import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    fs: {
      // Cho phép Vite truy cập các tệp bên ngoài project root
      allow: [resolve(__dirname, '..')],
    },
  }
})
