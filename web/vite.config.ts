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
    proxy: {
      // 代理所有以 /api 开头的请求
      '/api': {
        target: 'https://www.bettercallxiaojin.com', // 你的后端地址
        changeOrigin: true,
      },
    },
  },
})
