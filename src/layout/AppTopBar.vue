<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { getUserInfo } from '@/services/userService';


const { onMenuToggle } = useLayout();
const usuario = ref('');
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

const info = async () => {
    try {
        const response = await getUserInfo();
        usuario.value = response.data;
        //console.log(usuario.value)
    } catch (error) {
        console.error('Error fetching user info:', error);
        localStorage.removeItem('token');
    }
};

onMounted(() => {
    bindOutsideClickListener();
    info();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
/*
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});*/

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/dashboard" class="layout-topbar-logo">

            <img src="/logo.png" height="450" alt="logo" class="pr-3" />
            <span>Simulador Médico</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">

        </button>
        <div class="layout-topbar-menu mt-2">
            <h5 v-if="usuario && usuario.nombre && usuario.paterno && usuario.materno">
                {{ usuario.nombre.toUpperCase() + " " + usuario.paterno.toUpperCase() + " " +
                    usuario.materno.toUpperCase() }}
            </h5>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
