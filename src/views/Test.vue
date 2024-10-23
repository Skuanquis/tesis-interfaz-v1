<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue';
import {
    obtenerCasosClinicos, cambiarEstadoCaso,
    obtenerCasoClinicoPorId,
    obtenerPaciente,
    obtenerPuntaje,
    obtenerCategoriasProcedimientos, obtenerProcedimientosPorCategoria,
    obtenerProcedimientosAsignadosPorHistoriaClinica, actualizarProcedimientosAsignados

} from '../services/casoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const casosClinicos = ref([]);
const visible = ref(false);
const casoSeleccionado = ref(null);

const paciente = ref({});

const scoreProcedimientos = ref([]);
const categoriasProcedimientos = ref([]);
const procedimientosPorCategoria = ref({});
const selectedProcedimientosPorCategoria = ref({});
const procedimientoDetails = ref({});
const procedimientosMap = ref({});

const cerrarDialogo = () => {
    visible.value = false;
    localStorage.removeItem('id_historia_clinica');

}

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
        paciente.value = data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener datos del paciente', life: 3000 });
    }
};

const cargarPuntaje = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreProcedimientos.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const mostrarDetalleCaso = async (idCaso) => {
    try {
        const response = await obtenerCasoClinicoPorId(idCaso);
        casoSeleccionado.value = response.data;

        localStorage.setItem('id_historia_clinica', casoSeleccionado.value.id_historia_clinica);
        await cargarDatosPaciente(casoSeleccionado.value.id_historia_clinica);

        await cargarPuntaje(casoSeleccionado.value.id_historia_clinica);

        await cargarCategoriasYProcedimientos();
        await cargarProcedimientosAsignados(casoSeleccionado.value.id_historia_clinica);

        visible.value = true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el caso clínico', life: 3000 });
    }
};

const cargarCategoriasYProcedimientos = async () => {
    try {
        const response = await obtenerCategoriasProcedimientos();
        categoriasProcedimientos.value = response.data;
        categoriasProcedimientos.value.forEach(categoria => {
            selectedProcedimientosPorCategoria.value[categoria.id_categoria_procedimiento] = [];
        });
        for (let categoria of categoriasProcedimientos.value) {
            const resProcedimientos = await obtenerProcedimientosPorCategoria(categoria.id_categoria_procedimiento);
            const procedimientos = resProcedimientos.data.map(p => ({
                ...p,
                name: p.nombre,
                value: p.id_procedimiento,
            }));
            procedimientosPorCategoria.value[categoria.id_categoria_procedimiento] = procedimientos;
            procedimientos.forEach(procedimiento => {
                procedimientosMap.value[procedimiento.id_procedimiento] = procedimiento;
            });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías y procedimientos', life: 3000 });
    }
};

const cargarProcedimientosAsignados = async (id_historia_clinica) => {
    try {
        const response = await obtenerProcedimientosAsignadosPorHistoriaClinica(id_historia_clinica);
        const data = response.data;
        for (let categoriaId in selectedProcedimientosPorCategoria.value) {
            selectedProcedimientosPorCategoria.value[categoriaId] = [];
        }
        data.forEach(pa => {
            const procedimiento = procedimientosMap.value[pa.id_procedimiento];
            if (procedimiento) {
                const categoriaId = procedimiento.id_categoria_procedimiento;
                if (!selectedProcedimientosPorCategoria.value[categoriaId]) {
                    selectedProcedimientosPorCategoria.value[categoriaId] = [];
                }
                selectedProcedimientosPorCategoria.value[categoriaId].push(pa.id_procedimiento);
                procedimientoDetails.value[pa.id_procedimiento] = {
                    feedback: pa.feed_procedimiento_asignado,
                    score: pa.puntaje_procedimiento_asignado,
                    nombre: pa.nombre,
                };
            }
        });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar procedimientos asignados', life: 3000 });
    }
};

const getProcedimientoNameById = (procedimientoId) => {
    return procedimientosMap.value[procedimientoId]?.name || '';
};

const allSelectedProcedimientos = computed(() => {
    let allProcedimientos = [];
    for (let categoriaId in selectedProcedimientosPorCategoria.value) {
        allProcedimientos = allProcedimientos.concat(selectedProcedimientosPorCategoria.value[categoriaId]);
    }
    return allProcedimientos;
});

function contarYPrepararPuntajesVectores(objeto) {
    let puntajeCount = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    for (let key in objeto) {
        if (hasOwnProperty.call(objeto, key)) {
            const puntaje = objeto[key].score;
            if (hasOwnProperty.call(puntajeCount, puntaje)) {
                puntajeCount[puntaje]++;
            }
        }
    }
    puntajeCount = {
        A: puntajeCount.A || 0,
        B: puntajeCount.B || 0,
        C: puntajeCount.C || 0,
        D: puntajeCount.D || 0,
        E: puntajeCount.E || 0,
    };
    const data = {
        puntaje_a: puntajeCount.A,
        puntaje_b: puntajeCount.B,
        puntaje_c: puntajeCount.C,
        puntaje_d: puntajeCount.D,
        puntaje_e: puntajeCount.E
    };
    return data;
}

const guardarProcedimientosAsignados = async () => {
    try {
        const data = allSelectedProcedimientos.value.map(procedimientoId => ({
            id_procedimiento: procedimientoId,
            feed_procedimiento_asignado: procedimientoDetails.value[procedimientoId].feedback,
            puntaje_procedimiento_asignado: procedimientoDetails.value[procedimientoId].score,
        }));

        console.log("detallazos: ", contarYPrepararPuntajesVectores(procedimientoDetails.value))
        await actualizarProcedimientosAsignados(casoSeleccionado.value.id_historia_clinica, data);

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Procedimientos asignados guardados correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar procedimientos asignados', life: 3000 });
    }
};


watchEffect(() => {
    const allProcedimientos = allSelectedProcedimientos.value.map(id => parseInt(id));
    const currentProcedimientosDetails = Object.keys(procedimientoDetails.value).map(id => parseInt(id));
    allProcedimientos.forEach(procedimientoId => {
        if (!currentProcedimientosDetails.includes(procedimientoId)) {
            procedimientoDetails.value[procedimientoId] = {
                feedback: '',
                score: null,
                nombre: getProcedimientoNameById(procedimientoId),
            };
        }
    });
    currentProcedimientosDetails.forEach(procedimientoId => {
        if (!allProcedimientos.includes(procedimientoId)) {
            delete procedimientoDetails.value[procedimientoId];
        }
    });
});

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
                <h5>Selecciona los procedimientos para el caso</h5>

                <div v-for="categoria in categoriasProcedimientos" :key="categoria.id_categoria_procedimiento"
                    class="pt-4">
                    <div class="grid">
                        <Divider align="center" type="solid">
                            <h5>{{ categoria.nombre }}</h5>
                        </Divider>
                    </div>
                    <div class="card flex justify-content-center">
                        <SelectButton v-model="selectedProcedimientosPorCategoria[categoria.id_categoria_procedimiento]"
                            :options="procedimientosPorCategoria[categoria.id_categoria_procedimiento]"
                            optionLabel="name" optionValue="value" multiple aria-labelledby="multiple" />
                    </div>

                    <div v-for="(procedimientoId, index) in selectedProcedimientosPorCategoria[categoria.id_categoria_procedimiento]"
                        :key="procedimientoId" class="grid pt-3">
                        <div class="col md:col-4">
                            <h6>Procedimiento {{ index + 1 }}: {{ procedimientoDetails[procedimientoId]?.nombre }}
                            </h6>
                        </div>
                        <div class="col md:col-4">
                            <FloatLabel>
                                <Textarea v-model="procedimientoDetails[procedimientoId].feedback" autoResize rows="3"
                                    cols="30" />
                                <label for="feedback">Retroalimentación</label>
                            </FloatLabel>
                        </div>
                        <div class="col md:col-3">
                            <FloatLabel>
                                <Dropdown v-model="procedimientoDetails[procedimientoId].score"
                                    :options="scoreProcedimientos" optionLabel="name" optionValue="value"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
                                <label for="score">Puntaje Asignado</label>
                            </FloatLabel>
                        </div>
                        <div class="col md:col-1"></div>
                    </div>
                </div>

                <div class="flex py-4 gap-2">
                    <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                    <Button label="Guardar" @click="guardarProcedimientosAsignados" severity="success"
                        icon="pi pi-save" />
                    <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                </div>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cerrar" severity="secondary" @click=cerrarDialogo></Button>
                </div>
            </div>
        </Dialog>

    </div>
</template>
