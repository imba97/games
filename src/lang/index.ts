import { createI18n } from 'vue-i18n'

import jaJP from '@/lang/ja-JP.json'
import zhCN from '@/lang/zh-CN.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'ja-JP': jaJP
  }
})

export default i18n
