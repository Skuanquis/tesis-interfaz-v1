<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { obtenerGrupos } from '@/services/grupoService';
import { obtenerSimulaciones, obtenerDetallesSimulacion } from '@/services/simulacionService';
import { jwtDecode } from "jwt-decode";
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


const toast = useToast();

const grupos = ref([]);
const simulaciones = ref([]);
const loading = ref(true);
const usuarioRol = ref('');
const mostrarDropdown = computed(() => usuarioRol.value !== 'estudiante');
const selectedGroup = ref(null);

const dialogoVerAcciones = ref(false);

const selectedSimulation = ref({
    puntaje_porcentaje: null,
    fecha_inicio: null,
    fecha_fin: null,
    tiempo_empleado: null,
    diagnostico_final: null,
    diagnosticoAcertado: false,
    ultimaAccionCorrecta: false
});
const acciones = ref([]);
const puntajes = ref({
    puntaje_anamnesis: { puntaje_a: 0, puntaje_a_max: 0, puntaje_b: 0, puntaje_b_max: 0, puntaje_c: 0, puntaje_c_max: 0, puntaje_d: 0, puntaje_d_max: 0, puntaje_e: 0, puntaje_e_max: 0 },
    puntaje_examen: { puntaje_a: 0, puntaje_a_max: 0, puntaje_b: 0, puntaje_b_max: 0, puntaje_c: 0, puntaje_c_max: 0, puntaje_d: 0, puntaje_d_max: 0, puntaje_e: 0, puntaje_e_max: 0 },
    puntaje_diferencial: { puntaje_a: 0, puntaje_a_max: 0, puntaje_b: 0, puntaje_b_max: 0, puntaje_c: 0, puntaje_c_max: 0, puntaje_d: 0, puntaje_d_max: 0, puntaje_e: 0, puntaje_e_max: 0 },
    puntaje_laboratorio: { puntaje_a: 0, puntaje_a_max: 0, puntaje_b: 0, puntaje_b_max: 0, puntaje_c: 0, puntaje_c_max: 0, puntaje_d: 0, puntaje_d_max: 0, puntaje_e: 0, puntaje_e_max: 0 },
    puntaje_intervenir: { puntaje_a: 0, puntaje_a_max: 0, puntaje_b: 0, puntaje_b_max: 0, puntaje_c: 0, puntaje_c_max: 0, puntaje_d: 0, puntaje_d_max: 0, puntaje_e: 0, puntaje_e_max: 0 },
    puntaje_externa: { puntaje_a: 0, puntaje_a_max: 0, puntaje_b: 0, puntaje_b_max: 0, puntaje_c: 0, puntaje_c_max: 0, puntaje_d: 0, puntaje_d_max: 0, puntaje_e: 0, puntaje_e_max: 0 }
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre_completo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    id_historia_clinica: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    tiempo_empleado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    fecha_simulacion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    puntaje_porcentaje: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
});

const token = localStorage.getItem('token');
let decodedToken = {};
try {
    decodedToken = jwtDecode(token);
} catch (error) {
    console.error('Token inválido:', error);
}
const idUsuario = ref(decodedToken.id || null);
usuarioRol.value = decodedToken.role || 'estudiante';

const cargarGrupos = async () => {
    try {
        if (usuarioRol.value === 'administrador') {
            const response = await obtenerGrupos(idUsuario.value, 'administrador');
            grupos.value = [{ nombre: 'Todos', id_grupo: 0 }, ...response.data];
        } else if (usuarioRol.value === 'medico') {
            const response = await obtenerGrupos(idUsuario.value, 'medico');
            grupos.value = response.data;
        }
    } catch (error) {
        console.error('Error al cargar los grupos:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los grupos.', life: 3000 });
    }
};

const cargarSimulaciones = async () => {
    try {
        loading.value = true;
        const id_grupo = selectedGroup.value ? selectedGroup.value.id_grupo : null;
        const response = await obtenerSimulaciones(idUsuario.value, id_grupo);
        simulaciones.value = response.data.map(simulacion => {
            let puntaje = parseFloat(simulacion.puntaje_porcentaje.replace('%', ''));
            if (isNaN(puntaje)) {
                puntaje = null;
            }
            return {
                ...simulacion,
                fecha_simulacion: simulacion.fecha_simulacion ? new Date(simulacion.fecha_simulacion) : null,
                puntaje_porcentaje: puntaje
            };
        });
    } catch (error) {
        console.error('Error al cargar las simulaciones:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las simulaciones.', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre_completo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        id_historia_clinica: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        tiempo_empleado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        fecha_simulacion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        puntaje_porcentaje: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    };
};

const clearFilter = () => {
    initFilters();
};

const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    return `${value}%`;
};

const formatDate = (value) => {
    if (!value) return '';
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatDateTime = (value) => {
    if (!value) return '';
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const seconds = String(value.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getSeverity = (value) => {
    if (value === null || isNaN(value)) return 'warning';
    if (value < 50) return 'danger';
    if (value < 75) return 'warning';
    return 'success';
};

const obtenerDetalles = async (id_realiza_simulacion) => {
    try {
        const detalles = await obtenerDetallesSimulacion(id_realiza_simulacion);
        selectedSimulation.value = {
            ...detalles.simulacion,
            fecha_inicio: detalles.simulacion.fecha_inicio ? new Date(detalles.simulacion.fecha_inicio) : null,
            fecha_fin: detalles.simulacion.fecha_fin ? new Date(detalles.simulacion.fecha_fin) : null,
            diagnosticoAcertado: detalles.diagnosticoAcertado,
            ultimaAccionCorrecta: detalles.ultimaAccionCorrecta
        };
        acciones.value = detalles.acciones;
        puntajes.value = detalles.puntajes;

        console.log('Selected Simulation:', selectedSimulation.value);
        console.log('Acciones:', acciones.value);
        console.log('Puntajes:', puntajes.value);
    } catch (error) {
        console.error('Error al obtener los detalles de la simulación:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los detalles de la simulación.', life: 3000 });
    }
};

const totalAcciones = computed(() => {
    return acciones.value.length;
});

const calcularPorcentaje = (tipo, seccion) => {
    const tipoLower = tipo.toLowerCase();
    const total_puntaje = puntajes.value[seccion][`puntaje_${tipoLower}_max`] || 1; // Evitar división por cero
    const puntaje_obtenido = puntajes.value[seccion][`puntaje_${tipoLower}`] || 0;
    const porcentaje = ((puntaje_obtenido / total_puntaje) * 100).toFixed(2);
    return `${porcentaje}%`;
};

const verDetalle = async (data) => {
    await obtenerDetalles(data.id_realiza_simulacion);
    dialogoVerAcciones.value = true;
};

const generatePDF = () => {
    if (!selectedSimulation.value.id_realiza_simulacion) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No hay una simulación seleccionada.', life: 3000 });
        return;
    }

    console.log('Acciones para PDF:', acciones.value);

    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Detalles de la Simulación", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Fecha Inicio: ${formatDateTime(selectedSimulation.value.fecha_inicio)}`, 14, 30);
    doc.text(`Fecha Fin: ${formatDateTime(selectedSimulation.value.fecha_fin)}`, 14, 36);
    doc.text(`Tiempo Empleado: ${selectedSimulation.value.tiempo_empleado}`, 14, 42);
    doc.text(`Diagnóstico Final: ${selectedSimulation.value.diagnostico_final}`, 14, 48);
    doc.text(`Diagnóstico Acertado: ${selectedSimulation.value.diagnosticoAcertado ? 'Sí' : 'No'}`, 14, 54);
    doc.text(`Última Acción Correcta: ${selectedSimulation.value.ultimaAccionCorrecta ? 'Sí' : 'No'}`, 14, 60);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Resumen Detallado", 14, 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const resumenText = `
Total de Acciones: ${totalAcciones.value}
Decisiones para Anamnesis: ${puntajes.value.puntaje_anamnesis.puntaje_a}/${puntajes.value.puntaje_anamnesis.puntaje_a_max}
Decisiones de tipo Examen: ${puntajes.value.puntaje_examen.puntaje_a}/${puntajes.value.puntaje_examen.puntaje_a_max}
Decisiones de tipo Diagnóstico Diferencial: ${puntajes.value.puntaje_diferencial.puntaje_a}/${puntajes.value.puntaje_diferencial.puntaje_a_max}
Decisiones de tipo Laboratorio: ${puntajes.value.puntaje_laboratorio.puntaje_a}/${puntajes.value.puntaje_laboratorio.puntaje_a_max}
Decisiones de tipo Intervenir: ${puntajes.value.puntaje_intervenir.puntaje_a}/${puntajes.value.puntaje_intervenir.puntaje_a_max}
    `;
    doc.text(resumenText, 14, 80);

    // Tabla de Acciones Realizadas
    const headers = ['Descripción', 'Tipo de Acción', 'Tiempo', 'Puntaje', 'Retroalimentación'];
    const accionesData = acciones.value.map(accion => [
        accion.descripcion || 'N/D',
        accion.tipo_accion || 'N/D',
        accion.hora_accion || 'N/D',
        accion.puntaje || 'N/D',
        accion.retroalimentacion || 'N/D'
    ]);

    doc.autoTable({
        head: [headers],
        body: accionesData,
        startY: 90,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 10 },
        theme: 'striped'
    });

    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const day = String(fechaActual.getDate()).padStart(2, '0');
    const fechaActualDoc = `${year}-${month}-${day}`;
    doc.save(`Detalles_Simulacion_${fechaActualDoc}.pdf`);
};

onMounted(() => {
    initFilters();
    cargarGrupos();
    cargarSimulaciones();
});
</script>

<template>
    <div>
        <div v-if="usuarioRol !== 'estudiante'" class="card">
            <div class="grid p-fluid">
                <div class="col md:col-6 flex align-content-center flex-wrap text-2xl">Datos Importantes</div>
                <div v-if="mostrarDropdown" class="col md:col-4">
                    <Dropdown v-model="selectedGroup" :options="grupos" optionLabel="nombre"
                        placeholder="Seleccione un grupo" class="p-column-filter" showClear />
                </div>
                <div class="col md:col-2">
                    <Button label="Aplicar" icon="pi pi-check" iconPos="right" @click="cargarSimulaciones" />
                </div>
            </div>
        </div>

        <!-- Tabla de Simulaciones -->
        <div class="card">
            <DataTable v-model:filters="filters" stripedRows :value="simulaciones" paginator showGridlines :rows="10"
                dataKey="id_realiza_simulacion" filterDisplay="menu" :loading="loading"
                :globalFilterFields="['nombre_completo', 'id_historia_clinica', 'tiempo_empleado', 'fecha_simulacion', 'puntaje_porcentaje']">
                <template #header>
                    <div class="flex justify-content-between">
                        <Button type="button" icon="pi pi-filter-slash" label="Limpiar" outlined
                            @click="clearFilter()" />
                        <div class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <InputText v-model="filters.global.value" placeholder="Palabra clave" />
                        </div>
                    </div>
                </template>
                <template #empty> No se encontraron registros. </template>

                <!-- Columnas de la Tabla -->
                <Column field="nombre_completo" header="Nombre" style="min-width: 12rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                            placeholder="Buscar por nombre" />
                    </template>
                </Column>
                <Column field="id_historia_clinica" header="Historia Clínica" style="min-width: 12rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                            placeholder="Buscar por historia" />
                    </template>
                </Column>
                <Column field="tiempo_empleado" header="Tiempo Empleado" style="min-width: 10rem">
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                            placeholder="Buscar por tiempo" />
                    </template>
                </Column>
                <Column field="fecha_simulacion" header="Fecha Simulación" dataType="date" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ formatDate(data.fecha_simulacion) }}
                    </template>
                    <template #filter="{ filterModel }">
                        <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy"
                            mask="99/99/9999" />
                    </template>
                </Column>
                <Column field="puntaje_porcentaje" header="Puntaje Porcentaje" dataType="numeric"
                    style="min-width: 10rem">
                    <template #body="{ data }">
                        <Tag :value="formatPercentage(data.puntaje_porcentaje)"
                            :severity="getSeverity(data.puntaje_porcentaje)" v-if="data.puntaje_porcentaje !== null" />
                        <Tag value="N/A" severity="warning" v-else />
                    </template>
                    <template #filter="{ filterModel }">
                        <InputNumber v-model="filterModel.value" mode="decimal" minFractionDigits="0"
                            maxFractionDigits="2" class="p-column-filter" placeholder="Buscar por puntaje" :min="0"
                            :max="100" />
                    </template>
                </Column>
                <Column class="text-center" header="Acciones" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2"
                            @click="verDetalle(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Diálogo para ver los detalles de la simulación -->
        <Dialog v-model:visible="dialogoVerAcciones" modal header="Simulación" :style="{ width: '70vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :closable="true">
            <template #header>
                <div class="text-center">
                    <h5 class="text-2xl">Datos de la Simulación</h5>
                </div>
            </template>
            <div class="grid">
                <div class="col md:col-4">
                    <div class="card">
                        <div class="text-center">
                            <Knob v-model="selectedSimulation.puntaje_porcentaje"
                                :valueTemplate="selectedSimulation.puntaje_porcentaje !== null ? '{value}%' : 'Calculando...'"
                                :size="130" readonly />
                        </div>
                        <h6 class="text-left">
                            <strong>Fecha Inicio: </strong>{{ formatDateTime(selectedSimulation.fecha_inicio) }}
                        </h6>
                        <h6 class="text-left">
                            <strong>Fecha Fin: </strong>{{ formatDateTime(selectedSimulation.fecha_fin) }}
                        </h6>
                        <h6 class="text-left"><strong>Tiempo Empleado: </strong>{{ selectedSimulation.tiempo_empleado }}
                        </h6>
                        <h6 class="text-left"><strong>Diagnóstico Final: </strong>{{
                            selectedSimulation.diagnostico_final }}
                        </h6>
                        <!-- Verificación de Diagnóstico Acertado -->
                        <h6 class="text-left">
                            <strong>¿Diagnostico correcto?: </strong>
                            <Tag :value="selectedSimulation.diagnosticoAcertado ? 'Sí' : 'No'"
                                :severity="selectedSimulation.diagnosticoAcertado ? 'success' : 'danger'" />
                        </h6>
                        <!-- Verificación de Última Acción Correcta -->
                        <h6 class="text-left">
                            <strong>¿Desición correcta?: </strong>
                            <Tag :value="selectedSimulation.ultimaAccionCorrecta ? 'Sí' : 'No'"
                                :severity="selectedSimulation.ultimaAccionCorrecta ? 'success' : 'danger'" />
                        </h6>
                    </div>
                </div>
                <!-- Resumen Detallado -->
                <div class="col md:col-8">
                    <div class="card">
                        <h6 class="text-center">Resumen Detallado</h6>
                        <div class="grid">
                            <!-- Total de Acciones -->
                            <div class="col md:col-4">
                                <h5>{{ totalAcciones }}</h5>
                                <p>Total de acciones</p>
                            </div>
                            <!-- Decisiones Tipo A (Anamnesis) -->
                            <div class="col md:col-4">
                                <h5>{{ puntajes.puntaje_anamnesis.puntaje_a }}/{{
                                    puntajes.puntaje_anamnesis.puntaje_a_max }}
                                </h5>
                                <p>Decisiones para Anamnesis</p>
                                <ProgressBar
                                    :value="((puntajes.puntaje_anamnesis.puntaje_a / puntajes.puntaje_anamnesis.puntaje_a_max) * 100).toFixed(2)" />
                            </div>
                            <!-- Decisiones Tipo B (Examen) -->
                            <div class="col md:col-4">
                                <h5>{{ puntajes.puntaje_examen.puntaje_a }}/{{ puntajes.puntaje_examen.puntaje_a_max }}
                                </h5>
                                <p>Decisiones de tipo Examen</p>
                                <ProgressBar
                                    :value="((puntajes.puntaje_examen.puntaje_a / puntajes.puntaje_examen.puntaje_a_max) * 100).toFixed(2)" />
                            </div>
                            <!-- Decisiones Tipo C (Diagnóstico Diferencial) -->
                            <div class="col md:col-4">
                                <h5>{{ puntajes.puntaje_diferencial.puntaje_a }}/{{
                                    puntajes.puntaje_diferencial.puntaje_a_max
                                }}</h5>
                                <p>Decisiones de tipo Diagnóstico Diferencial</p>
                                <ProgressBar
                                    :value="((puntajes.puntaje_diferencial.puntaje_a / puntajes.puntaje_diferencial.puntaje_a_max) * 100).toFixed(2)" />
                            </div>
                            <!-- Decisiones Tipo D (Laboratorio) -->
                            <div class="col md:col-4">
                                <h5>{{ puntajes.puntaje_laboratorio.puntaje_a }}/{{
                                    puntajes.puntaje_laboratorio.puntaje_a_max
                                }}</h5>
                                <p>Decisiones de tipo Laboratorio</p>
                                <ProgressBar
                                    :value="((puntajes.puntaje_laboratorio.puntaje_a / puntajes.puntaje_laboratorio.puntaje_a_max) * 100).toFixed(2)" />
                            </div>
                            <!-- Decisiones Tipo E (Intervenir) -->
                            <div class="col md:col-4">
                                <h5>{{ puntajes.puntaje_intervenir.puntaje_a }}/{{
                                    puntajes.puntaje_intervenir.puntaje_a_max }}
                                </h5>
                                <p>Decisiones de tipo Intervenir</p>
                                <ProgressBar
                                    :value="((puntajes.puntaje_intervenir.puntaje_a / puntajes.puntaje_intervenir.puntaje_a_max) * 100).toFixed(2)" />
                            </div>
                            <!-- Paciente y Exámenes -->
                            <div class="col md:col-4">
                                <p>Paciente: {{ calcularPorcentaje('a', 'puntaje_anamnesis') }}</p>
                                <p>Exámenes: {{ calcularPorcentaje('a', 'puntaje_examen') }}</p>
                            </div>
                            <!-- Investigar y Diagnósticos Diferenciales -->
                            <div class="col md:col-4">
                                <p>Investigar: {{ calcularPorcentaje('a', 'puntaje_laboratorio') }}</p>
                                <p>Diagnósticos Diferenciales: {{ calcularPorcentaje('a', 'puntaje_diferencial') }}</p>
                            </div>
                            <!-- Intervenir y Consulta Externa -->
                            <div class="col md:col-4">
                                <p>Intervenir: {{ calcularPorcentaje('a', 'puntaje_intervenir') }}</p>
                                <p>Consulta Externa: {{ calcularPorcentaje('a', 'puntaje_externa') }}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <!-- Tabla de Acciones Realizadas -->
            <div class="card">
                <DataTable :value="acciones" showGridlines tableStyle="min-width: 50rem">
                    <Column field="descripcion" header="Descripción"></Column>
                    <Column field="tipo_accion" header="Tipo de Acción"></Column>
                    <Column field="hora_accion" header="Tiempo"></Column>
                    <Column field="puntaje" header="Puntaje"></Column>
                    <Column field="retroalimentacion" header="Retroalimentación"></Column>
                </DataTable>
            </div>
            <div class="flex justify-content-end mt-4">
                <Button label="Exportar a PDF" icon="pi pi-file-pdf" class="p-button-danger" @click="generatePDF" />
            </div>
        </Dialog>
    </div>
</template>