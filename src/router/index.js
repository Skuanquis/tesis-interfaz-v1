import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import AppLayoutMain from '@/layout/AppLayoutMain.vue'
import store from '@/store'
import { getUserInfo } from '@/services/userService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/app',
      component: AppLayout,
      children: [
        {
          path: 'paciente',
          name: 'paciente',
          component: () => import('@/views/Paciente.vue')
        },
        {
          path: 'examenes',
          name: 'examenes',
          component: () => import('@/views/Examenes.vue')
        },
        {
          path: 'investigar',
          name: 'investigar',
          component: () => import('@/views/Investigar.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      component: AppLayoutMain,
      children: [
        {
          path: 'perfil',
          name: 'perfil',
          component: () => import('@/views/Perfil.vue')
        },
        {
          path: 'registrar-usuario',
          name: 'registrar-usuario',
          component: () => import('@/views/RegistrarUsuario.vue')
        },
        {
          path: 'ver-usuarios',
          name: 'ver-usuarios',
          component: () => import('@/views/VerUsuarios.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      return next({ name: 'login' })
    } else {
      try {
        let user = store.state.user

        if (!user) {
          const response = await getUserInfo()
          user = response.data
          store.commit('setUser', user)
        }

        if (to.meta.roles && !to.meta.roles.includes(user.rol)) {
          return next({ name: 'dashboard' })
        }

        next()
      } catch (error) {
        localStorage.removeItem('token')
        next({ name: 'login' })
      }
    }
  } else {
    next()
  }
})

export default router
