<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { obtenerSubespecialidades } from '@/services/historiaService';
import { registrarAccion } from '@/services/simulacionService';
const display = ref(true);
const router = useRouter();
const position = ref('right');
const store = useStore();
const toast = useToast();
const subespecialidadesData = ref([]);
const selectedSubespecialidades = ref([]);
const id_historia_clinica = localStorage.getItem('id_historia_clinica');
const id_simulacion = localStorage.getItem('id_simulacion');

function closeDialog() {
    store.dispatch('subespecialidades/saveSelectedSubespecialidades', selectedSubespecialidades.value);
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
        store.dispatch('subespecialidades/saveSelectedSubespecialidades', selectedSubespecialidades.value);
        router.push('/app');
    }
}

async function loadSubespecialidades(id_historia_clinica) {
    try {
        const response = await obtenerSubespecialidades(id_historia_clinica);
        subespecialidadesData.value = response.data.map(sub => ({
            ...sub,
            seleccionado: false,
            mostrarDescripcion: false
        }));
    } catch (error) {
        console.error("Error al cargar las subespecialidades:", error);
    }
}


function selectSubespecialidad(subespecialidad) {
    if (!subespecialidad.seleccionado) {
        subespecialidad.loading = true;
        setTimeout(() => {
            subespecialidad.mostrarDescripcion = true;
            subespecialidad.seleccionado = true;
            subespecialidad.loading = false;
            const accionData = {
                id_simulacion: id_simulacion,
                descripcion: `Se consulto con: ${subespecialidad.subespecialidad}`,
                tipo_accion: subespecialidad.rubrica,
                puntaje: subespecialidad.puntaje_subespecialidad,
                retroalimentacion: subespecialidad.feed_subespecialidad
            };

            // eslint-disable-next-line no-unused-vars
            registrarAccion(accionData, (err, result) => {
                if (err) {
                    console.error("Error al registrar la acción:", err);
                }
            });
            toast.add({
                severity: 'info',
                summary: `Se consulto con ${subespecialidad.subespecialidad}`,
                detail: `${subespecialidad.feed_subespecialidad}`,
                life: 3000
            });

            selectedSubespecialidades.value.push(subespecialidad);
            store.dispatch('subespecialidades/saveSelectedSubespecialidades', selectedSubespecialidades.value); // Guardar en Vuex
        }, 2000);
    }
}


onMounted(() => {
    const storedSubespecialidades = store.getters['subespecialidades/selectedSubespecialidades'] || [];
    selectedSubespecialidades.value = storedSubespecialidades;

    loadSubespecialidades(id_historia_clinica).then(() => {
        subespecialidadesData.value.forEach(subespecialidad => {
            const selected = storedSubespecialidades.find(item => item.subespecialidad === subespecialidad.subespecialidad);
            if (selected) {
                subespecialidad.seleccionado = true;
                subespecialidad.mostrarDescripcion = true;
            }
        });
    });
});
</script>

<template>
    <Dialog header="Consulta Externa" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">
        <h5 class="text-center datos-paciente">Subespecialidades Disponibles</h5>
        <div class="grid">
            <div v-for="(subespecialidad, index) in subespecialidadesData" :key="index" class="col-12 md:flex">
                <div class="col md:col-8 text-lg pt-3">
                    <strong>{{ subespecialidad.subespecialidad }}</strong>
                    <p v-if="subespecialidad.mostrarDescripcion" class="mt-2">{{ subespecialidad.descripcion }}</p>
                </div>
                <div class="col md:col-4 pt-2">
                    <Button style="background-color: #7ABF5A; border: 0px" v-if="!subespecialidad.seleccionado"
                        :label="subespecialidad.loading ? 'Consultando...' : 'Consultar'" icon="pi pi-comment"
                        :class="{ 'p-button-loading': subespecialidad.loading }"
                        @click="selectSubespecialidad(subespecialidad)" :disabled="subespecialidad.loading" />
                </div>
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

.data-section-main {
    padding: 2px 0;
    border-bottom: 1px solid #444;
}

.examen-titulo {
    color: #bb86fc;
}
</style>