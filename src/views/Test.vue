<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import {
    obtenerCasosClinicos,
    cambiarEstadoCaso,
    obtenerCasoClinicoPorId,
    obtenerPaciente,
    obtenerPuntaje,
    obtenerCategoriasMedicamentos,
    obtenerMedicamentosPorCategoria,
    obtenerMedicamentosSuministradosPorHistoriaClinica,
    actualizarMedicamentosSuministrados
} from '../services/casoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const casosClinicos = ref([]);
const visible = ref(false);
const casoSeleccionado = ref(null);
const paciente = ref({});

const scoreMedicamentos = ref([]);
const categoriasMedicamentos = ref([]);
const medicamentosPorCategoria = ref({});
const selectedMedicamentosPorCategoria = ref({});
const medicamentoDetails = ref({});
const medicamentosMap = ref({});

const cargarPuntajeMedicamentos = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreMedicamentos.value = response.data.map(item => ({
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
        await cargarPuntajeMedicamentos(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasYMedicamentos();
        await cargarMedicamentosSuministrados(casoSeleccionado.value.id_historia_clinica);


        visible.value = true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el caso clínico', life: 3000 });
    }
};

const cargarCategoriasYMedicamentos = async () => {
    try {
        const response = await obtenerCategoriasMedicamentos();
        categoriasMedicamentos.value = response.data;
        categoriasMedicamentos.value.forEach(categoria => {
            selectedMedicamentosPorCategoria.value[categoria.id_categoria_medicamento] = [];
        });
        for (let categoria of categoriasMedicamentos.value) {
            const resMedicamentos = await obtenerMedicamentosPorCategoria(categoria.id_categoria_medicamento);
            const medicamentos = resMedicamentos.data.map(m => ({
                ...m,
                name: m.nombre,
                value: m.id_medicamento,
            }));
            medicamentosPorCategoria.value[categoria.id_categoria_medicamento] = medicamentos;
            medicamentos.forEach(medicamento => {
                medicamentosMap.value[medicamento.id_medicamento] = medicamento;
            });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías y medicamentos', life: 3000 });
    }
};

const cargarMedicamentosSuministrados = async (id_historia_clinica) => {
    try {
        const response = await obtenerMedicamentosSuministradosPorHistoriaClinica(id_historia_clinica);
        const data = response.data;
        for (let categoriaId in selectedMedicamentosPorCategoria.value) {
            selectedMedicamentosPorCategoria.value[categoriaId] = [];
        }
        data.forEach(ms => {
            const medicamento = medicamentosMap.value[ms.id_medicamento];
            if (medicamento) {
                const categoriaId = medicamento.id_categoria_medicamento;
                if (!selectedMedicamentosPorCategoria.value[categoriaId]) {
                    selectedMedicamentosPorCategoria.value[categoriaId] = [];
                }
                selectedMedicamentosPorCategoria.value[categoriaId].push(ms.id_medicamento);
                medicamentoDetails.value[ms.id_medicamento] = {
                    feedback: ms.feed_medicamento_diferencial,
                    score: ms.puntaje_medicamento_diferencial,
                    nombre: ms.nombre,
                };
            }
        });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar medicamentos suministrados', life: 3000 });
    }
};

const getMedicamentoNameById = (medicamentoId) => {
    return medicamentosMap.value[medicamentoId]?.name || '';
};

const allSelectedMedicamentos = computed(() => {
    let allMedicamentos = [];
    for (let categoriaId in selectedMedicamentosPorCategoria.value) {
        allMedicamentos = allMedicamentos.concat(selectedMedicamentosPorCategoria.value[categoriaId]);
    }
    return allMedicamentos;
});

watchEffect(() => {
    const allMedicamentos = allSelectedMedicamentos.value.map(id => parseInt(id));
    const currentMedicamentosDetails = Object.keys(medicamentoDetails.value).map(id => parseInt(id));

    allMedicamentos.forEach(medicamentoId => {
        if (!currentMedicamentosDetails.includes(medicamentoId)) {
            medicamentoDetails.value[medicamentoId] = {
                feedback: '',
                score: null,
                nombre: getMedicamentoNameById(medicamentoId),
            };
        }
    });

    currentMedicamentosDetails.forEach(medicamentoId => {
        if (!allMedicamentos.includes(medicamentoId)) {
            delete medicamentoDetails.value[medicamentoId];
        }
    });
});

const guardarMedicamentosSuministrados = async () => {
    try {
        const data = allSelectedMedicamentos.value.map(medicamentoId => ({
            id_medicamento: medicamentoId,
            feed_medicamento_diferencial: medicamentoDetails.value[medicamentoId].feedback,
            puntaje_medicamento_diferencial: medicamentoDetails.value[medicamentoId].score,
        }));

        await actualizarMedicamentosSuministrados(casoSeleccionado.value.id_historia_clinica, data);

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Medicamentos suministrados guardados correctamente', life: 3000 });
        visible.value = false;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar medicamentos suministrados', life: 3000 });
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
                <Stepper linear orientation="vertical">
                    <StepperPanel header="Intervenir">
                        <template #content="{ prevCallback, nextCallback }">
                            <h5>Selecciona los medicamentos para el caso</h5>

                            <!-- Iterar sobre categorías de medicamentos -->
                            <div v-for="categoria in categoriasMedicamentos" :key="categoria.id_categoria_medicamento"
                                class="pt-4">
                                <div class="grid">
                                    <div class="col-12">
                                        <h5>{{ categoria.categoria }}</h5>
                                    </div>
                                </div>
                                <div class="card flex justify-content-center">
                                    <SelectButton
                                        v-model="selectedMedicamentosPorCategoria[categoria.id_categoria_medicamento]"
                                        :options="medicamentosPorCategoria[categoria.id_categoria_medicamento]"
                                        optionLabel="name" optionValue="value" multiple aria-labelledby="multiple" />
                                </div>

                                <!-- Campos dinámicos para medicamentos seleccionados en esta categoría -->
                                <div v-for="(medicamentoId, index) in selectedMedicamentosPorCategoria[categoria.id_categoria_medicamento]"
                                    :key="medicamentoId" class="grid pt-3">
                                    <div class="col md:col-4">
                                        <h6>Medicamento {{ index + 1 }}: {{ medicamentoDetails[medicamentoId]?.nombre }}
                                        </h6>
                                    </div>
                                    <div class="col md:col-4">
                                        <FloatLabel>
                                            <Textarea v-model="medicamentoDetails[medicamentoId].feedback" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedback">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-3">
                                        <FloatLabel>
                                            <Dropdown v-model="medicamentoDetails[medicamentoId].score"
                                                :options="scoreMedicamentos" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="score">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-1"></div>
                                </div>
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>


                    <StepperPanel header="Consulta Externa">
                        <template #content="{ prevCallback, nextCallback }">
                            <h5>Selecciona las subespecialidades para el caso</h5>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="subespecialidades" :options="subespecialidadesDisponibles"
                                    optionLabel="name" multiple aria-labelledby="multiple" />
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <h6>Cardiologia</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSubespecialidad" autoResize rows="3" cols="30" />
                                        <label for="feedSubespecialidad">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeSubespecialidad" :options="scoreSubespecialidad"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeSubespecialidad">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Endocrionologia</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSubespecialidad" autoResize rows="3" cols="30" />
                                        <label for="feedSubespecialidad">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeSubespecialidad" :options="scoreSubespecialidad"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeSubespecialidad">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Gastroenterologia</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSubespecialidad" autoResize rows="3" cols="30" />
                                        <label for="feedSubespecialidad">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeSubespecialidad" :options="scoreSubespecialidad"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeSubespecialidad">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
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
                    <Button label="Guardar" @click="guardarMedicamentosSuministrados" severity="success"
                        icon="pi pi-save" />
                    <Button type=" button" label="Guardar" @click="visible = false"></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>