<script setup>
import { computed } from 'vue';
import LeftBar from './AppLeftBar.vue';
import RightBar from './AppRightBar.vue';

const containerClass = computed(() => {
    return {
        'layout-full': true
    };
});
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <div class="layout-sidebar-left">
            <LeftBar />
        </div>
        <div class="layout-main-container">
            <div class="layout-main">

                <router-view />
            </div>
        </div>
        <div class="layout-sidebar-right">
            <RightBar />
        </div>
    </div>
</template>

<style scoped>
.layout-wrapper {
    display: flex;
    height: 100vh;
}

.layout-sidebar-left,
.layout-sidebar-right {
    width: 10vw;
    /* Ajusta el ancho según necesites */
    background-color: #f4f4f4;
    /* Color de fondo de las barras laterales */
}

.layout-main-container {
    flex: 1;
    overflow: auto;
}

.layout-main {
    padding: 20px;
    /* Espacio interior para el contenido principal */
}
</style>
