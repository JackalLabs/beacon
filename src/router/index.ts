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
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/:user/:slug(.*)*',
    name: 'Article',
    component: () => import('@/views/HomePage.vue')
  },
  {
    path: '/:user',
    name: 'Profile',
    component: () => import('@/views/UserPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
