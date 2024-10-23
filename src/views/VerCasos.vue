<script setup>
import { ref, onMounted, watchEffect, computed, watch, reactive } from 'vue';
import {
    obtenerCasosClinicos, cambiarEstadoCaso, obtenerCategoriasSimulacion,
    obtenerCasoClinicoPorId, obtenerPuntajes, obtenerMensajes,
    actualizarPuntaje, actualizarMensaje, actualizarCasoClinico,
    agregarNuevoPuntaje, agregarNuevoMensaje, eliminarPuntajes, eliminarMensajes,
    obtenerPaciente, actualizarPaciente, obtenerAntecedentesPatologicos, actualizarAntecedentesPatologicos,
    obtenerAntecedentesNoPatologicos, actualizarAntecedentesNoPatologicos,
    obtenerAntecedentesFamiliares, actualizarAntecedentesFamiliares,
    obtenerAnamnesisSistemas, actualizarAnamnesisSistemas,
    obtenerMotivosConsulta, agregarMotivoConsulta, eliminarMotivoConsulta,
    obtenerPuntaje, actualizarMotivoConsulta,
    obtenerExamenFisicoGeneral, actualizarExamenFisicoGeneral,
    obtenerExamenFisicoSegmentario, actualizarExamenFisicoSegmentario,
    obtenerExamenObstetrico, actualizarExamenObstetrico,
    obtenerExamenViaAerea, obtenerExamenRespiratorio,
    obtenerExamenCirculatorio,
    obtenerExamenPsicologico, actualizarExamenViaAerea,
    actualizarExamenRespiratorio, actualizarExamenCirculatorio,
    actualizarExamenPsicologico,
    obtenerSignosVitales, actualizarSignosVitales,
    obtenerCategoriasDiferenciales, obtenerDiagnosticosPorCategoria,
    obtenerDiagnosticosDiferencialesPorHistoriaClinica, actualizarDiagnosticosDiferenciales,
    obtenerCategoriasMedicamentos, obtenerMedicamentosPorCategoria,
    obtenerMedicamentosSuministradosPorHistoriaClinica, actualizarMedicamentosSuministrados,
    obtenerSubespecialidades, obtenerSubespecialidadesPorHistoriaClinica,
    actualizarSubespecialidades, cargarImagen,
    obtenerCategoriasAnalisis, obtenerSubcategoriasPorCategoria,
    obtenerSolicitudesAnalisisPorHistoriaClinica, actualizarSolicitudesAnalisis,
    obtenerCategoriasConImagenologias, obtenerEstudiosImagenologiaPorHistoriaClinica,
    actualizarEstudiosImagenologia,
    obtenerTraspaso, actualizarTraspaso,
    obtenerCategoriasProcedimientos, obtenerProcedimientosPorCategoria,
    obtenerProcedimientosAsignadosPorHistoriaClinica, actualizarProcedimientosAsignados,
    actualizarDiagnosticoFinal,
    actualizarPuntajeAnamnesis,
    actualizarPuntajeExamen,
    actualizarPuntajeDiferencial,
    actualizarPuntajeIntervenir,
    actualizarPuntajeLaboratorio,
    actualizarPuntajeExterna,
    actualizarPuntajeTraspaso,
    cargarImagenCategoria,
    obtenerAntecedentesGinecoObstetricos, actualizarAntecedentesGinecoObstetricos,


} from '../services/casoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const casosClinicos = ref([]);
const categoriasSimulacion = ref([]);
const puntajes = ref([]);
const mensajesSimulacion = ref([]);
const categoriaSimulacion = ref('');
const dificultadSimulacion = ref(['Principiante', 'Intermedio', 'Avanzado']);
const dificultad = ref('');
const tiempoAsignado = ref('');
const visible = ref(false);
const casoSeleccionado = ref(null);

const paciente = ref({});
const antecedentesPatologicos = ref({});
const antecedentesNoPatologicos = ref({});
const antecedentesFamiliares = ref({});
const antecedentesGinecoObstetricos = ref({});
const anamnesisSistemas = ref({});
const motivosConsulta = ref([]);
const scoreAnamnesis = ref([]);
const sexoOpciones = ref([{ name: 'Masculino', value: 'masculino' }, { name: 'Femenino', value: 'femenino' }]);

const examenFisico = ref({});
const examenObstetrico = ref({});
const examenFisicoSegmentario = ref({});
const scoreExamenFisico = ref([]);
const examenViaAerea = ref({})
const examenRespiratorio = ref({})
const examenCirculatorio = ref({})
const examenPsicologico = ref({})

const scoreSignosVitales = ref([]);
const signosVitales = ref({});

const scoreDiagnosticoDiferencial = ref([]);
const categorias = ref([]);
const diagnosticosByCategoria = ref({});
const selectedDiagnosticosPorCategoria = ref({});
const diagnosticoDetails = ref({});
const diagnosesMap = ref({});

const scoreMedicamentos = ref([]);
const categoriasMedicamentos = ref([]);
const medicamentosPorCategoria = ref({});
const selectedMedicamentosPorCategoria = ref({});
const medicamentoDetails = ref({});
const medicamentosMap = ref({});

const scoreProcedimientos = ref([]);
const categoriasProcedimientos = ref([]);
const procedimientosPorCategoria = ref({});
const selectedProcedimientosPorCategoria = ref({});
const procedimientoDetails = ref({});
const procedimientosMap = ref({});

const subespecialidadesDisponibles = ref([]);
const subespecialidades = ref([]);
const subsData = ref([]);
const scoreSubespecialidad = ref([]);
const isInitializing = ref(false);

const scoreAnalisis = ref([]);
const categoriasAnalisis = ref([]);
const subcategoriasPorCategoria = ref({});
const selectedSubcategoriasPorCategoria = ref({});
const analisisDetails = ref({});
const subcategoriasMap = ref({});


const scoreImagenologia = ref([]);
const categoriasImagenologia = ref([]);
const imagenesData = ref([]);
const selectedImagenologiasByCategory = reactive({});

const scoreTraspaso = ref([]);
const traspaso = ref({});

const diagnosticosDiferenciales = ref([]);
const diagnosticoFinal = ref(null);

const mostrarFileUpload = ref({
    cabeza: false,
    cuello: false,
    torax: false,
    corazon: false,
    mamas: false,
    genitourinario: false,
    abdomen: false,
    extremidades: false,
    neurologico: false,
    piel: false
});

function contarYPrepararPuntajes(anamnesis) {
    let puntajeCount = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    for (let key in anamnesis) {
        if (key.startsWith('puntaje_') || key.startsWith('score')) {
            const puntaje = anamnesis[key];
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

function reunirPuntajes(...objetos) {
    let puntajeCount = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    function contarPuntajes(obj) {
        for (let key in obj) {
            if (key.startsWith('puntaje_')) {
                const puntaje = obj[key];
                //console.log("aguii: ", puntaje)
                if (hasOwnProperty.call(puntajeCount, puntaje)) {
                    puntajeCount[puntaje]++;
                }
            }
        }
    }
    objetos.forEach(obj => contarPuntajes(obj));
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
    return data
}

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

const cargarCategoriasSimulacion = async () => {
    try {
        const response = await obtenerCategoriasSimulacion();
        categoriasSimulacion.value = response.data.map(categoria => ({ label: categoria.nombre, value: categoria.id_categoria_simulacion }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las categorías', life: 3000 });
    }
};

const cargarPuntajes = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntajes(id_historia_clinica);
        puntajes.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los puntajes', life: 3000 });
    }
};

const cargarMensajes = async (id_caso_clinico) => {
    try {
        const response = await obtenerMensajes(id_caso_clinico);
        mensajesSimulacion.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los mensajes', life: 3000 });
    }
};

const mostrarDetalleCaso = async (idCaso) => {
    try {
        const response = await obtenerCasoClinicoPorId(idCaso);
        casoSeleccionado.value = response.data;
        categoriaSimulacion.value = casoSeleccionado.value.id_categoria_simulacion;
        dificultad.value = casoSeleccionado.value.difucultad;
        tiempoAsignado.value = casoSeleccionado.value.tiempo;
        localStorage.setItem('id_historia_clinica', casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajes(casoSeleccionado.value.id_historia_clinica);
        await cargarMensajes(idCaso);
        await cargarDatosPaciente(casoSeleccionado.value.id_historia_clinica);
        await cargarAntecedentesPatologicos(casoSeleccionado.value.id_historia_clinica);
        await cargarAntecedentesNoPatologicos(casoSeleccionado.value.id_historia_clinica);
        await cargarAntecedentesFamiliares(casoSeleccionado.value.id_historia_clinica);
        await cargarAntecedentesGinecoObstetricos(casoSeleccionado.value.id_historia_clinica);
        await cargarAnamnesisSistemas(casoSeleccionado.value.id_historia_clinica);
        await cargarMotivosConsulta(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeExamen(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenFisicoGeneral(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntaje(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenFisicoSegmentario(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenObstetrico(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenViaAerea(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenRespiratorio(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenCirculatorio(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenPsicologico(casoSeleccionado.value.id_historia_clinica);
        await cargarSignosVitales(casoSeleccionado.value.id_historia_clinica)
        await cargarPuntajeSignosVitales(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeDiagnosticoDiferencial(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasYDiagnosticos();
        await cargarDiagnosticosDiferenciales(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeMedicamentos(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasYMedicamentos();
        await cargarMedicamentosSuministrados(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeSubespecialidad(casoSeleccionado.value.id_historia_clinica);
        await cargarSubespecialidadesDisponibles();
        await cargarSubespecialidadesSeleccionadas(casoSeleccionado.value.id_historia_clinica);
        await cargarTraspaso(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeTraspaso(casoSeleccionado.value.id_historia_clinica);
        await cargarDiagnosticoFinal(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeAnalisis(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasYSubcategorias();
        await cargarSolicitudesAnalisis(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeImagenologia(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasImagenologia();
        await cargarEstudiosImagenes(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeProcedimiento(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasYProcedimientos();
        await cargarProcedimientosAsignados(casoSeleccionado.value.id_historia_clinica);
        visible.value = true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el caso clínico', life: 3000 });
    }
};

const agregarPuntaje = async () => {
    const nuevoPuntaje = { id_valor_puntaje: null, rubrica: '', codigo: '', valor: 0 };
    puntajes.value.push(nuevoPuntaje);
    try {
        const response = await agregarNuevoPuntaje({
            id_historia_clinica: casoSeleccionado.value.id_historia_clinica,
            rubrica: nuevoPuntaje.rubrica,
            codigo: nuevoPuntaje.codigo,
            valor: nuevoPuntaje.valor
        });
        nuevoPuntaje.id_valor_puntaje = response.data.id_valor_puntaje;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Puntaje agregado correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el puntaje', life: 3000 });
    }
};

const eliminarPuntaje = async (index) => {
    const puntaje = puntajes.value[index];
    if (puntaje.id_valor_puntaje) {
        try {
            await eliminarPuntajes(puntaje.id_valor_puntaje);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Puntaje eliminado correctamente', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el puntaje', life: 3000 });
        }
    }
    puntajes.value.splice(index, 1);
};

const agregarMensaje = async () => {
    const nuevoMensaje = { id_mensajes_simulacion: null, titulo: '', descripcion: '', tiempo: '' };
    mensajesSimulacion.value.push(nuevoMensaje);
    try {
        const response = await agregarNuevoMensaje({
            id_caso_clinico: casoSeleccionado.value.id_caso_clinico,
            titulo: nuevoMensaje.titulo,
            descripcion: nuevoMensaje.descripcion,
            tiempo: nuevoMensaje.tiempo
        });
        nuevoMensaje.id_mensajes_simulacion = response.data.id_mensajes_simulacion;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Mensaje agregado correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el mensaje', life: 3000 });
    }
};

const eliminarMensaje = async (index) => {
    const mensaje = mensajesSimulacion.value[index];
    if (mensaje.id_mensajes_simulacion) {
        try {
            await eliminarMensajes(mensaje.id_mensajes_simulacion);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Mensaje eliminado correctamente', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el mensaje', life: 3000 });
        }
    }
    mensajesSimulacion.value.splice(index, 1);
};

const guardarCambios = async () => {
    try {
        await actualizarCasoClinico(casoSeleccionado.value.id_caso_clinico, {
            id_categoria_simulacion: categoriaSimulacion.value,
            dificultad: dificultad.value,
            tiempo: tiempoAsignado.value
        });
        for (const puntaje of puntajes.value) {
            if (puntaje.id_valor_puntaje) {
                await actualizarPuntaje(puntaje.id_valor_puntaje, {
                    rubrica: puntaje.rubrica,
                    codigo: puntaje.codigo,
                    valor: puntaje.valor
                });
            }
        }
        for (const mensaje of mensajesSimulacion.value) {
            if (mensaje.id_mensajes_simulacion) {
                await actualizarMensaje(mensaje.id_mensajes_simulacion, {
                    titulo: mensaje.titulo,
                    descripcion: mensaje.descripcion,
                    tiempo: mensaje.tiempo
                });
            }
        }
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cambios guardados correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron guardar los cambios', life: 3000 });
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

const cargarAntecedentesPatologicos = async (id_historia_clinica) => {
    try {
        const response = await obtenerAntecedentesPatologicos(id_historia_clinica);
        antecedentesPatologicos.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes patológicos', life: 3000 });
    }
};

const cargarAntecedentesNoPatologicos = async (id_historia_clinica) => {
    try {
        const response = await obtenerAntecedentesNoPatologicos(id_historia_clinica);
        antecedentesNoPatologicos.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes no patológicos', life: 3000 });
    }
};

const cargarAntecedentesFamiliares = async (id_historia_clinica) => {
    try {
        const response = await obtenerAntecedentesFamiliares(id_historia_clinica);
        antecedentesFamiliares.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes familiares', life: 3000 });
    }
};

const cargarAntecedentesGinecoObstetricos = async (id_historia_clinica) => {
    try {
        const response = await obtenerAntecedentesGinecoObstetricos(id_historia_clinica);

        antecedentesGinecoObstetricos.value = response.data[0];
        console.log(antecedentesGinecoObstetricos.value)
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes familiares', life: 3000 });
    }
};

const cargarAnamnesisSistemas = async (id_historia_clinica) => {
    try {
        const response = await obtenerAnamnesisSistemas(id_historia_clinica);
        anamnesisSistemas.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener anamnesis por sistemas', life: 3000 });
    }
};

const cargarMotivosConsulta = async (id_historia_clinica) => {
    try {
        const response = await obtenerMotivosConsulta(id_historia_clinica);
        motivosConsulta.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener motivos de consulta', life: 3000 });
    }
};

const cargarPuntaje = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreAnamnesis.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const agregarNuevoMotivoConsulta = async () => {
    const nuevoMotivo = { id_motivo_consulta: null, motivo: '', id_historia_clinica: paciente.value.id_historia_clinica };
    try {
        const response = await agregarMotivoConsulta(nuevoMotivo);
        nuevoMotivo.id_motivo_consulta = response.data.id_motivo_consulta; // Asegúrate de obtener el ID generado
        motivosConsulta.value.push(nuevoMotivo);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Motivo de consulta agregado', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar motivo de consulta', life: 3000 });
    }
};

const eliminarMotivo = async (index) => {
    const motivo = motivosConsulta.value[index];
    if (motivo.id_motivo_consulta) {
        try {
            await eliminarMotivoConsulta(motivo.id_motivo_consulta);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Motivo eliminado correctamente', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar motivo', life: 3000 });
        }
    }
    motivosConsulta.value.splice(index, 1);
};

const cargarExamenFisicoGeneral = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenFisicoGeneral(id_historia_clinica);
        examenFisico.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};

const cargarExamenFisicoSegmentario = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenFisicoSegmentario(id_historia_clinica);
        examenFisicoSegmentario.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico segmentario', life: 3000 });
    }
};

const cargarExamenObstetrico = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenObstetrico(id_historia_clinica);
        examenObstetrico.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico obstetrico', life: 3000 });
    }
};

const cargarExamenViaAerea = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenViaAerea(id_historia_clinica);
        examenViaAerea.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico obstetrico', life: 3000 });
    }
};

const cargarExamenRespiratorio = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenRespiratorio(id_historia_clinica);
        examenRespiratorio.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico obstetrico', life: 3000 });
    }
};
const cargarExamenCirculatorio = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenCirculatorio(id_historia_clinica);
        examenCirculatorio.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico obstetrico', life: 3000 });
    }
};

const cargarExamenPsicologico = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenPsicologico(id_historia_clinica);
        examenPsicologico.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico obstetrico', life: 3000 });
    }
};

const cargarPuntajeExamen = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreExamenFisico.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const cargarPuntajeSignosVitales = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreSignosVitales.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const cargarSignosVitales = async (id_historia_clinica) => {
    try {
        const response = await obtenerSignosVitales(id_historia_clinica);
        signosVitales.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes patológicos', life: 3000 });
    }
};

const guardarTodosLosCambiosPaciente = async () => {
    try {

        await actualizarPaciente(paciente.value.id_paciente, paciente.value);
        await actualizarAntecedentesPatologicos(paciente.value.id_historia_clinica, antecedentesPatologicos.value);
        await actualizarAntecedentesNoPatologicos(paciente.value.id_historia_clinica, antecedentesNoPatologicos.value);
        await actualizarAntecedentesFamiliares(paciente.value.id_historia_clinica, antecedentesFamiliares.value);
        await actualizarAntecedentesGinecoObstetricos(paciente.value.id_historia_clinica, antecedentesGinecoObstetricos.value)
        await actualizarAnamnesisSistemas(paciente.value.id_historia_clinica, anamnesisSistemas.value);
        await actualizarPuntajeAnamnesis(paciente.value.id_historia_clinica, contarYPrepararPuntajes(anamnesisSistemas.value))
        await actualizarSignosVitales(paciente.value.id_historia_clinica, signosVitales.value);
        for (const motivo of motivosConsulta.value) {
            if (motivo.id_motivo_consulta) {

                await actualizarMotivoConsulta(motivo.id_motivo_consulta, motivo);
            } else {

                const response = await agregarMotivoConsulta(motivo);
                motivo.id_motivo_consulta = response.data.id_motivo_consulta;
            }
        }
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Todos los cambios se han guardado correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar los cambios', life: 3000 });
    }
};

const guardarTodosLosCambiosExamen = async () => {
    try {
        await actualizarExamenFisicoGeneral(paciente.value.id_historia_clinica, examenFisico.value);
        await actualizarExamenFisicoSegmentario(paciente.value.id_historia_clinica, examenFisicoSegmentario.value);
        await actualizarExamenObstetrico(paciente.value.id_historia_clinica, examenObstetrico.value);
        await actualizarExamenViaAerea(paciente.value.id_historia_clinica, examenViaAerea.value);
        await actualizarExamenRespiratorio(paciente.value.id_historia_clinica, examenRespiratorio.value);
        await actualizarExamenCirculatorio(paciente.value.id_historia_clinica, examenCirculatorio.value);
        await actualizarExamenPsicologico(paciente.value.id_historia_clinica, examenPsicologico.value);
        await actualizarPuntajeExamen(paciente.value.id_historia_clinica, reunirPuntajes(examenFisico.value, examenFisicoSegmentario.value, examenObstetrico.value, examenViaAerea.value, examenRespiratorio.value, examenCirculatorio.value, examenPsicologico.value));

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Todos los cambios se han guardado correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar los cambios', life: 3000 });
    }
};

const guardarTodosLosCambiosSignosVitales = async () => {
    try {

        await actualizarSignosVitales(paciente.value.id_historia_clinica, signosVitales.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Todos los cambios se han guardado correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar los cambios', life: 3000 });
    }
};

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

const cargarCategoriasYDiagnosticos = async () => {
    try {
        const response = await obtenerCategoriasDiferenciales();
        categorias.value = response.data;
        categorias.value.forEach(categoria => {
            selectedDiagnosticosPorCategoria.value[categoria.id_categoria_diferencial] = [];
        });
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
        for (let categoriaId in selectedDiagnosticosPorCategoria.value) {
            selectedDiagnosticosPorCategoria.value[categoriaId] = [];
        }
        data.forEach(dd => {
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

const allSelectedDiagnosticos = computed(() => {
    let allDiagnosticos = [];
    for (let categoriaId in selectedDiagnosticosPorCategoria.value) {
        allDiagnosticos = allDiagnosticos.concat(selectedDiagnosticosPorCategoria.value[categoriaId]);
    }
    return allDiagnosticos;
});

const guardarDiagnosticosDiferenciales = async () => {
    try {
        const data = allSelectedDiagnosticos.value.map(diagnosisId => ({
            id_diagnostico: diagnosisId,
            feed_diagnostico_diferencial: diagnosticoDetails.value[diagnosisId].feedback,
            puntaje_diagnostico_diferencial: diagnosticoDetails.value[diagnosisId].score,
        }));
        await actualizarDiagnosticosDiferenciales(casoSeleccionado.value.id_historia_clinica, data);
        await actualizarPuntajeDiferencial(casoSeleccionado.value.id_historia_clinica, contarYPrepararPuntajesVectores(diagnosticoDetails.value))
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Diagnósticos diferenciales guardados correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar diagnósticos diferenciales', life: 3000 });
    }
};

watchEffect(() => {
    const allDiagnosticos = allSelectedDiagnosticos.value.map(id => parseInt(id));
    const currentDiagnosticosDetails = Object.keys(diagnosticoDetails.value).map(id => parseInt(id));

    allDiagnosticos.forEach(diagnosisId => {
        if (!currentDiagnosticosDetails.includes(diagnosisId)) {
            diagnosticoDetails.value[diagnosisId] = {
                feedback: '',
                score: null,
                nombre: getDiagnosisNameById(diagnosisId),
            };
        }
    });

    currentDiagnosticosDetails.forEach(diagnosisId => {
        if (!allDiagnosticos.includes(diagnosisId)) {
            delete diagnosticoDetails.value[diagnosisId];
        }
    });
});

const cargarPuntajeAnalisis = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreAnalisis.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const cargarCategoriasYSubcategorias = async () => {
    try {
        const response = await obtenerCategoriasAnalisis();
        categoriasAnalisis.value = response.data;
        categoriasAnalisis.value.forEach(categoria => {
            selectedSubcategoriasPorCategoria.value[categoria.id_categoria_analisis] = [];
        });
        for (let categoria of categoriasAnalisis.value) {
            const resSubcategorias = await obtenerSubcategoriasPorCategoria(categoria.id_categoria_analisis);
            const subcategorias = resSubcategorias.data.map(s => ({
                ...s,
                name: s.nombre_subcategoria,
                value: s.id_subcategoria_analisis,
            }));
            subcategoriasPorCategoria.value[categoria.id_categoria_analisis] = subcategorias;
            subcategorias.forEach(subcategoria => {
                subcategoriasMap.value[subcategoria.id_subcategoria_analisis] = subcategoria;
            });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías y subcategorías', life: 3000 });
    }
};

const cargarSolicitudesAnalisis = async (id_historia_clinica) => {
    try {
        const response = await obtenerSolicitudesAnalisisPorHistoriaClinica(id_historia_clinica);
        const data = response.data;
        data.forEach(sa => {
            const categoriaId = sa.id_categoria_analisis;
            analisisDetails.value[categoriaId] = {
                id_solicitud_analisis: sa.id_solicitud_analisis,
                puntaje_analisis: sa.puntaje_analisis,
                feed_analisis: sa.feed_analsis,
                detalles: {},
            };
            selectedSubcategoriasPorCategoria.value[categoriaId] = [];
            if (sa.detalles && sa.detalles.length > 0) {
                sa.detalles.forEach(detalle => {
                    selectedSubcategoriasPorCategoria.value[categoriaId].push(detalle.id_subcategoria_analisis);
                    analisisDetails.value[categoriaId].detalles[detalle.id_subcategoria_analisis] = {
                        id_detalle_subanalisis: detalle.id_detalle_subanalisis,
                        resultado: detalle.resultado,
                        nombre_subcategoria: detalle.nombre_subcategoria,
                    };
                });
            }
        });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar solicitudes de análisis', life: 3000 });
    }
};

watchEffect(() => {
    for (let categoriaId in selectedSubcategoriasPorCategoria.value) {
        const selectedIds = selectedSubcategoriasPorCategoria.value[categoriaId];
        if (!analisisDetails.value[categoriaId]) {
            analisisDetails.value[categoriaId] = {
                id_solicitud_analisis: null,
                puntaje_analisis: null,
                feed_analisis: '',
                detalles: {},
            };
        }
        const detalles = analisisDetails.value[categoriaId].detalles;
        selectedIds.forEach(subcatId => {
            if (!detalles[subcatId]) {
                detalles[subcatId] = {
                    id_detalle_subanalisis: null,
                    resultado: '',
                    nombre_subcategoria: subcategoriasMap.value[subcatId]?.nombre_subcategoria || '',
                };
            }
        });
        for (let subcatId in detalles) {
            if (!selectedIds.includes(parseInt(subcatId))) {
                delete detalles[subcatId];
            }
        }
    }
});

const cargarPuntajeImagenologia = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreImagenologia.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const cargarCategoriasImagenologia = async () => {
    try {
        const response = await obtenerCategoriasConImagenologias();
        categoriasImagenologia.value = response.data;
        categoriasImagenologia.value.forEach(category => {
            if (!selectedImagenologiasByCategory[category.id_categoria_imagenologia]) {
                selectedImagenologiasByCategory[category.id_categoria_imagenologia] = [];
            }
        });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener categorías de imagenología', life: 3000 });
    }
};

const cargarEstudiosImagenes = async (id_historia_clinica) => {
    try {
        const response = await obtenerEstudiosImagenologiaPorHistoriaClinica(id_historia_clinica);
        const estudios = response.data;
        imagenesData.value = estudios.map(estudio => ({
            id_estudios_imagenologia: estudio.id_estudios_imagenologia,
            id_imagenologia: estudio.id_imagenologia,
            nombre: estudio.imagenologia_nombre,
            categoria_nombre: estudio.categoria_nombre,
            interpretacion: estudio.interpretacion,
            path: estudio.path,
            feed_estudios_imagenologia: estudio.feed_estudios_imagenologia,
            puntaje_estudios_imagenologia: estudio.puntaje_estudios_imagenologia
        }));

        estudios.forEach(estudio => {
            const categoryId = categoriasImagenologia.value.find(category => category.nombre === estudio.categoria_nombre)?.id_categoria_imagenologia;
            if (categoryId) {
                if (!selectedImagenologiasByCategory[categoryId]) {
                    selectedImagenologiasByCategory[categoryId] = [];
                }
                if (!selectedImagenologiasByCategory[categoryId].includes(estudio.id_imagenologia)) {
                    selectedImagenologiasByCategory[categoryId].push(estudio.id_imagenologia);
                }
            }
        });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener estudios de imagenología', life: 3000 });
    }
};

// eslint-disable-next-line no-unused-vars
const onImagenologiaSelectionChange = (categoryId) => {
    const selectedIds = Object.values(selectedImagenologiasByCategory).flat();
    const previousIds = imagenesData.value.map(img => img.id_imagenologia);
    const addedIds = selectedIds.filter(id => !previousIds.includes(id));
    const removedIds = previousIds.filter(id => !selectedIds.includes(id));
    addedIds.forEach(id_imagenologia => {
        const imagenologia = categoriasImagenologia.value.flatMap(cat => cat.imagenologias)
            .find(img => img.id_imagenologia === id_imagenologia);
        if (imagenologia) {
            const category = categoriasImagenologia.value.find(cat => cat.imagenologias.some(img => img.id_imagenologia === id_imagenologia));
            imagenesData.value.push({
                id_estudios_imagenologia: null,
                id_imagenologia: id_imagenologia,
                nombre: imagenologia.nombre,
                categoria_nombre: category.nombre,
                interpretacion: '',
                path: '',
                feed_estudios_imagenologia: '',
                puntaje_estudios_imagenologia: ''
            });
        }
    });
    removedIds.forEach(id_imagenologia => {
        const index = imagenesData.value.findIndex(img => img.id_imagenologia === id_imagenologia);
        if (index !== -1) {
            imagenesData.value.splice(index, 1);
        }
    });
};

const onUpload = async (event, index) => {
    const file = event.files[0];
    const formData = new FormData();
    let categoria = imagenesData.value[index].categoria_nombre + "-" + imagenesData.value[index].nombre
    console.log(categoria)
    console.log(imagenesData.value[index])
    formData.append('imagen', file);
    formData.append('id_imagenologia', categoria);
    try {
        const response = await cargarImagenCategoria(formData);
        imagenesData.value[index].path = response.data.path;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Imagen cargada correctamente', life: 3000 });
    } catch (error) {
        console.log(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la imagen', life: 3000 });
    }
};


function contarPuntajesImagenologia(imagenesData) {
    let puntajeCount = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    imagenesData.forEach(imagen => {
        const puntaje = imagen.puntaje_estudios_imagenologia;
        // eslint-disable-next-line no-prototype-builtins
        if (puntaje && puntajeCount.hasOwnProperty(puntaje)) {
            puntajeCount[puntaje]++;
        }
    });
    return {
        puntaje_a: puntajeCount.A || 0,
        puntaje_b: puntajeCount.B || 0,
        puntaje_c: puntajeCount.C || 0,
        puntaje_d: puntajeCount.D || 0,
        puntaje_e: puntajeCount.E || 0
    };
}

function contarPuntajesAnalisis(analisisDetails) {
    let puntajeCount = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    for (let categoriaId in analisisDetails) {
        const puntaje = analisisDetails[categoriaId].puntaje_analisis;
        // eslint-disable-next-line no-prototype-builtins
        if (puntaje && puntajeCount.hasOwnProperty(puntaje)) {
            puntajeCount[puntaje]++;
        }
    }
    return {
        puntaje_a: puntajeCount.A || 0,
        puntaje_b: puntajeCount.B || 0,
        puntaje_c: puntajeCount.C || 0,
        puntaje_d: puntajeCount.D || 0,
        puntaje_e: puntajeCount.E || 0
    };
}

function sumarPuntajes(puntajes1, puntajes2) {
    return {
        puntaje_a: (puntajes1.puntaje_a || 0) + (puntajes2.puntaje_a || 0),
        puntaje_b: (puntajes1.puntaje_b || 0) + (puntajes2.puntaje_b || 0),
        puntaje_c: (puntajes1.puntaje_c || 0) + (puntajes2.puntaje_c || 0),
        puntaje_d: (puntajes1.puntaje_d || 0) + (puntajes2.puntaje_d || 0),
        puntaje_e: (puntajes1.puntaje_e || 0) + (puntajes2.puntaje_e || 0)
    };
}

function prepararDatosAnalisis() {
    const data = [];
    for (let categoriaId in analisisDetails.value) {
        const analisis = analisisDetails.value[categoriaId];
        const detallesArray = [];
        for (let subcatId in analisis.detalles) {
            detallesArray.push({
                id_subcategoria_analisis: subcatId,
                resultado: analisis.detalles[subcatId].resultado,
            });
        }
        data.push({
            id_categoria_analisis: categoriaId,
            puntaje_analisis: analisis.puntaje_analisis,
            feed_analsis: analisis.feed_analisis,
            detalles: detallesArray,
        });
    }
    return data;
}

const guardarTodosLosCambiosLaboratorio = async () => {
    try {
        await actualizarEstudiosImagenologia(casoSeleccionado.value.id_historia_clinica, imagenesData.value);
        await actualizarSolicitudesAnalisis(casoSeleccionado.value.id_historia_clinica, prepararDatosAnalisis());
        let puntajesImagenologia = contarPuntajesImagenologia(imagenesData.value);
        let puntajesAnalisis = contarPuntajesAnalisis(analisisDetails.value);
        let puntajesTotales = sumarPuntajes(puntajesImagenologia, puntajesAnalisis);
        await actualizarPuntajeLaboratorio(casoSeleccionado.value.id_historia_clinica, puntajesTotales);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Laboratorio actualizado correctamente', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el laboratorio', life: 3000 });
    }
};







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

const guardarSeccionIntervenir = async () => {
    try {
        const data = allSelectedMedicamentos.value.map(medicamentoId => ({
            id_medicamento: medicamentoId,
            feed_medicamento_diferencial: medicamentoDetails.value[medicamentoId].feedback,
            puntaje_medicamento_diferencial: medicamentoDetails.value[medicamentoId].score,
        }));

        const dataUno = allSelectedProcedimientos.value.map(procedimientoId => ({
            id_procedimiento: procedimientoId,
            feed_procedimiento_asignado: procedimientoDetails.value[procedimientoId].feedback,
            puntaje_procedimiento_asignado: procedimientoDetails.value[procedimientoId].score,
        }));

        let puntajeMedicamento = contarYPrepararPuntajesVectores(medicamentoDetails.value)
        let puntajeProcedimiento = contarYPrepararPuntajesVectores(procedimientoDetails.value)
        console.log(sumarPuntajes(puntajeMedicamento, puntajeProcedimiento))
        await actualizarProcedimientosAsignados(casoSeleccionado.value.id_historia_clinica, dataUno);
        await actualizarMedicamentosSuministrados(casoSeleccionado.value.id_historia_clinica, data);
        await actualizarPuntajeIntervenir(casoSeleccionado.value.id_historia_clinica, sumarPuntajes(puntajeMedicamento, puntajeProcedimiento))
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Medicamentos suministrados guardados correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar medicamentos suministrados', life: 3000 });
    }
};


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


const cargarPuntajeProcedimiento = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreProcedimientos.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
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

const cargarPuntajeSubespecialidad = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreSubespecialidad.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const cargarSubespecialidadesDisponibles = async () => {
    try {
        const response = await obtenerSubespecialidades();
        subespecialidadesDisponibles.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener subespecialidades', life: 3000 });
    }
};

const cargarSubespecialidadesSeleccionadas = async (id_historia_clinica) => {
    try {
        isInitializing.value = true;
        const response = await obtenerSubespecialidadesPorHistoriaClinica(id_historia_clinica);
        const selectedSubs = response.data;
        subespecialidades.value = selectedSubs.map(sub => sub.id_subespecialidad);

        subsData.value = selectedSubs.map(sub => ({
            id_subespecialidad: sub.id_subespecialidad,
            nombre: sub.nombre,
            descripcion: sub.descripcion || '',
            feedback: sub.feed_subespecialidad || '',
            score: sub.puntaje_subespecialidad || ''
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener subespecialidades seleccionadas', life: 3000 });
    } finally {
        isInitializing.value = false;
    }
};

watch(subespecialidades, (newVal, oldVal) => {
    if (isInitializing.value) {
        return;
    }

    const addedSubs = newVal.filter(id => !oldVal.includes(id));
    const removedSubs = oldVal.filter(id => !newVal.includes(id));

    addedSubs.forEach(id => {
        const sub = subespecialidadesDisponibles.value.find(s => s.id_subespecialidad === id);
        if (sub) {
            const exists = subsData.value.some(s => s.id_subespecialidad === id);
            if (!exists) {
                subsData.value.push({
                    id_subespecialidad: sub.id_subespecialidad,
                    nombre: sub.nombre,
                    descripcion: '',
                    feedback: '',
                    score: ''
                });
            }
        }
    });
    removedSubs.forEach(id => {
        const index = subsData.value.findIndex(s => s.id_subespecialidad === id);
        if (index !== -1) {
            subsData.value.splice(index, 1);
        }
    });
});

const guardarSubespecialidades = async () => {
    try {
        await actualizarSubespecialidades(casoSeleccionado.value.id_historia_clinica, subsData.value);
        await actualizarPuntajeExterna(casoSeleccionado.value.id_historia_clinica, contarYPrepararPuntajesVectores(subsData.value))
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Subespecialidades guardadas correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar las subespecialidades', life: 3000 });
    }
};

const cargarPuntajeTraspaso = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreTraspaso.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const cargarTraspaso = async (id_historia_clinica) => {
    try {
        const response = await obtenerTraspaso(id_historia_clinica);
        traspaso.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes patológicos', life: 3000 });
    }
};

const guardarTodosLosCambiosTraspaso = async () => {
    try {

        await actualizarTraspaso(paciente.value.id_historia_clinica, traspaso.value);
        if (diagnosticoFinal.value) {
            await actualizarDiagnosticoFinal(casoSeleccionado.value.id_historia_clinica, diagnosticoFinal.value);
            await actualizarPuntajeTraspaso(casoSeleccionado.value.id_historia_clinica, contarYPrepararPuntajes(traspaso.value))
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'El diagnóstico final se ha actualizado correctamente', life: 3000 });
        } else {
            toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un diagnóstico final antes de guardar', life: 3000 });
        }
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Todos los cambios se han guardado correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar los cambios', life: 3000 });
    }
};


const cargarDiagnosticoFinal = async (idCaso) => {
    try {
        const response = await obtenerCasoClinicoPorId(idCaso);
        casoSeleccionado.value = response.data;
        await cargarDatosPaciente(casoSeleccionado.value.id_historia_clinica);
        const diagnosticosResponse = await obtenerDiagnosticosDiferencialesPorHistoriaClinica(casoSeleccionado.value.id_historia_clinica);
        diagnosticosDiferenciales.value = diagnosticosResponse.data.map(diagnostico => ({
            label: diagnostico.nombre,
            value: diagnostico.id_diagnostico
        }));

        diagnosticoFinal.value = parseInt(casoSeleccionado.value.diagnostico, 10);

        visible.value = true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el caso clínico o diagnósticos diferenciales', life: 3000 });
    }
};

const toggleFileUpload = (sistema) => {
    if (examenFisicoSegmentario.value[`img_${sistema}`]) {

        examenFisicoSegmentario.value[`img_${sistema}`] = '';
        toast.add({
            severity: 'info', summary: 'Imagen eliminada', detail: `Se ha eliminado la imagen del sistema ${sistema}`, life: 3000,
        });
    } else {
        mostrarFileUpload.value[sistema] = !mostrarFileUpload.value[sistema];
        if (!mostrarFileUpload.value[sistema]) {
            examenFisicoSegmentario.value[`img_${sistema}`] = '';
            toast.add({
                severity: 'info', summary: 'Imagen removida', detail: `Se ha removido la imagen del sistema ${sistema}`, life: 3000,
            });
        }
    }
};

const onFileSelect = (event, sistema) => {
    const archivo = event.files[0];
    subirImagen(sistema, archivo);
};

const subirImagen = async (sistema, archivo) => {
    try {
        const formData = new FormData();
        formData.append('imagen', archivo);
        formData.append('sistema', sistema);

        const response = await cargarImagen(formData);
        const rutaImagen = response.data.path;
        examenFisicoSegmentario.value = {
            ...examenFisicoSegmentario.value,
            [`img_${sistema}`]: rutaImagen
        };
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Imagen cargada correctamente para ${sistema}`,
            life: 3000,
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error al cargar la imagen para ${sistema}`,
            life: 3000,
        });
    }
};
onMounted(() => {
    cargarCasosClinicos();
    cargarCategoriasSimulacion();
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
                    <StepperPanel header="Configuración Inicial">
                        <template #content="{ nextCallback }">

                            <div class="grid">
                                <div class="col md:col-4">
                                    <h5>Categoria</h5>
                                </div>
                                <div class="col md:col-4">
                                    <h5>Dificultad</h5>
                                </div>
                                <div class="col md:col-4">
                                    <h5>Tiempo</h5>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Dropdown v-model="categoriaSimulacion" :options="categoriasSimulacion"
                                            optionLabel="label" optionValue="value" placeholder="Elige una opción"
                                            checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="categoriaSimulacion">Elige una categoría</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Dropdown v-model="dificultad" :options="dificultadSimulacion"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                            class="w-full md:w-14rem" />
                                        <label for="dificultad">Elige una dificultad</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <InputText id="tiempoAsignado" v-model="tiempoAsignado" />
                                        <label for="tiempoAsignado">Minutos [mm:ss]</label>
                                    </FloatLabel>
                                </div>
                            </div>

                            <div class="grid pt-3">
                                <div class="col md:col-6">
                                    <h5>Puntaje</h5>
                                </div>
                                <div class="col md:col-6">
                                    <h5>Mensajes durante la simulación</h5>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="col md:col-6">
                                    <div class="grid p-fluid pt-3" v-for="(puntaje, index) in puntajes" :key="index">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="puntaje.rubrica" />
                                                <label for="rubrica">Rubrica</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="puntaje.codigo" />
                                                <label for="codigoPuntajeSimulacion">Codigo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputNumber v-model="puntaje.valor" :minFractionDigits="2" />
                                                <label for="valorPuntaje">Puntos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 text-center pt-3">
                                            <!-- Mostrar el botón "+" solo si es el último elemento -->
                                            <Button v-if="index === puntajes.length - 1" icon="pi pi-plus" text raised
                                                rounded aria-label="Agregar" @click="agregarPuntaje" />
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar" @click="eliminarPuntaje(index)" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col md:col-6">
                                    <div class="grid p-fluid pt-3" v-for="(mensaje, index) in mensajesSimulacion"
                                        :key="index">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="mensaje.titulo" />
                                                <label for="tituloMensaje">TituloMensaje</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="mensaje.tiempo" />
                                                <label for="tiempoMensaje">Tiempo [mm:ss]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <Textarea v-model="mensaje.descripcion" autoResize rows="3" cols="30" />
                                                <label for="descripciónMensaje">Descripción</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 text-center pt-4">
                                            <!-- Mostrar el botón "+" solo si es el último elemento -->
                                            <Button v-if="index === mensajesSimulacion.length - 1" icon="pi pi-plus"
                                                text raised rounded aria-label="Agregar" @click="agregarMensaje" />
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar" @click="eliminarMensaje(index)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex py-4 gap-2">
                                <Button label="Guardar" severity="success" icon="pi pi-save" iconPos="left"
                                    @click="guardarCambios" />
                                <Button label="Siguiente" severity="primary" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>


                    <StepperPanel header="Paciente">
                        <template #content="{ prevCallback, nextCallback }">
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <h5>Información personal del paciente</h5>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="paciente.nombre" />
                                                <label for="nombre">Nombre</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="paciente.paterno" />
                                                <label for="paterno">Apellido Paterno</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="paciente.materno" />
                                                <label for="materno">Apellido Materno</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="paciente.edad" />
                                                <label for="materno">Edad</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <h5>Información básica del paciente</h5>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber v-model="paciente.peso" :minFractionDigits="2" />
                                                <label for="peso">Peso [Kg.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber v-model="paciente.talla" :minFractionDigits="2" />
                                                <label for="talla">Talla [m.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Dropdown v-model="paciente.sexo" :options="sexoOpciones"
                                                    optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark
                                                    class="w-full md:w-14rem" />
                                                <label for="sexo">Sexo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText v-model="paciente.ocupacion" />
                                                <label for="materno">Ocupación</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <h5>Información inicial para la historia clínica</h5>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-12">
                                            <FloatLabel>
                                                <Textarea v-model="paciente.descripcion" autoResize rows="5"
                                                    cols="30" />
                                                <label for="descripcionHistoria">Descripción</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <h5>Motivo de la consulta</h5>
                                    <div v-for="(motivo, index) in motivosConsulta" :key="index"
                                        class="grid p-fluid pt-3">
                                        <div class="col md:col-9">
                                            <FloatLabel>
                                                <InputText v-model="motivo.motivo" />
                                                <label for="motivoConsulta">Motivo de la consulta</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3 text-center">
                                            <!-- Botón "+" para agregar un nuevo motivo -->
                                            <Button v-if="index === motivosConsulta.length - 1" icon="pi pi-plus" text
                                                raised rounded aria-label="Agregar"
                                                @click="agregarNuevoMotivoConsulta" />
                                            <Button icon="pi pi-times" severity="danger" text raised rounded
                                                aria-label="Eliminar" @click="eliminarMotivo(index)" />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <h5>Información relevante para la historia clínica</h5>
                            <h5>Atecedentes Gineco Obstetricos</h5>
                            <div class="grid p-fluid">
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.menarca" />
                                        <label for="nombre">Menarca</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.fum" />
                                        <label for="nombre">FUM</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.fpp" />
                                        <label for="nombre">FPP</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.gestaciones" />
                                        <label for="nombre">Gestaciones</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-2">
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.partos" />
                                        <label for="nombre">Partos</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.abortos" />
                                        <label for="nombre">Abortos</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.cesarias" />
                                        <label for="nombre">Cesarias</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <InputText v-model="antecedentesGinecoObstetricos.cpn" />
                                        <label for="nombre">CPN</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <h5>Antecedentes patologicos</h5>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.alergias" autoResize rows="3"
                                                    cols="30" />
                                                <label for="alergias">Alergias</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.cirugias" autoResize rows="3"
                                                    cols="30" />
                                                <label for="cirugias">Cirugias</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.traumatismos" autoResize
                                                    rows="3" cols="30" />
                                                <label for="traumatismos">Traumatismos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.intoxicaciones" autoResize
                                                    rows="3" cols="30" />
                                                <label for="intoxicaciones">Intoxicaciones</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.hospitalizaciones" autoResize
                                                    rows="3" cols="30" />
                                                <label for="hospitalizaciones">Hospitalizaciones</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.enfermedades" autoResize
                                                    rows="3" cols="30" />
                                                <label for="enfermedades">Enfermedades</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.patologia_asociada"
                                                    autoResize rows="3" cols="30" />
                                                <label for="patologiaAsociada">Patologias Asociadas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.enfermedades_congenitas"
                                                    autoResize rows="3" cols="30" />
                                                <label for="enfermedadesCongenitas">Enfermedades Congenitas</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.enfermedades_infancia"
                                                    autoResize rows="3" cols="30" />
                                                <label for="enfermedadesInfancia">Enfermedades de la Infancia</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.enfermedades_adolescencia"
                                                    autoResize rows="3" cols="30" />
                                                <label for="enfermedadesAdolescencia">Enfermedades de la
                                                    Adolescencia</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.enfermedades_adulto"
                                                    autoResize rows="3" cols="30" />
                                                <label for="enfermedadesAdulto">Enfermedades de Adulto</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesPatologicos.transfusiones" autoResize
                                                    rows="3" cols="30" />
                                                <label for="transfusiones">Transfusiones</label>
                                            </FloatLabel>
                                        </div>
                                    </div>

                                </div>

                                <div class="col-12 md:col-6">
                                    <h5>Antecedentes no patológicos y familiares</h5>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesNoPatologicos.antecedentes_nacimiento"
                                                    autoResize rows="3" cols="30" />
                                                <label for="antecedentesNacimiento">Antecedentes de Nacimiento</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesNoPatologicos.habitos" autoResize
                                                    rows="3" cols="30" />
                                                <label for="habitos">Habitos</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-12">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesNoPatologicos.factores_de_riesgo"
                                                    autoResize rows="3" cols="30" />
                                                <label for="factoresRiesgo">Factores de Riesgo</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesFamiliares.padre" autoResize rows="3"
                                                    cols="30" />
                                                <label for="padre">Padre</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesFamiliares.madre" autoResize rows="3"
                                                    cols="30" />
                                                <label for="madre">Madre</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesFamiliares.hermanos" autoResize rows="3"
                                                    cols="30" />
                                                <label for="hermanos">Hermanos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesFamiliares.conyugue" autoResize rows="3"
                                                    cols="30" />
                                                <label for="conyugue">Conyugue</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="antecedentesFamiliares.hijos" autoResize rows="3"
                                                    cols="30" />
                                                <label for="hijos">Hijos</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-5">
                                    <h5>Anamnesis por sistemas</h5>
                                </div>
                                <div class="col md:col-4">
                                    <h5>Retroalimentación por sistemas</h5>
                                </div>
                                <div class="col md:col-3">
                                    <h5>Puntaje asignado</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12">
                                    <div class="grid p-fluid pt-2">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.cardiovascular" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaCardiovascular">Sistema Cardiovascular</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_cardiovascular" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_Cardiovascular">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_cardiovascular"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_cardiovascular">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.endocrino" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaEndocrino">Sistema Endocrino</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_endocrino" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feed_endocrino">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_endocrino"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_endocrino">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.gastrointestinal" autoResize
                                                    rows="3" cols="30" />
                                                <label for="sistemaGastrointestinal">Sistema Gastrointestinal</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_gastrointestinal" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_gastrointestinal">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_gastrointestinal"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_gastrointestinal">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.genitourinario" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaGenitourinario">Sistema Genitourinario</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_genitourinario" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_genitourinario">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_genitourinario"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_genitourinario">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.respiratorio" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaRespiratorio">Sistema Respiratorio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_respiratorio" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_respiratorio">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_respiratorio"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_repiratorio">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.neurologico" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaNeurologico">Sistema Neurologico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_neurologico" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_neurologico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_neurologico"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_neurologico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.locomotor" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaLocomotor">Sistema Locomotor</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_locomotor" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feed_locomotor">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_locomotor"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_locomotor">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.hematico" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaHematico">Sistema Hematico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_hematico" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feed_Hematico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_hematico"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_hematico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.psiquiatrico" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaPsiquiatrico">Sistema Psiquiatrico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_psiquiatrico" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_Psiquiatrico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_psiquiatrico"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_psiquiatrico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.tegumentario" autoResize rows="3"
                                                    cols="30" />
                                                <label for="sistemaTegumentario">Sistema Tegumentario</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="anamnesisSistemas.feed_tegumentario" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_tegumentario">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="anamnesisSistemas.puntaje_tegumentario"
                                                    :options="scoreAnamnesis" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_tegumentario">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" severity="success" icon="pi pi-save"
                                    @click="guardarTodosLosCambiosPaciente" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>

                    <StepperPanel header="Examen">
                        <template #content="{ prevCallback, nextCallback }">
                            <h5>Información del examen físico general</h5>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-2">
                                        <div class="col md:col-12">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisico.descripcion" autoResize rows="5"
                                                    cols="30" />
                                                <label for="descripcionExamenFisico">Descripción</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenPA" v-model="examenFisico.pa" />
                                                <label for="examenPA">PA [mmhg.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenTemperatura" v-model="examenFisico.temperatura"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenTemperatura">Temperatura [°C.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-2">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenTalla" v-model="examenFisico.talla"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenTalla">Talla [m.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenPeso" v-model="examenFisico.peso"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenPeso">Peso [kg.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenSaturacion" v-model="examenFisico.saturacion"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenSaturacion">Saturacion [%.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenFC" v-model="examenFisico.fc"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenFC">FC [pm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputNumber id="examenFR" v-model="examenFisico.fr"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenFR">FR [rpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">

                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid">
                                        <div class="col md:col-6 pt-1">
                                            <h5>Retroalimentación</h5>
                                        </div>
                                        <div class="col md:col-6 pt-1">
                                            <h5>Puntaje asignado</h5>
                                        </div>
                                        <div class="col md:col-6 pt-1">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisico.feed_examen_fisico" autoResize rows="3"
                                                    cols="30" />
                                                <label
                                                    for="examenFisicoGeneralRetroalimentacion">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-1">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisico.puntaje_examen_fisico"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-5">
                                    <h5>Examen físico segmentario</h5>
                                </div>
                                <div class="col md:col-4">
                                    <h5>Retroalimentación </h5>
                                </div>
                                <div class="col md:col-3">
                                    <h5>Puntaje asignado</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.cabeza" autoResize rows="4"
                                                    cols="30" />
                                                <label for="examenSegmentarioCabeza">Cabeza</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_cabeza" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioCabeza">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_cabeza"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_cabeza ? 'Eliminar Imagen' : mostrarFileUpload.cabeza ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_cabeza ? 'pi pi-trash' : mostrarFileUpload.cabeza ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_cabeza ? 'danger' : mostrarFileUpload.cabeza ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('cabeza')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.cabeza || examenFisicoSegmentario.img_cabeza"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'cabeza')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_cabeza">
                                                        <img :src="examenFisicoSegmentario.img_cabeza"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.cuello" autoResize rows="4"
                                                    cols="30" />
                                                <label for="examenSegmentarioCuello">Cuello</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_cuello" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioCuello">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_cuello"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_cuello ? 'Eliminar Imagen' : mostrarFileUpload.cuello ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_cuello ? 'pi pi-trash' : mostrarFileUpload.cuello ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_cuello ? 'danger' : mostrarFileUpload.cuello ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('cuello')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.cuello || examenFisicoSegmentario.img_cuello"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'cuello')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_cuello">
                                                        <img :src="examenFisicoSegmentario.img_cuello"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.torax" autoResize rows="4"
                                                    cols="30" />
                                                <label for="examenSegmentarioTorax">Torax</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_torax" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioTorax">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_torax"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_torax ? 'Eliminar Imagen' : mostrarFileUpload.torax ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_torax ? 'pi pi-trash' : mostrarFileUpload.torax ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_torax ? 'danger' : mostrarFileUpload.torax ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('torax')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.torax || examenFisicoSegmentario.img_torax"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'torax')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_torax">
                                                        <img :src="examenFisicoSegmentario.img_torax"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.corazon" autoResize rows="4"
                                                    cols="30" />
                                                <label for="examenSegmentarioCorazon">Corazón</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_corazon" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioCorazon">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_corazon"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_corazon ? 'Eliminar Imagen' : mostrarFileUpload.corazon ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_corazon ? 'pi pi-trash' : mostrarFileUpload.corazon ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_corazon ? 'danger' : mostrarFileUpload.corazon ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('corazon')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.corazon || examenFisicoSegmentario.img_corazon"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'corazon')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_corazon">
                                                        <img :src="examenFisicoSegmentario.img_corazon"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.mamas" autoResize rows="4"
                                                    cols="30" />
                                                <label for="examenSegmentarioMamas">Mamas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_mamas" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioMamas">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_mamas"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_mamas ? 'Eliminar Imagen' : mostrarFileUpload.mamas ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_mamas ? 'pi pi-trash' : mostrarFileUpload.mamas ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_mamas ? 'danger' : mostrarFileUpload.mamas ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('mamas')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.mamas || examenFisicoSegmentario.img_mamas"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'mamas')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_mamas">
                                                        <img :src="examenFisicoSegmentario.img_mamas"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.abdomen" autoResize rows="4"
                                                    cols="30" />
                                                <label for="examenSegmentarioAbdomen">Abdomen</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_abdomen" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioAbdomen">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_abdomen"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_abdomen ? 'Eliminar Imagen' : mostrarFileUpload.abdomen ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_abdomen ? 'pi pi-trash' : mostrarFileUpload.abdomen ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_abdomen ? 'danger' : mostrarFileUpload.abdomen ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('abdomen')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.abdomen || examenFisicoSegmentario.img_abdomen"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'abdomen')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_abdomen">
                                                        <img :src="examenFisicoSegmentario.img_abdomen"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.genitourinario" autoResize
                                                    rows="4" cols="30" />
                                                <label for="examenSegmentarioGenitourinario">Genitourinario</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_genitourinario"
                                                    autoResize rows="4" cols="30" />
                                                <label for="feedSegmentarioGenitoUrinario">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_genitourinario"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_genitourinario ? 'Eliminar Imagen' : mostrarFileUpload.genitourinario ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_genitourinario ? 'pi pi-trash' : mostrarFileUpload.genitourinario ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_genitourinario ? 'danger' : mostrarFileUpload.genitourinario ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('genitourinario')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.genitourinario || examenFisicoSegmentario.img_genitourinario"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'genitourinario')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_genitourinario">
                                                        <img :src="examenFisicoSegmentario.img_genitourinario"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.extremidades" autoResize
                                                    rows="4" cols="30" />
                                                <label for="examenSegmentarioExtremidades">Extremidades</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_extremidades" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioExtremidades">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_extremidades"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_extremidades ? 'Eliminar Imagen' : mostrarFileUpload.extremidades ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_extremidades ? 'pi pi-trash' : mostrarFileUpload.extremidades ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_extremidades ? 'danger' : mostrarFileUpload.extremidades ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('extremidades')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.extremidades || examenFisicoSegmentario.img_extremidades"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'extremidades')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_extremidades">
                                                        <img :src="examenFisicoSegmentario.img_extremidades"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.neurologico" autoResize
                                                    rows="4" cols="30" />
                                                <label for="examenSegmentarioNeurologico">Neurológico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_neurologico" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioNeurologico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_neurologico"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_neurologico ? 'Eliminar Imagen' : mostrarFileUpload.neurologico ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_neurologico ? 'pi pi-trash' : mostrarFileUpload.neurologico ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_neurologico ? 'danger' : mostrarFileUpload.neurologico ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('neurologico')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.neurologico || examenFisicoSegmentario.img_neurologico"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'neurologico')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_neurologico">
                                                        <img :src="examenFisicoSegmentario.img_neurologico"
                                                            class="img-preview" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.piel" autoResize rows="4"
                                                    cols="30" />
                                                <label for="examenSegmentarioPiel">Piel</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_piel" autoResize
                                                    rows="4" cols="30" />
                                                <label for="feedSegmentarioPiel">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenFisicoSegmentario.puntaje_piel"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                            <div class="pt-3">
                                                <Button
                                                    :label="examenFisicoSegmentario.img_piel ? 'Eliminar Imagen' : mostrarFileUpload.piel ? 'Cancelar' : 'Añadir Imagen'"
                                                    :icon="examenFisicoSegmentario.img_piel ? 'pi pi-trash' : mostrarFileUpload.piel ? 'pi pi-times' : 'pi pi-plus'"
                                                    :severity="examenFisicoSegmentario.img_piel ? 'danger' : mostrarFileUpload.piel ? 'warning' : 'info'"
                                                    text raised @click="toggleFileUpload('piel')" />
                                            </div>
                                        </div>
                                        <div v-if="mostrarFileUpload.piel || examenFisicoSegmentario.img_piel"
                                            class="col md:col-12">
                                            <FileUpload name="imagen" accept="image/*" :maxFileSize="1000000"
                                                :customUpload="true" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false" :auto="true"
                                                @select="onFileSelect($event, 'piel')">
                                                <template #content>
                                                    <div v-if="examenFisicoSegmentario.img_piel">
                                                        <img :src="examenFisicoSegmentario.img_piel" class="img-preview"
                                                            width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid p-fluid">
                                <div class="col-12">
                                    <h5>Examen Obstetrico</h5>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoSituacion"
                                                    v-model="examenObstetrico.situacion" />
                                                <label for="examenObstetricoSituacion">Situación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoAFU" v-model="examenObstetrico.afu"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenObstetricoAFU">AFU [cm.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoMonitorizacion"
                                                    v-model="examenObstetrico.monitorizacion" />
                                                <label for="examenObstetricoMonitorizacion">Monitorización</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoPelvis"
                                                    v-model="examenObstetrico.pelvis" />
                                                <label for="examenObstetricoPelvis">Pelvis</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoPresentacion"
                                                    v-model="examenObstetrico.presentacion" />
                                                <label for="examenObstetricoPresentacion">Presentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoFCF" v-model="examenObstetrico.fcf"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenObstetricoFCF">FCF [pm.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoDilatacion"
                                                    v-model="examenObstetrico.dilatacion" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="examenObstetricoDilatacion">Dilatación [cm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoPlano"
                                                    v-model="examenObstetrico.plano" />
                                                <label for="examenObstetricoPlano">Plano</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoVP" v-model="examenObstetrico.vp" />
                                                <label for="examenObstetricoVP">VP</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoDorso"
                                                    v-model="examenObstetrico.dorso" />
                                                <label for="examenObstetricoDorso">Dorso</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoPAF" v-model="examenObstetrico.paf"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenObstetricoPAF">PAF [gr.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoBorramiento"
                                                    v-model="examenObstetrico.borramiento" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="examenObstetricoBorramiento">Borramiento [%.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoMembranas"
                                                    v-model="examenObstetrico.membranas" />
                                                <label for="examenObstetricoMembranas">Membranas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoAU" v-model="examenObstetrico.au" />
                                                <label for="examenObstetricoAU">AU</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="examenObstetrico.feed_examen_obstetrico" autoResize
                                                    rows="2" cols="30" />
                                                <label for="feedExamenObstetrico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Dropdown v-model="examenObstetrico.puntaje_examen_obstetrico"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div class="grid">
                                <div class="col md:col-5">
                                    <h5>Examen físico complemetario</h5>
                                </div>
                                <div class="col md:col-4">
                                    <h5>Retroalimentación </h5>
                                </div>
                                <div class="col md:col-3">
                                    <h5>Puntaje asignado</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenViaAerea.descripcion" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenViaAerea">Examen de Via Aerea</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenViaAerea.feed_examen_via_aerea" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feedViaAerea">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenViaAerea.puntaje_examen_via_aerea"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenRespiratorio.descripcion" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenRespiratorio">Examen Respiratorio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenRespiratorio.feed_examen_respiratorio"
                                                    autoResize rows="3" cols="30" />
                                                <label for="feedRespiratorio">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenRespiratorio.puntaje_examen_respiratorio"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenCirculatorio.descripcion" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenCirculatorio">Examen Circulatorio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenCirculatorio.feed_examen_circulatorio"
                                                    autoResize rows="3" cols="30" />
                                                <label for="feedCirculatorio">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenCirculatorio.puntaje_examen_circulatorio"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenPsicologico.descripcion" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenPsicologico">Examen Psicológico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenPsicologico.feed_examen_psicologico" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feedPsicologico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenPsicologico.puntaje_examen_psicologico"
                                                    :options="scoreExamenFisico" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex py-4 gap-2">
                                <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" @click="guardarTodosLosCambiosExamen" severity="success"
                                    icon="pi pi-save" />

                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>



                    <StepperPanel header="Estabilizar">
                        <template #content="{ prevCallback, nextCallback }">
                            <div class="grid p-fluid">
                                <div class="col-12">
                                    <h5>Signos Vitales Iniciales</h5>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="signosFrecuenciaCardiaca"
                                                    v-model="signosVitales.frecuencia_cardiaca" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="signosFrecuenciaCardiaca">Frecuencia Cardiaca [pm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="signosSaturacion" v-model="signosVitales.saturacion"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="signosSaturacion">Saturación [%.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid ">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="signosPresionSistole"
                                                    v-model="signosVitales.presion_sanguinea_sistole"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="signosPresionSistole">Presión Sistole [mmhg.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="signosPresionDiastole"
                                                    v-model="signosVitales.presion_sanguinea_distole"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="signosPresionDiastole">Presión Diastole [mmhg.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-2">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="signosTemperatura" v-model="signosVitales.temperatura"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="signosTemperatura">Temperatura [°C.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="col-12 md:col-6">
                                <div class="grid p-fluid">
                                    <div class="col md:col-6 pt-1">
                                        <h5>Retroalimentación</h5>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <h5>Puntaje asignado</h5>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Textarea v-model="signosVitales.feed_signos_vitales" autoResize rows="3"
                                                cols="30" />
                                            <label for="feedSignosVitales">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="signosVitales.puntaje_signos_vitales"
                                                :options="scoreSignosVitales" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeEstabilizar">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>
                            <div class="flex py-4 gap-2">
                                <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" @click="guardarTodosLosCambiosSignosVitales" severity="success"
                                    icon="pi pi-save" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>


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
                                <Button label="Guardar" @click="guardarDiagnosticosDiferenciales" severity="success"
                                    icon="pi pi-save" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>

                    <StepperPanel header="Investigar">
                        <template #content="{ prevCallback, nextCallback }">
                            <div class="justify-content-center">
                                <h5>Selecciona los análisis para el caso</h5>

                                <div v-for="categoria in categoriasAnalisis" :key="categoria.id_categoria_analisis"
                                    class="pt-4">
                                    <div class="grid">
                                        <Divider align="center" type="solid">
                                            <h5>{{ categoria.nombre_categoria }}</h5>
                                        </Divider>
                                    </div>
                                    <div class="card flex justify-content-center">
                                        <SelectButton
                                            v-model="selectedSubcategoriasPorCategoria[categoria.id_categoria_analisis]"
                                            :options="subcategoriasPorCategoria[categoria.id_categoria_analisis]"
                                            optionLabel="name" optionValue="value" multiple
                                            aria-labelledby="multiple" />
                                    </div>


                                    <div
                                        v-if="selectedSubcategoriasPorCategoria[categoria.id_categoria_analisis].length > 0">
                                        <div class="grid pt-3">
                                            <div class="col md:col-6">
                                                <FloatLabel>
                                                    <Textarea
                                                        v-model="analisisDetails[categoria.id_categoria_analisis].feed_analisis"
                                                        autoResize rows="3" cols="30" />
                                                    <label for="feed_analisis">Retroalimentación</label>
                                                </FloatLabel>
                                            </div>
                                            <div class="col md:col-3">
                                                <FloatLabel>
                                                    <Dropdown
                                                        v-model="analisisDetails[categoria.id_categoria_analisis].puntaje_analisis"
                                                        :options="scoreAnalisis" optionLabel="name" optionValue="value"
                                                        placeholder="Elige una opción" checkmark
                                                        :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                    <label for="puntaje_analisis">Puntaje Asignado</label>
                                                </FloatLabel>
                                            </div>
                                            <div class="col md:col-3"></div>
                                        </div>

                                        <!-- Mostrar campos para cada subcategoría seleccionada -->
                                        <div v-for="subcatId in selectedSubcategoriasPorCategoria[categoria.id_categoria_analisis]"
                                            :key="subcatId" class="grid pt-3">
                                            <div class="col md:col-4">
                                                <h6>{{
                                                    analisisDetails[categoria.id_categoria_analisis].detalles[subcatId].nombre_subcategoria
                                                }}</h6>
                                            </div>
                                            <div class="col md:col-4">
                                                <FloatLabel>
                                                    <InputText
                                                        v-model="analisisDetails[categoria.id_categoria_analisis].detalles[subcatId].resultado" />
                                                    <label for="resultado">Resultado</label>
                                                </FloatLabel>
                                            </div>
                                            <div class="col md:col-4"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div class="justify-content-center pt-3">
                                <h5>Selecciona las imagenologías para el caso</h5>
                                <div v-for="category in categoriasImagenologia"
                                    :key="category.id_categoria_imagenologia" class="mt-4">
                                    <Divider align="center" type="solid">
                                        <h5>{{ category.nombre }}</h5>
                                    </Divider>
                                    <div class="card text-center">
                                        <SelectButton
                                            v-model="selectedImagenologiasByCategory[category.id_categoria_imagenologia]"
                                            :options="category.imagenologias" optionLabel="nombre"
                                            optionValue="id_imagenologia" multiple
                                            @change="onImagenologiaSelectionChange(category.id_categoria_imagenologia)" />
                                    </div>
                                </div>

                                <Divider />
                                <div v-for="(imgData, index) in imagenesData" :key="imgData.id_imagenologia"
                                    class="mt-4">
                                    <h5>{{ imgData.categoria_nombre }} - {{ imgData.nombre }}</h5>
                                    <div class="grid p-fluid">
                                        <div class="col md:col-5">
                                            <FileUpload name="imagen" accept="image/*" :auto="true" :customUpload="true"
                                                :maxFileSize="1000000" chooseLabel="Elegir Imagen"
                                                :showCancelButton="false" :showUploadButton="false"
                                                @select="(event) => onUpload(event, index)">
                                                <template #content>
                                                    <div v-if="imgData.path">
                                                        <img :src="imgData.path" alt="Imagen" width="200" />
                                                    </div>
                                                    <div v-else>
                                                        <p>Elige y arrastra una imagen.</p>
                                                    </div>
                                                </template>
                                            </FileUpload>
                                        </div>
                                        <div class="col md:col-4">
                                            <div class="grid">
                                                <div class="col md:col-12">
                                                    <FloatLabel>
                                                        <Textarea v-model="imgData.interpretacion" autoResize rows="3"
                                                            cols="30" />
                                                        <label for="interpretacion">Interpretación</label>
                                                    </FloatLabel>
                                                </div>
                                                <div class="col md:col-12 pt-3">
                                                    <FloatLabel>
                                                        <Textarea v-model="imgData.feed_estudios_imagenologia"
                                                            autoResize rows="3" cols="30" />
                                                        <label
                                                            for="feed_estudios_imagenologia">Retroalimentación</label>
                                                    </FloatLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="imgData.puntaje_estudios_imagenologia"
                                                    :options="scoreImagenologia" optionLabel="name" optionValue="value"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
                                                <label for="puntaje_estudios_imagenologia">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" @click="guardarTodosLosCambiosLaboratorio" severity="success"
                                    icon="pi pi-save" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>


                    <StepperPanel header="Intervenir">
                        <template #content="{ prevCallback, nextCallback }">
                            <h5>Selecciona los medicamentos para el caso</h5>

                            <!-- Iterar sobre categorías de medicamentos -->
                            <div v-for="categoria in categoriasMedicamentos" :key="categoria.id_categoria_medicamento"
                                class="pt-4">
                                <div class="grid">
                                    <Divider align="center" type="solid">
                                        <h5>{{ categoria.categoria }}</h5>
                                    </Divider>
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
                            <Divider />
                            <div class="justify-content-center pt-3">
                                <h5>Selecciona los procedimientos para el caso</h5>

                                <div v-for="categoria in categoriasProcedimientos"
                                    :key="categoria.id_categoria_procedimiento" class="pt-4">
                                    <div class="grid">
                                        <Divider align="center" type="solid">
                                            <h5>{{ categoria.nombre }}</h5>
                                        </Divider>
                                    </div>
                                    <div class="card flex justify-content-center">
                                        <SelectButton
                                            v-model="selectedProcedimientosPorCategoria[categoria.id_categoria_procedimiento]"
                                            :options="procedimientosPorCategoria[categoria.id_categoria_procedimiento]"
                                            optionLabel="name" optionValue="value" multiple
                                            aria-labelledby="multiple" />
                                    </div>

                                    <div v-for="(procedimientoId, index) in selectedProcedimientosPorCategoria[categoria.id_categoria_procedimiento]"
                                        :key="procedimientoId" class="grid pt-3">
                                        <div class="col md:col-4">
                                            <h6>Procedimiento {{ index + 1 }}: {{
                                                procedimientoDetails[procedimientoId]?.nombre }}
                                            </h6>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="procedimientoDetails[procedimientoId].feedback"
                                                    autoResize rows="3" cols="30" />
                                                <label for="feedback">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="procedimientoDetails[procedimientoId].score"
                                                    :options="scoreProcedimientos" optionLabel="name"
                                                    optionValue="value" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="score">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-1"></div>
                                    </div>
                                </div>
                            </div>


                            <div class="flex py-4 gap-2">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" @click="guardarSeccionIntervenir" severity="success"
                                    icon="pi pi-save" />
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
                                    optionLabel="nombre" optionValue="id_subespecialidad" multiple
                                    aria-labelledby="multiple" />
                            </div>

                            <div v-for="(subData) in subsData" :key="subData.id_subespecialidad" class="pt-3">
                                <div class="grid p-fluid">
                                    <div class="col md:col-3">
                                        <h6>{{ subData.nombre }}</h6>
                                    </div>
                                    <div class="col md:col-3">
                                        <FloatLabel>
                                            <Textarea v-model="subData.descripcion" autoResize rows="3" cols="23" />
                                            <label for="descripcionSubespecialidad">Descripción</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-3">
                                        <FloatLabel>
                                            <Textarea v-model="subData.feedback" autoResize rows="3" cols="23" />
                                            <label for="feedSubespecialidad">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-3">
                                        <FloatLabel>
                                            <Dropdown v-model="subData.score" :options="scoreSubespecialidad"
                                                optionLabel="name" optionValue="value" placeholder="Elige una opción"
                                                checkmark :highlightOnSelect="false" class="w-full md:w-10rem" />
                                            <label for="puntajeSubespecialidad">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" @click="guardarSubespecialidades" severity="success"
                                    icon="pi pi-save" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>


                    <StepperPanel header="Traspaso">
                        <template #content="{ prevCallback }">

                            <h5>{{ traspaso.opcion_uno }}</h5>
                            <div class="grid pt-3">
                                <div class="col md:col-4">
                                    <h5>Ingresar al paciente a una unidad de cuidados intensivos</h5>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="traspaso.feed_opcion_uno" autoResize rows="3" cols="30" />
                                        <label for="feedTraspasoUCI">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="traspaso.puntaje_opcion_uno" :options="scoreTraspaso"
                                            optionLabel="name" optionValue="value" placeholder="Elige una opción"
                                            checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeTraspasoUCI">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1">
                                    <h5></h5>
                                </div>

                                <div class="col md:col-4 pt-3">
                                    <h5>{{ traspaso.opcion_dos }}</h5>
                                </div>
                                <div class="col md:col-4 pt-3">
                                    <FloatLabel>
                                        <Textarea v-model="traspaso.feed_opcion_dos" autoResize rows="3" cols="30" />
                                        <label for="feedTraspasoInternar">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <Dropdown v-model="traspaso.puntaje_opcion_dos" :options="scoreTraspaso"
                                            optionLabel="name" optionValue="value" placeholder="Elige una opción"
                                            checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeTraspasoInternar">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1 pt-3">
                                    <h5></h5>
                                </div>

                                <div class="col md:col-4">
                                    <h5>{{ traspaso.opcion_tres }}</h5>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="traspaso.feed_opcion_tres" autoResize rows="3" cols="30" />
                                        <label for="feedTraspasoCirugia">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="traspaso.puntaje_opcion_tres" :options="scoreTraspaso"
                                            optionLabel="name" optionValue="value" placeholder="Elige una opción"
                                            checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeTraspasoCirugia">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1">
                                    <h5></h5>
                                </div>

                                <div class="col md:col-4">
                                    <h5>{{ traspaso.opcion_cuatro }}</h5>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="traspaso.feed_opcion_cuatro" autoResize rows="3" cols="30" />
                                        <label for="feedTraspasoCirugia">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="traspaso.puntaje_opcion_cuatro" :options="scoreTraspaso"
                                            optionLabel="name" optionValue="value" placeholder="Elige una opción"
                                            checkmark :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeTraspasoCirugia">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1">
                                    <h5></h5>
                                </div>
                            </div>

                            <h5>¿Cual es el diagnostico final?</h5>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="diagnosticoFinal" :options="diagnosticosDiferenciales"
                                    optionLabel="label" optionValue="value" aria-labelledby="basic" />
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" severity="success" icon="pi pi-save"
                                    @click="guardarTodosLosCambiosTraspaso" />
                                <Button label="Crear" severity="primary" icon="pi pi-check" @click="prevCallback" />
                            </div>
                        </template>
                    </StepperPanel>
                </Stepper>

                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cerrar" severity="secondary" @click=cerrarDialogo></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
