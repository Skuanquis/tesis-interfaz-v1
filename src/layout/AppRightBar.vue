<template>
    <Dock :model="itemsDer" position="right">
        <template #icon="{ item }">
            <div class="flex flex-col items-center justify-center relative overflow-hidden cursor-pointer w-16 h-16"
                @click="onDockItemClick(item)" @keydown.enter="onDockItemClick(item)">
                <img :alt="item.label" :src="item.icon" style="width: 100%" />
            </div>
        </template>
    </Dock>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import Dock from 'primevue/dock';

const itemsDer = ref([
    {
        label: 'INVESTIGAR',
        icon: '/layout/images/investigar.png',
        routeName: 'investigar'
    },
    {
        label: 'INTERVENIR',
        icon: '/layout/images/intervenir.png',
        routeName: 'intervenir'
    },
    {
        label: 'CONSULTA EXTERNA',
        icon: '/layout/images/externa.png',
        routeName: 'externa'
    },
    {
        label: 'TRASPASO',
        icon: '/layout/images/traspaso.png',
        routeName: 'traspaso'
    }
]);

const router = useRouter();

function onDockItemClick(item) {
    if (item.routeName) {
        router.push({ name: item.routeName });
    }
}
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