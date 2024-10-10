<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { obtenerSimulacion, obtenerAccionesSimulacion, actualizarPuntajePorcentaje } from '@/services/simulacionService';
import { obtenerPuntajes, obtenerPuntajeTotal, obtenerPuntajeAccionSimulacion } from '@/services/casoService'
const store = useStore();
const router = useRouter();
const display = ref(false);
const tiempoEmpleado = ref('');
const position = ref('top');
const acciones = ref([]);
const id_simulacion = localStorage.getItem('id_simulacion');
const id_historia_clinica = localStorage.getItem('id_historia_clinica');
const puntajeTotal = ref([]);
const puntajes = ref([{}]);
const puntajeAccion = ref([{}]);
const puntajePorcentaje = ref(null);

const fetchSimulacionData = async () => {
    try {
        const id_simulacion = localStorage.getItem('id_simulacion');
        if (id_simulacion) {
            const response = await obtenerSimulacion(id_simulacion);
            tiempoEmpleado.value = response.data.tiempo_empleado;
        }
        display.value = true;
    } catch (error) {
        console.error('Error al obtener los datos de la simulación:', error);
    }
};

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
            acciones.value = [];
        } else {
            acciones.value = response.data;
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
            console.log("Accion: ", puntajeAccion.value[0].cantidad)
        } else {
            puntajeAccion.value = [{}]; // En caso de que no haya datos
        }
    } catch (error) {
        console.error('Error al obtener el puntaje', error);
    }
};

const calcularYActualizarPuntaje = async () => {
    try {
        const totalPuntajesResponse = await obtenerPuntajeTotal(id_historia_clinica);
        const totalPuntajes = totalPuntajesResponse.data[0];

        const puntajesAccionResponse = await obtenerPuntajeAccionSimulacion(id_simulacion);
        const puntajesAccion = puntajesAccionResponse.data;

        const totalA = totalPuntajes.total_puntaje_a || 1;
        const totalB = totalPuntajes.total_puntaje_b || 1;
        const totalC = totalPuntajes.total_puntaje_c || 1;

        const obtenidosA = puntajesAccion.find(p => p.puntaje === 'A')?.cantidad || 0;
        const obtenidosB = puntajesAccion.find(p => p.puntaje === 'B')?.cantidad || 0;
        const obtenidosC = puntajesAccion.find(p => p.puntaje === 'C')?.cantidad || 0;

        const porcentajeA = (obtenidosA / totalA) * 100;
        const porcentajeB = (obtenidosB / totalB) * 100;
        const porcentajeC = (obtenidosC / totalC) * 100;

        // Calcular el porcentaje total
        puntajePorcentaje.value = ((porcentajeA + porcentajeB + porcentajeC) / 3).toFixed(2);

        // Actualizar el porcentaje en el backend
        await actualizarPuntajePorcentaje(id_simulacion, puntajePorcentaje.value);
        console.log('Puntaje porcentaje actualizado exitosamente:', puntajePorcentaje.value);
    } catch (error) {
        console.error('Error al calcular o actualizar el puntaje porcentaje:', error);
    }
};

onMounted(() => {
    fetchSimulacionData();
    fetchAcciones();
    fetchPuntajeSimulacion();
    fetchPuntaje();
    fetchPuntajeAccion();
    calcularYActualizarPuntaje();
});

// Función para eliminar los datos del localStorage al finalizar la simulación
function eliminarLocalStorage() {
    localStorage.removeItem('examenSegmentario');
    localStorage.removeItem('examenFisico');
    localStorage.removeItem('examenObstetrico');
    localStorage.removeItem('id_paciente');
    localStorage.removeItem('id_historia_clinica');
    localStorage.removeItem('minutos');
    localStorage.removeItem('segundos');
    localStorage.removeItem('isActive');
    localStorage.removeItem('id_simulacion');
}

function closeDialog() {
    store.dispatch('navigation/confirmNavigation');
    display.value = false;
    eliminarLocalStorage();
    router.push('/dashboard');
}

function onDialogHide() {
    if (!display.value) {
        store.dispatch('navigation/confirmNavigation');
        router.push('/dashboard');
        eliminarLocalStorage();
    }
}
</script>

<template>
    <Dialog header="Resultados de la simulación" v-model:visible="display" :style="{ width: '40rem', height: '100%' }"
        :modal="true" @hide="onDialogHide" class="p-fluid" :position="position" :draggable="false">
        <div>
            <h4 class="text-center"> Tiempo Transcurrido </h4>
            <h4 class="text-center"> {{ tiempoEmpleado }}</h4>
        </div>
        <div class="text-center">
            <Knob v-model="puntajePorcentaje" :valueTemplate="puntajePorcentaje !== null ? '{value}%' : 'Calculando...'"
                :size="130" readonly />

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
            <div class="col md:col-4"></div>
            <div class="col md:col-4"><Button label="Finalizar" @click="closeDialog" icon="pi pi-check" /></div>
            <div class="col md:col-4"></div>
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