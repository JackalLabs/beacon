import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }
})
