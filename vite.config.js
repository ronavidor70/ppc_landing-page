import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogPlugin from './scripts/vite-plugin-blog.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), blogPlugin()],
})
