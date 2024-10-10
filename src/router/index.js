import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import AppLayoutMain from '@/layout/AppLayoutMain.vue'
import store from '@/store/index'
import { getUserInfo } from '@/services/userService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/app',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'paciente',
          name: 'paciente',
          component: () => import('@/views/Paciente.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'examenes',
          name: 'examenes',
          component: () => import('@/views/Examenes.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'investigar',
          name: 'investigar',
          component: () => import('@/views/Investigar.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'estabilizar',
          name: 'estabilizar',
          component: () => import('@/views/Estabilizar.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'diferencial',
          name: 'diferencial',
          component: () => import('@/views/Diferencial.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'intervenir',
          name: 'intervenir',
          component: () => import('@/views/Intervenir.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'externa',
          name: 'externa',
          component: () => import('@/views/Externa.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'traspaso',
          name: 'traspaso',
          component: () => import('@/views/Traspaso.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'logs',
          name: 'logs',
          component: () => import('@/views/Logs.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'resultados',
          name: 'resultados',
          component: () => import('@/views/Resultados.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'ayuda',
          name: 'ayuda',
          component: () => import('@/views/Ayuda.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        }
      ]
    },
    {
      path: '/dashboard',
      component: AppLayoutMain,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'operador', 'supervisor'] }
        },
        {
          path: 'perfil',
          name: 'perfil',
          component: () => import('@/views/Perfil.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
        },
        {
          path: 'registrar-usuario',
          name: 'registrar-usuario',
          component: () => import('@/views/RegistrarUsuario.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico'] }
        },
        {
          path: 'ver-usuarios',
          name: 'ver-usuarios',
          component: () => import('@/views/VerUsuarios.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico'] }
        },
        {
          path: 'crear-caso',
          name: 'crear-caso',
          component: () => import('@/views/CrearCaso.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico'] }
        },
        {
          path: 'ver-casos',
          name: 'ver-casos',
          component: () => import('@/views/VerCasos.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico'] }
        },
        {
          path: 'configuracion',
          name: 'configuracion',
          component: () => import('@/views/Configuracion.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico'] }
        },
        {
          path: 'test',
          name: 'test',
          component: () => import('@/views/Test.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico'] }
        },
        {
          path: 'grupos',
          name: 'grupos',
          component: () => import('@/views/Grupos.vue'),
          meta: { requiresAuth: true, roles: ['administrador', 'medico'] }
        },
        {
          path: 'ver-grupos',
          name: 'ver-grupos',
          component: () => import('@/views/GruposEstudiante.vue'),
          meta: { requiresAuth: true, roles: ['estudiante'] }
        }
      ]
    },
    {
      path: '/elegir-caso',
      component: () => import('@/views/ElegirCaso.vue'),
      meta: { requiresAuth: true, roles: ['administrador', 'medico', 'estudiante'] }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  console.log('Navigating from:', from.path, 'to:', to.path)

  if (to.name === 'login' && token) {
    return next({ path: '/dashboard' })
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      return next({ name: 'login' })
    } else {
      let user = store.state.user.user
      if (!user) {
        try {
          const response = await getUserInfo()
          user = response.data
          store.commit('user/setUser', user)
        } catch (error) {
          localStorage.removeItem('token')
          return next({ name: 'login' })
        }
      }

      if (from.path.startsWith('/app') && to.path.startsWith('/dashboard')) {
        if (store.getters['navigation/isNavigationConfirmed']) {
          store.dispatch('navigation/resetNavigation')
          return next()
        } else {
          console.log('Preventing navigation from /app to /dashboard')
          return next(false)
        }
      }

      return next()
    }
  } else {
    next()
  }
})

export default router
