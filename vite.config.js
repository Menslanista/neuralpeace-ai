import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devBanner from '@replit/vite-plugin-dev-banner'
import runtimeErrorModal from '@replit/vite-plugin-runtime-error-modal'
import cartographer from '@replit/vite-plugin-cartographer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), devBanner(), runtimeErrorModal(), cartographer()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared')
    }
  }
})