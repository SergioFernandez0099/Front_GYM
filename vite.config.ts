import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'public/index.html') // ✅ ruta absoluta
    }
  }
})
