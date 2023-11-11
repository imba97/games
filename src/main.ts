import { createI18n } from 'vue-i18n'
import '@/assets/styles/style.css'
import App from '@/App.vue'

import router from '@/router'

import 'virtual:uno.css'

import zhCN from '@/lang/zh-CN.json'
import jaJP from '@/lang/ja-JP.json'

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'ja-JP': jaJP
  }
})

app.use(i18n)

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
