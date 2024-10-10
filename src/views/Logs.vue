<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { obtenerAccionesSimulacion } from '@/services/simulacionService';
import { obtenerPuntajes, obtenerPuntajeTotal, obtenerPuntajeAccionSimulacion } from '@/services/casoService'

const store = useStore();

const minutos = computed(() => store.state.timer.minutos);
const segundos = computed(() => store.state.timer.segundos);
const acciones = ref([]);
const puntajeTotal = ref([]);
const puntajes = ref([{}]);
const puntajeAccion = ref([{}]);
const id_simulacion = localStorage.getItem('id_simulacion');
const id_historia_clinica = localStorage.getItem('id_historia_clinica');

//const noAcciones = ref(false);
//const isActive = computed(() => store.state.timer.isActive);

const formattedTime = computed(() => {
    return `${minutos.value}:${segundos.value < 10 ? '0' + segundos.value : segundos.value}`;
});

/*
function start() {
    if (!isActive.value) {
        store.dispatch('timer/startTimer');
    }
}

function stop() {
    if (isActive.value) {
        store.dispatch('timer/stopTimer');
    }
}

function reset() {
    store.dispatch('timer/resetTimer');
}*/

//import { useToast } from 'primevue/usetoast';
//import { getInfoHistoria } from '@/services/historiaService';

const display = ref(false);
const router = useRouter();
//const toast = useToast();

const position = ref('bottom');

const getSeverity = (status) => {
    switch (status) {
        case 'A':
            return 'success';
        case 'B':
            return 'primary';
        case 'C':
            return 'info';
        case 'D':
            return 'warning';
        default:
            return 'danger';
    }
};


const fetchAcciones = async () => {
    try {
        const response = await obtenerAccionesSimulacion(id_simulacion);
        if (response.data.message === 'No hay acciones registradas para esta simulación') {
            acciones.value = [];// No hay acciones
        } else {
            acciones.value = response.data; // Guardar las acciones en el estado
            //console.log("Esta: ", acciones.value)
        }
        display.value = true;
    } catch (error) {
        console.error('Error al obtener las acciones:', error);
    }
};

const fetchPuntajeSimulacion = async () => {
    try {
        const response = await obtenerPuntajeTotal(id_historia_clinica);
        puntajeTotal.value = response.data[0]
        console.log(puntajeTotal.value)
    } catch (error) {
        console.error('Error al obtener el puntaje total', error)
    }
}


const fetchPuntaje = async () => {
    try {
        const response = await obtenerPuntajes(id_historia_clinica);
        if (response.data && response.data.length > 0) {
            puntajes.value = response.data;
        } else {
            puntajes.value = [{}]; // En caso de que no haya datos
        }
    } catch (error) {
        console.error('Error al obtener el puntaje', error);
    }
};

const fetchPuntajeAccion = async () => {
    try {
        const response = await obtenerPuntajeAccionSimulacion(id_simulacion);
        if (response.data && response.data.length > 0) {
            puntajeAccion.value = response.data;
            //console.log("Accion: ", puntajeAccion.value[0].cantidad)
        } else {
            puntajeAccion.value = [{}]; // En caso de que no haya datos
        }
    } catch (error) {
        console.error('Error al obtener el puntaje', error);
    }
};



onMounted(() => {
    fetchAcciones();
    fetchPuntajeSimulacion();
    fetchPuntaje();
    fetchPuntajeAccion();
});

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
    <Dialog header="Historial de la simulación" v-model:visible="display" :style="{ width: '40rem', height: '100%' }"
        :modal="true" @hide="onDialogHide" class="p-fluid" :position="position" :draggable="false">
        <div>
            <h4 class="text-center"> Tiempo Transcurrido </h4>
        </div>
        <div>
            <h1 class="text-center"> {{ formattedTime }} </h1>
        </div>
        <div>
            <h4 class="text-center"> Historial de eventos </h4>
        </div>

        <div class="grid">
            <div class="col md:col-3 text-right">
                <h6><strong>{{ puntajes[0]?.rubrica || 'Sin rubrica' }}</strong></h6>
            </div>
            <div class="col md:col-8">
                <div class="progress-container">
                    <div class="progress-bar-a"
                        :style="{ width: ((puntajeAccion[0]?.cantidad || 0) / (puntajeTotal?.total_puntaje_a || 1)) * 100 + '%' }">
                        <span class="progress-text">{{ (puntajeAccion[0]?.cantidad || 0) }} / {{
                            puntajeTotal?.total_puntaje_a || 0 }}</span>
                    </div>
                </div>
            </div>
            <div class="col md:col-1"></div>
            <div class="col md:col-3 text-right">
                <h6><strong>{{ puntajes[1]?.rubrica || 'Sin rubrica' }}</strong></h6>
            </div>
            <div class="col md:col-8">
                <div class="progress-container">
                    <div class="progress-bar-b"
                        :style="{ width: ((puntajeAccion[1]?.cantidad || 0) / (puntajeTotal?.total_puntaje_b || 1)) * 100 + '%' }">
                        <span class="progress-text">{{ (puntajeAccion[1]?.cantidad || 0) }} / {{
                            puntajeTotal?.total_puntaje_b || 0 }}</span>
                    </div>
                </div>
            </div>
            <div class="col md:col-1"></div>
        </div>


        <DataTable :value="acciones" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 30rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} al {last} de {totalRecords}">
            <Column field="descripcion" header="Descripción" style="width: 50%"></Column>
            <Column field="tipo_accion" header="Tipo de Acción" style="width: 25%" class="text-center">
                <template #body="slotProps">
                    <Tag :severity="getSeverity(slotProps.data.puntaje)" :value="slotProps.data.tipo_accion"
                        class="text-sm" />
                </template>
            </Column>
            <Column field="hora_accion" header="Hora" style="width: 25%"></Column>
        </DataTable>
        <div class="grid ">
            <div class="col md:col-3"></div>
            <div class="col md:col-3"></div>
            <div class="col md:col-3"></div>
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

.progress-container {
    width: 100%;
    max-width: 400px;
    /* Ancho máximo para la barra */
    background-color: #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    /* Para evitar que el contenido se salga del borde */
    margin: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar-a {
    height: 20px;
    /* Ajusta la altura */
    background-color: #4caf50;
    /* Color verde */
    border-radius: 12px 0 0 12px;
    /* Bordes redondeados solo en la izquierda */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.4s ease;
    color: white;
    /* Texto blanco dentro de la barra */
    font-weight: bold;
    font-size: 14px;
}

.progress-bar-b {
    height: 20px;
    /* Ajusta la altura */
    background-color: #1f4de6;
    /* Color verde */
    border-radius: 12px 0 0 12px;
    /* Bordes redondeados solo en la izquierda */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.4s ease;
    color: white;
    /* Texto blanco dentro de la barra */
    font-weight: bold;
    font-size: 14px;
}

.progress-text {
    padding: 0 10px;
    /* Espacio interno para el texto */
}
</style>