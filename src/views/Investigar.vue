<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { registrarAccion } from '@/services/simulacionService';
import { useStore } from 'vuex';
import {
    getExamenFisicoOrina, getExamenSedimentoUrinario, getExamenQuimicoUrinario,
    getExamenBiometriaHematica, getExamenRecuentoDiferencialHematico,
    getExamenIndiceEritrocitario, getExamenQuimicoSanguineo,
    getExamenHemostaseaSanguinea, getExamenSerologiaSanguinea, getExamenEspecialOrina,
    getExamenElectrolitosSanguineos
} from '@/services/historiaService';

const display = ref(true);
const router = useRouter();
const toast = useToast();
const position = ref('right');

const id_simulacion = localStorage.getItem('id_simulacion');
const id_historia_clinica = localStorage.getItem('id_historia_clinica');
const store = useStore();

const examenOrina = ref(store.getters['laboratorios/examenOrina']);
const examenSedimento = ref(store.getters['laboratorios/examenSedimento']);
const examenQuimicoUrinario = ref(store.getters['laboratorios/examenQuimicoUrinario']);
const examenEspecialOrina = ref(store.getters['laboratorios/examenEspecialOrina']);
const examenBiometriaHematica = ref(store.getters['laboratorios/examenBiometriaHematica']);
const examenRecuentoDiferencial = ref(store.getters['laboratorios/examenRecuentoDiferencial']);
const examenIndiceEritrocitario = ref(store.getters['laboratorios/examenIndiceEritrocitario']);
const examenQuimicoSanguineo = ref(store.getters['laboratorios/examenQuimicoSanguineo']);
const examenHemostasea = ref(store.getters['laboratorios/examenHemostasea']);
const examenSerologia = ref(store.getters['laboratorios/examenSerologia']);
const examenElectrolitos = ref(store.getters['laboratorios/examenElectrolitos']);

const imagenologias = computed(() => store.getters['imagenologia/imagenologias']);
const selectedCategories = computed(() => store.getters['imagenologia/selectedCategories']);

const loadingCategories = ref({});


const loadingStates = ref({
    orina: false,
    sedimento: false,
    quimico_urinario: false,
    especial_orina: false,
    biometria_hematica: false,
    recuento_diferencial: false,
    indice_eritrocitario: false,
    quimico_sanguineo: false,
    hemostasea: false,
    serologia: false,
    electrolitos: false
});

const registrarAccionSimulacion = async (descripcion, rubrica, puntaje, retroalimentacion) => {
    try {
        const accionData = {
            id_simulacion: id_simulacion,
            descripcion: descripcion,
            tipo_accion: rubrica,
            puntaje: puntaje,
            retroalimentacion: retroalimentacion
        };
        await registrarAccion(accionData);
        toast.add({ severity: 'info', summary: `Laboratorio realizado.`, detail: `${accionData.retroalimentacion}`, life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la acción', life: 3000 });
        console.error('Error al registrar la acción:', error);
    }
};

const registrarAccionSimulacionImagenologia = async (descripcion, rubrica, puntaje, retroalimentacion) => {
    try {
        const accionData = {
            id_simulacion: id_simulacion,
            descripcion: descripcion,
            tipo_accion: rubrica,
            puntaje: puntaje,
            retroalimentacion: retroalimentacion
        };
        await registrarAccion(accionData);
        toast.add({ severity: 'info', summary: `Imagenologia solicitada.`, detail: `${accionData.retroalimentacion}`, life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la acción', life: 3000 });
        console.error('Error al registrar la acción:', error);
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

const fetchExamenData = async (type) => {
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    if (!id_historia_clinica) {
        toast.error('ID de historia clínica no encontrado en el localStorage');
        return;
    }
    try {
        let response;
        loadingStates.value[type] = true;
        switch (type) {
            case 'orina':
                response = await getExamenFisicoOrina(id_historia_clinica);
                console.log(response.data[0])
                store.dispatch('laboratorios/saveExamenOrina', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de orina', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'sedimento':
                response = await getExamenSedimentoUrinario(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenSedimento', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de sedimento urinario', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'quimico_urinario':
                response = await getExamenQuimicoUrinario(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenQuimicoUrinario', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio químico urinario', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'especial_orina':
                response = await getExamenEspecialOrina(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenEspecialOrina', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio especial de orina', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'biometria_hematica':
                response = await getExamenBiometriaHematica(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenBiometriaHematica', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de biometria hematica', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'recuento_diferencial':
                response = await getExamenRecuentoDiferencialHematico(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenRecuentoDiferencial', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de recuento diferencial hematico', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'indice_eritrocitario':
                response = await getExamenIndiceEritrocitario(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenIndiceEritrocitario', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de indice eritrocitario hemático', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'quimico_sanguineo':
                response = await getExamenQuimicoSanguineo(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenQuimicoSanguineo', response.data[0])
                break;
            case 'hemostasea':
                response = await getExamenHemostaseaSanguinea(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenHemostasea', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de hemostasea sanguinea', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'serologia':
                response = await getExamenSerologiaSanguinea(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenSerologia', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de serologia sanguinea', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            case 'electrolitos':
                response = await getExamenElectrolitosSanguineos(id_historia_clinica);
                store.dispatch('laboratorios/saveExamenElectrolitos', response.data[0])
                await registrarAccionSimulacion('Se  realizo el laboratorio de electrolitos sanguineos', response.data[0].rubrica, response.data[0].puntaje, response.data[0].feed);
                break;
            default:
                throw new Error('Unknown exam type');
        }
        setTimeout(() => {
            eval(`examen${type.charAt(0).toUpperCase() + type.slice(1).replace(/_([a-z])/g, g => g[1].toUpperCase())}`).value = response.data[0];
            loadingStates.value[type] = false;
        }, 2000);
    } catch (error) {
        toast.error(`Error al cargar los datos del examen ${type}`);
        console.error(error);
        loadingStates.value[type] = false;
    }
};

const fetchImagenologias = async () => {
    try {
        await store.dispatch('imagenologia/fetchImagenologias', id_historia_clinica);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener imagenologías', life: 3000 });
        console.error('Error al obtener imagenologías:', error);
    }
};

onMounted(() => {
    fetchImagenologias();
});

function realizarCategoria(categoryName) {

    if (selectedCategories.value.includes(categoryName) || loadingCategories.value[categoryName]) {
        return;
    }

    loadingCategories.value[categoryName] = true;

    const imagenologia = imagenologias.value[categoryName];
    console.log(imagenologia)
    const rubrica = imagenologia.rubrica;
    const puntaje = imagenologia.puntaje;
    const retroalimentacion = imagenologia.feed;

    registrarAccionSimulacionImagenologia(`Se solicito ${categoryName}`, rubrica, puntaje, retroalimentacion);

    setTimeout(() => {
        store.dispatch('imagenologia/realizarCategoria', categoryName);
        loadingCategories.value[categoryName] = false;
    }, 2000);
}
</script>

<template>
    <Dialog header="Investigar" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        @hide="onDialogHide" class="p-fluid" :position="position" :draggable="false">
        <Accordion>
            <AccordionTab header="Laboratorios Disponibles">
                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio de orina</strong></div>
                    <div class="col md:col-4"> <Button v-if="!examenOrina && !loadingStates.orina" label="Realizar"
                            @click="() => fetchExamenData('orina')" />
                        <Button v-if="loadingStates.orina" label="Obteniendo..." icon="pi pi-spin pi-spinner"
                            disabled />
                    </div>
                </div>
                <template v-if="examenOrina">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Color: </strong> {{ examenOrina.color }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Aspecto: </strong> {{ examenOrina.aspecto }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Volumen: </strong> {{ examenOrina.volumen }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio de Sedimento Urinario</strong></div>
                    <div class="col md:col-4"> <Button v-if="!examenSedimento && !loadingStates.sedimento"
                            label="Realizar" @click="() => fetchExamenData('sedimento')" />
                        <Button v-if="loadingStates.sedimento" label="Obteniendo..." icon="pi pi-spin pi-spinner"
                            disabled />
                    </div>
                </div>

                <template v-if="examenSedimento">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Hematies: </strong> {{ examenSedimento.hematies }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Leucocitos: </strong> {{ examenSedimento.leucocitos }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Piocitos: </strong> {{ examenSedimento.piocitos }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Células Epiteliales: </strong> {{ examenSedimento.celulas_epiteliales }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Células Renales: </strong> {{ examenSedimento.celulas_renales }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cilindro Cereo: </strong> {{ examenSedimento.cilindro_cereo }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Hialianos: </strong> {{ examenSedimento.cilindros_hialianos }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Granulosos: </strong> {{ examenSedimento.cilindros_granulosos
                                        }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Leucocitarios: </strong> {{
                                        examenSedimento.cilindros_leucocitarios }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Eritrocitarios: </strong> {{
                                        examenSedimento.cilindros_eritrocitarios }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Flora Bacteriana: </strong> {{ examenSedimento.flora_bacteriana }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cristales: </strong> {{ examenSedimento.cristales }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Filamento Mucoso: </strong> {{ examenSedimento.filamento_mucoso }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Hifas: </strong> {{ examenSedimento.hifas }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Levaduras: </strong> {{ examenSedimento.levaduras }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Otros: </strong> {{ examenSedimento.otros }}</p>
                                </div>
                                <div class="col md:col-4"> </div>
                                <div class="col md:col-4"> </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Químico Urinario</strong></div>
                    <div class="col md:col-4"> <Button v-if="!examenQuimicoUrinario && !loadingStates.quimico_urinario"
                            label="Realizar" @click="() => fetchExamenData('quimico_urinario')" />
                        <Button v-if="loadingStates.quimico_urinario" label="Obteniendo..." icon="pi pi-spin pi-spinner"
                            disabled />
                    </div>
                </div>

                <template v-if="examenQuimicoUrinario">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Ph: </strong> {{ examenQuimicoUrinario.ph }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Densidad: </strong> {{ examenQuimicoUrinario.densidad }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Proteinas: </strong> {{ examenQuimicoUrinario.proteinas }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Sangre: </strong> {{ examenQuimicoUrinario.sangre }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Glucosa: </strong> {{ examenQuimicoUrinario.glucosa }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cetonas: </strong> {{ examenQuimicoUrinario.cetonas }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Urobilinogeno: </strong> {{ examenQuimicoUrinario.urobilinogeno }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Bilirrubina: </strong> {{ examenQuimicoUrinario.bilirrubina }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Pigmentos Biliares: </strong> {{ examenQuimicoUrinario.pigmentos_biliares
                                        }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Nitritos: </strong> {{ examenQuimicoUrinario.nitritos }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Leucocitos: </strong> {{ examenQuimicoUrinario.leucocitos }}</p>
                                </div>
                                <div class="col md:col-4">
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Especial de Orina</strong></div>
                    <div class="col md:col-4"> <Button v-if="!examenEspecialOrina && !loadingStates.especial_orina"
                            label="Realizar" @click="() => fetchExamenData('especial_orina')" />
                        <Button v-if="loadingStates.especial_orina" label="Obteniendo..." icon="pi pi-spin pi-spinner"
                            disabled />
                    </div>
                </div>

                <template v-if="examenEspecialOrina">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Proteurinaria: </strong> {{ examenEspecialOrina.proteurinaria }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Creatinuria: </strong> {{ examenEspecialOrina.creatinuria }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Microalbuminuria: </strong> {{ examenEspecialOrina.microalbuminuria }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Clearence Creatinina: </strong> {{
                                        examenEspecialOrina.clearence_creatinina }}</p>
                                </div>
                                <div class="col md:col-4">

                                </div>
                                <div class="col md:col-4">
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio de Biometria Hemática</strong></div>
                    <div class="col md:col-4"> <Button
                            v-if="!examenBiometriaHematica && !loadingStates.biometria_hematica" label="Realizar"
                            @click="() => fetchExamenData('biometria_hematica')" />
                        <Button v-if="loadingStates.biometria_hematica" label="Obteniendo..."
                            icon="pi pi-spin pi-spinner" disabled />
                    </div>
                    <div class="col md:col-4"></div>
                </div>

                <template v-if="examenBiometriaHematica">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Globulos Rojos: </strong> {{ examenBiometriaHematica.globulos_rojos }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Globulos Blancos: </strong> {{ examenBiometriaHematica.globulos_blancos
                                        }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Hemoglobina: </strong> {{ examenBiometriaHematica.hemoglobina }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Heritrocito: </strong> {{ examenBiometriaHematica.hematocrito }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>VES: </strong> {{ examenBiometriaHematica.ves }}
                                    </p>
                                </div>
                                <div class="col md:col-4">

                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Recuento Diferencial Hematico</strong>
                    </div>
                    <div class="col md:col-4"> <Button
                            v-if="!examenRecuentoDiferencial && !loadingStates.recuento_diferencial" label="Realizar"
                            @click="() => fetchExamenData('recuento_diferencial')" />
                        <Button v-if="loadingStates.recuento_diferencial" label="Obteniendo..."
                            icon="pi pi-spin pi-spinner" disabled />
                    </div>
                </div>

                <template v-if="examenRecuentoDiferencial">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Cayados Relativo: </strong> {{ examenRecuentoDiferencial.cayados_relativo
                                        }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cayados Absoluto: </strong> {{ examenRecuentoDiferencial.cayados_absoluto
                                        }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Linfocitos Relativo: </strong> {{
                                        examenRecuentoDiferencial.linfocitos_relativo }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Linfositos Absolutos: </strong> {{
                                        examenRecuentoDiferencial.linfocitos_absoluto }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Eosinofilos Relativo: </strong> {{
                                        examenRecuentoDiferencial.eosinofilos_relativo }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Eosinofilos Absoluto: </strong> {{
                                        examenRecuentoDiferencial.eosinofilos_absoluto }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Basofilos Relativo: </strong> {{
                                        examenRecuentoDiferencial.basofilos_relativo }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Basofilos Absoluto: </strong> {{
                                        examenRecuentoDiferencial.basofilos_absoluto }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Segmentados Relativo: </strong> {{
                                        examenRecuentoDiferencial.segmentados_relativo }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Segmentados Absoluto: </strong> {{
                                        examenRecuentoDiferencial.segmentados_absoluto }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Monocitos Relativo: </strong> {{
                                        examenRecuentoDiferencial.monocitos_relativo
                                    }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Monocitos Absoluto: </strong> {{
                                        examenRecuentoDiferencial.monocitos_absoluto }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Recuendo Plaquetas: </strong> {{
                                        examenRecuentoDiferencial.recuento_plaquetas
                                    }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Recuento Reticulos: </strong> {{
                                        examenRecuentoDiferencial.recuento_reticulos }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Indice Eritrocitario Hematico</strong>
                    </div>
                    <div class="col md:col-4"> <Button
                            v-if="!examenIndiceEritrocitario && !loadingStates.indice_eritrocitario" label="Realizar"
                            @click="() => fetchExamenData('indice_eritrocitario')" />
                        <Button v-if="loadingStates.indice_eritrocitario" label="Obteniendo..."
                            icon="pi pi-spin pi-spinner" disabled />
                    </div>
                </div>

                <template v-if="examenIndiceEritrocitario">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>VCM: </strong> {{ examenIndiceEritrocitario.vcm }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>HBCM: </strong> {{ examenIndiceEritrocitario.hbcm }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>CHBCM: </strong> {{ examenIndiceEritrocitario.chbcm }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Químico Sanguineo</strong>
                    </div>
                    <div class="col md:col-4"> <Button
                            v-if="!examenQuimicoSanguineo && !loadingStates.quimico_sanguineo" label="Realizar"
                            @click="() => fetchExamenData('quimico_sanguineo')" />
                        <Button v-if="loadingStates.quimico_sanguineo" label="Obteniendo..."
                            icon="pi pi-spin pi-spinner" disabled />
                    </div>
                </div>

                <template v-if="examenQuimicoSanguineo">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Glicemmia: </strong> {{ examenQuimicoSanguineo.glicemia
                                        }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Creatinina: </strong> {{ examenQuimicoSanguineo.creatinina
                                        }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Urea: </strong> {{
                                        examenQuimicoSanguineo.nitrogeno_ureico }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Acido Urico: </strong> {{
                                        examenQuimicoSanguineo.acido_urico }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Bilirrubina Total: </strong> {{
                                        examenQuimicoSanguineo.bilirrubina_total }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Bilirrubina Directa: </strong> {{
                                        examenQuimicoSanguineo.bilirrubina_directa }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Bilirrubina Indirecta: </strong> {{
                                        examenQuimicoSanguineo.bilirrubina_indirecta }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Transaminasa GPT: </strong> {{
                                        examenQuimicoSanguineo.transaminasa_gpt }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Transaminasa GOT: </strong> {{
                                        examenQuimicoSanguineo.transaminasa_got }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Lactato Deshdrogenasa: </strong> {{
                                        examenQuimicoSanguineo.lactato_deshidrogenasa }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Fosfatasa Alcalina: </strong> {{
                                        examenQuimicoSanguineo.fosfatasa_alcalina
                                    }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Proteinas Totales: </strong> {{
                                        examenQuimicoSanguineo.proteinas_totales }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Albumina: </strong> {{
                                        examenQuimicoSanguineo.albumina
                                    }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Globulina: </strong> {{
                                        examenQuimicoSanguineo.globulina }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Relación ALB/GLO: </strong> {{
                                        examenQuimicoSanguineo.relacion_alb_glo }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Colesterol Total: </strong> {{
                                        examenQuimicoSanguineo.colesterol_total }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Trigliceridos: </strong> {{
                                        examenQuimicoSanguineo.trigliceridos
                                    }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>HDL Colesterol: </strong> {{
                                        examenQuimicoSanguineo.hdl_colesterol }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>LDL Colesterol: </strong> {{
                                        examenQuimicoSanguineo.ldl_colesterol
                                    }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>VLDL Colesterol: </strong> {{
                                        examenQuimicoSanguineo.vldl_colesterol }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Glicemia RN: </strong> {{
                                        examenQuimicoSanguineo.glicemia_rn }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Hemoglobina Glicosilada: </strong> {{
                                        examenQuimicoSanguineo.hemoglobina_glicosilada
                                    }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Nitrogeno Ureico: </strong> {{
                                        examenQuimicoSanguineo.nitrogeno_ureico }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Hemostasea Sanguinea</strong>
                    </div>
                    <div class="col md:col-4"> <Button v-if="!examenHemostasea && !loadingStates.hemostasea"
                            label="Realizar" @click="() => fetchExamenData('hemostasea')" />
                        <Button v-if="loadingStates.hemostasea" label="Obteniendo..." icon="pi pi-spin pi-spinner"
                            disabled />
                    </div>
                </div>

                <template v-if="examenHemostasea">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Tiempo de Coagulación: </strong> {{ examenHemostasea.tiempo_coagulacion
                                        }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Tiempo de Sangria: </strong> {{ examenHemostasea.tiempo_sangria }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Tiempo Protrombina: </strong> {{ examenHemostasea.tiempo_protrombina }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Actividad Protrombinica: </strong> {{
                                        examenHemostasea.actividad_protrombinica }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>INR: </strong> {{
                                        examenHemostasea.inr }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Tiempo de Control: </strong> {{
                                        examenHemostasea.tiempo_control }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Tiempo Tromboplasitna Parcial: </strong> {{
                                        examenHemostasea.tiempo_tromboplastina_parcial }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Dimero D: </strong> {{
                                        examenHemostasea.dimero_d }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Fibrinogeno: </strong> {{
                                        examenHemostasea.fibrinogeno }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Serologia Sanguinea</strong>
                    </div>
                    <div class="col md:col-4"> <Button v-if="!examenSerologia && !loadingStates.serologia"
                            label="Realizar" @click="() => fetchExamenData('serologia')" />
                        <Button v-if="loadingStates.serologia" label="Obteniendo..." icon="pi pi-spin pi-spinner"
                            disabled />
                    </div>
                </div>

                <template v-if="examenSerologia">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Proteina C: </strong> {{ examenSerologia.proteina_c }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Factor Reumático: </strong> {{ examenSerologia.factor_reumatico }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>RPR Sifilis: </strong> {{ examenSerologia.rpr_sifilis }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Prueba Sifilis: </strong> {{
                                        examenSerologia.prueba_sifilis }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>VIH SIDA: </strong> {{
                                        examenSerologia.prueba_vih_sida }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Hepatitis B: </strong> {{
                                        examenSerologia.prueba_hepatitis_b }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>


                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio Electrolitos Sanguineos</strong>
                    </div>
                    <div class="col md:col-4"> <Button v-if="!examenElectrolitos && !loadingStates.electrolitos"
                            label="Realizar" @click="() => fetchExamenData('electrolitos')" />
                        <Button v-if="loadingStates.electrolitos" label="Obteniendo..." icon="pi pi-spin pi-spinner"
                            disabled />
                    </div>
                </div>

                <template v-if="examenElectrolitos">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Calcio: </strong> {{ examenElectrolitos.calcio }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Sodio: </strong> {{ examenElectrolitos.sodio }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Potasio: </strong> {{ examenElectrolitos.potasio }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Cloro: </strong> {{
                                        examenElectrolitos.cloro }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Fosforo: </strong> {{
                                        examenElectrolitos.fosforo }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Magenesio: </strong> {{
                                        examenElectrolitos.magnesio }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

            </AccordionTab>
            <AccordionTab header="Imagenología">
                <div v-for="(imagenologia, categoryName) in imagenologias" :key="categoryName" class="pt-4">
                    <div class="grid">
                        <div class="col md:col-4 pt-3 text-lg">{{ categoryName }}</div>
                        <div class="col md:col-4"></div>
                        <div class="col md:col-4">
                            <Button v-if="!selectedCategories.includes(categoryName)"
                                :label="loadingCategories[categoryName] ? 'Obteniendo' : 'Realizar'"
                                @click="realizarCategoria(categoryName)" :disabled="loadingCategories[categoryName]" />
                        </div>
                    </div>
                    <div v-if="selectedCategories.includes(categoryName)" class="card text-center">
                        <Image :src="imagenologia.path" alt="" width="250" preview />
                        <p>Interpretación: {{ imagenologia.interpretacion }}</p>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

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

.data-section-main {
    padding: 2px 0;
    border-bottom: 1px solid #444;
}

.examen-titulo {
    color: #bb86fc;
}
</style>