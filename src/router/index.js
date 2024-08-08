import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppLayout,
      children: [
        {
          path: '/paciente',
          name: 'paciente',
          component: () => import('@/views/Paciente.vue')
        }
      ]
    }
  ]
})

export default router
