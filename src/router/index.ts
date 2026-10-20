import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes,
    // 未知路径回到首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 页面文件增删时热更新路由表
if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
