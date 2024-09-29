<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import { obtenerMedicamentos } from '@/services/historiaService';
import { registrarAccion, eliminarAccion } from '@/services/simulacionService';

const display = ref(true);
const router = useRouter();
const position = ref('right');
const toast = useToast();
const store = useStore();

const medicamentosData = ref({});
const selectedMedicamentos = ref([]);

const id_simulacion = localStorage.getItem('id_simulacion');

function closeDialog() {
    store.dispatch('medicamentos/saveSelectedMedicamentos', selectedMedicamentos.value);
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
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

watch(selectedMedicamentos, (newSelected, oldSelected) => {
    const added = newSelected.filter(m => !oldSelected.includes(m));
    const removed = oldSelected.filter(m => !newSelected.includes(m));

    added.forEach(medicamento => {
        const accionData = {
            id_simulacion: id_simulacion,
            descripcion: `Se suministró el medicamento: ${medicamento.nombre}`,
            tipo_accion: medicamento.rubrica,
            puntaje: medicamento.puntaje,
            retroalimentacion: medicamento.feed
        };
        // eslint-disable-next-line no-unused-vars
        registrarAccion(accionData, (err, result) => {
            if (err) {
                console.error("Error al registrar la acción:", err);
            }
        });
        toast.add({
            severity: 'info',
            summary: `Medicamento ${medicamento.nombre} seleccionado`,
            detail: `${medicamento.feed}`,
            life: 3000
        });
    });

    removed.forEach(medicamento => {
        const descripcion = `Se suministró el medicamento: ${medicamento.nombre}`;

        // eslint-disable-next-line no-unused-vars
        eliminarAccion(id_simulacion, descripcion, (err, result) => {
            if (err) {
                console.error("Error al eliminar la acción:", err);
            }
        });
        toast.add({
            severity: 'warn',
            summary: 'Medicamento desmarcado',
            detail: `Se desmarco: ${medicamento.nombre}`,
            life: 3000
        });
    });
});

onMounted(() => {
    selectedMedicamentos.value = store.getters['medicamentos/selectedMedicamentos'] || [];
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    loadMedicamentos(id_historia_clinica);
});


</script>

<template>
    <Dialog header="Intervenir" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">

        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">Procedimientos</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>

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
                        <Checkbox v-model="selectedMedicamentos" :inputId="medicamento.nombre" :value="medicamento" />
                        <label class="pl-3 text-lg" :for="medicamento.nombre">{{ medicamento.nombre }}</label>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

        <h5>Medicamentos suministrados</h5>
        <div class="grid">
            <div v-if="selectedMedicamentos.length > 0" class="col-12">
                <div v-for="category in selectedMedicamentos" :key="category" class="flex items-center pt-3">
                    <Checkbox v-model="selectedMedicamentos" :inputId="category" :value="category" />
                    <label class="pl-3 text-lg" :for="category">{{ category.nombre }}</label>
                </div>
            </div>
            <div v-else class="col-12">
                <p>No hay diagnósticos seleccionados.</p>
            </div>
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