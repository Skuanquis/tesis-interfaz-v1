<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getExamenFisicoGeneral, getExamenFisicoSegmentario, getExamenObstetrico } from '@/services/historiaService';

const display = ref(true);
const router = useRouter();
const toast = useToast();
const examenFisico = ref(null);
const examenSegmentario = ref(null);
const examenObstetrico = ref(null);

const fetchExamenFisicoGeneral = async () => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.error('ID de historia clínica no encontrado en el localStorage');
        return;
    }
    try {
        const response = await getExamenFisicoGeneral(id_historia_clinica);
        examenFisico.value = response.data[0];
    } catch (error) {
        toast.error('Error al cargar los datos del paciente');
        console.error(error);
    }
};

const fetchExamenFisicoSegmentario = async () => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.error('ID de historia clínica no encontrado en el localStorage');
        return;
    }
    try {
        const response = await getExamenFisicoSegmentario(id_historia_clinica);
        examenSegmentario.value = response.data[0];
    } catch (error) {
        toast.error('Error al cargar los datos del paciente');
        console.error(error);
    }
};

const fetchExamenObstetrico = async () => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.error('ID de historia clínica no encontrado en el localStorage');
        return;
    }
    try {
        const response = await getExamenObstetrico(id_historia_clinica);
        examenObstetrico.value = response.data[0];
    } catch (error) {
        toast.error('Error al cargar los datos del paciente');
        console.error(error);
    }
};

onMounted(() => {
    fetchExamenFisicoGeneral();
    fetchExamenFisicoSegmentario();
    fetchExamenObstetrico();
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
    <Dialog header="Exámenes" v-model:visible="display" :style="{ width: '45vw' }" :modal="true" @hide="onDialogHide"
        class="p-fluid">
        <h5 class="text-center datos-paciente">Examenes Disponibles</h5>
        <template v-if="examenFisico">
            <Accordion>
                <AccordionTab header="Realizar Examen Físico General">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <h5 class="case-data">{{ examenFisico.descripcion }}</h5>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>PA:</strong> {{ examenFisico.pa }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>FC:</strong> {{ examenFisico.fc }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>FR:</strong> {{ examenFisico.fr }}</p>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Temperatura:</strong> {{ examenFisico.temperatura }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Saturación:</strong> {{ examenFisico.saturacion }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Peso:</strong> {{ examenFisico.peso }}</p>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Talla:</strong> {{ examenFisico.talla }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>IMC:</strong> {{ examenFisico.imc }}</p>
                                </div>
                                <div class="col md:col-4">
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </template>
        <template v-if="examenSegmentario">
            <Accordion class="pt-4">
                <AccordionTab header="Realizar Examen Físico Segmentario">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Cabeza: </h5>
                                    <p class="text-justify">{{ examenSegmentario.cabeza }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Cuello: </h5>
                                    <p class="text-justify">{{ examenSegmentario.cuello }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Torax: </h5>
                                    <p class="text-justify">{{ examenSegmentario.torax }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Corazon: </h5>
                                    <p class="text-justify">{{ examenSegmentario.corazon }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Mamas: </h5>
                                    <p class="text-justify">{{ examenSegmentario.mamas }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Abdomen: </h5>
                                    <p class="text-justify">{{ examenSegmentario.abdomen }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Genitourinario: </h5>
                                    <p class="text-justify">{{ examenSegmentario.genitourinario }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Extremidades: </h5>
                                    <p class="text-justify">{{ examenSegmentario.extremidades }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5 class="info-data-dialog">Neurologico: </h5>
                                    <p class="text-justify">{{ examenSegmentario.neurologico }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </template>
        <template v-if="examenObstetrico">
            <Accordion class="pt-4">
                <AccordionTab header="Realizar Examen Obstétrico">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Situación:</strong> {{ examenObstetrico.situacion }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Presentación:</strong> {{ examenObstetrico.presentacion }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Dorso:</strong> {{ examenObstetrico.dorso }}</p>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>AFU:</strong> {{ examenObstetrico.afu }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>FCF:</strong> {{ examenObstetrico.fcf }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>PAF:</strong> {{ examenObstetrico.paf }}</p>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Monitorización:</strong> {{ examenObstetrico.monitorizacion }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Dilatación:</strong> {{ examenObstetrico.dilatacion }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Borramiento:</strong> {{ examenObstetrico.borramiento }}</p>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Membranas:</strong> {{ examenObstetrico.membranas }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Plano:</strong> {{ examenObstetrico.plano }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>AU:</strong> {{ examenObstetrico.au }}</p>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Pelvis:</strong> {{ examenObstetrico.pelvis }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>VP:</strong> {{ examenObstetrico.vp }}</p>
                                </div>
                                <div class="col md:col-4"></div>
                            </div>
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>
        </template>
        <div class="grid pt-4">
            <div class="col md:col-9"></div>
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
    font-size: 1.1em;
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