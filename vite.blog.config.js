import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogPlugin from './scripts/vite-plugin-blog.js'

// בניית הבלוג — נפרדת מ-vite.config.js, כדי שקובצי דף הנחיתה לא ישתנו בגללו
export default defineConfig({
  plugins: [react(), blogPlugin()],
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    rollupOptions: { input: { blog: 'blog/index.html' } },
  },
})
