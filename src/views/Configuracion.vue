<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import {
    obtenerDiagnosticosDiferencialesPorCategoria, eliminarDiagnostico, agregarDiagnostico,
    actualizarDiagnostico, agregarCategoriaConDiagnosticos,
    obtenerMedicamentosPorCategoria, eliminarMedicamento, agregarMedicamento, actualizarMedicamento, agregarCategoriaConMedicamentos,
    obtenerSubespecialidades, agregarSubespecialidad, actualizarSubespecialidad, eliminarSubespecialidad,
    obtenerCategoriasConImagenologias, eliminarImagenologia, agregarImagenologia,
    actualizarImagenologia, agregarCategoriaConImagenologias,
    obtenerCategoriasConProcedimientos, eliminarProcedimiento, actualizarProcedimiento, agregarProcedimiento, agregarCategoriaConProcedimientos,
    obtenerCategoriasConSubcategorias, eliminarSubcategoria, agregarSubcategoria, actualizarSubcategoria, agregarCategoriaConSubcategorias
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

// Variable para almacenar las categorías con sus imagenologías
const imagenologiasPorCategoria = ref({});

// Diálogo para agregar nueva categoría
const dialogoImagenologia = ref(false);
const nuevaCategoriaImagenologia = ref({
    nombre: '',
    imagenologias: [{ nombre: '' }]
});

// Función para obtener las categorías con sus imagenologías desde la API
const obtenerImagenologias = async () => {
    try {
        const response = await obtenerCategoriasConImagenologias();
        imagenologiasPorCategoria.value = response.data; // Asigna la respuesta de la API a la variable
    } catch (error) {
        console.error("Error al obtener imagenologías por categoría", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudieron cargar las imagenologías', life: 3000 });
    }
};

// Función para eliminar una imagenología
const eliminarRegistroImagenologia = async (id_imagenologia) => {
    try {
        await eliminarImagenologia(id_imagenologia);
        for (const categoria in imagenologiasPorCategoria.value) {
            const categoriaData = imagenologiasPorCategoria.value[categoria];
            categoriaData.imagenologias = categoriaData.imagenologias.filter(i => i.id_imagenologia !== id_imagenologia);
        }
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Imagenología eliminada correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al eliminar imagenología", error);
        const errorMsg = error.response?.data?.error || 'No se pudo eliminar la imagenología';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

// Función para agregar un nuevo campo de imagenología
const agregarNuevoCampoImagenologia = (categoria) => {
    const categoriaData = imagenologiasPorCategoria.value[categoria];
    if (!categoriaData.imagenologias) {
        categoriaData.imagenologias = [];
    }
    categoriaData.imagenologias.push({ id_imagenologia: null, imagenologia: '' });
    toast.add({ severity: "info", summary: 'Nuevo', detail: `Campo agregado para nueva imagenología en ${categoria}`, life: 3000 });
};

// Guardar cambios en las imagenologías
const guardarCambiosImagenologia = async () => {
    try {
        for (const categoria in imagenologiasPorCategoria.value) {
            const categoriaData = imagenologiasPorCategoria.value[categoria];
            const id_categoria_imagenologia = categoriaData.id_categoria_imagenologia;
            const imagenologias = categoriaData.imagenologias;

            for (const imagenologia of imagenologias) {
                if (!imagenologia.imagenologia || imagenologia.imagenologia.trim() === "") {
                    console.warn("El nombre de la imagenología está vacío, no se procesará.");
                    continue;
                }

                if (imagenologia.id_imagenologia) {
                    await actualizarImagenologia(imagenologia.id_imagenologia, { nombre: imagenologia.imagenologia });
                } else {
                    const response = await agregarImagenologia({ id_categoria_imagenologia, nombre: imagenologia.imagenologia });
                    imagenologia.id_imagenologia = response.data.id;
                }
            }
        }

        toast.add({ severity: "success", summary: 'Éxito', detail: 'Se guardaron los cambios correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al guardar cambios", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudieron guardar los cambios', life: 3000 });
    }
};

// Abrir diálogo para agregar nueva categoría de imagenología
const abrirDialogoCategoriaImagenologia = () => {
    nuevaCategoriaImagenologia.value = {
        nombre: '',
        imagenologias: [{ nombre: '' }]
    };
    dialogoImagenologia.value = true;
};

// Agregar nueva imagenología en el diálogo
const agregarImagenologiaEnDialogo = () => {
    nuevaCategoriaImagenologia.value.imagenologias.push({ nombre: '' });
};

// Eliminar imagenología en el diálogo
const eliminarImagenologiaEnDialogo = (index) => {
    if (nuevaCategoriaImagenologia.value.imagenologias.length > 1) {
        nuevaCategoriaImagenologia.value.imagenologias.splice(index, 1);
    } else {
        toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe tener al menos una imagenología', life: 3000 });
    }
};

// Guardar nueva categoría con imagenologías
const guardarNuevaCategoriaImagenologia = async () => {
    try {
        const imagenologiasNombres = nuevaCategoriaImagenologia.value.imagenologias.map(i => i.nombre.trim()).filter(n => n !== '');
        if (!nuevaCategoriaImagenologia.value.nombre.trim()) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'El nombre de la categoría es requerido', life: 3000 });
            return;
        }
        if (imagenologiasNombres.length === 0) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe proporcionar al menos una imagenología válida', life: 3000 });
            return;
        }

        const data = {
            nombre: nuevaCategoriaImagenologia.value.nombre.trim(),
            imagenologias: imagenologiasNombres
        };
        const response = await agregarCategoriaConImagenologias(data);
        const id_categoria_imagenologia = response.data.id_categoria_imagenologia;
        imagenologiasPorCategoria.value[nuevaCategoriaImagenologia.value.nombre.trim()] = {
            id_categoria_imagenologia,
            imagenologias: imagenologiasNombres.map((nombre, index) => ({
                id_imagenologia: response.data.ids_imagenologias[index],
                imagenologia: nombre
            }))
        };

        dialogoImagenologia.value = false;
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría e imagenologías agregadas correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al agregar categoría e imagenologías", error);
        const errorMsg = error.response?.data?.error || 'No se pudo agregar la categoría e imagenologías';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

onMounted(obtenerImagenologias);

const procedimientosPorCategoria = ref({});
const dialogoProcedimiento = ref(false);
const nuevaCategoriaProcedimiento = ref({
    categoria: '',
    procedimientos: [{ nombre: '' }]
});

const eliminarRegistroProcedimiento = async (id_procedimiento) => {
    try {
        await eliminarProcedimiento(id_procedimiento);
        for (const categoria in procedimientosPorCategoria.value) {
            const categoriaData = procedimientosPorCategoria.value[categoria];
            categoriaData.procedimientos = categoriaData.procedimientos.filter(p => p.id_procedimiento !== id_procedimiento);
        }
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Se eliminó el procedimiento', life: 3000 });
    } catch (error) {
        console.error("Error al eliminar procedimiento", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudo eliminar el procedimiento', life: 3000 });
    }
};

const agregarNuevoCampoProcedimiento = (categoria) => {
    const categoriaData = procedimientosPorCategoria.value[categoria];
    categoriaData.procedimientos.push({ id_procedimiento: null, nombre: '' });
};

const guardarCambiosProcedimiento = async () => {
    try {
        for (const categoria in procedimientosPorCategoria.value) {
            const categoriaData = procedimientosPorCategoria.value[categoria];
            const id_categoria_procedimiento = categoriaData.id_categoria_procedimiento;

            for (const procedimiento of categoriaData.procedimientos) {
                if (procedimiento.id_procedimiento) {
                    await actualizarProcedimiento(procedimiento.id_procedimiento, { nombre: procedimiento.nombre });
                } else {
                    const response = await agregarProcedimiento({ id_categoria_procedimiento, nombre: procedimiento.nombre });
                    procedimiento.id_procedimiento = response.data.id;
                }
            }
        }
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Se guardaron los cambios correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al guardar cambios", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudieron guardar los cambios', life: 3000 });
    }
};

const abrirDialogoCategoriaProcedimiento = () => {
    nuevaCategoriaProcedimiento.value = {
        categoria: '',
        procedimientos: [{ nombre: '' }]
    };
    dialogoProcedimiento.value = true;
};

const agregarProcedimientoEnDialogo = () => {
    nuevaCategoriaProcedimiento.value.procedimientos.push({ nombre: '' });
};

const eliminarProcedimientoEnDialogo = (index) => {
    if (nuevaCategoriaProcedimiento.value.procedimientos.length > 1) {
        nuevaCategoriaProcedimiento.value.procedimientos.splice(index, 1);
    } else {
        toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe haber al menos un procedimiento', life: 3000 });
    }
};

const guardarNuevaCategoriaProcedimiento = async () => {
    try {
        const procedimientosNombres = nuevaCategoriaProcedimiento.value.procedimientos.map(p => p.nombre.trim()).filter(n => n !== '');
        if (!nuevaCategoriaProcedimiento.value.categoria.trim()) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'El nombre de la categoría es requerido', life: 3000 });
            return;
        }
        if (procedimientosNombres.length === 0) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe proporcionar al menos un procedimiento válido', life: 3000 });
            return;
        }
        const data = {
            categoria: nuevaCategoriaProcedimiento.value.categoria.trim(),
            procedimientos: procedimientosNombres
        };
        const response = await agregarCategoriaConProcedimientos(data);
        const id_categoria_procedimiento = response.data.id_categoria_procedimiento;
        procedimientosPorCategoria.value[nuevaCategoriaProcedimiento.value.categoria.trim()] = {
            id_categoria_procedimiento,
            procedimientos: procedimientosNombres.map((nombre, index) => ({
                id_procedimiento: response.data.result.insertId + index,
                nombre
            }))
        };

        dialogoProcedimiento.value = false;
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría y procedimientos agregados correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al agregar categoría y procedimientos", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudo agregar la categoría y procedimientos', life: 3000 });
    }
};

onMounted(async () => {
    try {
        const response = await obtenerCategoriasConProcedimientos();
        procedimientosPorCategoria.value = response.data;
    } catch (error) {
        console.error("Error al obtener los procedimientos por categoría", error);
        toast.add({ severity: "error", summary: 'Error', detail: 'No se pudo cargar los procedimientos', life: 3000 });
    }
});

const categoriasConSubcategorias = ref({});
const dialogoAnalisis = ref(false);
const nuevaCategoriaAnalisis = ref({
    categoria: '',
    subcategorias: [{ nombre: '' }]
});

const eliminarRegistroSubcategoria = async (id_subcategoria_analisis) => {
    try {
        await eliminarSubcategoria(id_subcategoria_analisis);
        for (const categoria in categoriasConSubcategorias.value) {
            const categoriaData = categoriasConSubcategorias.value[categoria];
            categoriaData.subcategorias = categoriaData.subcategorias.filter(s => s.id_subcategoria_analisis !== id_subcategoria_analisis);
        }
        toast.add({ severity: "success", summary: 'Éxito', detail: `Se eliminó la subcategoría`, life: 3000 });
    } catch (error) {
        console.error("Error al eliminar subcategoría", error);
        const errorMsg = error.response?.data?.error || 'No se pudo eliminar la subcategoría';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

const agregarNuevoCampoSubcategoria = (categoria) => {
    const categoriaData = categoriasConSubcategorias.value[categoria];
    if (!categoriaData.subcategorias) {
        categoriaData.subcategorias = [];
    }
    categoriaData.subcategorias.push({ id_subcategoria_analisis: null, nombre_subcategoria: '' });
    toast.add({ severity: "info", summary: 'Nuevo', detail: `Campo agregado para nueva subcategoría en ${categoria}`, life: 3000 });
};

const guardarCambiosAnalisis = async () => {
    try {
        for (const categoria in categoriasConSubcategorias.value) {
            const categoriaData = categoriasConSubcategorias.value[categoria];
            const id_categoria_analisis = categoriaData.id_categoria_analisis;
            const subcategorias = categoriaData.subcategorias;

            for (const subcategoria of subcategorias) {
                if (!subcategoria.nombre_subcategoria || subcategoria.nombre_subcategoria.trim() === "") {
                    console.warn("El nombre de la subcategoría está vacío, no se procesará.");
                    continue;
                }

                if (subcategoria.id_subcategoria_analisis) {
                    await actualizarSubcategoria(subcategoria.id_subcategoria_analisis, { nombre_subcategoria: subcategoria.nombre_subcategoria });
                } else {
                    const response = await agregarSubcategoria({ id_categoria_analisis, nombre_subcategoria: subcategoria.nombre_subcategoria });
                    subcategoria.id_subcategoria_analisis = response.data.id_subcategoria_analisis;
                }
            }
        }

        toast.add({ severity: "success", summary: 'Éxito', detail: `Se guardaron los cambios correctamente`, life: 3000 });
    } catch (error) {
        console.error("Error al guardar cambios", error);
        toast.add({ severity: "error", summary: 'Error', detail: `No se pudieron guardar los cambios`, life: 3000 });
    }
};

const abrirDialogoCategoriaAnalisis = () => {
    nuevaCategoriaAnalisis.value = {
        categoria: '',
        subcategorias: [{ nombre: '' }]
    };
    dialogoAnalisis.value = true;
};

const agregarSubcategoriaEnDialogo = () => {
    nuevaCategoriaAnalisis.value.subcategorias.push({ nombre: '' });
};

const eliminarSubcategoriaEnDialogo = (index) => {
    if (nuevaCategoriaAnalisis.value.subcategorias.length > 1) {
        nuevaCategoriaAnalisis.value.subcategorias.splice(index, 1);
    } else {
        toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe tener al menos una subcategoría', life: 3000 });
    }
};

const guardarNuevaCategoriaAnalisis = async () => {
    try {
        const subcategoriasNombres = nuevaCategoriaAnalisis.value.subcategorias.map(s => s.nombre.trim()).filter(n => n !== '');
        if (!nuevaCategoriaAnalisis.value.categoria.trim()) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'El nombre de la categoría es requerido', life: 3000 });
            return;
        }
        if (subcategoriasNombres.length === 0) {
            toast.add({ severity: "warn", summary: 'Advertencia', detail: 'Debe proporcionar al menos una subcategoría válida', life: 3000 });
            return;
        }
        const data = {
            categoria: nuevaCategoriaAnalisis.value.categoria.trim(),
            subcategorias: subcategoriasNombres
        };
        const response = await agregarCategoriaConSubcategorias(data);
        const id_categoria_analisis = response.data.id_categoria_analisis;
        categoriasConSubcategorias.value[nuevaCategoriaAnalisis.value.categoria.trim()] = {
            id_categoria_analisis,
            subcategorias: subcategoriasNombres.map((nombre, index) => ({
                id_subcategoria_analisis: response.data.ids_subcategorias[index],
                nombre_subcategoria: nombre
            }))
        };

        dialogoAnalisis.value = false;
        toast.add({ severity: "success", summary: 'Éxito', detail: 'Categoría y subcategorías agregadas correctamente', life: 3000 });
    } catch (error) {
        console.error("Error al agregar categoría y subcategorías", error);
        const errorMsg = error.response?.data?.error || 'No se pudo agregar la categoría y subcategorías';
        toast.add({ severity: "error", summary: 'Error', detail: errorMsg, life: 3000 });
    }
};

onMounted(async () => {
    try {
        const response = await obtenerCategoriasConSubcategorias();
        categoriasConSubcategorias.value = response.data;
    } catch (error) {
        console.error("Error al obtener las categorías con subcategorías", error);
        toast.add({ severity: "error", summary: 'Error', detail: `No se pudo cargar las categorías`, life: 3000 });
    }
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


            <StepperPanel header="Imagenologías Disponibles">
                <template #content="{ prevCallback, nextCallback }">
                    <Accordion>
                        <AccordionTab v-for="(categoriaData, categoria) in imagenologiasPorCategoria" :key="categoria"
                            :header="categoria">
                            <div class="grid p-fluid">

                                <div v-for="(imagenologia, index) in categoriaData.imagenologias" :key="index"
                                    class="col-12">
                                    <div class="grid">
                                        <div class="col md:col-10">
                                            <InputText v-model="imagenologia.imagenologia" />
                                        </div>
                                        <div class="col md:col-2 text-center">
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar"
                                                @click="eliminarRegistroImagenologia(imagenologia.id_imagenologia)" />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12 text-center">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Agregar"
                                        @click="agregarNuevoCampoImagenologia(categoria)" />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <Dialog v-model:visible="dialogoImagenologia" modal header="Añadir Categoría"
                        :style="{ width: '25rem' }" class="p-fluid">
                        <div>
                            <FloatLabel>
                                <InputText id="categoria" v-model="nuevaCategoriaImagenologia.nombre"
                                    autocomplete="off" />
                                <Label for="categoria">Categoría</Label>
                            </FloatLabel>
                        </div>
                        <h6>Imagenologías</h6>
                        <div v-for="(imagenologia, index) in nuevaCategoriaImagenologia.imagenologias" :key="index"
                            class="grid align-items-center">
                            <div class="col md:col-10">
                                <InputText v-model="imagenologia.nombre" autocomplete="off" />
                            </div>
                            <div class="col md:col-2">
                                <Button icon="pi pi-times" severity="danger" text raised rounded aria-label="Eliminar"
                                    @click="eliminarImagenologiaEnDialogo(index)" />
                            </div>
                        </div>
                        <div class="col-12 text-center">
                            <Button icon="pi pi-plus" text raised rounded aria-label="Agregar Imagenología"
                                @click="agregarImagenologiaEnDialogo" />
                        </div>
                        <div class="col-12 text-center" style="margin-top: 1rem;">
                            <Button label="Guardar" icon="pi pi-save" text raised
                                @click="guardarNuevaCategoriaImagenologia" />
                        </div>
                    </Dialog>

                    <div class="col-12 p-3" style="margin-top: 2rem;">
                        <div class="grid  align-items-center justify-content-center">
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Guardar Cambios" icon="pi pi-save" severity="success" raised
                                    @click="guardarCambiosImagenologia" />
                            </div>
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Añadir Categoría" icon="pi pi-plus" severity="help" raised
                                    @click="abrirDialogoCategoriaImagenologia" />
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

            <StepperPanel header="Procedimientos Disponibles">
                <template #content="{ prevCallback, nextCallback }">
                    <Accordion>
                        <AccordionTab v-for="(categoriaData, categoria) in procedimientosPorCategoria" :key="categoria"
                            :header="categoria">
                            <div class="grid p-fluid">
                                <!-- Iterar sobre los procedimientos dentro de cada categoría -->
                                <div v-for="(procedimiento, index) in categoriaData.procedimientos" :key="index"
                                    class="col-12">
                                    <div class="grid">
                                        <div class="col md:col-10">
                                            <InputText v-model="procedimiento.nombre" />
                                        </div>
                                        <div class="col md:col-2 text-center">
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar"
                                                @click="eliminarRegistroProcedimiento(procedimiento.id_procedimiento)" />
                                        </div>
                                    </div>
                                </div>
                                <!-- Botón para agregar un nuevo procedimiento -->
                                <div class="col-12 text-center">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Agregar"
                                        @click="agregarNuevoCampoProcedimiento(categoria)" />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <!-- Diálogo para añadir nueva categoría -->
                    <Dialog v-model:visible="dialogoProcedimiento" modal header="Añadir Categoría"
                        :style="{ width: '25rem' }" class="p-fluid">
                        <div>
                            <FloatLabel>
                                <InputText id="categoria" v-model="nuevaCategoriaProcedimiento.categoria"
                                    autocomplete="off" />
                                <Label for="categoria">Categoría</Label>
                            </FloatLabel>
                        </div>
                        <h6>Procedimientos</h6>
                        <div v-for="(procedimiento, index) in nuevaCategoriaProcedimiento.procedimientos" :key="index"
                            class="grid align-items-center">
                            <div class="col md:col-10">
                                <InputText v-model="procedimiento.nombre" autocomplete="off" />
                            </div>
                            <div class="col md:col-2">
                                <Button icon="pi pi-times" severity="danger" text raised rounded aria-label="Eliminar"
                                    @click="eliminarProcedimientoEnDialogo(index)" />
                            </div>
                        </div>
                        <div class="col-12 text-center">
                            <Button icon="pi pi-plus" text raised rounded aria-label="Agregar Procedimiento"
                                @click="agregarProcedimientoEnDialogo" />
                        </div>
                        <div class="col-12 text-center" style="margin-top: 1rem;">
                            <Button label="Guardar" icon="pi pi-save" text raised
                                @click="guardarNuevaCategoriaProcedimiento" />
                        </div>
                    </Dialog>

                    <!-- Botones para Guardar cambios y Añadir categoría -->
                    <div class="col-12 p-3" style="margin-top: 2rem;">
                        <div class="grid align-items-center justify-content-center">
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Guardar Cambios" icon="pi pi-save" severity="success" raised
                                    @click="guardarCambiosProcedimiento" />
                            </div>
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Añadir Categoría" icon="pi pi-plus" severity="help" raised
                                    @click="abrirDialogoCategoriaProcedimiento" />
                            </div>
                        </div>
                    </div>
                    <div class="flex py-4 gap-2">
                        <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left" iconPos="left"
                            @click="prevCallback" />
                        <Button label="Siguiente" severity="info" icon="pi pi-arrow-right" iconPos="right"
                            @click="nextCallback" />
                    </div>
                </template>
            </StepperPanel>

            <StepperPanel header="Análisis Disponibles">
                <template #content="{ prevCallback, nextCallback }">
                    <Accordion>
                        <AccordionTab v-for="(categoriaData, categoria) in categoriasConSubcategorias" :key="categoria"
                            :header="categoria">
                            <div class="grid p-fluid">
                                <!-- Iterar sobre las subcategorías dentro de cada categoría -->
                                <div v-for="(subcategoria, index) in categoriaData.subcategorias" :key="index"
                                    class="col-12">
                                    <div class="grid">
                                        <div class="col md:col-10">
                                            <InputText v-model="subcategoria.nombre_subcategoria" />
                                        </div>
                                        <div class="col md:col-2 text-center">
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar"
                                                @click="eliminarRegistroSubcategoria(subcategoria.id_subcategoria_analisis)" />
                                        </div>
                                    </div>
                                </div>
                                <!-- Botón para agregar una nueva subcategoría -->
                                <div class="col-12 text-center">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Agregar"
                                        @click="agregarNuevoCampoSubcategoria(categoria)" />
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <!-- Dialog para añadir nueva categoría con subcategorías -->
                    <Dialog v-model:visible="dialogoAnalisis" modal header="Añadir Categoría"
                        :style="{ width: '25rem' }" class="p-fluid">
                        <div>
                            <FloatLabel>
                                <InputText id="categoria" v-model="nuevaCategoriaAnalisis.categoria"
                                    autocomplete="off" />
                                <Label for="categoria">Categoría</Label>
                            </FloatLabel>
                        </div>
                        <h6>Subcategorías</h6>
                        <div v-for="(subcategoria, index) in nuevaCategoriaAnalisis.subcategorias" :key="index"
                            class="grid align-items-center">
                            <div class="col md:col-10">
                                <InputText v-model="subcategoria.nombre" autocomplete="off" />
                            </div>
                            <div class="col md:col-2">
                                <Button icon="pi pi-times" severity="danger" text raised rounded aria-label="Eliminar"
                                    @click="eliminarSubcategoriaEnDialogo(index)" />
                            </div>
                        </div>
                        <div class="col-12 text-center">
                            <Button icon="pi pi-plus" text raised rounded aria-label="Agregar Subcategoría"
                                @click="agregarSubcategoriaEnDialogo" />
                        </div>
                        <div class="col-12 text-center" style="margin-top: 1rem;">
                            <Button label="Guardar" icon="pi pi-save" text raised
                                @click="guardarNuevaCategoriaAnalisis" />
                        </div>
                    </Dialog>

                    <!-- Botones para Guardar cambios y Añadir categoría -->
                    <div class="col-12 p-3" style="margin-top: 2rem;">
                        <div class="grid align-items-center justify-content-center">
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Guardar Cambios" icon="pi pi-save" severity="success" raised
                                    @click="guardarCambiosAnalisis" />
                            </div>
                            <div class="px-2 w-15rem m-3 border-round">
                                <Button label="Añadir Categoría" icon="pi pi-plus" severity="help" raised
                                    @click="abrirDialogoCategoriaAnalisis" />
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
        </Stepper>
    </div>
</template>