import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Критически важно для GitHub Pages, чтобы пути к ассетам были относительными
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Игнорируем внешние зависимости, если они есть, но лучше все бандлить
    }
  }
})
