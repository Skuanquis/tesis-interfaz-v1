<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getUserInfo } from '@/services/userService';
import AppMenuItem from './AppMenuItem.vue';

const modelPasante = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/dashboard/perfil' }
        ]
    },
    {
        label: 'Acciones',
        items: [
            { label: 'Registrar Atención', icon: 'pi pi-fw pi-pencil', to: '/dashboard/registrar-atencion' },
            { label: 'Ver Atenciones', icon: 'pi pi-fw pi-book', to: '/dashboard/ver-atenciones' },
            { label: 'Actividades Asignadas', icon: 'pi pi-fw pi-file-edit', to: '/dashboard/ver-actividades' },
            { label: 'Preguntas Frecuentes', icon: 'pi pi-fw pi-question-circle', to: '/dashboard/preguntas-frecuentes' },
            { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => cerrarSesion() }
        ]
    }
];

const modelAdminitrador = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/dashboard/perfil' }
        ]
    },
    {
        label: 'Acciones',
        items: [
            //{ label: 'Reportes', icon: 'pi pi-fw pi-file', to: '/dashboard/reportes' },
            { label: 'Registrar Usuario', icon: 'pi pi-fw pi-user-plus', to: '/dashboard/registrar-usuario' },
            { label: 'Ver Usuarios', icon: 'pi pi-fw pi-users', to: '/dashboard/ver-usuarios' },
            //{ label: 'Asignar Actividad', icon: 'pi pi-fw pi-plus', to: '/dashboard/actividades' },
            //{ label: 'OVT en Números', icon: 'pi pi-fw pi-database', to: '/dashboard/numeros' },
            { label: 'Ver Casos', icon: 'pi pi-fs pi-eye', to: '/dashboard/ver-casos' },
            { label: 'Pruebita Crud', icon: 'pi pi-fs pi-eye', to: '/dashboard/test' },
            { label: 'Crear Caso', icon: 'pi pi-fs pi-plus', to: '/dashboard/crear-caso' },
            { label: 'Iniciar Simulación', icon: 'pi pi-fs pi-play', to: '/elegir-caso' },
            { label: 'Configuración', icon: 'pi pi-fs pi-cog', to: '/dashboard/configuracion' },
            { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => cerrarSesion() }
        ]
    }
];

const modelSupervisor = [
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/dashboard/perfil' }
        ]
    },
    {
        label: 'Acciones',
        items: [
            { label: 'Registrar Atención', icon: 'pi pi-fw pi-pencil', to: '/dashboard/registrar-atencion' },
            { label: 'Ver Atenciones', icon: 'pi pi-fw pi-book', to: '/dashboard/ver-atenciones' },
            { label: 'Asignar Actividad', icon: 'pi pi-fw pi-plus', to: '/dashboard/actividades' },
            { label: 'Actividades Asignadas', icon: 'pi pi-fw pi-file-edit', to: '/dashboard/ver-actividades' },
            { label: 'Preguntas Frecuentes', icon: 'pi pi-fw pi-question-circle', to: '/dashboard/preguntas-frecuentes' },
            { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => cerrarSesion() }
        ]
    }
];

const model = ref([]);
const router = useRouter();
const store = useStore();

const cerrarSesion = () => {
    localStorage.removeItem('token');
    store.commit('user/clearUser');
    router.push('/');
};

const loadUserInfo = async () => {
    try {
        const response = await getUserInfo();
        const user = response.data;
        store.commit('user/setUser', user);
        updateMenu(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        localStorage.removeItem('token');
        router.push('/');
    }
};

const updateMenu = (user) => {
    if (user.rol === 'administrador') {
        model.value = modelAdminitrador;
    } else if (user.rol === 'operador') {
        model.value = modelPasante;
    } else if (user.rol === 'supervisor') {
        model.value = modelSupervisor;
    }
};

watch(() => store.state.user, (newUser) => {
    if (newUser) {
        updateMenu(newUser);
    }
});

onMounted(() => {
    loadUserInfo();
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
