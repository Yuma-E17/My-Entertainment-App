import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/My-Entertainment-App/',  // <-- ADD THIS LINE
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate"
    })
  ],
  server: {
    proxy: {
      "/anilist": {
        target: "https://graphql.anilist.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/anilist/, "")
      }
    }
  }
})