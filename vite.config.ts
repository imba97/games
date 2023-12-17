import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'

import path from 'node:path'

const resolvePath = (p: string) => path.resolve(process.cwd(), p)

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
    vue(),
    unoCSS(),
    autoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        {
          lodash: [['*', '_']],
          '@/lang': [['default', 'i18n']]
        }
      ],
      dts: resolvePath('auto-import/auto-import.d.ts'),
      vueTemplate: true
    })
  ]
})
