import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: true, // permite acceder desde la LAN en desarrollo
        port: 5173,
    },
    base: '/', //  ruta base de tu app en producción
    build: {
        outDir: 'dist', // carpeta de salida del build
        sourcemap: false, // evita exponer código fuente en producción
        emptyOutDir: true, // limpia dist antes de generar el build
    },
})
