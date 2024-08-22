<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getInfoHistoria } from '@/services/historiaService';

const display = ref(false);
const router = useRouter();
const toast = useToast();
const paciente = ref(null);

const fetchPacienteData = async () => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.error('ID de historia clínica no encontrado en el localStorage');
        return;
    }
    try {
        const response = await getInfoHistoria(id_historia_clinica);
        paciente.value = response.data[0];
        display.value = true;
    } catch (error) {
        toast.error('Error al cargar los datos del paciente');
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
    <Dialog header="Paciente" v-model:visible="display" :style="{ width: '45vw' }" :modal="true" @hide="onDialogHide"
        class="p-fluid">
        <template v-if="paciente">
            <h5 class="text-center datos-paciente">Datos del Paciente</h5>
            <div class="data-wrapper">
                <div class="data-section">
                    <div class="grid">
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Nombre: </strong>{{ paciente.nombre.toUpperCase() }}
                            </h5>
                            <h5 class="case-data text-lg"><strong>Apellido Paterno: </strong>{{
                                paciente.paterno.toUpperCase() }}
                            </h5>
                            <h5 class="case-data text-lg"><strong>Apellido Materno: </strong>{{
                                paciente.materno.toUpperCase() }}
                            </h5>
                        </div>
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>CI: </strong>{{ paciente.ci }}</h5>
                            <h5 class="case-data text-lg"><strong>Edad: </strong>{{ paciente.edad }} años</h5>
                        </div>
                    </div>
                </div>
                <div class="data-section">
                    <p class="text-lg text-justify">{{ paciente.descripcion }}</p>
                </div>
                <div class="data-section">
                    <h5 class="info-data-dialog text-lg">Antecedentes Gineco Obstetricos</h5>
                    <div class="grid">
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Menarca:</strong> {{ paciente.menarca }}</h5>
                            <h5 class="case-data text-lg"><strong>FUM: </strong>{{ new
                                Date(paciente.fum).toLocaleDateString() }}</h5>
                            <h5 class="case-data text-lg"><strong>FPP: </strong>{{ new
                                Date(paciente.fpp).toLocaleDateString() }}</h5>
                            <h5 class="case-data text-lg"><strong>CPN: </strong>{{ paciente.cpn }}</h5>
                        </div>
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>G: </strong>{{ paciente.gestaciones }}</h5>
                            <h5 class="case-data text-lg"><strong>P: </strong>{{ paciente.partos }}</h5>
                            <h5 class="case-data text-lg"><strong>AB: </strong>{{ paciente.abortos }}</h5>
                            <h5 class="case-data text-lg"><strong>C: </strong>{{ paciente.cesarias }}</h5>
                        </div>
                    </div>
                </div>
                <div class="data-section">
                    <h5 class="info-data-dialog text-lg">Antecedentes Patológicos</h5>
                    <div class="grid">
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>APP:</strong> {{ paciente.app }}</h5>
                            <h5 class="case-data text-lg"><strong>AFP:</strong> {{ paciente.afp }}</h5>
                        </div>
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Alergias:</strong> {{ paciente.alergias }}</h5>
                            <h5 class="case-data text-lg"><strong>Cirugias:</strong> {{ paciente.cirugias }}</h5>
                        </div>
                    </div>
                </div>
                <div class="data-section">
                    <h5 class="info-data-dialog text-lg">Motivo de Consulta</h5>
                    <div class="grid">
                        <div class="col md:col-12">
                            <h5 class="case-data text-lg">{{ paciente.motivo }}</h5>
                        </div>
                    </div>
                </div>
                <div class="data-section">
                    <h5 class="info-data-dialog text-lg">Historia de la enfermedad actual</h5>
                    <p class="text-lg text-justify">{{ paciente.historia_enfermedad_actual }}</p>
                </div>
            </div>
            <div class="grid ">
                <div class="col md:col-3"></div>
                <div class="col md:col-3"></div>
                <div class="col md:col-3"></div>
                <div class="col md:col-3">
                    <Button label="Ok" @click="closeDialog" icon="pi pi-check" />
                </div>
            </div>
        </template>
        <template v-else>
            <h4 class="text-center">No hay datos disponibles de la histria clínica.</h4>
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