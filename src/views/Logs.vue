<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();

const minutos = computed(() => store.state.timer.minutos);
const segundos = computed(() => store.state.timer.segundos);
//const isActive = computed(() => store.state.timer.isActive);

const formattedTime = computed(() => {
    return `${minutos.value}:${segundos.value < 10 ? '0' + segundos.value : segundos.value}`;
});

/*
function start() {
    if (!isActive.value) {
        store.dispatch('timer/startTimer');
    }
}

function stop() {
    if (isActive.value) {
        store.dispatch('timer/stopTimer');
    }
}

function reset() {
    store.dispatch('timer/resetTimer');
}*/

//import { useToast } from 'primevue/usetoast';
//import { getInfoHistoria } from '@/services/historiaService';

const display = ref(false);
const router = useRouter();
//const toast = useToast();

const position = ref('bottom');

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

function closeDialog() {
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
        router.push('/app');
    }
}
</script>

<template>
    <Dialog header="Historial de la simulación" v-model:visible="display" :style="{ width: '40rem', height: '100%' }"
        :modal="true" @hide="onDialogHide" class="p-fluid" :position="position" :draggable="false">
        <div>
            <h4 class="text-center"> Tiempo Transcurrido </h4>
        </div>
        <div>
            <h1 class="text-center"> {{ formattedTime }} </h1>
        </div>
        <!--
        <button @click="start">Start</button>
        <button @click="stop">Stop</button>
        <button @click="reset">Reset</button>-->
        <div class="grid ">
            <div class="col md:col-3"></div>
            <div class="col md:col-3"></div>
            <div class="col md:col-3"></div>
            <div class="col md:col-3">
                <Button label="Ok" @click="closeDialog" icon="pi pi-check" />
            </div>
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