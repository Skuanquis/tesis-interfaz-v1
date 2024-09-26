<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
//import { useToast } from 'primevue/usetoast';

const display = ref(true);
const router = useRouter();
const position = ref('right');
//const toast = useToast();


function closeDialog() {
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
        router.push('/app');
    }
}
const dagnostico = ref('');
</script>

<template>
    <Dialog header="Traspaso" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">

        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">¿Cuál es el siguiente paso para el paciente?</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
            <div class="flex-wrap gap-3">
                <div class="flex items-center pt-3">
                    <RadioButton v-model="dagnostico" inputId="dagnostico1" name="pizza" value="Cheese" />
                    <label for="dagnostico1" class="ml-2 pl-2 text-lg">Ingresar al paciente a la Unidad de Terapia
                        Intensiva</label>
                </div>
                <div class="flex items-center pt-3">
                    <RadioButton v-model="dagnostico" inputId="dagnostico2" name="pizza" value="Mushroom" />
                    <label for="dagnostico2" class="ml-2 pl-2 text-lg">Ingresar al paciente a una habitación de
                        hospitalización
                        general </label>
                </div>
                <div class="flex items-center pt-3">
                    <RadioButton v-model="dagnostico" inputId="dagnostico3" name="pizza" value="Pepper" />
                    <label for="dagnostico3" class="ml-2 pl-2 text-lg">Preparar al paciente para una cirugía</label>
                </div>
            </div>
        </div>

        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo pt-3">¿Cual es tu diagnostico final?</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>

        <div class="grid pt-4">
            <div class="col md:col-9"></div>
            <div class="col md:col-3">
                <Button label="Ok" @click="closeDialog" />
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

.examen-titulo {
    color: #bb86fc;
}

.data-section-main {
    padding: 2px 0;
    border-bottom: 1px solid #444;
}
</style>