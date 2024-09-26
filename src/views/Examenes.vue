<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import {
    getExamenFisicoGeneral, getExamenObstetrico,
    getExamenFisicoSegmentarioCabeza, getExamenFisicoSegmentarioCuello, getExamenFisicoSegmentarioTorax,
    getExamenFisicoSegmentarioCorazon, getExamenFisicoSegmentarioMamas, getExamenFisicoSegmentarioAbdomen,
    getExamenFisicoSegmentarioGenitourinario, getExamenFisicoSegmentarioExtremidades, getExamenFisicoSegmentarioNeurologico
} from '@/services/historiaService';

import { registrarAccion } from '@/services/simulacionService';


const display = ref(true);
const router = useRouter();
const toast = useToast();
const store = useStore();

const loadingGeneral = ref(false);
const loadingObstetrico = ref(false);
const position = ref('left');

const examenFisico = ref(store.getters['examenes/examenFisico']);
const examenObstetrico = ref(store.getters['examenes/examenObstetrico']);

const loadingCabeza = ref(false);
const loadingCuello = ref(false);
const loadingTorax = ref(false);
const loadingCorazon = ref(false);
const loadingMamas = ref(false);
const loadingAbdomen = ref(false);
const loadingGenitourinario = ref(false);
const loadingExtremidades = ref(false);
const loadingNeurologico = ref(false);

const examenSegmentarioCabeza = ref(store.getters['examenes/examenSegmentarioCabeza']);
const examenSegmentarioCuello = ref(store.getters['examenes/examenSegmentarioCuello']);
const examenSegmentarioTorax = ref(store.getters['examenes/examenSegmentarioTorax']);
const examenSegmentarioCorazon = ref(store.getters['examenes/examenSegmentarioCorazon']);
const examenSegmentarioMamas = ref(store.getters['examenes/examenSegmentarioMamas']);
const examenSegmentarioAbdomen = ref(store.getters['examenes/examenSegmentarioAbdomen']);
const examenSegmentarioGenitourinario = ref(store.getters['examenes/examenSegmentarioGenitourinario']);
const examenSegmentarioExtremidades = ref(store.getters['examenes/examenSegmentarioExtremidades']);
const examenSegmentarioNeurologico = ref(store.getters['examenes/examenSegmentarioNeurologico']);

const id_simulacion = localStorage.getItem('id_simulacion');

const buttonsState = ref({
    general: { loading: false, label: "Obtener" },
    obstetrico: { loading: false, label: "Obtener" },
    cabeza: { loading: false, label: "Obtener" },
    cuello: { loading: false, label: "Obtener" },
    torax: { loading: false, label: "Obtener" },
    corazon: { loading: false, label: "Obtener" },
    mamas: { loading: false, label: "Obtener" },
    abdomen: { loading: false, label: "Obtener" },
    genitourinario: { loading: false, label: "Obtener" },
    extremidades: { loading: false, label: "Obtener" },
    neurologico: { loading: false, label: "Obtener" }
});

const registrarAccionSimulacion = async (descripcion, tipo_accion) => {
    try {
        const accionData = {
            id_simulacion: id_simulacion,
            id_categoria_decision: 1,
            descripcion: descripcion,
            tipo_accion: tipo_accion
        };
        await registrarAccion(accionData);
        toast.add({ severity: 'success', summary: 'Acción registrada', detail: 'La acción ha sido registrada con éxito', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la acción', life: 3000 });
        console.error('Error al registrar la acción:', error);
    }
};

const fetchData = async (type, section = null) => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'ID de historia clínica no encontrado en el localStorage', life: 3000 });
        return;
    }

    try {
        let response;
        console.log(`Fetching data for type: ${type}, section: ${section}`);

        if (type === 'general' && !examenFisico.value) {

            buttonsState.value.general.loading = true;
            buttonsState.value.general.label = "Obteniendo...";
            await registrarAccionSimulacion('Se  realizo el examen físico general', 'Innecesaria');
            loadingGeneral.value = true;
            response = await getExamenFisicoGeneral(id_historia_clinica);

            setTimeout(() => {
                examenFisico.value = response.data[0];
                store.dispatch('examenes/saveExamenFisico', examenFisico.value);
                loadingGeneral.value = false;
                buttonsState.value.general.loading = false;
                buttonsState.value.general.label = "Obtener";
            }, 2000);
        } else if (type === 'obstetrico' && !examenObstetrico.value) {
            buttonsState.value.obstetrico.loading = true;
            buttonsState.value.obstetrico.label = "Obteniendo...";
            await registrarAccionSimulacion('Se  realizo el examen obstetrico', 'Critico');
            loadingObstetrico.value = true;
            response = await getExamenObstetrico(id_historia_clinica);

            setTimeout(() => {
                examenObstetrico.value = response.data[0];
                store.dispatch('examenes/saveExamenObstetrico', examenObstetrico.value);
                loadingObstetrico.value = false;
                buttonsState.value.obstetrico.loading = false;
                buttonsState.value.obstetrico.label = "Obtener";

            }, 2000);
        } else if (type === 'segmentario' && section) {
            let loadingRef;
            let examenSegmentarioRef;
            switch (section) {
                case 'cabeza':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario de cabeza', 'Innecesaria');
                    loadingRef = loadingCabeza;
                    examenSegmentarioRef = examenSegmentarioCabeza;
                    response = await getExamenFisicoSegmentarioCabeza(id_historia_clinica);
                    break;
                case 'cuello':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario de cuello', 'Innecesaria');
                    loadingRef = loadingCuello;
                    examenSegmentarioRef = examenSegmentarioCuello;
                    response = await getExamenFisicoSegmentarioCuello(id_historia_clinica);
                    break;
                case 'torax':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario de torax', 'Util');
                    loadingRef = loadingTorax;
                    examenSegmentarioRef = examenSegmentarioTorax;
                    response = await getExamenFisicoSegmentarioTorax(id_historia_clinica);
                    break;
                case 'corazon':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario de corazon', 'Innecesaria');
                    loadingRef = loadingCorazon;
                    examenSegmentarioRef = examenSegmentarioCorazon;
                    response = await getExamenFisicoSegmentarioCorazon(id_historia_clinica);
                    break;
                case 'mamas':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario de mamas', 'Util');
                    loadingRef = loadingMamas;
                    examenSegmentarioRef = examenSegmentarioMamas;
                    response = await getExamenFisicoSegmentarioMamas(id_historia_clinica);
                    break;
                case 'abdomen':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario de abdomen', 'Util');
                    loadingRef = loadingAbdomen;
                    examenSegmentarioRef = examenSegmentarioAbdomen;
                    response = await getExamenFisicoSegmentarioAbdomen(id_historia_clinica);
                    break;
                case 'genitourinario':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario genitourinario', 'Critico');
                    loadingRef = loadingGenitourinario;
                    examenSegmentarioRef = examenSegmentarioGenitourinario;
                    response = await getExamenFisicoSegmentarioGenitourinario(id_historia_clinica);
                    break;
                case 'extremidades':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario de extremidades', 'Inutil');
                    loadingRef = loadingExtremidades;
                    examenSegmentarioRef = examenSegmentarioExtremidades;
                    response = await getExamenFisicoSegmentarioExtremidades(id_historia_clinica);
                    break;
                case 'neurologico':
                    buttonsState.value[section].loading = true;
                    buttonsState.value[section].label = "Obteniendo...";
                    await registrarAccionSimulacion('Se  realizo el examen segmentario neurologico', 'Innecesaria');
                    loadingRef = loadingNeurologico;
                    examenSegmentarioRef = examenSegmentarioNeurologico;
                    response = await getExamenFisicoSegmentarioNeurologico(id_historia_clinica);
                    break;
                default:
                    throw new Error('Sección no válida');
            }

            loadingRef.value = true;

            setTimeout(() => {
                examenSegmentarioRef.value = response.data[0];
                store.dispatch(`examenes/saveExamenSegmentario${section.charAt(0).toUpperCase() + section.slice(1)}`, examenSegmentarioRef.value);
                loadingRef.value = false;
                buttonsState.value[section].loading = false;
                buttonsState.value[section].label = "Obtener";
                console.log(`${section} segmentario data:`, examenSegmentarioRef.value);
            }, 2000);
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos del examen', life: 3000 });
        console.error(error);
        loadingGeneral.value = loadingObstetrico.value = loadingCabeza.value =
            loadingCuello.value = loadingTorax.value = loadingCorazon.value =
            loadingMamas.value = loadingAbdomen.value = loadingGenitourinario.value =
            loadingExtremidades.value = loadingNeurologico.value = false;
        buttonsState.value[type].loading = false;
        buttonsState.value[type].label = "Obtener";
    }
};

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
    <Dialog header="Exámenes" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">
        <h5 class="text-center datos-paciente">Examenes Disponibles</h5>
        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">Examen General</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>

        <div class="grid p-fluid">
            <div class="col md:col-8 text-lg">
                <strong>Examen Físico General</strong>
            </div>
            <div class="col md:col-4 pt-2">
                <Button type="button" v-if="!examenFisico" :label="buttonsState.general.label"
                    @click="() => fetchData('general')" icon="pi pi-search" :loading="buttonsState.general.loading" />
            </div>
        </div>
        <template v-if="examenFisico">
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
                        <div class="col md:col-4"></div>
                    </div>
                </div>
            </div>
        </template>

        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">Examen Físico Segmentario</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>
        <div class="grid p-fluid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Cabeza:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioCabeza" :label="buttonsState.cabeza.label"
                    @click="() => fetchData('segmentario', 'cabeza')" icon="pi pi-search"
                    :loading="buttonsState.cabeza.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingCabeza"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioCabeza?.cabeza || '' }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Cuello:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioCuello" :label="buttonsState.cuello.label"
                    @click="() => fetchData('segmentario', 'cuello')" icon="pi pi-search"
                    :loading="buttonsState.cuello.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingCuello"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioCuello?.cuello || '' }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Torax:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioTorax" :label="buttonsState.torax.label"
                    @click="() => fetchData('segmentario', 'torax')" icon="pi pi-search"
                    :loading="buttonsState.torax.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingTorax"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioTorax?.torax || '' }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Corazón:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioCorazon" :label="buttonsState.corazon.label"
                    @click="() => fetchData('segmentario', 'corazon')" icon="pi pi-search"
                    :loading="buttonsState.corazon.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingCorazon"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioCorazon?.corazon || '' }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Mamas:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioMamas" :label="buttonsState.mamas.label"
                    @click="() => fetchData('segmentario', 'mamas')" icon="pi pi-search"
                    :loading="buttonsState.mamas.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingMamas"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioMamas?.mamas || '' }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Abdomen:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioAbdomen" :label="buttonsState.abdomen.label"
                    @click="() => fetchData('segmentario', 'abdomen')" icon="pi pi-search"
                    :loading="buttonsState.abdomen.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingAbdomen"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioAbdomen?.abdomen || '' }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Genitourinario:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioGenitourinario" :label="buttonsState.genitourinario.label"
                    @click="() => fetchData('segmentario', 'genitourinario')" icon="pi pi-search"
                    :loading="buttonsState.genitourinario.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingGenitourinario"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioGenitourinario?.genitourinario || ''
                    }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Extremidades:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioExtremidades" :label="buttonsState.extremidades.label"
                    @click="() => fetchData('segmentario', 'extremidades')" icon="pi pi-search"
                    :loading="buttonsState.extremidades.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingExtremidades"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioExtremidades?.extremidades || '' }}
                </p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-4 pt-3 text-lg"><strong>Neurológico:</strong></div>
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button v-if="!examenSegmentarioNeurologico" :label="buttonsState.neurologico.label"
                    @click="() => fetchData('segmentario', 'neurologico')" icon="pi pi-search"
                    :loading="buttonsState.neurologico.loading" type="button" />
            </div>
            <div class="col">
                <p v-if="loadingNeurologico"></p>
                <p class="text-justify text-lg" v-else>{{ examenSegmentarioNeurologico?.neurologico || '' }}</p>
            </div>
        </div>

        <div class="grid">
            <div class="col md:col-8 text-lg">
                <strong>Obstetrico:</strong>
            </div>
            <div class=" col md:col-4">
                <Button v-if="!examenObstetrico" :label="buttonsState.obstetrico.label"
                    @click="() => fetchData('obstetrico')" icon="pi pi-search"
                    :loading="buttonsState.obstetrico.loading" type="button" />
            </div>
        </div>
        <template v-if="examenObstetrico">
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
        </template>
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

.data-section-main {
    padding: 2px 0;
    border-bottom: 1px solid #444;
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
</style>
