<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { obtenerAnalisis, obtenerImagenologia } from '@/services/historiaService';
import { registrarAccion } from '@/services/simulacionService';

const display = ref(true);
const position = ref('right');
const toast = useToast();
const router = useRouter();
const store = useStore();
const loadingImagenologia = ref({});
const laboratorios = ref({});
const subanalisisVisibilidad = ref({});
const loading = ref({});
const idSimulacion = localStorage.getItem('id_simulacion');

onMounted(() => {
    fetchLaboratorios();
    const realizados = store.getters['laboratorios/laboratoriosRealizados'];
    Object.keys(realizados).forEach(categoria => {
        subanalisisVisibilidad.value[categoria] = true;
    });
});

async function fetchLaboratorios() {
    try {
        const response = await obtenerAnalisis(localStorage.getItem('id_historia_clinica')); // Suponiendo que el id de historia clínica está en el localStorage
        laboratorios.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener los laboratorios', life: 3000 });
    }
}

function toggleSubanalisis(categoria) {
    loading.value[categoria] = true;

    setTimeout(async () => {
        subanalisisVisibilidad.value[categoria] = true;


        const subanalisis = laboratorios.value[categoria].subanalisis;
        const puntaje = laboratorios.value[categoria].puntaje;
        const rubrica = laboratorios.value[categoria].rubrica;
        const feed = laboratorios.value[categoria].feed;
        store.dispatch('laboratorios/realizarLaboratorio', { categoria, subanalisis });

        const descripcion = `Se realizó el laboratorio de ${categoria}`;
        const accionData = {
            id_simulacion: idSimulacion,
            descripcion,
            tipo_accion: rubrica,
            puntaje,
            retroalimentacion: feed,
        };
        try {
            await registrarAccion(accionData);
            toast.add({ severity: 'success', summary: 'Acción registrada', detail: `Se realizó el laboratorio de ${categoria}`, life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la acción', life: 3000 });
        }

        loading.value[categoria] = false;
    }, 2000);
}


onMounted(async () => {
    await fetchImagenologias();
});

async function fetchImagenologias() {
    try {
        const response = await obtenerImagenologia(localStorage.getItem('id_historia_clinica'));
        store.dispatch('imagenologia/saveImagenologias', response.data);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener las imagenologías', life: 3000 });
    }
}

async function realizarImagenologia(categoria, nombre, estudio) {
    loadingImagenologia.value[nombre] = true;

    setTimeout(async () => {
        store.dispatch('imagenologia/realizarImagenologia', nombre);
        const descripcion = `Se realizó el estudio de imagenologia ${nombre} - ${categoria}`;
        const accionData = {
            id_simulacion: idSimulacion,
            descripcion,
            tipo_accion: estudio.rubrica,
            puntaje: estudio.puntaje,
            retroalimentacion: estudio.feed,
        };
        try {
            await registrarAccion(accionData);
            toast.add({ severity: 'success', summary: 'Acción registrada', detail: `Se realizó el estudio de imagenología ${categoria} - ${nombre}`, life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la acción', life: 3000 });
        }

        loadingImagenologia.value[nombre] = false;
    }, 2000);
}

function closeDialog() {
    display.value = false;
    router.push('/app');
}
</script>

<template>
    <Dialog header="Investigar" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        @hide="closeDialog" class="p-fluid" :position="position" :draggable="false">
        <h5 class="text-center datos-paciente">Laboratorios e Imagenología</h5>
        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">Estudios de laboratorio</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>
        <Accordion>
            <AccordionTab header="Laboratorios Disponibles">
                <div v-for="(laboratorio, categoria) in laboratorios" :key="categoria" class="grid p-fluid mb-4">
                    <div class="col md:col-8 text-lg"><strong>{{ categoria }}</strong></div>
                    <div class="col md:col-4">
                        <Button style="background-color: #7ABF5A; border: 0px"
                            v-if="!subanalisisVisibilidad[categoria] && !loading[categoria]" label="Realizar"
                            @click="toggleSubanalisis(categoria)" />
                        <Button style="background-color: #7ABF5A; border: 0px" v-else-if="loading[categoria]"
                            label="Obteniendo..." icon="pi pi-spin pi-spinner" disabled />
                    </div>
                    <div v-if="subanalisisVisibilidad[categoria]" class="col-12">
                        <div v-for="subanalisis in laboratorio.subanalisis" :key="subanalisis.nombre" class="mb-2">
                            <div class="grid">
                                <div class="col md:col-6"><strong>{{ subanalisis.nombre }}: </strong></div>
                                <div class="col md:col-6">{{ subanalisis.resultado }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

        <div class="grid p-fluid">
            <div class="col md:col-12">
                <h5 class="examen-titulo">Estudios de imagenología</h5>
                <div class="data-section-main"></div>
                <div></div>
            </div>
        </div>
        <Accordion>
            <AccordionTab v-for="(estudios, categoria) in store.getters['imagenologia/imagenologias']" :key="categoria"
                :header="categoria">
                <div v-for="estudio in estudios" :key="estudio.nombre" class="grid p-fluid mb-4">
                    <div class="col md:col-8 text-lg pt-3"><strong>{{ estudio.nombre }}</strong></div>
                    <div class="col md:col-4">
                        <!-- Mostrar el botón "Realizar" solo si no se ha presionado antes -->
                        <Button style="background-color: #7ABF5A; border: 0px"
                            v-if="!store.getters['imagenologia/displayedImages'][estudio.nombre] && !loadingImagenologia[estudio.nombre]"
                            label="Realizar" @click="realizarImagenologia(categoria, estudio.nombre, estudio)" />

                        <!-- Mostrar el estado "Obteniendo..." cuando está cargando -->
                        <Button style="background-color: #7ABF5A; border: 0px"
                            v-else-if="loadingImagenologia[estudio.nombre]" label="Obteniendo..."
                            icon="pi pi-spin pi-spinner" disabled />
                    </div>

                    <!-- Mostrar la imagen y la interpretación después de presionar "Realizar" -->
                    <div v-if="store.getters['imagenologia/displayedImages'][estudio.nombre]"
                        class="col-12 text-center">
                        <Image :src="estudio.path" alt="" width="250" preview />
                        <p><strong>Interpretación:</strong> {{ estudio.interpretacion }}</p>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

        <!-- Botón para cerrar el diálogo -->
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
    color: #7abf5a;
}
</style>