import { defineConfig } from 'vite'

export default defineConfig({
 server: {
    host: true, // permite acceder desde la LAN
    port: 5173, // puedes cambiar el puerto si quieres
  },
})
