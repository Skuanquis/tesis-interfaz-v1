<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();



const display = ref(false);
const router = useRouter();

const position = ref('top');

const fetchPacienteData = async () => {
    try {
        display.value = true;
    } catch (error) {

        console.error(error);
    }
};

onMounted(() => {
    fetchPacienteData();
});
//se añadio la limpieza del localstorage despues de terminar la simulacion
//si no se quiere persistencia comentar la funcion de abajo

function eliminarLocalStorage() {
    localStorage.removeItem('examenSegmentario');
    localStorage.removeItem('examenFisico');
    localStorage.removeItem('examenObstetrico');
    localStorage.removeItem('id_paciente');
    localStorage.removeItem('id_historia_clinica');
    localStorage.removeItem('minutos');
    localStorage.removeItem('segundos');
    localStorage.removeItem('isActive');
}

function closeDialog() {
    store.dispatch('navigation/confirmNavigation');
    display.value = false;
    eliminarLocalStorage();
    router.push('/dashboard');
}

function onDialogHide() {
    if (!display.value) {
        store.dispatch('navigation/confirmNavigation');
        router.push('/dashboard');
        eliminarLocalStorage();
    }
}
</script>

<template>
    <Dialog header="Resultados de la simulación" v-model:visible="display" :style="{ width: '40rem', height: '100%' }"
        :modal="true" @hide="onDialogHide" class="p-fluid" :position="position" :draggable="false">
        <div>
            <h4 class="text-center"> Tiempo Transcurrido </h4>
        </div>
        <!--
        <button @click="start">Start</button>
        <button @click="stop">Stop</button>
        <button @click="reset">Reset</button>-->
        <div class="grid ">
            <div class="col md:col-4"></div>
            <div class="col md:col-4"><Button label="Finalizar" @click="closeDialog" icon="pi pi-check" /></div>
            <div class="col md:col-4"></div>
        </div>
    </Dialog>
</template>


<style scoped>
.gestion-title {
    font-size: 2em;
    font-weight: bold;
    color: #bb86fc;
}

.total-casos {
    font-size: 1.3em;
    font-weight: bold;
    color: #e0e0e0;
}

.info-data,
.case-data {
    font-size: 1em;
    color: #fff9e3;
}

.info-data-dialog {
    font-size: 1.2em;
    color: #cfcfcf;
}

.case-data {
    font-weight: normal;
    padding-bottom: 0.5em;
}

.info-data {
    font-weight: bold;
    padding-bottom: 0.3em;
}

.month-name {
    font-size: 1.1em;
    font-weight: bold;
    color: #bb86fc;
    margin-bottom: 0.3em;
}

.datos-paciente {
    font-size: 1.4em;
    font-weight: bold;
    color: #bb86fc;
    margin-bottom: 0.3em;
}

.data-section {
    padding: 2px 0;
    border-bottom: 1px solid #444;
    margin: 0 10px;
}

.data-section:last-child {
    border-bottom: none;
}

h5 {
    margin: 0;
    padding: 2px 0;
}

.data-text {
    font-size: 0.85em;
    color: #b0b0b0;
}

.card-mes:hover {
    background-color: #333;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
</style>