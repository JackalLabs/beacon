import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/DraftEditor.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/UserSettings.vue')
  },
  {
    path: '/:user/:stub(.*)*',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
