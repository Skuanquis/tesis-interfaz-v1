<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { obtenerSimulacion } from '@/services/simulacionService';
import { obtenerAccionesSimulacion } from '@/services/simulacionService';
const store = useStore();
const router = useRouter();
const display = ref(false);
const tiempoEmpleado = ref('');
const position = ref('top');
const acciones = ref([]);
const id_simulacion = localStorage.getItem('id_simulacion');
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
        case 'Inutil':
            return 'danger';
        case 'Util':
            return 'success';
        case 'Critico':
            return 'info';
        case 'Innecesaria':
            return 'secondary';
        default:
            return 'secondary';
    }
};


const fetchAcciones = async () => {
    try {
        const response = await obtenerAccionesSimulacion(id_simulacion);
        if (response.data.message === 'No hay acciones registradas para esta simulación') {
            acciones.value = [];// No hay acciones
        } else {
            acciones.value = response.data; // Guardar las acciones en el estado
        }
        display.value = true;
    } catch (error) {
        console.error('Error al obtener las acciones:', error);
    }
};

onMounted(() => {
    fetchSimulacionData();
    fetchAcciones();
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
        <!--
        <button @click="start">Start</button>
        <button @click="stop">Stop</button>
        <button @click="reset">Reset</button>-->
        <div>
            <h4 class="text-center"> Historial de eventos </h4>
        </div>  
        <DataTable :value="acciones" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 30rem"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} al {last} de {totalRecords}">
            <Column field="descripcion" header="Descripción" style="width: 50%"></Column>
            <Column field="tipo_accion" header="Tipo de Acción" style="width: 25%" class="text-center">
                <template #body="slotProps">
                    <Tag :severity="getSeverity(slotProps.data.tipo_accion)" :value="slotProps.data.tipo_accion"
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
</style>