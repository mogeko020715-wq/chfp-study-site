import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  // 开发环境用 / 便于本地预览；生产构建固定为 GitHub Pages 子路径
  base: process.env.NODE_ENV === 'production' ? '/chfp-study-site/' : '/',
  build: {
    assetsDir: '',
  },
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
