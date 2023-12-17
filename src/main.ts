import '@/assets/styles/style.css'
import App from '@/App.vue'

import router from '@/router'
import i18n from '@/lang'

import 'virtual:uno.css'

const app = createApp(App)

app.use(i18n)

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
