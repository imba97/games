import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import unoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

import vueRouter from 'vue-router/vite'

// 用配置文件自身所在目录，避免从其他工作目录启动时别名解析错位
const resolvePath = (p: string) => path.resolve(import.meta.dirname, p)

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolvePath('src')
    }
  },

  server: {
    host: '0.0.0.0'
  },

  plugins: [
    // vue-router 内置的文件路由：src/pages 目录即路由表
    vueRouter(),
    vue(),
    unoCSS(),
    autoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        {
          '@/lang': [['default', 'i18n']]
        }
      ],
      dts: resolvePath('auto-import/auto-import.d.ts'),
      vueTemplate: true
    })
  ]
})
