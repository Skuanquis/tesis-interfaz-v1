<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const display = ref(false);
const router = useRouter();

onMounted(() => {
    openDialog();
});

function openDialog() {
    display.value = true;
}

function closeDialog() {
    display.value = false;
    router.push('/');
}

function onDialogHide() {
    if (!display.value) {
        router.push('/');
    }
}
</script>

<template>
    <Dialog header="Paciente" v-model:visible="display" :style="{ width: '45vw' }" :modal="true" @hide="onDialogHide"
        class="p-fluid">
        <h5 class="text-center datos-paciente">Datos del Paciente</h5>
        <div class="data-wrapper">
            <div class="data-section">
                <div class="grid">
                    <div class="col md:col-6">
                        <h5 class="info-data-dialog">Nombre: Sandra Ximena</h5>
                        <h5 class="info-data-dialog">Apellido Paterno: Ramos</h5>
                        <h5 class="info-data-dialog">Apellido Materno: Mamani</h5>
                    </div>
                    <div class="col md:col-6">
                        <h5 class="info-data-dialog">CI: 8427813</h5>
                        <h5 class="info-data-dialog">HC: 200963</h5>
                    </div>
                </div>
            </div>
            <div class="data-section">
                <p class="text-lg">Paciente de 28 años de edad, estado civil unión estable, ocupación estudiantem nivel
                    socioeconomico
                    medio residente de Sub-Yungas Chulumani, procendente de la ciudad de La Paz</p>
            </div>
            <div class="data-section">
                <h5 class="info-data-dialog">Antecedentes Gineco Obstetricos</h5>
                <div class="grid">
                    <div class="col md:col-6">
                        <h5 class="case-data"><strong>Menarca:</strong> 15 años</h5>
                        <h5 class="case-data"><strong>FUM: </strong>15.12.22</h5>
                        <h5 class="case-data"><strong>FPP: </strong>21.04.22</h5>
                        <h5 class="case-data"><strong>CPN: </strong>Realizo 8 controles prenatales en el Hospital de
                            Chulumani</h5>
                    </div>
                    <div class="col md:col-6">
                        <h5 class="case-data"><strong>G: </strong>0</h5>
                        <h5 class="case-data"><strong>P: </strong>0</h5>
                        <h5 class="case-data"><strong>AB: </strong>0</h5>
                        <h5 class="case-data"><strong>C: </strong>0</h5>
                    </div>
                </div>
            </div>
            <div class="data-section">
                <h5 class="info-data-dialog">Antecedentes Patológicos</h5>
                <div class="grid">
                    <div class="col md:col-6">
                        <h5 class="case-data"><strong>APP:</strong> No refiere</h5>
                        <h5 class="case-data"><strong>AFP:</strong> No refiere</h5>
                    </div>
                    <div class="col md:col-6">
                        <h5 class="case-data"><strong>Alergias:</strong> Refiere alergias a productos lacteos</h5>
                        <h5 class="case-data"><strong>Cirugias:</strong> No refiere</h5>
                    </div>
                </div>
            </div>
            <div class="data-section">
                <h5 class="info-data-dialog">Examen Físico General</h5>
                <div class="grid">
                    <div class="col md:col-6">
                        <h5 class="case-data"><strong>PA:</strong> 120/80mmhg</h5>
                        <h5 class="case-data"><strong>FC:</strong> 751pm</h5>
                        <h5 class="case-data"><strong>FR:</strong> 20rpm</h5>
                        <h5 class="case-data"><strong>T:</strong> 36.5°C</h5>
                    </div>
                    <div class="col md:col-6">
                        <h5 class="case-data"><strong>SatO2:</strong> 90%</h5>
                        <h5 class="case-data"><strong>Peso:</strong> 82.5kg</h5>
                        <h5 class="case-data"><strong>Talla:</strong> 1.60mts</h5>
                        <h5 class="case-data"><strong>IMC:</strong> 32.1kg/m2</h5>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Ok" @click="closeDialog" icon="pi pi-check" />
        </template>
    </Dialog>
</template>

<style scoped>
.gestion-title {
    font-size: 2em;
    font-weight: bold;
    color: #3f51b5;
}

.total-casos {
    font-size: 1.3em;
    font-weight: bold;
    color: #333;
}

.info-data,
.case-data {
    font-size: 1em;
    color: #666;
}

.info-data-dialog {
    font-size: 1.2em;
    color: #666;
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
    color: #3f51b5;
    margin-bottom: 0.3em;
}

.datos-paciente {
    font-size: 1.4em;
    font-weight: bold;
    color: #3f51b5;
    margin-bottom: 0.3em;
}

.data-section {
    padding: 2px 0;
    border-bottom: 1px solid #ccc;
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
    color: #555;
}

.card-mes:hover {
    background-color: #f8f9fa;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
