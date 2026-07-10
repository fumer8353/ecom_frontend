import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ecom_frontend/',   // 👈 replace with your actual repo nam
  server: {
    port: 5173,
  },
})
