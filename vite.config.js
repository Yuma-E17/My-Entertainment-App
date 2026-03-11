import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

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