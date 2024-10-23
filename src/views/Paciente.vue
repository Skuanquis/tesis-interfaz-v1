<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getInfoHistoria } from '@/services/historiaService';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import {
    getAnamnesisCardiovascular, getAnamnesisEndocrino,
    getAnamnesisGastrointestinal, getAnamnesisGenitourinario, getAnamnesisHematico,
    getAnamnesisLocomotor, getAnamnesisNeurologico, getAnamnesisPsiquiatrico,
    getAnamnesisRespiratorio, getAnamnesisTegumentario
} from '@/services/historiaService';

import { registrarAccion } from '@/services/simulacionService';
const store = useStore();

const display = ref(false);
const router = useRouter();
const toast = useToast();
const paciente = ref(null);
const position = ref('left');

const loadingGeneral = ref(false);

const loadingCardiovascular = ref(false);
const loadingEndocrino = ref(false);
const loadingGastrointestinal = ref(false);
const loadingGenitourinario = ref(false);
const loadingHematico = ref(false);
const loadingLocomotor = ref(false);
const loadingNeurologico = ref(false);
const loadingPsiquiatrico = ref(false);
const loadingRespiratorio = ref(false);
const loadingTegumentario = ref(false);

const anamnesisCardiovascular = ref(store.getters['anamnesis/anamnesisCardiovascular']);
const anamnesisEndocrino = ref(store.getters['anamnesis/anamnesisEndocrino']);
const anamnesisGastrointestinal = ref(store.getters['anamnesis/anamnesisGastrointestinal']);
const anamnesisGenitourinario = ref(store.getters['anamnesis/anamnesisGenitourinario']);
const anamnesisHematico = ref(store.getters['anamnesis/anamnesisHematico']);
const anamnesisLocomotor = ref(store.getters['anamnesis/anamnesisLocomotor']);
const anamnesisNeurologico = ref(store.getters['anamnesis/anamnesisNeurologico']);
const anamnesisPsiquiatrico = ref(store.getters['anamnesis/anamnesisPsiquiatrico']);
const anamnesisRespiratorio = ref(store.getters['anamnesis/anamnesisRespiratorio']);
const anamnesisTegumentario = ref(store.getters['anamnesis/anamnesisTegumentario']);

const id_simulacion = localStorage.getItem('id_simulacion');

const registrarAccionSimulacion = async (descripcion, rubrica, puntaje, retroalimentacion, section) => {
    try {
        const accionData = {
            id_simulacion: id_simulacion,
            descripcion: descripcion,
            tipo_accion: rubrica,
            puntaje: puntaje,
            retroalimentacion: retroalimentacion
        };
        await registrarAccion(accionData);
        toast.add({ severity: 'info', summary: `Examen ${section} realizado.`, detail: `${accionData.retroalimentacion}`, life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la acción', life: 3000 });
        console.error('Error al registrar la acción:', error);
    }
};

const fetchPacienteData = async (type, section = null) => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontro el id de la historia clinica', life: 3000 });
        return;
    }
    try {
        const response = await getInfoHistoria(id_historia_clinica);
        paciente.value = response.data[0];
        display.value = true;

        let responseAnamnesis;
        console.log(`Fetching data for type: ${type}, section: ${section}`);

        if (type === 'anamnesis' && section) {
            let loadingRef;
            let anamnesisRef;
            switch (section) {
                case 'cardiovascular':
                    loadingRef = loadingCardiovascular;
                    anamnesisRef = anamnesisCardiovascular;
                    responseAnamnesis = await getAnamnesisCardiovascular(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis cardiovascular', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_cardiovascular, section);
                    break;
                case 'endocrino':
                    loadingRef = loadingEndocrino;
                    anamnesisRef = anamnesisEndocrino;
                    responseAnamnesis = await getAnamnesisEndocrino(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema endocrino', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_endocrino, section);
                    break;
                case 'gastrointestinal':
                    loadingRef = loadingGastrointestinal;
                    anamnesisRef = anamnesisGastrointestinal;
                    responseAnamnesis = await getAnamnesisGastrointestinal(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis gastrointestinal', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_gastrointestinal, section);
                    break;
                case 'genitourinario':
                    loadingRef = loadingGenitourinario;
                    anamnesisRef = anamnesisGenitourinario;
                    responseAnamnesis = await getAnamnesisGenitourinario(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema genitourinario', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_genitourinario, section);
                    break;
                case 'hematico':
                    loadingRef = loadingHematico;
                    anamnesisRef = anamnesisHematico;
                    responseAnamnesis = await getAnamnesisHematico(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema hematico', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_hematico, section);
                    break;
                case 'locomotor':
                    loadingRef = loadingLocomotor;
                    anamnesisRef = anamnesisLocomotor;
                    responseAnamnesis = await getAnamnesisLocomotor(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema locomotor', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_locomotor, section);
                    break;
                case 'neurologico':
                    loadingRef = loadingNeurologico;
                    anamnesisRef = anamnesisNeurologico;
                    responseAnamnesis = await getAnamnesisNeurologico(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema neurologico', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_neurologico, section);
                    break;
                case 'psiquiatrico':
                    loadingRef = loadingPsiquiatrico;
                    anamnesisRef = anamnesisPsiquiatrico;
                    responseAnamnesis = await getAnamnesisPsiquiatrico(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema psiquiatrico', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_psiquiatrico, section);
                    break;
                case 'respiratorio':
                    loadingRef = loadingRespiratorio;
                    anamnesisRef = anamnesisRespiratorio;
                    responseAnamnesis = await getAnamnesisRespiratorio(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema respiratorio', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_respiratorio, section);
                    break;
                case 'tegumentario':
                    loadingRef = loadingTegumentario;
                    anamnesisRef = anamnesisTegumentario;
                    responseAnamnesis = await getAnamnesisTegumentario(id_historia_clinica);
                    await registrarAccionSimulacion('Se  realizo la anamnesis del sistema tegumentario', responseAnamnesis.data[0].rubrica, responseAnamnesis.data[0].codigo, responseAnamnesis.data[0].feed_tegumentario, section);
                    break;
                default:
                    throw new Error('Sección no válida');
            }

            loadingRef.value = true;
            setTimeout(() => {
                anamnesisRef.value = responseAnamnesis.data[0];
                store.dispatch(`anamnesis/saveAnamnesis${section.charAt(0).toUpperCase() + section.slice(1)}`, anamnesisRef.value);
                loadingRef.value = false;
                console.log(`${section} segmentario data:`, anamnesisRef.value);
            }, 2000);

        }

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la información del paciente', life: 3000 });
        console.error(error);
        loadingGeneral.value = loadingCardiovascular.value = loadingEndocrino.value =
            loadingGastrointestinal.value = loadingGenitourinario.value = loadingHematico.value =
            loadingLocomotor.value = loadingNeurologico.value = loadingPsiquiatrico.value =
            loadingPsiquiatrico.value = loadingTegumentario.value = false;
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
    <Dialog header="Paciente" v-model:visible="display" :style="{ width: '40rem', height: '100%' }" :modal="true"
        @hide="onDialogHide" class="p-fluid" :position="position" :draggable="false">
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
                            <h5 class="case-data text-lg"><strong>Edad: </strong>{{ paciente.edad }} años</h5>
                            <h5 class="case-data text-lg"><strong>Peso: </strong>{{ paciente.peso }} Kg.</h5>
                            <h5 class="case-data text-lg"><strong>Talla: </strong>{{ paciente.talla }} m.</h5>
                            <h5 class="case-data text-lg"><strong>Ocupación: </strong>{{ paciente.ocupacion }} </h5>
                        </div>
                    </div>
                </div>
                <div class="data-section">
                    <p class="text-lg text-justify">{{ paciente.descripcion }}</p>
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
                <div v-if="paciente.sexo === 'femenino'" class="data-section">
                    <h5 class="info-data-dialog text-lg">Antecedentes Gineco Obstetricos</h5>
                    <div class="grid">
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Menarca:</strong> {{ paciente.menarca }}</h5>
                            <h5 class="case-data text-lg"><strong>FUM:</strong> {{ new
                                Date(paciente.fum).toLocaleDateString() }}</h5>
                            <h5 class="case-data text-lg"><strong>FPP:</strong> {{ new
                                Date(paciente.fpp).toLocaleDateString() }}</h5>
                            <h5 class="case-data text-lg"><strong>CPN:</strong> {{ paciente.cpn }}</h5>
                        </div>
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>G:</strong> {{ paciente.gestaciones }}</h5>
                            <h5 class="case-data text-lg"><strong>P:</strong> {{ paciente.partos }}</h5>
                            <h5 class="case-data text-lg"><strong>AB:</strong> {{ paciente.abortos }}</h5>
                            <h5 class="case-data text-lg"><strong>C:</strong> {{ paciente.cesarias }}</h5>
                        </div>
                    </div>
                </div>
                <div class="data-section">
                    <h5 class="info-data-dialog text-lg">Antecedentes Patológicos</h5>
                    <div class="grid">
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Alergias:</strong> {{ paciente.alergias }}</h5>
                            <h5 class="case-data text-lg"><strong>Cirugias:</strong> {{ paciente.cirugias }}</h5>
                            <h5 class="case-data text-lg"><strong>Traumatismos:</strong> {{ paciente.traumas }}</h5>
                            <h5 class="case-data text-lg"><strong>Intoxicaciones:</strong> {{ paciente.intoxicaciones }}
                            </h5>
                            <h5 class="case-data text-lg"><strong>Hospitalizaciones:</strong> {{
                                paciente.hospitalizaciones }}</h5>
                            <h5 class="case-data text-lg"><strong>Enfermedades:</strong> {{ paciente.enfermedades }}
                            </h5>
                            <h5 class="case-data text-lg"><strong>Patologia Asociada:</strong> {{
                                paciente.patologia_asociada }}</h5>
                        </div>
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Enfermedades Congenitas:</strong> {{
                                paciente.enfermedades_congenitas }}</h5>
                            <h5 class="case-data text-lg"><strong>Enfermedades de Infancia:</strong> {{
                                paciente.enfermedades_infancia }}</h5>
                            <h5 class="case-data text-lg"><strong>Enfermedades de Adolescencia:</strong> {{
                                paciente.enfermedades_adolescencia }}</h5>
                            <h5 class="case-data text-lg"><strong>Enfermedades de Adulto:</strong> {{
                                paciente.enfermedades_adulto }}</h5>
                            <h5 class="case-data text-lg"><strong>Transfusiones:</strong> {{ paciente.trasfusiones }}
                            </h5>
                        </div>
                    </div>
                </div>

                <div class="data-section">
                    <h5 class="info-data-dialog text-lg">Antecedentes No Patológicos</h5>
                    <div class="grid">
                        <div class="col md:col-12">
                            <h5 class="case-data text-lg text-justify"><strong>Antecedentes de Nacimiento:</strong> {{
                                paciente.antecedentes_nacimiento }}</h5>
                            <h5 class="case-data text-lg text-justify"><strong>Habitos:</strong> {{ paciente.habitos }}
                            </h5>
                            <h5 class="case-data text-lg text-justify"><strong>Factores de Riesgo:</strong> {{
                                paciente.factores_de_riesgo }}</h5>
                        </div>
                    </div>
                </div>

                <div class="data-section">
                    <h5 class="info-data-dialog text-lg">Antecedentes Familiares</h5>
                    <div class="grid">
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Padre:</strong> {{
                                paciente.padre }}</h5>
                            <h5 class="case-data text-lg"><strong>Madre:</strong> {{ paciente.madre }}</h5>
                            <h5 class="case-data text-lg"><strong>Hermanos:</strong> {{ paciente.hermanos }}</h5>
                        </div>
                        <div class="col md:col-6">
                            <h5 class="case-data text-lg"><strong>Hijos:</strong> {{
                                paciente.hijos }}</h5>
                            <h5 class="case-data text-lg"><strong>Conyugue:</strong> {{
                                paciente.conyugue }}</h5>

                        </div>
                    </div>
                </div>
            </div>
            <h5>Anamnesis por Sistemas</h5>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Cardiovascular:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisCardiovascular && !loadingCardiovascular" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'cardiovascular')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingCardiovascular"
                        label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisCardiovascular">{{
                        anamnesisCardiovascular?.cardiovascular || '' }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Endocrino:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisEndocrino && !loadingEndocrino" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'endocrino')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingEndocrino" label="Obteniendo..."
                        icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisEndocrino">{{ anamnesisEndocrino?.endocrino || '' }}
                    </p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Gastrointestinal:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisGastrointestinal && !loadingGastrointestinal" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'gastrointestinal')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingGastrointestinal"
                        label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisGastrointestinal">{{
                        anamnesisGastrointestinal?.gastrointestinal || '' }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Genitourinario:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisGenitourinario && !loadingGenitourinario" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'genitourinario')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingGenitourinario"
                        label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisGenitourinario">{{
                        anamnesisGenitourinario?.genitourinario || '' }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Respiratorio:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisRespiratorio && !loadingRespiratorio" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'respiratorio')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingRespiratorio"
                        label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisRespiratorio">{{ anamnesisRespiratorio?.respiratorio
                        || '' }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Neurologico:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisNeurologico && !loadingNeurologico" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'neurologico')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingNeurologico"
                        label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisNeurologico">{{ anamnesisNeurologico?.neurologico ||
                        '' }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Locomotor:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisLocomotor && !loadingLocomotor" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'locomotor')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingLocomotor" label="Obteniendo..."
                        icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisLocomotor">{{ anamnesisLocomotor?.locomotor || '' }}
                    </p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Hematico:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="!anamnesisHematico && !loadingHematico"
                        label="Realizar" @click="() => fetchPacienteData('anamnesis', 'hematico')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingHematico" label="Obteniendo..."
                        icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisHematico">{{ anamnesisHematico?.hematico || '' }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Psiquiatrico:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisPsiquiatrico && !loadingPsiquiatrico" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'psiquiatrico')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingPsiquiatrico"
                        label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisPsiquiatrico">{{ anamnesisPsiquiatrico?.psiquiatrico
                        || '' }}</p>
                </div>
            </div>
            <div class="grid">
                <div class="col md:col-8 pt-3 text-lg"><strong>Sistema Tegumentario:</strong></div>
                <div class="col md:col-4">
                    <Button style="background-color: #7ABF5A; border: 0px"
                        v-if="!anamnesisTegumentario && !loadingTegumentario" label="Realizar"
                        @click="() => fetchPacienteData('anamnesis', 'tegumentario')" />
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="loadingTegumentario"
                        label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                </div>
                <div class="col">
                    <p class="text-justify text-lg" v-if="anamnesisTegumentario">{{ anamnesisTegumentario?.tegumentario
                        || '' }}</p>
                </div>
            </div>
            <div class="grid ">
                <div class="col md:col-3"></div>
                <div class="col md:col-3"></div>
                <div class="col md:col-3"></div>
                <div class="col md:col-3">
                    <Button style="background-color: #BAC8D9; border: 0px" label="Ok" @click="closeDialog"
                        icon="pi pi-check" />
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
    color: #9BF272;
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
    color: #A8DCE7;
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
    color: #9BF272;
    margin-bottom: 0.3em;
}

.datos-paciente {
    font-size: 1.4em;
    font-weight: bold;
    color: #9BF272;
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