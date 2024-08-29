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

const fetchData = async (type, section = null) => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.error('ID de historia clínica no encontrado en el localStorage');
        return;
    }

    try {
        let response;
        console.log(`Fetching data for type: ${type}, section: ${section}`);

        if (type === 'general' && !examenFisico.value) {
            loadingGeneral.value = true;
            response = await getExamenFisicoGeneral(id_historia_clinica);
            setTimeout(() => {
                examenFisico.value = response.data[0];
                store.dispatch('examenes/saveExamenFisico', examenFisico.value);
                loadingGeneral.value = false;
            }, 2000);
        } else if (type === 'obstetrico' && !examenObstetrico.value) {
            loadingObstetrico.value = true;
            response = await getExamenObstetrico(id_historia_clinica);
            setTimeout(() => {
                examenObstetrico.value = response.data[0];
                store.dispatch('examenes/saveExamenObstetrico', examenObstetrico.value);
                loadingObstetrico.value = false;
            }, 2000);
        } else if (type === 'segmentario' && section) {
            let loadingRef;
            let examenSegmentarioRef;
            switch (section) {
                case 'cabeza':
                    loadingRef = loadingCabeza;
                    examenSegmentarioRef = examenSegmentarioCabeza;
                    response = await getExamenFisicoSegmentarioCabeza(id_historia_clinica);
                    break;
                case 'cuello':
                    loadingRef = loadingCuello;
                    examenSegmentarioRef = examenSegmentarioCuello;
                    response = await getExamenFisicoSegmentarioCuello(id_historia_clinica);
                    break;
                case 'torax':
                    loadingRef = loadingTorax;
                    examenSegmentarioRef = examenSegmentarioTorax;
                    response = await getExamenFisicoSegmentarioTorax(id_historia_clinica);
                    break;
                case 'corazon':
                    loadingRef = loadingCorazon;
                    examenSegmentarioRef = examenSegmentarioCorazon;
                    response = await getExamenFisicoSegmentarioCorazon(id_historia_clinica);
                    break;
                case 'mamas':
                    loadingRef = loadingMamas;
                    examenSegmentarioRef = examenSegmentarioMamas;
                    response = await getExamenFisicoSegmentarioMamas(id_historia_clinica);
                    break;
                case 'abdomen':
                    loadingRef = loadingAbdomen;
                    examenSegmentarioRef = examenSegmentarioAbdomen;
                    response = await getExamenFisicoSegmentarioAbdomen(id_historia_clinica);
                    break;
                case 'genitourinario':
                    loadingRef = loadingGenitourinario;
                    examenSegmentarioRef = examenSegmentarioGenitourinario;
                    response = await getExamenFisicoSegmentarioGenitourinario(id_historia_clinica);
                    break;
                case 'extremidades':
                    loadingRef = loadingExtremidades;
                    examenSegmentarioRef = examenSegmentarioExtremidades;
                    response = await getExamenFisicoSegmentarioExtremidades(id_historia_clinica);
                    break;
                case 'neurologico':
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
                console.log(`${section} segmentario data:`, examenSegmentarioRef.value);
            }, 2000);
        }
    } catch (error) {
        toast.error('Error al cargar los datos del examen');
        console.error(error);
        loadingGeneral.value = loadingObstetrico.value = loadingCabeza.value =
            loadingCuello.value = loadingTorax.value = loadingCorazon.value =
            loadingMamas.value = loadingAbdomen.value = loadingGenitourinario.value =
            loadingExtremidades.value = loadingNeurologico.value = false;
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
        <Accordion>
            <AccordionTab header="Realizar Examen Físico General">
                <div class="grid">
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenFisico" label="Realizar" @click="() => fetchData('general')" />
                    </div>
                    <div class="col md:col-4"></div>
                </div>
                <div v-if="loadingGeneral">Obteniendo...</div>
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
            </AccordionTab>
            <AccordionTab header="Realizar Examen Físico Segmentario">
                <div class="grid p-fluid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Cabeza:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioCabeza && !loadingCabeza" label="Realizar"
                            @click="() => fetchData('segmentario', 'cabeza')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingCabeza">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioCabeza?.cabeza || '' }}</p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Cuello:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioCuello && !loadingCuello" label="Realizar"
                            @click="() => fetchData('segmentario', 'cuello')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingCuello">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioCuello?.cuello || '' }}</p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Torax:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioTorax && !loadingTorax" label="Realizar"
                            @click="() => fetchData('segmentario', 'torax')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingTorax">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioTorax?.torax || '' }}</p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Corazón:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioCorazon && !loadingCorazon" label="Realizar"
                            @click="() => fetchData('segmentario', 'corazon')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingCorazon">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioCorazon?.corazon || '' }}</p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Mamas:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioMamas && !loadingMamas" label="Realizar"
                            @click="() => fetchData('segmentario', 'mamas')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingMamas">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioMamas?.mamas || '' }}</p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Abdomen:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioAbdomen && !loadingAbdomen" label="Realizar"
                            @click="() => fetchData('segmentario', 'abdomen')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingAbdomen">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioAbdomen?.abdomen || '' }}</p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Genitourinario:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioGenitourinario && !loadingGenitourinario" label="Realizar"
                            @click="() => fetchData('segmentario', 'genitourinario')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingGenitourinario">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioGenitourinario?.genitourinario || ''
                            }}</p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Extremidades:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioExtremidades && !loadingExtremidades" label="Realizar"
                            @click="() => fetchData('segmentario', 'extremidades')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingExtremidades">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioExtremidades?.extremidades || '' }}
                        </p>
                    </div>
                </div>
                <div class="grid">
                    <div class="col md:col-4 pt-3 text-lg"><strong>Neurológico:</strong></div>
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenSegmentarioNeurologico && !loadingNeurologico" label="Realizar"
                            @click="() => fetchData('segmentario', 'neurologico')" />
                    </div>
                    <div class="col">
                        <p v-if="loadingNeurologico">Cargando...</p>
                        <p class="text-justify text-lg" v-else>{{ examenSegmentarioNeurologico?.neurologico || '' }}</p>
                    </div>
                </div>
            </AccordionTab>
            <AccordionTab header="Realizar Examen Obstétrico">
                <div class="grid">
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenObstetrico" label="Realizar" @click="() => fetchData('obstetrico')" />
                    </div>
                    <div class="col md:col-4"></div>
                </div>
                <div v-if="loadingObstetrico">Obteniendo...</div>
                <template v-if="examenObstetrico">
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
                </template>
            </AccordionTab>
        </Accordion>
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
</style>
