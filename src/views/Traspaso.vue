<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { obtenerTraspasoRubrica } from '../services/casoService';
import { registrarAccion } from '@/services/simulacionService';
import { enviarDiagnosticoFinal } from '@/services/simulacionService';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const display = ref(true);
const router = useRouter();
const position = ref('right');
const toast = useToast();
const confirm = useConfirm();

const traspaso = ref('');
const diagnosticoFinal = ref('');
const opcionesTraspaso = ref({});

const store = useStore();
const diagnosticosDiferenciales = computed(() => store.getters['diferencial/selectedCategories']);

const id_historia_clinica = localStorage.getItem('id_historia_clinica');
const id_simulacion = localStorage.getItem('id_simulacion');

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
        toast.add({ severity: 'info', summary: `Accion registrada.`, detail: `${accionData.retroalimentacion}`, life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la acción', life: 3000 });
        console.error('Error al registrar la acción:', error);
    }
};

const finalizarAccion = () => {
    confirm.require({
        header: 'Confirmación',
        message: '¿Estás seguro de que deseas finalizar la simulación?',
        icon: 'pi pi-exclamation-circle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: async () => {
            if (traspaso.value) {
                let descripcion = traspaso.value;
                let rubrica = '';
                let puntaje = '';
                let retroalimentacion = '';

                if (traspaso.value === opcionesTraspaso.value.opcion_uno) {
                    rubrica = opcionesTraspaso.value.rubrica_opcion_uno;
                    puntaje = opcionesTraspaso.value.puntaje_opcion_uno;
                    retroalimentacion = opcionesTraspaso.value.feed_opcion_uno;
                } else if (traspaso.value === opcionesTraspaso.value.opcion_dos) {
                    rubrica = opcionesTraspaso.value.rubrica_opcion_dos;
                    puntaje = opcionesTraspaso.value.puntaje_opcion_dos;
                    retroalimentacion = opcionesTraspaso.value.feed_opcion_dos;
                } else if (traspaso.value === opcionesTraspaso.value.opcion_tres) {
                    rubrica = opcionesTraspaso.value.rubrica_opcion_tres;
                    puntaje = opcionesTraspaso.value.puntaje_opcion_tres;
                    retroalimentacion = opcionesTraspaso.value.feed_opcion_tres;
                }

                await registrarAccionSimulacion(descripcion, rubrica, puntaje, retroalimentacion);

                if (diagnosticoFinal.value) {
                    try {
                        await enviarDiagnosticoFinal(id_simulacion, diagnosticoFinal.value);
                        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Diagnóstico final actualizado correctamente', life: 3000 });
                    } catch (error) {
                        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el diagnóstico final', life: 3000 });
                        console.error('Error al actualizar el diagnóstico final:', error);
                    }
                } else {
                    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un diagnóstico final antes de finalizar', life: 3000 });
                }
            } else {
                toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar el siguiente paso antes de finalizar', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelado', detail: 'Has cancelado la acción', life: 3000 });
        }
    });
};

const cargarTraspaso = async () => {
    try {
        const response = await obtenerTraspasoRubrica(id_historia_clinica);
        opcionesTraspaso.value = response.data[0];
        console.log(opcionesTraspaso.value)
    } catch (error) {
        console.error('Error al obtener las opciones de traspaso:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las opciones de traspaso', life: 3000 });
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

onMounted(() => {
    cargarTraspaso();
});
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
                <div class="flex items-center pt-3" v-if="opcionesTraspaso.opcion_uno">
                    <RadioButton v-model="traspaso" inputId="traspaso1" name="diagnostico"
                        :value="opcionesTraspaso.opcion_uno" />
                    <label for="traspaso1" class="ml-2 pl-2 text-lg">{{ opcionesTraspaso.opcion_uno }}</label>
                </div>
                <div class="flex items-center pt-3" v-if="opcionesTraspaso.opcion_dos">
                    <RadioButton v-model="traspaso" inputId="traspaso2" name="diagnostico"
                        :value="opcionesTraspaso.opcion_dos" />
                    <label for="traspaso2" class="ml-2 pl-2 text-lg">{{ opcionesTraspaso.opcion_dos }}</label>
                </div>
                <div class="flex items-center pt-3" v-if="opcionesTraspaso.opcion_tres">
                    <RadioButton v-model="traspaso" inputId="traspaso3" name="diagnostico"
                        :value="opcionesTraspaso.opcion_tres" />
                    <label for="traspaso3" class="ml-2 pl-2 text-lg">{{ opcionesTraspaso.opcion_tres }}</label>
                </div>
            </div>
        </div>

        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo pt-3">¿Cual es tu diagnostico final?</h5>
                <div class="data-section-main">
                    <div class="flex-wrap gap-3">
                        <div class="flex items-center pt-3" v-for="(diagnostico, index) in diagnosticosDiferenciales"
                            :key="index">
                            <RadioButton v-model="diagnosticoFinal" :inputId="'diagnostico' + index"
                                name="diagnosticoFinal" :value="diagnostico" />
                            <label :for="'diagnostico' + index" class="ml-2 pl-2 text-lg">{{ diagnostico }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid pt-5">
            <div class="col md:col-4"></div>
            <div class="col md:col-4">
                <Button label="Finalizar" @click="finalizarAccion" />
            </div>
            <div class="col md:col-4"></div>
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