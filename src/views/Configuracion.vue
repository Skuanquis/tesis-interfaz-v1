<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import {
    obtenerDiagnosticosDiferencialesPorCategoria, eliminarDiagnostico, agregarDiagnostico,
    actualizarDiagnostico, agregarCategoriaConDiagnosticos,
    obtenerMedicamentosPorCategoria, eliminarMedicamento, agregarMedicamento, actualizarMedicamento, agregarCategoriaConMedicamentos,
    obtenerSubespecialidades, agregarSubespecialidad, actualizarSubespecialidad, eliminarSubespecialidad,
    obtenerCategoriasImagenologia, agregarCategoriaImagenologia, actualizarCategoriaImagenologia, eliminarCategoriaImagenologia
} from '@/services/configuracionService';
import { useToast } from 'primevue/usetoast';
import FloatLabel from 'primevue/floatlabel';

const toast = useToast();
const diagnosticosPorCategoria = ref({});
const dialogoDiagnostico = ref(false);
const nuevaCategoria = ref({
    categoria: '',
    diagnosticos: [{ nombre: '' }]
});



const eliminarRegistro = async (id_diagnostico) => {
    try {
        await eliminarDiagnostico(id_diagnostico);
        for (const categoria in diagnosticosPorCategoria.value) {
            const categoriaData = diagnosticosPorCategoria.value[categoria];
            categoriaData.diagnosticos = categoriaData.diagnosticos.filter(d => d.id_diagnostico !== id_diagnostico);
        }
        toast.add({ severity: "success", summary: 'Éxito', detail: `Se eliminó el diagnóstico diferencial`, life: 3000 });
    } catch (error) {
        console.error("Error al eliminar diagnóstico", error);
        const errorMsg = error.response?.data?.error || 'No se pudo eliminar el diagnóstico diferencial';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};


const agregarNuevoCampo = (categoria) => {
    const categoriaData = diagnosticosPorCategoria.value[categoria];
    if (!categoriaData.diagnosticos) {
        categoriaData.diagnosticos = [];
    }
    categoriaData.diagnosticos.push({ id_diagnostico: null, diagnostico: '' });
    toast.add({ severity: "info", summary: 'Nuevo', detail: `Campo agregado para nueva entrada de diagnóstico en ${categoria}`, life: 3000 });
};

const guardarCambios = async () => {
    try {
        for (const categoria in diagnosticosPorCategoria.value) {
            const categoriaData = diagnosticosPorCategoria.value[categoria];
            const id_categoria_diferencial = categoriaData.id_categoria_diferencial;
            const diagnosticos = categoriaData.diagnosticos;

            for (const diagnostico of diagnosticos) {
                console.log("Datos enviados para actualizar o agregar:", diagnostico);

                if (!diagnostico.diagnostico || diagnostico.diagnostico.trim() === "") {
                    console.warn("El diagnóstico está vacío, no se procesará.");
                    continue;
                }

                if (diagnostico.id_diagnostico) {
                    await actualizarDiagnostico(diagnostico.id_diagnostico, { diagnostico: diagnostico.diagnostico });
                } else {
                    const response = await agregarDiagnostico({ id_categoria_diferencial, diagnostico: diagnostico.diagnostico });
                    diagnostico.id_diagnostico = response.data.id;
                }
            }
        }

        toast.add({ severity: "success", summary: 'Éxito', detail: `Se guardaron los cambios correctamente`, life: 3000 });
    } catch (error) {
        console.error("Error al guardar cambios", error);
        toast.add({ severity: "error", summary: 'Error', detail: `No se pudieron guardar los cambios`, life: 3000 });
    }
};

const abrirDialogoCategoriaMMedicamento = () => {
    nuevaCategoria.value = {
        categoria: '',
        diagnosticos: [{ nombre: '' }]
    };
    dialogoDiagnostico.value = true;
};

const agregarDiagnosticoEnDialogo = () => {
    nuevaCategoria.value.diagnosticos.push({ nombre: '' });
};

const eliminarDiagnosticoEnDialogo = (index) => {
    if (nuevaCategoria.value.diagnosticos.length > 1) {
        nuevaCategoria.value.diagnosticos.splice(index, 1);
    } else {
        toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe tener al menos un diagnóstico', life: 3000 });
    }
};

const guardarNuevaCategoria = async () => {
    try {
        const diagnosticosNombres = nuevaCategoria.value.diagnosticos.map(d => d.nombre.trim()).filter(n => n !== '');
        if (!nuevaCategoria.value.categoria.trim()) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'El nombre de la categoría es requerido', life: 3000 });
            return;
        }
        if (diagnosticosNombres.length === 0) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe proporcionar al menos un diagnóstico válido', life: 3000 });
            return;
        }
        const data = {
            categoria: nuevaCategoria.value.categoria.trim(),
            diagnosticos: diagnosticosNombres
        };
        const response = await agregarCategoriaConDiagnosticos(data);
        const id_categoria_diferencial = response.data.id_categoria_diferencial;
        diagnosticosPorCategoria.value[nuevaCategoria.value.categoria.trim()] = {
            id_categoria_diferencial,
            diagnosticos: diagnosticosNombres.map((nombre, index) => ({
                id_diagnostico: response.data.ids_diagnosticos[index],
                diagnostico: nombre
            }))
        };

        dialogoDiagnostico.value = false;
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría y diagnósticos agregados correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al agregar categoría y diagnósticos", error);
        const errorMsg = error.response?.data?.error || 'No se pudo agregar la categoría y diagnósticos';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};



onMounted(async () => {
    try {
        const response = await obtenerDiagnosticosDiferencialesPorCategoria();
        diagnosticosPorCategoria.value = response.data;
    } catch (error) {
        console.error("Error al obtener los diagnósticos por categoría", error);
        toast.add({ severity: "error", summary: 'Error', detail: `No se pudo cargar los diagnósticos diferenciales`, life: 3000 });
    }
});


const medicamentosPorCategoria = ref({});
const dialogoMedicamento = ref(false);
const nuevaCategoriaMedicamento = ref({
    categoria: '',
    medicamentos: [{ nombre: '' }]
});

const eliminarRegistroMedicamento = async (id_medicamento) => {
    try {
        await eliminarMedicamento(id_medicamento);
        for (const categoria in medicamentosPorCategoria.value) {
            const categoriaData = medicamentosPorCategoria.value[categoria];
            categoriaData.medicamentos = categoriaData.medicamentos.filter(m => m.id_medicamento !== id_medicamento);
        }
        toast.add({ severity: "success", summary: 'Éxito', detail: `Se eliminó el medicamento`, life: 3000 });
    } catch (error) {
        console.error("Error al eliminar medicamento", error);
        const errorMsg = error.response?.data?.error || 'No se pudo eliminar el medicamento';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

const agregarNuevoCampoMedicamento = (categoria) => {
    const categoriaData = medicamentosPorCategoria.value[categoria];
    if (!categoriaData.medicamentos) {
        categoriaData.medicamentos = [];
    }
    categoriaData.medicamentos.push({ id_medicamento: null, medicamento: '' });
    toast.add({ severity: "info", summary: 'Nuevo', detail: `Campo agregado para nuevo medicamento en ${categoria}`, life: 3000 });
};

const guardarCambiosMedicamento = async () => {
    try {
        for (const categoria in medicamentosPorCategoria.value) {
            const categoriaData = medicamentosPorCategoria.value[categoria];
            const id_categoria_medicamento = categoriaData.id_categoria_medicamento;
            const medicamentos = categoriaData.medicamentos;

            for (const medicamento of medicamentos) {
                console.log("Datos enviados para actualizar o agregar:", medicamento);

                if (!medicamento.medicamento || medicamento.medicamento.trim() === "") {
                    console.warn("El nombre del medicamento está vacío, no se procesará.");
                    continue;
                }

                if (medicamento.id_medicamento) {
                    await actualizarMedicamento(medicamento.id_medicamento, { medicamento: medicamento.medicamento });
                } else {
                    const response = await agregarMedicamento({ id_categoria_medicamento, medicamento: medicamento.medicamento });
                    medicamento.id_medicamento = response.data.id;
                }
            }
        }

        toast.add({ severity: "success", summary: 'Éxito', detail: `Se guardaron los cambios correctamente`, life: 3000 });
    } catch (error) {
        console.error("Error al guardar cambios", error);
        toast.add({ severity: "error", summary: 'Error', detail: `No se pudieron guardar los cambios`, life: 3000 });
    }
};

const abrirDialogoCategoriaMedicamento = () => {
    nuevaCategoriaMedicamento.value = {
        categoria: '',
        medicamentos: [{ nombre: '' }]
    };
    dialogoMedicamento.value = true;
};

const agregarMedicamentoEnDialogo = () => {
    nuevaCategoriaMedicamento.value.medicamentos.push({ nombre: '' });
};

const eliminarMedicamentoEnDialogo = (index) => {
    if (nuevaCategoriaMedicamento.value.medicamentos.length > 1) {
        nuevaCategoriaMedicamento.value.medicamentos.splice(index, 1);
    } else {
        toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe tener al menos un medicamento', life: 3000 });
    }
};

const guardarNuevaCategoriaMedicamento = async () => {
    try {
        const medicamentosNombres = nuevaCategoriaMedicamento.value.medicamentos.map(m => m.nombre.trim()).filter(n => n !== '');
        if (!nuevaCategoriaMedicamento.value.categoria.trim()) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'El nombre de la categoría es requerido', life: 3000 });
            return;
        }
        if (medicamentosNombres.length === 0) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe proporcionar al menos un medicamento válido', life: 3000 });
            return;
        }
        const data = {
            categoria: nuevaCategoriaMedicamento.value.categoria.trim(),
            medicamentos: medicamentosNombres
        };
        const response = await agregarCategoriaConMedicamentos(data);
        const id_categoria_medicamento = response.data.id_categoria_medicamento;
        medicamentosPorCategoria.value[nuevaCategoriaMedicamento.value.categoria.trim()] = {
            id_categoria_medicamento,
            medicamentos: medicamentosNombres.map((nombre, index) => ({
                id_medicamento: response.data.ids_medicamentos[index],
                medicamento: nombre
            }))
        };

        dialogoMedicamento.value = false;
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría y medicamentos agregados correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al agregar categoría y medicamentos", error);
        const errorMsg = error.response?.data?.error || 'No se pudo agregar la categoría y medicamentos';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

onMounted(async () => {
    try {
        const response = await obtenerMedicamentosPorCategoria();
        medicamentosPorCategoria.value = response.data;
    } catch (error) {
        console.error("Error al obtener los medicamentos por categoría", error);
        toast.add({ severity: "error", summary: 'Error', detail: `No se pudo cargar los medicamentos`, life: 3000 });
    }
});

const subespecialidades = ref([]);
const mostrarDialogoSubespecialidad = ref(false);
const esEditar = ref(false);
const subespecialidadActual = ref({
    id_subespecialidad: null,
    nombre: ''
});

const obtenerListaSubespecialidades = async () => {
    try {
        const response = await obtenerSubespecialidades();
        subespecialidades.value = response.data;
    } catch (error) {
        console.error("Error al obtener subespecialidades", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudo cargar la lista de subespecialidades', life: 3000 });
    }
};

const abrirDialogoAgregarSubespecialidad = () => {
    esEditar.value = false;
    subespecialidadActual.value = {
        id_subespecialidad: null,
        nombre: ''
    };
    mostrarDialogoSubespecialidad.value = true;
};

const abrirDialogoEditarSubespecialidad = (subespecialidad) => {
    esEditar.value = true;
    subespecialidadActual.value = { ...subespecialidad };
    mostrarDialogoSubespecialidad.value = true;
};

const guardarSubespecialidad = async () => {
    try {
        if (!subespecialidadActual.value.nombre.trim()) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'El nombre de la subespecialidad es requerido', life: 3000 });
            return;
        }
        if (esEditar.value) {
            await actualizarSubespecialidad(subespecialidadActual.value.id_subespecialidad, { nombre: subespecialidadActual.value.nombre });
            const index = subespecialidades.value.findIndex(s => s.id_subespecialidad === subespecialidadActual.value.id_subespecialidad);
            if (index !== -1) {
                subespecialidades.value[index].nombre = subespecialidadActual.value.nombre;
            }
            toast.add({ severity: "success", summary: 'Éxito', detail: 'Subespecialidad actualizada correctamente', life: 3000 });
        } else {

            const response = await agregarSubespecialidad({ nombre: subespecialidadActual.value.nombre });
            subespecialidades.value.push({
                id_subespecialidad: response.data.id_subespecialidad,
                nombre: subespecialidadActual.value.nombre
            });
            toast.add({ severity: "success", summary: 'Éxito', detail: 'Subespecialidad agregada correctamente', life: 3000 });
        }
        mostrarDialogoSubespecialidad.value = false;
    } catch (error) {
        console.error("Error al guardar subespecialidad", error);
        const errorMsg = error.response?.data?.error || 'No se pudo guardar la subespecialidad';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

const eliminarRegistroSubespecialidad = async (id_subespecialidad) => {
    try {
        await eliminarSubespecialidad(id_subespecialidad);
        subespecialidades.value = subespecialidades.value.filter(s => s.id_subespecialidad !== id_subespecialidad);
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Subespecialidad eliminada correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al eliminar subespecialidad", error);
        const errorMsg = error.response?.data?.error || 'No se pudo eliminar la subespecialidad';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

onMounted(() => {
    obtenerListaSubespecialidades();
});

const categoriasImagenologia = ref([]);
const mostrarDialogoImagenologia = ref(false);
const esEditarImagenologia = ref(false);
const categoriaActualImagenologia = ref({
    id_categoria_imagenologia: null,
    nombre: ''
});

const obtenerListaCategorias = async () => {
    try {
        const response = await obtenerCategoriasImagenologia();
        categoriasImagenologia.value = response.data;
    } catch (error) {
        console.error("Error al obtener categorías de imagenología", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudo cargar la lista de categorías', life: 3000 });
    }
};

const abrirDialogoAgregarImagenologia = () => {
    esEditarImagenologia.value = false;
    categoriaActualImagenologia.value = {
        id_categoria_imagenologia: null,
        nombre: ''
    };
    mostrarDialogoImagenologia.value = true;
};

const abrirDialogoEditarImagenologia = (categoria) => {
    esEditarImagenologia.value = true;
    categoriaActualImagenologia.value = { ...categoria };
    mostrarDialogoImagenologia.value = true;
};

const guardarCategoriaImagenologia = async () => {
    try {
        if (!categoriaActualImagenologia.value.nombre.trim()) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'El nombre de la categoría es requerido', life: 3000 });
            return;
        }
        if (esEditarImagenologia.value) {
            // Actualizar categoría
            await actualizarCategoriaImagenologia(categoriaActualImagenologia.value.id_categoria_imagenologia, { nombre: categoriaActualImagenologia.value.nombre });
            const index = categoriasImagenologia.value.findIndex(c => c.id_categoria_imagenologia === categoriaActualImagenologia.value.id_categoria_imagenologia);
            if (index !== -1) {
                categoriasImagenologia.value[index].nombre = categoriaActualImagenologia.value.nombre;
            }
            toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría actualizada correctamente', life: 3000 });
        } else {
            // Agregar nueva categoría
            const response = await agregarCategoriaImagenologia({ nombre: categoriaActualImagenologia.value.nombre });
            categoriasImagenologia.value.push({
                id_categoria_imagenologia: response.data.id_categoria_imagenologia,
                nombre: categoriaActualImagenologia.value.nombre
            });
            toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría agregada correctamente', life: 3000 });
        }
        mostrarDialogoImagenologia.value = false;
    } catch (error) {
        console.error("Error al guardar categoría", error);
        const errorMsg = error.response?.data?.error || 'No se pudo guardar la categoría';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

const eliminarRegistroImagenologia = async (id_categoria_imagenologia) => {
    try {
        await eliminarCategoriaImagenologia(id_categoria_imagenologia);
        categoriasImagenologia.value = categoriasImagenologia.value.filter(c => c.id_categoria_imagenologia !== id_categoria_imagenologia);
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría eliminada correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al eliminar categoría", error);
        const errorMsg = error.response?.data?.error || 'No se pudo eliminar la categoría';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

onMounted(() => {
    obtenerListaCategorias();
});


</script>

<template>
    <div class="card justify-content-center">
        <Stepper>
            <StepperPanel header="Diagnósticos Diferenciales">
                <template #content="{ nextCallback }">
                    <Accordion>
                        <!-- Iterar sobre las categorías para crear una pestaña por cada categoría -->
                        <AccordionTab v-for="(categoriaData, categoria) in diagnosticosPorCategoria" :key="categoria"
                            :header="categoria">
                            <div class="grid p-fluid">
                                <!-- Iterar sobre los diagnósticos dentro de cada categoría -->
                                <div v-for="(diagnostico, index) in categoriaData.diagnosticos" :key="index"
                                    class="col-12">
                                    <div class="grid">
                                        <div class="col md:col-10">
                                            <InputText v-model="diagnostico.diagnostico" />
                                        </div>
                                        <div class="col md:col-2 text-center">
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar"
                                                @click="eliminarRegistro(diagnostico.id_diagnostico)" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 text-center">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Agregar"
                                        @click="agregarNuevoCampo(categoria)" />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <!-- Dialog para añadir nueva categoría -->
                    <Dialog v-model:visible="dialogoDiagnostico" modal header="Añadir Categoría"
                        :style="{ width: '25rem' }" class="p-fluid">
                        <div>
                            <FloatLabel>
                                <InputText id="categoria" v-model="nuevaCategoria.categoria" autocomplete="off" />
                                <Label for="categoria">Categoría</Label>
                            </FloatLabel>
                        </div>
                        <h6>Diagnósticos</h6>
                        <div v-for="(diagnostico, index) in nuevaCategoria.diagnosticos" :key="index"
                            class="grid align-items-center">
                            <div class="col md:col-10">
                                <InputText v-model="diagnostico.nombre" autocomplete="off" />
                            </div>
                            <div class="col md:col-2">
                                <Button icon="pi pi-times" severity="danger" text raised rounded aria-label="Eliminar"
                                    @click="eliminarDiagnosticoEnDialogo(index)" />
                            </div>
                        </div>
                        <div class="col-12 text-center">
                            <Button icon="pi pi-plus" text raised rounded aria-label="Agregar Diagnóstico"
                                @click="agregarDiagnosticoEnDialogo" />
                        </div>
                        <div class="col-12 text-center" style="margin-top: 1rem;">
                            <Button label="Guardar" icon="pi pi-save" text raised @click="guardarNuevaCategoria" />
                        </div>
                    </Dialog>

                    <!-- Botones para Guardar cambios y Añadir categoría -->
                    <div class="col-12 p-3" style="margin-top: 2rem;">
                        <div class="grid  align-items-center justify-content-center">
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Guardar Cambios" icon="pi pi-save" severity="success" raised
                                    @click="guardarCambios" />
                            </div>
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Añadir Categoría" icon="pi pi-plus" severity="help" raised
                                    @click="abrirDialogoCategoriaMMedicamento" />
                            </div>
                        </div>
                    </div>
                    <div class="flex py-4 gap-2">
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>


            <StepperPanel header="Medicamentos Disponibles">
                <template #content="{ prevCallback, nextCallback }">
                    <Accordion>
                        <AccordionTab v-for="(categoriaData, categoria) in medicamentosPorCategoria" :key="categoria"
                            :header="categoria">
                            <div class="grid p-fluid">
                                <!-- Iterar sobre los medicamentos dentro de cada categoría -->
                                <div v-for="(medicamento, index) in categoriaData.medicamentos" :key="index"
                                    class="col-12">
                                    <div class="grid">
                                        <div class="col md:col-10">
                                            <InputText v-model="medicamento.medicamento" />
                                        </div>
                                        <div class="col md:col-2 text-center">
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar"
                                                @click="eliminarRegistroMedicamento(medicamento.id_medicamento)" />
                                        </div>
                                    </div>
                                </div>
                                <!-- Botón para agregar un nuevo medicamento -->
                                <div class="col-12 text-center">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Agregar"
                                        @click="agregarNuevoCampoMedicamento(categoria)" />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>


                    <!-- Dialog para añadir nueva categoría -->
                    <Dialog v-model:visible="dialogoMedicamento" modal header="Añadir Categoría"
                        :style="{ width: '25rem' }" class="p-fluid">
                        <div>
                            <FloatLabel>
                                <InputText id="categoria" v-model="nuevaCategoriaMedicamento.categoria"
                                    autocomplete="off" />
                                <Label for="categoria">Categoría</Label>
                            </FloatLabel>
                        </div>
                        <h6>Medicamentos</h6>
                        <div v-for="(medicamento, index) in nuevaCategoriaMedicamento.medicamentos" :key="index"
                            class="grid align-items-center">
                            <div class="col md:col-10">
                                <InputText v-model="medicamento.nombre" autocomplete="off" />
                            </div>
                            <div class="col md:col-2">
                                <Button icon="pi pi-times" severity="danger" text raised rounded aria-label="Eliminar"
                                    @click="eliminarMedicamentoEnDialogo(index)" />
                            </div>
                        </div>
                        <div class="col-12 text-center">
                            <Button icon="pi pi-plus" text raised rounded aria-label="Agregar Medicamento"
                                @click="agregarMedicamentoEnDialogo" />
                        </div>
                        <div class="col-12 text-center" style="margin-top: 1rem;">
                            <Button label="Guardar" icon="pi pi-save" text raised
                                @click="guardarNuevaCategoriaMedicamento" />
                        </div>
                    </Dialog>

                    <!-- Botones para Guardar cambios y Añadir categoría -->
                    <div class="col-12 p-3" style="margin-top: 2rem;">
                        <div class="grid  align-items-center justify-content-center">
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Guardar Cambios" icon="pi pi-save" severity="success" raised
                                    @click="guardarCambiosMedicamento" />
                            </div>
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Añadir Categoría" icon="pi pi-plus" severity="help" raised
                                    @click="abrirDialogoCategoriaMedicamento" />
                            </div>
                        </div>
                    </div>
                    <div class="flex py-4 gap-2">
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" iconPos="left"
                            @click="prevCallback" />
                        <Button label="Siguiente" severity="info" icon="pi pi-arrow-right" iconPos="right"
                            @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>


            <StepperPanel header="Subespecialidades Disponibles">
                <template #content="{ prevCallback, nextCallback }">
                    <div v-for="(subespecialidad, index) in subespecialidades" :key="index" class="col-12">
                        <div class="grid align-items-center">
                            <div class="col md:col-8">
                                <span>{{ subespecialidad.nombre }}</span>
                            </div>
                            <div class="col md:col-4 text-right">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text" aria-label="Editar"
                                    @click="abrirDialogoEditarSubespecialidad(subespecialidad)" />
                                <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-danger"
                                    aria-label="Eliminar"
                                    @click="eliminarRegistroSubespecialidad(subespecialidad.id_subespecialidad)" />
                            </div>
                        </div>
                    </div>
                    <div class="col-12 text-center" style="margin-top: 1rem;">
                        <Button label="Añadir Subespecialidad" icon="pi pi-plus" raised severity="help"
                            @click="abrirDialogoAgregarSubespecialidad" />
                    </div>

                    <Dialog v-model:visible="mostrarDialogoSubespecialidad" modal
                        :header="esEditar ? 'Editar Subespecialidad' : 'Añadir Subespecialidad'"
                        :style="{ width: '25rem' }" class="p-fluid">
                        <div>
                            <FloatLabel>
                                <InputText id="nombre" v-model="subespecialidadActual.nombre" autocomplete="off" />
                                <Label for="nombre">Nombre</Label>
                            </FloatLabel>
                        </div>
                        <div class="col-12 text-center" style="margin-top: 1rem;">
                            <Button label="Guardar" icon="pi pi-save" text raised @click="guardarSubespecialidad" />
                        </div>
                    </Dialog>


                    <div class="flex py-4 gap-2">
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" iconPos="left"
                            @click="prevCallback" />
                        <Button label="Siguiente" severity="info" icon="pi pi-arrow-right" iconPos="right"
                            @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>


            <StepperPanel header="Imagenologia Disponible">
                <template #content="{ prevCallback }">
                    <div v-for="(categoria, index) in categoriasImagenologia" :key="index" class="col-12">
                        <div class="grid align-items-center">
                            <div class="col md:col-8">
                                <span>{{ categoria.nombre }}</span>
                            </div>
                            <div class="col md:col-4 text-right">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text" aria-label="Editar"
                                    @click="abrirDialogoEditarImagenologia(categoria)" />
                                <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-danger"
                                    aria-label="Eliminar"
                                    @click="eliminarRegistroImagenologia(categoria.id_categoria_imagenologia)" />
                            </div>
                        </div>
                    </div>
                    <div class="col-12 text-center" style="margin-top: 1rem;">
                        <Button label="Añadir Categoría" icon="pi pi-plus" severity="help" raised
                            @click="abrirDialogoAgregarImagenologia" />
                    </div>

                    <Dialog v-model:visible="mostrarDialogoImagenologia" modal
                        :header="esEditarImagenologia ? 'Editar Categoría' : 'Añadir Categoría'"
                        :style="{ width: '25rem' }" class="p-fluid">
                        <div>
                            <FloatLabel>
                                <InputText id="nombre" v-model="categoriaActualImagenologia.nombre"
                                    autocomplete="off" />
                                <Label for="nombre">Nombre</Label>
                            </FloatLabel>
                        </div>
                        <div class="col-12 text-center" style="margin-top: 1rem;">
                            <Button label="Guardar" icon="pi pi-save" text raised
                                @click="guardarCategoriaImagenologia" />
                        </div>
                    </Dialog>


                    <div class="flex py-4 gap-2">
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" iconPos="left"
                            @click="prevCallback" />
                    </div>
                </template>
            </StepperPanel>
        </Stepper>
    </div>
</template>