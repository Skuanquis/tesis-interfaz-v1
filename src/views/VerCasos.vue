<script setup>
import { ref, onMounted, watchEffect, computed, watch } from 'vue';
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
    obtenerExamenCirculatorio, obtenerExamenPiel,
    obtenerExamenPsicologico, actualizarExamenViaAerea,
    actualizarExamenRespiratorio, actualizarExamenCirculatorio,
    actualizarExamenPiel, actualizarExamenPsicologico,
    obtenerSignosVitales, actualizarSignosVitales,
    obtenerCategoriasDiferenciales, obtenerDiagnosticosPorCategoria,
    obtenerDiagnosticosDiferencialesPorHistoriaClinica, actualizarDiagnosticosDiferenciales,
    obtenerCategoriasMedicamentos, obtenerMedicamentosPorCategoria,
    obtenerMedicamentosSuministradosPorHistoriaClinica, actualizarMedicamentosSuministrados,
    obtenerSubespecialidades, obtenerSubespecialidadesPorHistoriaClinica,
    actualizarSubespecialidades,
    obtenerExamenFisicoOrina, actualizarExamenFisicoOrina,
    obtenerSedimentoUrinario, actualizarSedimentoUrinario,
    obtenerExamenQuimicoUrinario, actualizarExamenQuimicoUrinario,
    obtenerExamenEspecialOrina, actualizarExamenEspecialOrina,
    obtenerExamenHematologico, actualizarExamenHematologico,
    obtenerIndicesEritrocitarios, actualizarIndicesEritrocitarios,
    obtenerRecuentoDiferencialHematico, actualizarRecuentoDiferencialHematico,
    obtenerHemostasiaSanguinea, actualizarHemostasiaSanguinea,
    obtenerSerologiaSanguinea, actualizarSerologiaSanguinea,
    obtenerElectrolitosSanguineos, actualizarElectrolitosSanguineos,
    obtenerQuimicaSanguinea, actualizarQuimicaSanguinea,
    obtenerBiometriaHematica, actualizarBiometriaHematica,
    obtenerCategoriasImagenologia, obtenerImagenesPorHistoriaClinica,
    actualizarImagenes, cargarImagen,
    obtenerTraspaso, actualizarTraspaso,
    actualizarDiagnosticoFinal


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
const examenDePiel = ref({})
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

const subespecialidadesDisponibles = ref([]);
const subespecialidades = ref([]);
const subsData = ref([]);
const scoreSubespecialidad = ref([]);
const isInitializing = ref(false);

const labOrina = ref({});
const labSed = ref({});
const labQuimico = ref({});
const labEspecial = ref({});
const labHematologico = ref({});
const labBiometriaHematica = ref({});
const labIndice = ref({});
const labRecuento = ref({});
const labHemostasea = ref({});
const labSerologia = ref({});
const labElectrolitos = ref({});
const labQuimicoSanguineo = ref({});
const scoreLaboratorioOrina = ref([]);

const scoreImagenologia = ref([]);
const categoriasImagenologia = ref([]);
const categoriasSeleccionadas = ref([]);
const imagenesData = ref([]);

const scoreTraspaso = ref([]);
const traspaso = ref({});

const diagnosticosDiferenciales = ref([]);
const diagnosticoFinal = ref(null);


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
        await cargarExamenPiel(casoSeleccionado.value.id_historia_clinica);
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
        await cargarExamenFisicoOrina(casoSeleccionado.value.id_historia_clinica);
        await cargarSedimentoUrinario(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenQuimicoUrinario(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenEspecialOrina(casoSeleccionado.value.id_historia_clinica);
        await cargarExamenHematologico(casoSeleccionado.value.id_historia_clinica);
        await cargarIndicesEritrocitarios(casoSeleccionado.value.id_historia_clinica);
        await cargarRecuentoDiferencialHematico(casoSeleccionado.value.id_historia_clinica);
        await cargarHemostasiaSanguinea(casoSeleccionado.value.id_historia_clinica);
        await cargarSerologiaSanguinea(casoSeleccionado.value.id_historia_clinica);
        await cargarElectrolitosSanguineos(casoSeleccionado.value.id_historia_clinica);
        await cargarQuimicaSanguinea(casoSeleccionado.value.id_historia_clinica);
        await cargarBiometriaHematica(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeInvestigar(casoSeleccionado.value.id_historia_clinica)
        await cargarPuntajeImagenologia(casoSeleccionado.value.id_historia_clinica);
        await cargarCategoriasImagenologia();
        await cargarImagenes(casoSeleccionado.value.id_historia_clinica);
        await cargarTraspaso(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeTraspaso(casoSeleccionado.value.id_historia_clinica);
        await cargarDiagnosticoFinal(casoSeleccionado.value.id_historia_clinica);
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
const cargarExamenPiel = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenPiel(id_historia_clinica);
        examenDePiel.value = response.data[0];
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
        await actualizarAnamnesisSistemas(paciente.value.id_historia_clinica, anamnesisSistemas.value);
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
        await actualizarExamenPiel(paciente.value.id_historia_clinica, examenDePiel.value);
        await actualizarExamenPsicologico(paciente.value.id_historia_clinica, examenPsicologico.value);

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

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Diagnósticos diferenciales guardados correctamente', life: 3000 });
        visible.value = false;
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

const guardarMedicamentosSuministrados = async () => {
    try {
        const data = allSelectedMedicamentos.value.map(medicamentoId => ({
            id_medicamento: medicamentoId,
            feed_medicamento_diferencial: medicamentoDetails.value[medicamentoId].feedback,
            puntaje_medicamento_diferencial: medicamentoDetails.value[medicamentoId].score,
        }));

        await actualizarMedicamentosSuministrados(casoSeleccionado.value.id_historia_clinica, data);

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
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener subespecialidades',
            life: 3000
        });
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
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al obtener subespecialidades seleccionadas',
            life: 3000
        });
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
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Subespecialidades guardadas correctamente',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar las subespecialidades',
            life: 3000
        });
    }
};

const cargarExamenFisicoOrina = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenFisicoOrina(id_historia_clinica);
        labOrina.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};

const cargarSedimentoUrinario = async (id_historia_clinica) => {
    try {
        const response = await obtenerSedimentoUrinario(id_historia_clinica);
        labSed.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarExamenQuimicoUrinario = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenQuimicoUrinario(id_historia_clinica);
        labQuimico.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarExamenEspecialOrina = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenEspecialOrina(id_historia_clinica);
        labEspecial.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarExamenHematologico = async (id_historia_clinica) => {
    try {
        const response = await obtenerExamenHematologico(id_historia_clinica);
        labHematologico.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarIndicesEritrocitarios = async (id_historia_clinica) => {
    try {
        const response = await obtenerIndicesEritrocitarios(id_historia_clinica);
        labIndice.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarRecuentoDiferencialHematico = async (id_historia_clinica) => {
    try {
        const response = await obtenerRecuentoDiferencialHematico(id_historia_clinica);
        labRecuento.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarHemostasiaSanguinea = async (id_historia_clinica) => {
    try {
        const response = await obtenerHemostasiaSanguinea(id_historia_clinica);
        labHemostasea.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarSerologiaSanguinea = async (id_historia_clinica) => {
    try {
        const response = await obtenerSerologiaSanguinea(id_historia_clinica);
        labSerologia.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarElectrolitosSanguineos = async (id_historia_clinica) => {
    try {
        const response = await obtenerElectrolitosSanguineos(id_historia_clinica);
        labElectrolitos.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarQuimicaSanguinea = async (id_historia_clinica) => {
    try {
        const response = await obtenerQuimicaSanguinea(id_historia_clinica);
        labQuimicoSanguineo.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};
const cargarBiometriaHematica = async (id_historia_clinica) => {
    try {
        const response = await obtenerBiometriaHematica(id_historia_clinica);
        labBiometriaHematica.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el examen fisico general', life: 3000 });
    }
};



const guardarTodosLosCambiosLaboratorio = async () => {
    try {

        console.log(labEspecial.value);
        await actualizarExamenFisicoOrina(paciente.value.id_historia_clinica, labOrina.value);
        await actualizarSedimentoUrinario(paciente.value.id_historia_clinica, labSed.value);
        await actualizarExamenQuimicoUrinario(paciente.value.id_historia_clinica, labQuimico.value);
        await actualizarExamenEspecialOrina(paciente.value.id_historia_clinica, labEspecial.value);
        await actualizarExamenHematologico(paciente.value.id_historia_clinica, labHematologico.value);
        await actualizarIndicesEritrocitarios(paciente.value.id_historia_clinica, labIndice.value);
        await actualizarRecuentoDiferencialHematico(paciente.value.id_historia_clinica, labRecuento.value);
        await actualizarHemostasiaSanguinea(paciente.value.id_historia_clinica, labHemostasea.value);
        await actualizarSerologiaSanguinea(paciente.value.id_historia_clinica, labSerologia.value);
        await actualizarElectrolitosSanguineos(paciente.value.id_historia_clinica, labElectrolitos.value);
        await actualizarQuimicaSanguinea(paciente.value.id_historia_clinica, labQuimicoSanguineo.value);
        await actualizarBiometriaHematica(paciente.value.id_historia_clinica, labBiometriaHematica.value);
        await actualizarImagenes(casoSeleccionado.value.id_historia_clinica, imagenesData.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Examen físico general actualizado correctamente', life: 3000 });
    } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el examen físico general', life: 3000 });
    }
};

const cargarPuntajeInvestigar = async (id_historia_clinica) => {
    try {
        const response = await obtenerPuntaje(id_historia_clinica);
        scoreLaboratorioOrina.value = response.data.map(item => ({
            name: `${item.codigo}: ${item.valor}`, value: item.codigo
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

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
        const response = await obtenerCategoriasImagenologia();
        categoriasImagenologia.value = response.data.map(cat => ({
            id_categoria_imagenologia: cat.id_categoria_imagenologia,
            nombre: cat.nombre,
        }));
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener categorías de imagenología', life: 3000 });
    }
};

const cargarImagenes = async (id_historia_clinica) => {
    try {
        const response = await obtenerImagenesPorHistoriaClinica(id_historia_clinica);
        const imagenes = response.data;
        const backendBaseUrl = '';
        imagenes.forEach(img => {
            if (img.path) {
                img.path = backendBaseUrl + img.path;
            }
        });

        imagenesData.value = imagenes;
        categoriasSeleccionadas.value = [...new Set(imagenes.map(img => img.id_categoria_imagenologia))];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener imágenes', life: 3000 });
    }
};

watch(categoriasSeleccionadas, (newVal, oldVal) => {
    const addedCategorias = newVal.filter(id => !oldVal.includes(id));
    const removedCategorias = oldVal.filter(id => !newVal.includes(id));

    addedCategorias.forEach(id_categoria => {
        const categoria = categoriasImagenologia.value.find(cat => cat.id_categoria_imagenologia === id_categoria);
        if (categoria) {
            const exists = imagenesData.value.some(img => img.id_categoria_imagenologia === id_categoria);
            if (!exists) {
                imagenesData.value.push({
                    id_imagenologia: null,
                    id_categoria_imagenologia: id_categoria,
                    categoria_nombre: categoria.nombre,
                    interpretacion: '',
                    path: '',
                    feed_imagenologia: '',
                    puntaje_imagenologia: ''
                });
            }
        }
    });

    removedCategorias.forEach(id_categoria => {
        const index = imagenesData.value.findIndex(img => img.id_categoria_imagenologia === id_categoria);
        if (index !== -1) {
            imagenesData.value.splice(index, 1);
        }
    });
});


const onUpload = async (event, index) => {
    const file = event.files[0];
    const formData = new FormData();
    formData.append('imagen', file);

    try {
        const response = await cargarImagen(formData);
        const backendBaseUrl = 'http://localhost:3000';
        imagenesData.value[index].path = backendBaseUrl + response.data.path;
        imagenesData.value[index].path = response.data.path;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Imagen cargada correctamente', life: 3000 });
    } catch (error) {
        console.log(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la imagen', life: 3000 });
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
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'El diagnóstico final se ha actualizado correctamente',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar un diagnóstico final antes de guardar',
                life: 3000
            });
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
                                                <Calendar v-model="paciente.fecha_nacimiento" dateFormat="dd/mm/yy">
                                                </Calendar>
                                                <label for="fecha_nacimiento">Fecha de nacimiento</label>
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
                                                <InputNumber id="examenFC" v-model="examenFisico.fc"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenFC">FC [pm.]</label>
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
                                                <InputNumber id="examenIMC" v-model="examenFisico.imc"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenIMC">IMC [kg/m2.]</label>
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
                                            <FloatLabel>
                                                <InputNumber id="examenPeso" v-model="examenFisico.peso"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenPeso">Peso [kg.]</label>
                                            </FloatLabel>
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
                                                <Textarea v-model="examenFisicoSegmentario.cabeza" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioCabeza">Cabeza</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_cabeza" autoResize
                                                    rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.cuello" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioCuello">Cuello</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_cuello" autoResize
                                                    rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.torax" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioTorax">Torax</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_torax" autoResize
                                                    rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.corazon" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioCorazon">Corazón</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_corazon" autoResize
                                                    rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.mamas" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioMamas">Mamas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_mamas" autoResize
                                                    rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.abdomen" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioAbdomen">Abdomen</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_abdomen" autoResize
                                                    rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.genitourinario" autoResize
                                                    rows="3" cols="30" />
                                                <label for="examenSegmentarioGenitourinario">Genitourinario</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_genitourinario"
                                                    autoResize rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.extremidades" autoResize
                                                    rows="3" cols="30" />
                                                <label for="examenSegmentarioExtremidades">Extremidades</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_extremidades" autoResize
                                                    rows="3" cols="30" />
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
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.neurologico" autoResize
                                                    rows="3" cols="30" />
                                                <label for="examenSegmentarioNeurologico">Neurológico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenFisicoSegmentario.feed_neurologico" autoResize
                                                    rows="3" cols="30" />
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
                                                <Textarea v-model="examenDePiel.descripcion" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenDePiel">Examen de Piel</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="examenDePiel.feed_examen_piel" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedDePiel">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="examenDePiel.puntaje_examen_piel"
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
                            <div class="grid">
                                <div class="col md:col-6">
                                    <h5> Laboratorio de orina</h5>
                                </div>
                                <div class="col md:col-3">
                                    <h5>Retroalimentación</h5>
                                </div>
                                <div class="col md:col-3">
                                    <h5>Puntaje</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labOrinaColor" v-model="labOrina.color" />
                                                <label for="labOrinaColor">Color</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labOrinaAspecto" v-model="labOrina.aspecto" />
                                                <label for="labOrinaAspecto">Aspecto</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labOrinaVolumen" v-model="labOrina.volumen" />
                                                <label for="labOrinaVolumen">Volumen</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="labOrina.feed_examen_fisico_orina" autoResize
                                                    rows="3" cols="30" />
                                                <label for="feed_examen_fisico_orina">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Dropdown v-model="labOrina.puntaje_examen_fisico_orina"
                                                    :options="scoreLaboratorioOrina" optionLabel="name"
                                                    optionValue="value" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeLaboratorioOrina">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio de sedimento urinario</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedHematies" v-model="labSed.hematies" />
                                                <label for="labSedHematies">Hematies [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedLeucocitos" v-model="labSed.leucocitos" />
                                                <label for="labSedLeucocitos">Leucocitos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedPiocitos" v-model="labSed.piocitos" />
                                                <label for="labSedPiocitos">Piocitos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedEpiteliales"
                                                    v-model="labSed.celulas_epiteliales" />
                                                <label for="labSedEpiteliales">Células Epiteliales [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedRenales" v-model="labSed.celulas_renales" />
                                                <label for="labSedRenales">Células Renales [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labSedCereo" v-model="labSed.cilindro_cereo" />
                                                <label for="labSedCereo">Cilindro Cereo [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedHialianos" v-model="labSed.cilindros_hialianos" />
                                                <label for="labSedHialianos">Cilindros Hialianos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedGranulosos"
                                                    v-model="labSed.cilindros_granulosos" />
                                                <label for="labSedGranulosos">Cilindors Granulosos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedLeucocitarios"
                                                    v-model="labSed.cilindros_leucocitarios" />
                                                <label for="labSedLeucocitarios">Cilindros Leucocitarios [cpm]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedEritrocitarios"
                                                    v-model="labSed.cilindros_eritrocitarios" />
                                                <label for="labSedEritrocitarios">Cilindros Eritrocitarios
                                                    [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedFlora" v-model="labSed.flora_bacteriana" />
                                                <label for="labSedFlora">Flora Bacteriana</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedCristales" v-model="labSed.cristales" />
                                                <label for="labSedCristales">Cristales</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedFilamento" v-model="labSed.filamento_mucoso" />
                                                <label for="labSedFilamento">Filamento Mucoso</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedHifas" v-model="labSed.hifas" />
                                                <label for="labSedHifas">Hifas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedLevaduras" v-model="labSed.levaduras" />
                                                <label for="labSedLevaduras">Levaduras</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedOtros" v-model="labSed.otros" />
                                                <label for="labSedOtros">Otros</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labSed.feed_examen_sedimento_urinario" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabEspecial">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labSed.puntaje_examen_sedimento_urinario"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabEspecial">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio químico urinario</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicopH" v-model="labQuimico.ph" />
                                                <label for="labQuimicopH">pH </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoDensidad" v-model="labQuimico.densidad" />
                                                <label for="labQuimicoDensidad">Densidad </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoProteinas" v-model="labQuimico.proteinas" />
                                                <label for="labQuimicoProteinas">Proteinas [mg/dl]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSangre" v-model="labQuimico.sangre" />
                                                <label for="labQuimicoSangre">Sangre </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoGlucosa" v-model="labQuimico.glucosa" />
                                                <label for="labQuimicoGlucosa">Células Glucosa </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labQuimicoCetona" v-model="labQuimico.cetonas" />
                                                <label for="labQuimicoCetona">Cilindro Cetonas </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoPigmentos"
                                                    v-model="labQuimico.pigmentos_biliares" />
                                                <label for="labQuimicoPigmentos">Pigmentos Biliares</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoNitritos" v-model="labQuimico.nitritos" />
                                                <label for="labQuimicoNitritos">Nitritos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoLeucocitos" v-model="labQuimico.leucocitos" />
                                                <label for="labQuimicoLeucocitos">Leucocitos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoBilirrubina"
                                                    v-model="labQuimico.bilirrubina" />
                                                <label for="labQuimicoBilirrubina">Bilirrubina </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoUrobilinogeno"
                                                    v-model="labQuimico.urobilinogeno" />
                                                <label for="labQuimicoUrobilinogeno">Urobilinogeno [mg/dl]</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labQuimico.feed_examen_quimico_urinario" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabQuimico">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labQuimico.puntaje_examen_quimico_urinario"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabQuimico">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>


                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio especial de orina</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labEspecialProteurinaria"
                                                    v-model="labEspecial.proteurinaria" />
                                                <label for="labEspecialProteurinaria">Proteurinaria </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labEspecialCreatinuria"
                                                    v-model="labEspecial.creatinuria" />
                                                <label for="labEspecialCreatinuria">Creatinuria </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labEspecialMicroalbuminuria"
                                                    v-model="labEspecial.microalbuminuria" />
                                                <label for="labEspecialMicroalbuminuria">Microalbuminuria </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labEspecialClearenceCreatinina"
                                                    v-model="labEspecial.clearence_creatinina" />
                                                <label for="labEspecialClearenceCreatinina">Clearence Creatinina</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labEspecial.feed_examen_especial_orina" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabSed">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labEspecial.puntaje_examen_especial_orina"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabSedimento">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio hematológico</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHematologicoGrupo"
                                                    v-model="labHematologico.grupo_sanguineo" />
                                                <label for="labHematologicoGrupo">GrupoSanguineo </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHematologicoFactor"
                                                    v-model="labHematologico.factor_rh" />
                                                <label for="labHematologicoFactor">Factor RH </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHematologicoObservaciones"
                                                    v-model="labHematologico.observaciones" />
                                                <label for="labHematologicoObservaciones">Observaciones </label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labHematologico.feed_examen_hematologico" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabBiometriaHematica">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labHematologico.puntaje_examen_hematologico"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabBiometriaHematica">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>


                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio de biometria hemática</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labBiometriaHematicaRojos"
                                                    v-model="labBiometriaHematica.globulos_rojos" />
                                                <label for="labBiometriaHematicaRojos">Globulos Rojos </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labBiometriaHematicaBlancos"
                                                    v-model="labBiometriaHematica.globulos_blancos" />
                                                <label for="labBiometriaHematicaBlancos">Globulos Blancos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labBiometriaHematicaHemoglobina"
                                                    v-model="labBiometriaHematica.hemoglobina" />
                                                <label for="labBiometriaHematicaHemoglobina">Hemoglobina </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labBiometriaHematicaHematrocito"
                                                    v-model="labBiometriaHematica.hematocrito" />
                                                <label for="labBiometriaHematicaHematrocito">Hematrocito </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labBiometriaHematicaVes"
                                                    v-model="labBiometriaHematica.ves" />
                                                <label for="labBiometriaHematicaVes">VES</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labBiometriaHematica.feed_examen_biometria_hematica"
                                                autoResize rows="3" cols="30" />
                                            <label for="feedLabHematologico">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labBiometriaHematica.puntaje_examen_biometria_hematica"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabHematologico">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio índice eritrocitario hemático</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labIndiceVcm" v-model="labIndice.vcm" />
                                                <label for="labIndiceVcm">VCM </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labIndiceHbcm" v-model="labIndice.hbcm" />
                                                <label for="labIndiceHbcm">HBCM </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labIndiceChbcm" v-model="labIndice.chbcm" />
                                                <label for="labIndiceChbcm">CHBCM </label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labIndice.feed_indices_eritrocitarios" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabIndice">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labIndice.puntaje_indices_eritrocitarios"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabIndice">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio de recuento diferencial hemático</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoCayadosRelativo"
                                                    v-model="labRecuento.cayados_relativo" />
                                                <label for="labRecuentoCayadosRelativo">Cayados Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoCayadosAbsoluto"
                                                    v-model="labRecuento.cayados_absoluto" />
                                                <label for="labRecuentoCayadosAbsoluto">Cayados Absoluto [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoLinfocitosRelativo"
                                                    v-model="labRecuento.linfocitos_relativo" />
                                                <label for="labRecuentoLinfocitosRelativo">Linfocitos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoLinfocitosAbsoluto"
                                                    v-model="labRecuento.linfocitos_absoluto" />
                                                <label for="labRecuentoLinfocitosAbsoluto">Linfocitos Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoEosinofilosRelativo"
                                                    v-model="labRecuento.eosinofilos_relativo" />
                                                <label for="labRecuentoEosinofilosRelativo">Eosinofilos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labRecuentoEosinofilosAbsoluto"
                                                    v-model="labRecuento.eosinofilos_absoluto" />
                                                <label for="labRecuentoEosinofilosAbsoluto">Eosinofilos Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoBasofilosRelativo"
                                                    v-model="labRecuento.basofilos_relativo" />
                                                <label for="labRecuentoBasofilosRelativo">Basofilos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoBasofilosAbsoluto"
                                                    v-model="labRecuento.basofilos_absoluto" />
                                                <label for="labRecuentoBasofilosAbsoluto">Basofilos Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoSegmentadosRelativo"
                                                    v-model="labRecuento.segmentados_relativo" />
                                                <label for="labRecuentoSegmentadosRelativo">Segmentados Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoSegmentadosAbsoluto"
                                                    v-model="labRecuento.segmentados_absoluto" />
                                                <label for="labRecuentoSegmentadosAbsoluto">Segmentados Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoMonocitosRelativo"
                                                    v-model="labRecuento.monocitos_relativo" />
                                                <label for="labRecuentoMonocitosRelativo">Monocitos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoMonocitosAbsoluto"
                                                    v-model="labRecuento.monocitos_absoluto" />
                                                <label for="labRecuentoMonocitosAbsoluto">Monocitos Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoPlaquetas"
                                                    v-model="labRecuento.recuento_plaquetas" />
                                                <label for="labRecuentoPlaquetas">Recuento de Plaquetas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoReticulos"
                                                    v-model="labRecuento.recuento_reticulos" />
                                                <label for="labRecuentoReticulos">Recuento Reticulos</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labRecuento.feed_recuento_diferencial_hematico"
                                                autoResize rows="3" cols="30" />
                                            <label for="feedLabRecuento">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labRecuento.puntaje_recuento_diferencial_hematico"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabRecuento">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>


                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio hemostasea sanguinea</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaCoagulacion"
                                                    v-model="labHemostasea.tiempo_coagulacion" />
                                                <label for="labHemostaseaCoagulacion">Tiempo de Coagulación </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaSangria"
                                                    v-model="labHemostasea.tiempo_sangria" />
                                                <label for="labHemostaseaSangria">Tiempo de Sangria </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaProtrombina"
                                                    v-model="labHemostasea.tiempo_protrombina" />
                                                <label for="labHemostaseaProtrombina">Tiempo de Protrombina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaInr" v-model="labHemostasea_inr" />
                                                <label for="labHemostaseaInr">INR</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaActividad"
                                                    v-model="labHemostasea.actividad_protrombinica" />
                                                <label for="labHemostaseaActividad">Actividad Protrombinica </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaDimeroD" v-model="labHemostasea.dimero_d" />
                                                <label for="labHemostaseaDimeroD">Dimero D</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaFibrinogeno"
                                                    v-model="labHemostasea.fibrinogeno" />
                                                <label for="labHemostaseaFibrinogeno">Fibrinogeno</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaControl"
                                                    v-model="labHemostasea.tiempo_control" />
                                                <label for="labHemostaseaControl">Tiempo de Control </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaTroboplastina"
                                                    v-model="labHemostasea.tiempo_tromboplastina_parcial" />
                                                <label for="labHemostaseaTroboplastina">Tiempo Troboplastina
                                                    Parcial</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labHemostasea.feed_hemostasia_sanguinea" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabHemostasea">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labHemostasea.puntaje_hemostasia_sanguinea"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabHemostasea">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio serologia sanguinea</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSerologiaProteinaC"
                                                    v-model="labSerologia.proteina_c" />
                                                <label for="labSerologiaProteinaC">Proteina C</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSerologiaFactor"
                                                    v-model="labSerologia.factor_reumatico" />
                                                <label for="labSerologiaFactor">Factor Reumatico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSerologiaRPR" v-model="labSerologia.rpr_sifilis" />
                                                <label for="labSerologiaRPR">RPR Sifilis</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSerologiaPrueba"
                                                    v-model="labSerologia.prueba_sifilis" />
                                                <label for="labSerologiaPrueba">Prueba SIfilis</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSerologiaVIH"
                                                    v-model="labSerologia.prueba_vih_sida" />
                                                <label for="labSerologiaVIH">Prueba VIH/SIDA</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSerologiaHepatitis"
                                                    v-model="labSerologia.prueba_hepatitis_b" />
                                                <label for="labSerologiaHepatitis">Prueba Hepatitis B</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labSerologia.feed_serologia_sanguinea" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabSerologia">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labSerologia.puntaje_serologia_sanguinea"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabSerologia">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio electrolitos sanguineos</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosCalcio"
                                                    v-model="labElectrolitos.calcio" />
                                                <label for="labElectrolitosCalcio">Calcio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosSodio" v-model="labElectrolitos.sodio" />
                                                <label for="labElectrolitosSodio">Sodio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosPotasio"
                                                    v-model="labElectrolitos.potasio" />
                                                <label for="labElectrolitosPotasio">Potasio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosCloro" v-model="labElectrolitos.cloro" />
                                                <label for="labElectrolitosCloro">Cloro</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosFoforo"
                                                    v-model="labElectrolitos.fosforo" />
                                                <label for="labElectrolitosFoforo">Foforo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosMagnesio"
                                                    v-model="labElectrolitos.magnesio" />
                                                <label for="labElectrolitosMagnesio">Magnesio</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labElectrolitos.feed_electrolitos_sanguineos" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabElectrolitos">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labElectrolitos.puntaje_electrolitos_sanguineos"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabElectrolitos">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="grid">
                                <div class="col md:col-12">
                                    <h5> Laboratorio químico sanguineo</h5>
                                </div>
                            </div>
                            <div class="grid p-fluid">
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoGlicemia"
                                                    v-model="labQuimicoSanguineo.glicemia" />
                                                <label for="labQuimicoSanguineoGlicemia">Glicemia</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoCreatinina"
                                                    v-model="labQuimicoSanguineo.creatinina" />
                                                <label for="labQuimicoSanguineoCreatinina">Creatinina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoNitrogeno"
                                                    v-model="labQuimicoSanguineo.nitrogeno_ureico" />
                                                <label for="labQuimicoSanguineoNitrogeno">Nitrogeno Ureico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoUrea"
                                                    v-model="labQuimicoSanguineo.urea" />
                                                <label for="labQuimicoSanguineoUrea">Urea</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoAcidoUrico"
                                                    v-model="labQuimicoSanguineo.acido_urico" />
                                                <label for="labQuimicoSanguineoAcidoUrico">Acido Urico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoBilirrubinaTotal"
                                                    v-model="labQuimicoSanguineo.bilirrubina_total" />
                                                <label for="labQuimicoSanguineoBilirrubinaTotal">Bilirrubina
                                                    Total</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoBilirrubinaDirecta"
                                                    v-model="labQuimicoSanguineo.bilirrubina_directa" />
                                                <label for="labQuimicoSanguineoBilirrubinaDirecta">Bilirrubina
                                                    Directa</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoBilirrubinaIndirecta"
                                                    v-model="labQuimicoSanguineo.bilirrubina_indirecta" />
                                                <label for="labQuimicoSanguineoBilirrubinaIndirecta">Bilirrubina
                                                    Indirecta</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoTransaminasaGPT"
                                                    v-model="labQuimicoSanguineo.transaminasa_gpt" />
                                                <label for="labQuimicoSanguineoTransaminasaGPT">Transaminasa GPT</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoTransaminasaGOT"
                                                    v-model="labQuimicoSanguineo.transaminasa_got" />
                                                <label for="labQuimicoSanguineoTransaminasaGOT">Transaminasa GOT</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoLactato"
                                                    v-model="labQuimicoSanguineo.lactato_deshidrogenasa" />
                                                <label for="labQuimicoSanguineoLactato">Lactato Deshidrogenasa</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoFosfatosa"
                                                    v-model="labQuimicoSanguineo.fosfatasa_alcalina" />
                                                <label for="labQuimicoSanguineoFosfatosa">Fosfatasa Alcalina</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoProteinas"
                                                    v-model="labQuimicoSanguineo.proteinas_totales" />
                                                <label for="labQuimicoSanguineoProteinas">Proteinas Totales</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoAlbumina"
                                                    v-model="labQuimicoSanguineo.albumina" />
                                                <label for="labQuimicoSanguineoAlbumina">Albumina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoGlobulina"
                                                    v-model="labQuimicoSanguineo.globulina" />
                                                <label for="labQuimicoSanguineoGlobulina">Globulina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoRelacion"
                                                    v-model="labQuimicoSanguineo.relacion_alb_glo" />
                                                <label for="labQuimicoSanguineoRelacion">Relación ALB-GLO</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoColesterol"
                                                    v-model="labQuimicoSanguineo.colesterol_total" />
                                                <label for="labQuimicoSanguineoColesterol">Colesterol Total</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoTrigliceridos"
                                                    v-model="labQuimicoSanguineo.trigliceridos" />
                                                <label for="labQuimicoSanguineoTrigliceridos">Trigliceridos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoHemoglobina"
                                                    v-model="labQuimicoSanguineo.hemoglobina_glicosilada" />
                                                <label for="labQuimicoSanguineoHemoglobina">Hemoglobina
                                                    Glicosilada</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoHdl"
                                                    v-model="labQuimicoSanguineo.hdl_colesterol" />
                                                <label for="labQuimicoSanguineoHdl">HDL Colesterol</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoLdl"
                                                    v-model="labQuimicoSanguineo.ldl_colesterol" />
                                                <label for="labQuimicoSanguineoLdl">LDL Colesterol</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoVldl"
                                                    v-model="labQuimicoSanguineo.vldl_colesterol" />
                                                <label for="labQuimicoSanguineoVldl">VLDL Colesterol</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoGlicemia"
                                                    v-model="labQuimicoSanguineo.glicemia_rn" />
                                                <label for="labQuimicoSanguineoGlicemia">Glicemia RN</label>
                                            </FloatLabel>
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
                                            <Textarea v-model="labQuimicoSanguineo.feed_quimica_sanguinea" autoResize
                                                rows="3" cols="30" />
                                            <label for="feedLabQuimicoSanguineo">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="labQuimicoSanguineo.puntaje_quimica_sanguinea"
                                                :options="scoreLaboratorioOrina" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabQuimicoSanguineo">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <h5>Selecciona las categorías de imagenología para el caso</h5>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="categoriasSeleccionadas" :options="categoriasImagenologia"
                                    optionLabel="nombre" optionValue="id_categoria_imagenologia" multiple
                                    aria-labelledby="multiple" />
                            </div>

                            <!-- Mostrar imágenes por categoría seleccionada -->
                            <div v-for="(imgData, index) in imagenesData" :key="imgData.id_categoria_imagenologia"
                                class="mt-4">
                                <h5>{{ imgData.categoria_nombre }}</h5>
                                <div class="grid p-fluid    x">
                                    <div class="col md:col-5">
                                        <FileUpload name="imagen" accept="image/*" :auto="true" :customUpload="true"
                                            :maxFileSize="1000000" chooseLabel="Elegir Imagen" :showCancelButton="false"
                                            :showUploadButton="false" @select="(event) => onUpload(event, index)">
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
                                                    <Textarea v-model="imgData.feed_imagenologia" autoResize rows="3"
                                                        cols="30" />
                                                    <label for="interpretacion">Retroalimentación</label>
                                                </FloatLabel>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="col md:col-3">
                                        <FloatLabel>
                                            <Dropdown v-model="imgData.puntaje_imagenologia"
                                                :options="scoreImagenologia" optionLabel="name" optionValue="value"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntaje_imagenologia">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" @click="guardarTodosLosCambiosLaboratorio" />
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
                                <Button label="Guardar" @click="guardarMedicamentosSuministrados" severity="success"
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
                                <div class="grid">
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
                                    <h5>Ingresar al paciente a una unidade de cuidados intensivos</h5>
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
                    <Button type="button" label="Cancel" severity="secondary" @click=cerrarDialogo></Button>
                    <Button type=" button" label="Guardar" @click="visible = false"></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>
