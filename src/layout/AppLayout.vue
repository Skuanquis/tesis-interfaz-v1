<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LeftBar from './AppLeftBar.vue';
import RightBar from './AppRightBar.vue';
import BottomBar from './AppBottomBar.vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { obtenerMensaje } from '@/services/simulacionService';

const store = useStore();
const containerClass = computed(() => {
    return {
        'layout-full': true
    };
});

const toast = useToast();
const checkNotificationInterval = ref(null);

const mensajes = ref([]);

const mensajesMostrados = ref(new Set());

const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = '';
};

function checkTimeForNotification() {
    const minutos = parseInt(localStorage.getItem('minutos'), 10) || 0;
    const segundos = parseInt(localStorage.getItem('segundos'), 10) || 0;

    const tiempoActualEnSegundos = minutos * 60 + segundos;

    if (Array.isArray(mensajes.value)) {
        mensajes.value.forEach((mensaje) => {
            if (!mensajesMostrados.value.has(mensaje.id_mensajes_simulacion)) {
                const [minutosMensaje, segundosMensaje] = mensaje.tiempo_mensaje.split(':').map(Number);
                const tiempoMensajeEnSegundos = minutosMensaje * 60 + segundosMensaje;

                if (tiempoActualEnSegundos === tiempoMensajeEnSegundos) {
                    toast.add({
                        severity: 'info',
                        summary: mensaje.titulo,
                        detail: mensaje.descripcion,
                        life: 8000,
                    });

                    mensajesMostrados.value.add(mensaje.id_mensajes_simulacion);
                }
            }
        });
    } else {
        console.error('mensajes.value is not an array:', mensajes.value);
    }
}

onMounted(async () => {
    const isActive = JSON.parse(localStorage.getItem('isActive'));
    if (isActive) {
        store.dispatch('timer/resumeTimer');
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    const id_caso_clinico = localStorage.getItem('id_historia_clinica');
    try {
        const response = await obtenerMensaje(id_caso_clinico);
        //console.log('API response:', response.data); 
        mensajes.value = response.data;
    } catch (error) {
        console.error('Error fetching mensajes:', error);
    }

    checkTimeForNotification();
    checkNotificationInterval.value = setInterval(() => {
        checkTimeForNotification();
    }, 1000);
});

onUnmounted(() => {
    if (checkNotificationInterval.value) {
        clearInterval(checkNotificationInterval.value);
    }
    window.removeEventListener('beforeunload', handleBeforeUnload);
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
