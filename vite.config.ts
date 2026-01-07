import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 基础路径（如果是仓库名称，需要设置 base）
  // 如果仓库名是 rus_test，则 base 应该是 '/rus_test/'
  // 如果使用自定义域名，则 base 应该是 '/'
  base: process.env.GITHUB_PAGES === 'true' ? '/rus_test/' : '/',
  plugins: [react()],
  server: {
    fs: {
      // 允许访问项目根目录
      allow: ['.']
    }
  },
  // 配置静态资源别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 将媒体文件目录作为静态资源
  publicDir: 'public',
  // 配置构建选项
  build: {
    outDir: 'dist',
    rollupOptions: {
      // 确保媒体文件被正确处理
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})

