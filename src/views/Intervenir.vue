<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import { obtenerMedicamentos, obtenerProcedimientos } from '@/services/historiaService';
import { registrarAccion, eliminarAccion } from '@/services/simulacionService';

const display = ref(true);
const router = useRouter();
const position = ref('right');
const toast = useToast();
const store = useStore();

const medicamentosData = ref({});
const selectedMedicamentos = ref([]);

const procedimientosData = ref({});
const selectedProcedimientos = ref([]);

const id_simulacion = localStorage.getItem('id_simulacion');
const id_historia_clinica = localStorage.getItem('id_historia_clinica');

function findProcedimientoByNombre(nombre) {
    for (const categoryName in procedimientosData.value) {
        const category = procedimientosData.value[categoryName];
        const procedimiento = category.procedimientos.find(p => p.nombre === nombre);
        if (procedimiento) {
            return procedimiento;
        }
    }
    return null;
}

async function loadProcedimientos(id_historia_clinica) {
    try {
        const response = await obtenerProcedimientos(id_historia_clinica);
        procedimientosData.value = response.data;
    } catch (error) {
        console.error("Error al cargar los procedimientos:", error);
    }
}

let isInitialLoad = true;

watch(selectedProcedimientos, (newSelected, oldSelected) => {
    if (isInitialLoad) {
        isInitialLoad = false;
        return;
    }

    const added = newSelected.filter(p => !oldSelected.includes(p));
    const removed = oldSelected.filter(p => !newSelected.includes(p));

    added.forEach(procedimientoNombre => {
        const procedimiento = findProcedimientoByNombre(procedimientoNombre);
        if (procedimiento) {
            const accionData = {
                id_simulacion: id_simulacion,
                descripcion: `Se realizo el procedimiento: ${procedimiento.nombre}`,
                tipo_accion: procedimiento.rubrica,
                puntaje: procedimiento.puntaje,
                retroalimentacion: procedimiento.feed
            };

            registrarAccion(accionData).catch(err => {
                console.error("Error al registrar la acción:", err);
            });
            console.log("Se registro la acción: ", accionData)

            toast.add({
                severity: 'info',
                summary: `Procedimiento ${procedimiento.nombre} seleccionado`,
                detail: `${procedimiento.feed}`,
                life: 3000
            });
        }
    });

    removed.forEach(procedimientoNombre => {
        const descripcion = `Se realizo el procedimiento: ${procedimientoNombre}`;

        eliminarAccion(id_simulacion, descripcion).catch(err => {
            console.error("Error al eliminar la acción:", err);
        });

        toast.add({
            severity: 'warn',
            summary: 'Procedimiento desmarcado',
            detail: `Se desmarcó: ${procedimientoNombre}`,
            life: 3000
        });
    });
}, { deep: true });

function findMedicamentoByNombre(nombre) {
    for (const categoryName in medicamentosData.value) {
        const category = medicamentosData.value[categoryName];
        const medicamento = category.medicamentos.find(m => m.nombre === nombre);
        if (medicamento) {
            return medicamento;
        }
    }
    return null;
}

function closeDialog() {
    store.dispatch('procedimientos/saveSelectedProcedimientos', selectedProcedimientos.value);
    store.dispatch('medicamentos/saveSelectedMedicamentos', selectedMedicamentos.value);
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
        store.dispatch('procedimientos/saveSelectedProcedimientos', selectedProcedimientos.value);
        store.dispatch('medicamentos/saveSelectedMedicamentos', selectedMedicamentos.value);
        router.push('/app');
    }
}

async function loadMedicamentos(id_historia_clinica) {
    try {
        const response = await obtenerMedicamentos(id_historia_clinica);
        medicamentosData.value = response.data;
    } catch (error) {
        console.error("Error al cargar los medicamentos:", error);
    }
}

let isInitialLoadMedicamento = true;

watch(selectedMedicamentos, (newSelected, oldSelected) => {
    if (isInitialLoadMedicamento) {
        isInitialLoadMedicamento = false;
        return;
    }

    const added = newSelected.filter(m => !oldSelected.includes(m));
    const removed = oldSelected.filter(m => !newSelected.includes(m));

    added.forEach(medicamentoNombre => {
        const medicamento = findMedicamentoByNombre(medicamentoNombre);
        if (medicamento) {
            const accionData = {
                id_simulacion: id_simulacion,
                descripcion: `Se suministro el medicamento: ${medicamento.nombre}`,
                tipo_accion: medicamento.rubrica,
                puntaje: medicamento.puntaje,
                retroalimentacion: medicamento.feed
            };

            registrarAccion(accionData).catch(err => {
                console.error("Error al registrar la acción:", err);
            });
            console.log("Se registro la acción: ", accionData)

            toast.add({
                severity: 'info',
                summary: `Medicamento ${medicamento.nombre} seleccionado`,
                detail: `${medicamento.feed}`,
                life: 3000
            });
        }
    });

    removed.forEach(medicamentoNombre => {
        const descripcion = `Se suministró el medicamento: ${medicamentoNombre}`;

        eliminarAccion(id_simulacion, descripcion).catch(err => {
            console.error("Error al eliminar la acción:", err);
        });

        toast.add({
            severity: 'warn',
            summary: 'Medicamento desmarcado',
            detail: `Se desmarcó: ${medicamentoNombre}`,
            life: 3000
        });
    });
}, { deep: true });

onMounted(() => {
    selectedMedicamentos.value = store.getters['medicamentos/selectedMedicamentos'] || [];
    loadMedicamentos(id_historia_clinica);
    selectedProcedimientos.value = store.getters['procedimientos/selectedProcedimientos'] || [];
    loadProcedimientos(id_historia_clinica);
});
</script>

<template>
    <Dialog header="Intervenir" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">
        <h5 class="text-center datos-paciente">Procedimientos y Medicamentos</h5>
        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">Procedimientos</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>

        <Accordion>
            <AccordionTab v-for="(category, categoryName) in procedimientosData" :key="categoryName"
                :header="categoryName">
                <div class="flex-col gap-4">
                    <div v-for="procedimiento in category.procedimientos" :key="procedimiento.nombre"
                        class="flex items-center pt-3">
                        <Checkbox v-model="selectedProcedimientos" :inputId="procedimiento.nombre"
                            :value="procedimiento.nombre" />
                        <label class="pl-3 text-lg" :for="procedimiento.nombre">{{ procedimiento.nombre }}</label>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">Suministrar Medicamentos</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>

        <Accordion>
            <AccordionTab v-for="(category, categoryName) in medicamentosData" :key="categoryName"
                :header="categoryName">
                <div class="flex-col gap-4">
                    <div v-for="medicamento in category.medicamentos" :key="medicamento.nombre"
                        class="flex items-center pt-3">
                        <Checkbox v-model="selectedMedicamentos" :inputId="medicamento.nombre"
                            :value="medicamento.nombre" />
                        <label class="pl-3 text-lg" :for="medicamento.nombre">{{ medicamento.nombre }}</label>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

        <h5>Medicamentos suministrados</h5>
        <div class="grid">
            <div v-if="selectedMedicamentos.length > 0" class="col-12">
                <div v-for="medicamentoNombre in selectedMedicamentos" :key="medicamentoNombre"
                    class="flex items-center pt-3">
                    <Checkbox v-model="selectedMedicamentos" :inputId="medicamentoNombre" :value="medicamentoNombre" />
                    <label class="pl-3 text-lg" :for="medicamentoNombre">{{ medicamentoNombre }}</label>
                </div>
            </div>
            <div v-else class="col-12">
                <p>No hay medicamentos seleccionados.</p>
            </div>
        </div>

        <h5>Procedimientos seleccionados</h5>
        <div class="grid">
            <div v-if="selectedProcedimientos.length > 0" class="col-12">
                <div v-for="procedimientoNombre in selectedProcedimientos" :key="procedimientoNombre"
                    class="flex items-center pt-3">
                    <Checkbox v-model="selectedProcedimientos" :inputId="procedimientoNombre"
                        :value="procedimientoNombre" />
                    <label class="pl-3 text-lg" :for="procedimientoNombre">{{ procedimientoNombre }}</label>
                </div>
            </div>
            <div v-else class="col-12">
                <p>No hay procedimientos seleccionados.</p>
            </div>
        </div>

        <div class="grid pt-4">
            <div class="col md:col-9"></div>
            <div class="col md:col-3">
                <Button style="background-color: #BAC8D9; border: 0px" label="Ok" @click="closeDialog"
                    icon="pi pi-check" />
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


.examen-titulo {
    color: #7abf5a;
}

.data-section-main {
    padding: 2px 0;
    border-bottom: 1px solid #444;
}
</style>