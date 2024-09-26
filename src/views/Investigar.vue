<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import {
    getExamenFisicoOrina, getExamenSedimentoUrinario, getExamenQuimicoUrinario,
    getExamenBiometriaHematica, getExamenRecuentoDiferencialHematico,
    getExamenIndiceEritrocitario, getExamenQuimicoSanguineo,
    getExamenHemostaseaSanguinea, getExamenSerologiaSanguinea, getExamenEspecialOrina,
    getExamenElectrolitosSanquineos, getExamenImagenPrueba
} from '@/services/historiaService';
import { registrarAccion } from '@/services/simulacionService';

const display = ref(true);
const router = useRouter();
const toast = useToast();

// References for data
const examenOrina = ref(null);
const examenSedimento = ref(null);
const examenQuimicoUrinario = ref(null);
const examenEspecialOrina = ref(null);
const examenBiometriaHematica = ref(null);

const examenImagenPrueba = ref(null);

/*
const examenRecuentoDiferencial = ref(null);
const examenIndiceEritrocitario = ref(null);
const examenQuimicoSanguineo = ref(null);
const examenHemostasea = ref(null);
const examenSerologia = ref(null);
const examenElectrolitos = ref(null);*/
const position = ref('right');

// Loading states for each exam type
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
    electrolitos: false,
    imagen_prueba: false
});

const id_simulacion = localStorage.getItem('id_simulacion');

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

// Function to fetch exam data
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
                await registrarAccionSimulacion('Se  realizo el laboratorio de orina', 'Innecesaria');
                response = await getExamenFisicoOrina(id_historia_clinica);
                break;
            case 'sedimento':
                await registrarAccionSimulacion('Se  realizo el laboratorio de sedimento urinario', 'Innecesaria');
                response = await getExamenSedimentoUrinario(id_historia_clinica);
                break;
            case 'quimico_urinario':
                await registrarAccionSimulacion('Se  realizo el laboratorio quimico urinario', 'Innecesaria');
                response = await getExamenQuimicoUrinario(id_historia_clinica);
                break;
            case 'especial_orina':
                await registrarAccionSimulacion('Se  realizo el laboratorio especial de orina', 'Innecesaria');
                response = await getExamenEspecialOrina(id_historia_clinica);
                break;
            case 'biometria_hematica':
                await registrarAccionSimulacion('Se  realizo el laboratorio de miometria hematica', 'Innecesaria');
                response = await getExamenBiometriaHematica(id_historia_clinica);
                break;
            case 'recuento_diferencial':
                response = await getExamenRecuentoDiferencialHematico(id_historia_clinica);
                break;
            case 'indice_eritrocitario':
                response = await getExamenIndiceEritrocitario(id_historia_clinica);
                break;
            case 'quimico_sanguineo':
                response = await getExamenQuimicoSanguineo(id_historia_clinica);
                break;
            case 'hemostasea':
                response = await getExamenHemostaseaSanguinea(id_historia_clinica);
                break;
            case 'serologia':
                response = await getExamenSerologiaSanguinea(id_historia_clinica);
                break;
            case 'electrolitos':
                response = await getExamenElectrolitosSanquineos(id_historia_clinica);
                break;
            case 'imagen_prueba':
                await registrarAccionSimulacion('Se  solicito la imagen de pueba', 'Critico');
                response = await getExamenImagenPrueba(id_historia_clinica);
                break;
            default:
                throw new Error('Unknown exam type');
        }
        setTimeout(() => {
            if (type === 'imagen_prueba') {
                examenImagenPrueba.value = response.data[0];
            } else {
                eval(`examen${type.charAt(0).toUpperCase() + type.slice(1).replace(/_([a-z])/g, g => g[1].toUpperCase())}`).value = response.data[0];
            }
            loadingStates.value[type] = false;
        }, 2000);
    } catch (error) {
        toast.error(`Error al cargar los datos del examen ${type}`);
        console.error(error);
        loadingStates.value[type] = false;
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
    <Dialog header="Investigar" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        @hide="onDialogHide" class="p-fluid" :position="position" :draggable="false">
        <Accordion>
            <AccordionTab header="Examenes de Cabecera">
            </AccordionTab>
            <AccordionTab header="Laboratorios Disponibles">
                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio de orina</strong></div>
                    <div class="col md:col-4"> <Button v-if="!examenOrina && !loadingStates.orina" label="Realizar"
                            @click="() => fetchExamenData('orina')" /></div>
                </div>
                <div v-if="loadingStates.orina">Obteniendo...</div>
                <template v-if="examenOrina">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Color:</strong> {{ examenOrina.color }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Aspecto:</strong> {{ examenOrina.aspecto }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Volumen:</strong> {{ examenOrina.volumen }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="grid">
                    <div class="col md:col-8 text-lg pt-3"><strong>Laboratorio de Sedimento Urinario</strong></div>
                    <div class="col md:col-4"> <Button v-if="!examenSedimento && !loadingStates.sedimento"
                            label="Realizar" @click="() => fetchExamenData('sedimento')" /></div>
                </div>
                <div v-if="loadingStates.sedimento">Obteniendo...</div>
                <template v-if="examenSedimento">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Hematies:</strong> {{ examenSedimento.hematies }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Leucocitos:</strong> {{ examenSedimento.leucocitos }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Piocitos:</strong> {{ examenSedimento.piocitos }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Células Epiteliales:</strong> {{ examenSedimento.celulas_epiteliales }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Células Renales:</strong> {{ examenSedimento.celulas_renales }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cilindro Cereo:</strong> {{ examenSedimento.cilindro_cereo }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Hialianos:</strong> {{ examenSedimento.cilindros_hialianos }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Granulosos:</strong> {{ examenSedimento.cilindros_granulosos }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Leucocitarios:</strong> {{
                                        examenSedimento.cilindros_leucocitarios }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Cilindros Eritrocitarios:</strong> {{
                                        examenSedimento.cilindros_eritrocitarios }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Flora Bacteriana:</strong> {{ examenSedimento.flora_bacteriana }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cristales:</strong> {{ examenSedimento.cristales }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Filamento Mucoso:</strong> {{ examenSedimento.filamento_mucoso }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Hifas:</strong> {{ examenSedimento.hifas }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Levaduras:</strong> {{ examenSedimento.levaduras }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Otros:</strong> {{ examenSedimento.otros }}</p>
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
                            label="Realizar" @click="() => fetchExamenData('quimico_urinario')" /></div>
                </div>
                <div v-if="loadingStates.quimico_urinario">Obteniendo...</div>
                <template v-if="examenQuimicoUrinario">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Ph:</strong> {{ examenQuimicoUrinario.ph }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Densidad:</strong> {{ examenQuimicoUrinario.densidad }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Proteinas:</strong> {{ examenQuimicoUrinario.proteinas }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Sangre:</strong> {{ examenQuimicoUrinario.sangre }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Glucosa:</strong> {{ examenQuimicoUrinario.glucosa }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Cetonas:</strong> {{ examenQuimicoUrinario.cetonas }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Urobilinogeno:</strong> {{ examenQuimicoUrinario.urobilinogeno }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Bilirrubina:</strong> {{ examenQuimicoUrinario.bilirrubina }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Pigmentos Biliares:</strong> {{ examenQuimicoUrinario.pigmentos_biliares
                                        }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Nitritos:</strong> {{ examenQuimicoUrinario.nitritos }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Leucocitos:</strong> {{ examenQuimicoUrinario.leucocitos }}</p>
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
                            label="Realizar" @click="() => fetchExamenData('especial_orina')" /></div>
                </div>
                <div v-if="loadingStates.especial_orina">Obteniendo...</div>
                <template v-if="examenEspecialOrina">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Proteurinaria:</strong> {{ examenEspecialOrina.proteurinaria }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Creatinuria:</strong> {{ examenEspecialOrina.creatinuria }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Microalbuminuria:</strong> {{ examenEspecialOrina.microalbuminuria }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Clearence Creatinina:</strong> {{
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
                            @click="() => fetchExamenData('biometria_hematica')" /></div>
                    <div class="col md:col-4"></div>
                </div>
                <div v-if="loadingStates.biometria_hematica">Obteniendo...</div>
                <template v-if="examenBiometriaHematica">
                    <div class="data-wrapper">
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Globulos Rojos:</strong> {{ examenBiometriaHematica.globulos_rojos }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Globulos Blancos:</strong> {{ examenBiometriaHematica.globulos_blancos }}
                                    </p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>Hemoglobina:</strong> {{ examenBiometriaHematica.hemoglobina }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="data-section">
                            <div class="grid">
                                <div class="col md:col-4">
                                    <p><strong>Heritrocito:</strong> {{ examenBiometriaHematica.heritrocito }}</p>
                                </div>
                                <div class="col md:col-4">
                                    <p><strong>VES:</strong> {{ examenBiometriaHematica.ves }}
                                    </p>
                                </div>
                                <div class="col md:col-4">

                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </AccordionTab>
            <AccordionTab header="Imagenologia">
                <div class="grid">
                    <div class="col md:col-4"></div>
                    <div class="col md:col-4">
                        <Button v-if="!examenImagenPrueba && !loadingStates.imagen_prueba" label="Realizar"
                            @click="() => fetchExamenData('imagen_prueba')" />
                    </div>
                    <div class="col md:col-4"></div>
                </div>
                <div v-if="loadingStates.imagen_prueba">Obteniendo...</div>
                <template v-if="examenImagenPrueba">
                    <div class="card text-center">
                        <Image :src="examenImagenPrueba.path" :alt="examenImagenPrueba.name" width="350" preview />
                    </div>
                </template>
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