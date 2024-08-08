<template>
    <Dock :model="itemsDer" position="right">
        <template #icon="{ item }">
            <a href="#"
                class="flex flex-col items-center justify-center relative overflow-hidden cursor-default w-16 h-16"
                @click="onDockItemClick($event, item)">
                <img :alt="item.label" :src="item.icon" style="width: 100%" />
            </a>
        </template>
    </Dock>
</template>

<script setup>
import { ref } from "vue";
import Dock from 'primevue/dock';

const itemsDer = ref([
    {
        label: 'DIAGNOSTICO DIFERENCIAL',
        icon: '/layout/images/investigar.png'
    },
    {
        label: 'INTERVENIR',
        icon: '/layout/images/intervenir.png'
    },
    {
        label: 'CONSULTA EXTERNA',
        icon: '/layout/images/externa.png'
    },
    {
        label: 'TRASPASO',
        icon: '/layout/images/traspaso.png'
    }
]);
</script>

<style scoped>
.dock-window {
    width: 100%;
    height: 100%;
    background-image: url("https://primefaces.org/cdn/primevue/images/dock/window.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    z-index: 1;
}

.p-dock {
    z-index: 1000;
}
</style>