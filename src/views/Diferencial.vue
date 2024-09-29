<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getDiagnosticosDiferenciales } from '@/services/historiaService';
import { registrarAccion, eliminarAccion } from '@/services/simulacionService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const display = ref(true);
const router = useRouter();
const position = ref('left');
const store = useStore();
const selectedCategories = ref([]);
const diagnosticosData = ref({});

const id_simulacion = localStorage.getItem('id_simulacion');

function closeDialog() {
    store.dispatch('diferencial/saveSelectedCategories', selectedCategories.value);
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
        store.dispatch('diferencial/saveSelectedCategories', selectedCategories.value);
        router.push('/app');
    }
}

async function loadDiagnosticos(id_historia_clinica) {
    try {
        const response = await getDiagnosticosDiferenciales(id_historia_clinica);
        diagnosticosData.value = response.data;
    } catch (error) {
        console.error("Error al cargar los diagnósticos diferenciales:", error);
    }
}

watch(selectedCategories, (newSelected, oldSelected) => {
    const added = newSelected.filter(d => !oldSelected.includes(d));
    const removed = oldSelected.filter(d => !newSelected.includes(d));

    added.forEach(diagnostico => {
        const accionData = {
            id_simulacion: id_simulacion,
            descripcion: `Se seleccionó el diagnóstico: ${diagnostico.nombre}`,
            tipo_accion: diagnostico.rubrica,
            puntaje: diagnostico.puntaje,
            retroalimentacion: diagnostico.feed
        };

        // eslint-disable-next-line no-unused-vars
        registrarAccion(accionData, (err, result) => {
            if (err) {
                console.error("Error al registrar la acción:", err);
            }
        });
        toast.add({
            severity: 'info',
            summary: `Diagnóstico ${diagnostico.nombre} seleccionado`,
            detail: `${diagnostico.feed}`,
            life: 3000
        });
    });

    removed.forEach(diagnostico => {
        const descripcion = `Se seleccionó el diagnóstico: ${diagnostico.nombre}`;

        // eslint-disable-next-line no-unused-vars
        eliminarAccion(id_simulacion, descripcion, (err, result) => {
            if (err) {
                console.error("Error al eliminar la acción:", err);
            }
        });
        toast.add({
            severity: 'warn',
            summary: 'Diagnóstico desmarcado',
            detail: `Se desmarco: ${diagnostico.nombre}`,
            life: 3000
        });
    });
});

onMounted(() => {
    selectedCategories.value = store.getters['diferencial/selectedCategories'] || [];
    const id_historia_clinica = localStorage.getItem('id_historia_clinica');
    loadDiagnosticos(id_historia_clinica);
});

</script>

<template>
    <Dialog header="Diagnostico diferencial" v-model:visible="display" :style="{ width: '45vw', height: '100%' }"
        :modal="true" class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">
        <h5 class="text-center datos-paciente">Posibles Diagnosticos</h5>
        <Accordion>
            <AccordionTab v-for="(category, categoryName) in diagnosticosData" :key="categoryName"
                :header="categoryName">
                <div class="flex-col gap-4">
                    <div v-for="diagnostico in category.diagnosticos" :key="diagnostico" class="flex items-center pt-3">
                        <Checkbox v-model="selectedCategories" :inputId="diagnostico" :value="diagnostico" />
                        <label class="pl-3 text-lg" :for="diagnostico">{{ diagnostico.nombre }}</label>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>
        <Divider />

        <h5>Diagnosticos Seleccionados</h5>
        <div class="grid">
            <div v-if="selectedCategories.length > 0" class="col-12">
                <div v-for="category in selectedCategories" :key="category" class="flex items-center pt-3">
                    <Checkbox v-model="selectedCategories" :inputId="category" :value="category" />
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
</style>
