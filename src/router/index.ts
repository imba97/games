import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    redirect: '/Home'
  },
  {
    path: '/Home',
    name: 'home',
    component: () => import('@/pages/Home.vue')
  },
  {
    path: '/MemoryGame',
    name: 'memoryGame',
    component: () => import('@/pages/MemoryGame.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
