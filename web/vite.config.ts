import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'], 
  },
    server: {
    port: 3001,
    // --- ADDED THIS SECTION ---
    proxy: {
      // This sets up a proxy for any request starting with /api
      '/api': {
        // This is your backend server address
        target: 'http://47.113.186.81:8081',
        // Necessary for virtual hosted sites
        changeOrigin: true,
        // Removes the /api prefix before sending to the backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
