<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import {
    obtenerCasosClinicos,
    cambiarEstadoCaso,
    obtenerCasoClinicoPorId,
    obtenerPaciente,
    obtenerPuntaje,
    obtenerCategoriasDiferenciales,
    obtenerDiagnosticosPorCategoria,
    obtenerDiagnosticosDiferencialesPorHistoriaClinica,
    actualizarDiagnosticosDiferenciales
} from '../services/casoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const casosClinicos = ref([]);
const visible = ref(false);
const casoSeleccionado = ref(null);
const paciente = ref({});

const scoreDiagnosticoDiferencial = ref([]);
const categorias = ref([]);
const diagnosticosByCategoria = ref({});
const selectedDiagnosticosPorCategoria = ref({}); // Diagnósticos seleccionados por categoría
const diagnosticoDetails = ref({});
const diagnosesMap = ref({}); // Mapa para acceso rápido a diagnósticos

// Cargar los puntajes
const cargarPuntajeDiagnosticoDiferencial = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreDiagnosticoDiferencial.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const cerrarDialogo = () => {
    visible.value = false;
    localStorage.removeItem('id_historia_clinica');
};

const cargarCasosClinicos = async () => {
    try {
        const response = await obtenerCasosClinicos();
        casosClinicos.value = response.data;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener los casos clínicos',
            life: 3000
        });
    }
};

const toggleEstadoCaso = async (caso) => {
    try {
        const nuevoEstado = caso.estado === 'habilitado' ? 'deshabilitado' : 'habilitado';
        await cambiarEstadoCaso(caso.id_caso_clinico, nuevoEstado);
        caso.estado = nuevoEstado;
        toast.add({
            severity: caso.estado === 'habilitado' ? 'success' : 'warn',
            summary: 'Éxito',
            detail: `Se ha ${nuevoEstado} el caso clínico N°${caso.id_caso_clinico}`,
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cambiar el estado del caso clínico',
            life: 3000
        });
    }
};

const getDificultadSeverity = (dificultad) => {
    switch (dificultad.toLowerCase()) {
        case 'principiante':
            return 'success';
        case 'intermedio':
            return 'warning';
        case 'avanzado':
            return 'danger';
        default:
            return 'info';
    }
};

const cargarDatosPaciente = async (id_historia_clinica) => {
    try {
        const response = await obtenerPaciente(id_historia_clinica);
        const data = response.data[0];
        if (data.fecha_nacimiento) {
            const fecha = new Date(data.fecha_nacimiento);
            data.fecha_nacimiento = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        paciente.value = data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener datos del paciente', life: 3000 });
    }
};

const mostrarDetalleCaso = async (idCaso) => {
    try {
        const response = await obtenerCasoClinicoPorId(idCaso);
        casoSeleccionado.value = response.data;

        await cargarDatosPaciente(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeDiagnosticoDiferencial(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasYDiagnosticos();
        await cargarDiagnosticosDiferenciales(casoSeleccionado.value.id_historia_clinica);

        visible.value = true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el caso clínico', life: 3000 });
    }
};

const cargarCategoriasYDiagnosticos = async () => {
    try {
        const response = await obtenerCategoriasDiferenciales();
        categorias.value = response.data;
        // Inicializar selectedDiagnosticosPorCategoria
        categorias.value.forEach(categoria => {
            selectedDiagnosticosPorCategoria.value[categoria.id_categoria_diferencial] = [];
        });
        // Cargar diagnósticos por categoría y llenar el mapa de diagnósticos
        for (let categoria of categorias.value) {
            const resDiagnosticos = await obtenerDiagnosticosPorCategoria(categoria.id_categoria_diferencial);
            const diagnosticos = resDiagnosticos.data.map(d => ({
                ...d,
                name: d.nombre,
                value: d.id_diagnostico,
            }));
            diagnosticosByCategoria.value[categoria.id_categoria_diferencial] = diagnosticos;
            diagnosticos.forEach(diagnostico => {
                diagnosesMap.value[diagnostico.id_diagnostico] = diagnostico;
            });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías y diagnósticos', life: 3000 });
    }
};

const cargarDiagnosticosDiferenciales = async (id_historia_clinica) => {
    try {
        const response = await obtenerDiagnosticosDiferencialesPorHistoriaClinica(id_historia_clinica);
        const data = response.data;
        // Reiniciar selectedDiagnosticosPorCategoria
        for (let categoriaId in selectedDiagnosticosPorCategoria.value) {
            selectedDiagnosticosPorCategoria.value[categoriaId] = [];
        }
        data.forEach(dd => {
            // Encontrar la categoría del diagnóstico
            const diagnostico = diagnosesMap.value[dd.id_diagnostico];
            if (diagnostico) {
                const categoriaId = diagnostico.id_categoria_diferencial;
                if (!selectedDiagnosticosPorCategoria.value[categoriaId]) {
                    selectedDiagnosticosPorCategoria.value[categoriaId] = [];
                }
                selectedDiagnosticosPorCategoria.value[categoriaId].push(dd.id_diagnostico);
                diagnosticoDetails.value[dd.id_diagnostico] = {
                    feedback: dd.feed_diagnostico_diferencial,
                    score: dd.puntaje_diagnostico_diferencial,
                    nombre: dd.nombre,
                };
            }
        });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar diagnósticos diferenciales', life: 3000 });
    }
};

const getDiagnosisNameById = (diagnosisId) => {
    return diagnosesMap.value[diagnosisId]?.name || '';
};

// Propiedad computada para obtener todos los diagnósticos seleccionados
const allSelectedDiagnosticos = computed(() => {
    let allDiagnosticos = [];
    for (let categoriaId in selectedDiagnosticosPorCategoria.value) {
        allDiagnosticos = allDiagnosticos.concat(selectedDiagnosticosPorCategoria.value[categoriaId]);
    }
    return allDiagnosticos;
});

// Actualizar diagnosticoDetails cuando cambien los diagnósticos seleccionados
watchEffect(() => {
    const allDiagnosticos = allSelectedDiagnosticos.value.map(id => parseInt(id));
    const currentDiagnosticosDetails = Object.keys(diagnosticoDetails.value).map(id => parseInt(id));

    // Diagnósticos añadidos
    allDiagnosticos.forEach(diagnosisId => {
        if (!currentDiagnosticosDetails.includes(diagnosisId)) {
            diagnosticoDetails.value[diagnosisId] = {
                feedback: '',
                score: null,
                nombre: getDiagnosisNameById(diagnosisId),
            };
        }
    });

    // Diagnósticos eliminados
    currentDiagnosticosDetails.forEach(diagnosisId => {
        if (!allDiagnosticos.includes(diagnosisId)) {
            delete diagnosticoDetails.value[diagnosisId];
        }
    });
});

const guardarDiagnosticosDiferenciales = async () => {
    try {
        const data = allSelectedDiagnosticos.value.map(diagnosisId => ({
            id_diagnostico: diagnosisId,
            feed_diagnostico_diferencial: diagnosticoDetails.value[diagnosisId].feedback,
            puntaje_diagnostico_diferencial: diagnosticoDetails.value[diagnosisId].score,
        }));

        await actualizarDiagnosticosDiferenciales(casoSeleccionado.value.id_historia_clinica, data);

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Diagnósticos diferenciales guardados correctamente', life: 3000 });
        visible.value = false;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar diagnósticos diferenciales', life: 3000 });
    }
};

onMounted(() => {
    cargarCasosClinicos();
});
</script>




<template>
    <div class="grid">
        <div v-for="caso in casosClinicos" :key="caso.id_caso_clinico" class="col md:col-4">
            <Card style="overflow: hidden">
                <template #title>Caso N° {{ caso.id_caso_clinico }}</template>
                <template #subtitle>Autor: {{ caso.autor }}</template>
                <template #content>
                    <div class="grid">
                        <div class="col md:col-12 capitalize"><strong>Nombre: </strong>{{ caso.nombre }} {{ caso.paterno
                            }} {{
                                caso.materno }}</div>
                    </div>
                    <div class="grid">
                        <div class="col md:col-4"><strong>Peso: </strong>{{ caso.peso }} kg</div>
                        <div class="col md:col-4"><strong>Talla: </strong>{{ caso.talla }} m</div>
                        <div class="col md:col-4 capitalize"><strong>Sexo: </strong>{{ caso.sexo }}</div>
                    </div>
                    <p class="m-0 text-justify">
                        {{ caso.descripcion }}
                    </p>
                    <div class="grid pt-2">
                        <div class="col md:col-12"><strong>Categoría: </strong>
                            <Tag :value="caso.categoria" severity="info" />
                        </div>
                    </div>
                    <div class="grid">
                        <div class="col md:col-12"><strong>Dificultad: </strong>
                            <Tag :value="caso.difucultad" :severity="getDificultadSeverity(caso.difucultad)" />
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex gap-3 mt-1">
                        <Button :label="caso.estado === 'deshabilitado' ? 'Habilitar' : 'Deshabilitar'"
                            @click="toggleEstadoCaso(caso)"
                            :severity="caso.estado === 'deshabilitado' ? 'contrast' : 'danger'" class="w-full" />
                        <Button label="Ver" class="w-full" @click="mostrarDetalleCaso(caso.id_caso_clinico)" />
                    </div>
                </template>
            </Card>
        </div>
        <Dialog v-model:visible="visible" modal header="Ver caso clínico" :style="{ width: '65rem' }">
            <div class="justify-content-center">
                <Stepper>
                    <StepperPanel header="Diagnostico Diferencial">
                        <template #content="{ prevCallback, nextCallback }">
                            <h5>Selecciona los diagnósticos para el caso</h5>

                            <!-- Iterar sobre categorías -->
                            <div v-for="categoria in categorias" :key="categoria.id_categoria_diferencial" class="pt-4">
                                <div class="grid">
                                    <div class="col-12">
                                        <h5>{{ categoria.categoria }}</h5>
                                    </div>
                                </div>
                                <div class="card flex justify-content-center">
                                    <SelectButton
                                        v-model="selectedDiagnosticosPorCategoria[categoria.id_categoria_diferencial]"
                                        :options="diagnosticosByCategoria[categoria.id_categoria_diferencial]"
                                        optionLabel="name" optionValue="value" multiple aria-labelledby="multiple" />
                                </div>

                                <!-- Campos dinámicos para diagnósticos seleccionados en esta categoría -->
                                <div v-for="(diagnosisId, index) in selectedDiagnosticosPorCategoria[categoria.id_categoria_diferencial]"
                                    :key="diagnosisId" class="grid pt-3">
                                    <div class="col md:col-4">
                                        <h6>Diagnóstico {{ index + 1 }}: {{ diagnosticoDetails[diagnosisId]?.nombre }}
                                        </h6>
                                    </div>
                                    <div class="col md:col-4">
                                        <FloatLabel>
                                            <Textarea v-model="diagnosticoDetails[diagnosisId].feedback" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedback">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-3">
                                        <FloatLabel>
                                            <Dropdown v-model="diagnosticoDetails[diagnosisId].score"
                                                :options="scoreDiagnosticoDiferencial" optionLabel="name"
                                                optionValue="value" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
                                            <label for="score">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-1"></div>
                                </div>
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>
                </Stepper>

                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click=cerrarDialogo></Button>
                    <Button label="Guardar" @click="guardarDiagnosticosDiferenciales" severity="success"
                        icon="pi pi-save" />
                    <Button type=" button" label="Guardar" @click="visible = false"></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>