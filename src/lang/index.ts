import { createI18n } from 'vue-i18n'

import zhCN from '@/lang/zh-CN.json'
import jaJP from '@/lang/ja-JP.json'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'ja-JP': jaJP
  }
})

export default i18n
