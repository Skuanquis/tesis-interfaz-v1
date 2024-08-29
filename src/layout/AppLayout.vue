<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LeftBar from './AppLeftBar.vue';
import RightBar from './AppRightBar.vue';
import BottomBar from './AppBottomBar.vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import ThreeScene from './ThreeScene.vue';

const store = useStore();
const containerClass = computed(() => {
    return {
        'layout-full': true
    };
});

//se añadio esto
const toast = useToast();
const checkNotificationInterval = ref(null);

function checkTimeForNotification() {
    const minutos = parseInt(localStorage.getItem('minutos'), 10) || 0;
    const segundos = parseInt(localStorage.getItem('segundos'), 10) || 0;

    if (minutos === 1 && segundos === 0) {
        toast.add({
            severity: 'info',
            summary: 'Tomate tu tiempo chokito',
            detail: `Has alcanzado los 1 minutos.`,
            life: 8000,
        });
    }

    if (minutos === 2 && segundos === 0) {
        toast.add({
            severity: 'warn',
            summary: 'No wachees con el caso hijita',
            detail: `Has alcanzado los 2 minutos.`,
            life: 8000,
        });
    }

    if (minutos === 3 && segundos === 0) {
        toast.add({
            severity: 'error',
            summary: 'Ya KAGASTE',
            detail: `Has alcanzado los 3 minutos.`,
            life: 8000,
        });
    }

    // Puedes agregar más condiciones aquí para 10, 15 minutos, etc.
}


onMounted(() => {
    const isActive = JSON.parse(localStorage.getItem('isActive'));
    if (isActive) {
        store.dispatch('timer/resumeTimer');
    }

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    onUnmounted(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    //aqui cambio
    checkTimeForNotification();
    checkNotificationInterval.value = setInterval(() => {
        checkTimeForNotification();
    }, 60000);


});




</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <div class="layout-sidebar-left">
            <LeftBar />
        </div>
        <div class="layout-main-container-scene">
            <div class="layout-main">
                <!--<ThreeScene />-->
                <router-view />
                <BottomBar />
            </div>
        </div>
        <div class="layout-sidebar-right">
            <RightBar />
        </div>
        <ConfirmDialog />
        <!--eliminar toast si trae error xD-->
        <Toast />
    </div>
</template>

<style scoped>
.layout-wrapper {
    display: flex;
    height: 100vh;
}

/*Modificar aqui para cambiar el dock*/
.layout-sidebar-left,
.layout-sidebar-right {
    width: 0;
    background-color: #f4f4f4;
}

.layout-main-container-scene {
    flex: 1;
    overflow: auto;
}

.layout-main {
    padding: 0px;
}
</style>
