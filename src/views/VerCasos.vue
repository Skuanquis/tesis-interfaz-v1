<script setup>
import { ref, onMounted } from 'vue';
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
    obtenerPuntaje, actualizarMotivoConsulta
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
        await cargarPuntaje(casoSeleccionado.value.id_historia_clinica);

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
        //console.log(error)
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

const guardarTodosLosCambiosPaciente = async () => {
    try {

        await actualizarPaciente(paciente.value.id_paciente, paciente.value);

        await actualizarAntecedentesPatologicos(paciente.value.id_historia_clinica, antecedentesPatologicos.value);

        await actualizarAntecedentesNoPatologicos(paciente.value.id_historia_clinica, antecedentesNoPatologicos.value);

        await actualizarAntecedentesFamiliares(paciente.value.id_historia_clinica, antecedentesFamiliares.value);

        console.log(anamnesisSistemas.value)
        await actualizarAnamnesisSistemas(paciente.value.id_historia_clinica, anamnesisSistemas.value);


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
                <Stepper linear orientation="vertical">
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
                                                <Textarea v-model="descripcionExamenFisico" autoResize rows="5"
                                                    cols="30" />
                                                <label for="descripcionExamenFisico">Descripción</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-2">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenPA" v-model="examenPA" />
                                                <label for="examenPA">PA [mmhg.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenTemperatura" v-model="temperatura"
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
                                                <InputNumber id="examenTalla" v-model="examenTalla"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenTalla">Talla [m.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenFC" v-model="examenFC" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="examenFC">FC [pm.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenSaturacion" v-model="examenSaturacion"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenSaturacion">Saturacion [%.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenIMC" v-model="examenIMC" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="examenIMC">IMC [kg/m2.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputNumber id="examenFR" v-model="examenFR" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="examenFR">FR [rpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputNumber id="examenPeso" v-model="examenPeso" inputId="locale-user"
                                                    :minFractionDigits="2" />
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
                                                <Textarea v-model="examenFisicoGeneralRetroalimentacion" autoResize
                                                    rows="3" cols="30" />
                                                <label
                                                    for="examenFisicoGeneralRetroalimentacion">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-1">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                <Textarea v-model="examenSegmentarioCabeza" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioCabeza">Cabeza</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioCabeza" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioCabeza">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioCuello" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioCuello">Cuello</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioCuello" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioCuello">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioTorax" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioTorax">Torax</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioTorax" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioTorax">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioCorazon" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioCorazon">Corazón</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioCorazon" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioCorazon">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioMamas" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioMamas">Mamas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioMamas" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioMamas">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioAbdomen" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioAbdomen">Abdomen</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioAbdomen" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioAbdomen">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioGenitourinario" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioGenitourinario">Genitourinario</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioGenitoUrinario" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioGenitoUrinario">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioExtremidades" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioExtremidades">Extremidades</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioExtremidades" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioExtremidades">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenSegmentarioNeurologico" autoResize rows="3"
                                                    cols="30" />
                                                <label for="examenSegmentarioNeurologico">Neurológico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedSegmentarioNeurologico" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedSegmentarioNeurologico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                    v-model="examenObstetricoSituacion" />
                                                <label for="examenObstetricoSituacion">Situación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoAFU" v-model="examenObstetricoAFU"
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
                                                    v-model="examenObstetricoMonitorizacion" />
                                                <label for="examenObstetricoMonitorizacion">Monitorización</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoPelvis"
                                                    v-model="examenObstetricoPelvis" />
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
                                                    v-model="examenObstetricoPresentacion" />
                                                <label for="examenObstetricoPresentacion">Presentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoFCF" v-model="examenObstetricoFCF"
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
                                                    v-model="examenObstetricoDilatacion" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="examenObstetricoDilatacion">Dilatación [cm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoPlano" v-model="examenObstetricoPlano" />
                                                <label for="examenObstetricoPlano">Plano</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoVP" v-model="examenObstetricoVP" />
                                                <label for="examenObstetricoVP">VP</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoDorso" v-model="examenObstetricoDorso" />
                                                <label for="examenObstetricoDorso">Dorso</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoPAF" v-model="examenObstetricoPAF"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="examenObstetricoPAF">PAF [gr.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="examenObstetricoBorramiento"
                                                    v-model="examenObstetricoBorramiento" inputId="locale-user"
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
                                                    v-model="examenObstetricoMembranas" />
                                                <label for="examenObstetricoMembranas">Membranas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="examenObstetricoAU" v-model="examenObstetricoAU" />
                                                <label for="examenObstetricoAU">AU</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="feedExamenObstetrico" autoResize rows="2"
                                                    cols="30" />
                                                <label for="feedExamenObstetrico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                <Textarea v-model="examenViaAerea" autoResize rows="3" cols="30" />
                                                <label for="examenViaAerea">Examen de Via Aerea</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedViaAerea" autoResize rows="3" cols="30" />
                                                <label for="feedViaAerea">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenRespiratorio" autoResize rows="3" cols="30" />
                                                <label for="examenRespiratorio">Examen Respiratorio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedRespiratorio" autoResize rows="3" cols="30" />
                                                <label for="feedRespiratorio">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenCirculatorio" autoResize rows="3" cols="30" />
                                                <label for="examenCirculatorio">Examen Circulatorio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedCirculatorio" autoResize rows="3" cols="30" />
                                                <label for="feedCirculatorio">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenDePiel" autoResize rows="3" cols="30" />
                                                <label for="examenDePiel">Examen de Piel</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedDePiel" autoResize rows="3" cols="30" />
                                                <label for="feedDePiel">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-5">
                                            <FloatLabel>
                                                <Textarea v-model="examenPsicologico" autoResize rows="3" cols="30" />
                                                <label for="examenPsicologico">Examen Psicológico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-4">
                                            <FloatLabel>
                                                <Textarea v-model="feedPsicologico" autoResize rows="3" cols="30" />
                                                <label for="feedPsicologico">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-3">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeExamenFisico" :options="scoreExamenFisico"
                                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                                <label for="puntajeExamenFisico">Puntaje Asignado</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
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
                                                    v-model="signosFrecuenciaCardiaca" inputId="locale-user"
                                                    :minFractionDigits="2" />
                                                <label for="signosFrecuenciaCardiaca">Frecuencia Cardiaca [pm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="signosSaturacion" v-model="signosSaturacion"
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
                                                <InputNumber id="signosPresionSistole" v-model="signosPresionSistole"
                                                    inputId="locale-user" :minFractionDigits="2" />
                                                <label for="signosPresionSistole">Presión Sistole [mmhg.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputNumber id="signosPresionDiastole" v-model="signosPresionDiastole"
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
                                                <InputNumber id="signosTemperatura" v-model="signosTemperatura"
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
                                            <Textarea v-model="feedSignosVitales" autoResize rows="3" cols="30" />
                                            <label for="feedSignosVitales">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeEstabilizar" :options="scoreEstabilizar"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
                                            <label for="puntajeEstabilizar">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
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


                    <StepperPanel header="Diagnostico Diferecial">
                        <template #content="{ prevCallback, nextCallback }">
                            <h5>Selecciona los diagnosticos para el caso</h5>
                            <div class="grid">
                                <div class="col-12">
                                    <h5>Alergia/Inmunológico</h5>
                                </div>
                            </div>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="diagnosticos" :options="diagnosticosDiferenciales"
                                    optionLabel="name" multiple aria-labelledby="multiple" />
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <h6>Diagnostico 1</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedDiagnosticos" autoResize rows="3" cols="30" />
                                        <label for="feedDiagnosticos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeDiagnosticoDiferencial"
                                            :options="scoreDiagnosticoDiferencial" optionLabel="name"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                            class="w-full md:w-14rem" />
                                        <label for="puntajeDiagnosticoDiferencial">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Diagnostico 2</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedDiagnosticos" autoResize rows="3" cols="30" />
                                        <label for="feedDiagnosticos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeDiagnosticoDiferencial"
                                            :options="scoreDiagnosticoDiferencial" optionLabel="name"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                            class="w-full md:w-14rem" />
                                        <label for="puntajeDiagnosticoDiferencial">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Diagnostico 3</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedDiagnosticos" autoResize rows="3" cols="30" />
                                        <label for="feedDiagnosticos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeDiagnosticoDiferencial"
                                            :options="scoreDiagnosticoDiferencial" optionLabel="name"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                            class="w-full md:w-14rem" />
                                        <label for="puntajeDiagnosticoDiferencial">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                            </div>

                            <div class="grid">
                                <div class="col-12">
                                    <h5>Cardiovascular</h5>
                                </div>
                            </div>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="diagnosticos" :options="diagnosticosDiferenciales"
                                    optionLabel="name" multiple aria-labelledby="multiple" />
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <h6>Diagnostico 1</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedDiagnosticos" autoResize rows="3" cols="30" />
                                        <label for="feedDiagnosticos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeDiagnosticoDiferencial"
                                            :options="scoreDiagnosticoDiferencial" optionLabel="name"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                            class="w-full md:w-14rem" />
                                        <label for="puntajeDiagnosticoDiferencial">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Diagnostico 2</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedDiagnosticos" autoResize rows="3" cols="30" />
                                        <label for="feedDiagnosticos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeDiagnosticoDiferencial"
                                            :options="scoreDiagnosticoDiferencial" optionLabel="name"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                            class="w-full md:w-14rem" />
                                        <label for="puntajeDiagnosticoDiferencial">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Diagnostico 3</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedDiagnosticos" autoResize rows="3" cols="30" />
                                        <label for="feedDiagnosticos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeDiagnosticoDiferencial"
                                            :options="scoreDiagnosticoDiferencial" optionLabel="name"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                            class="w-full md:w-14rem" />
                                        <label for="puntajeDiagnosticoDiferencial">Puntaje Asignado</label>
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
                                                <InputText id="labOrinaColor" v-model="labOrinaColor" />
                                                <label for="labOrinaColor">Color</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labOrinaAspecto" v-model="labOrinaAspecto" />
                                                <label for="labOrinaAspecto">Aspecto</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labOrinaVolumen" v-model="labOrinaVolumen" />
                                                <label for="labOrinaVolumen">Volumen</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Textarea v-model="feedLaboratorioOrina" autoResize rows="3"
                                                    cols="30" />
                                                <label for="feedLaboratorioOrina">Retroalimentación</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <Dropdown v-model="puntajeLaboratorioOrina"
                                                    :options="scoreLaboratorioOrina" optionLabel="name"
                                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                    class="w-full md:w-14rem" />
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
                                                <InputText id="labSedHematies" v-model="labSedHematies" />
                                                <label for="labSedHematies">Hematies [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedLeucocitos" v-model="labSedLeucocitos" />
                                                <label for="labSedLeucocitos">Leucocitos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedPiocitos" v-model="labSedPiocitos" />
                                                <label for="labSedPiocitos">Piocitos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedEpiteliales" v-model="labSedEpiteliales" />
                                                <label for="labSedEpiteliales">Células Epiteliales [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedRenales" v-model="labSedRenales" />
                                                <label for="labSedRenales">Células Renales [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labSedCereo" v-model="labSedCereo" />
                                                <label for="labSedCereo">Cilindro Cereo [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedHialianos" v-model="labSedHialianos" />
                                                <label for="labSedHialianos">Cilindros Hialianos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedGranulosos" v-model="labSedGranulosos" />
                                                <label for="labSedGranulosos">Cilindors Granulosos [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedLeucocitarios" v-model="labSedLeucocitarios" />
                                                <label for="labSedLeucocitarios">Cilindros Leucocitarios [cpm]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedEritrocitarios" v-model="labSedEritrocitarios" />
                                                <label for="labSedEritrocitarios">Cilindros Eritrocitarios
                                                    [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedFlora" v-model="labSedFlora" />
                                                <label for="labSedFlora">Flora Bacteriana</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedCristales" v-model="labSedCristales" />
                                                <label for="labSedCristales">Cristales</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedFilamento" v-model="labSedFilamento" />
                                                <label for="labSedFilamento">Filamento Mucoso</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSedHifas" v-model="labSedHifas" />
                                                <label for="labSedHifas">Hifas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedLevaduras" v-model="labSedLevaduras" />
                                                <label for="labSedLevaduras">Levaduras</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSedOtros" v-model="labSedOtros" />
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
                                            <Textarea v-model="feedLabEspecial" autoResize rows="3" cols="30" />
                                            <label for="feedLabEspecial">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabEspecial" :options="scoreLabEspecial"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                <InputText id="labQuimicopH" v-model="labQuimicopH" />
                                                <label for="labQuimicopH">pH </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoDensidad" v-model="labQuimicoDensidad" />
                                                <label for="labQuimicoDensidad">Densidad </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoProteinas" v-model="labQuimicoProteinas" />
                                                <label for="labQuimicoProteinas">Proteinas [mg/dl]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSangre" v-model="labQuimicoSangre" />
                                                <label for="labQuimicoSangre">Sangre </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoGlucosa" v-model="labQuimicoGlucosa" />
                                                <label for="labQuimicoGlucosa">Células Glucosa </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labQuimicoCetona" v-model="labQuimicoCetona" />
                                                <label for="labQuimicoCetona">Cilindro Cetonas </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoPigmentos" v-model="labQuimicoPigmentos" />
                                                <label for="labQuimicoPigmentos">Pigmentos Biliares</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoNitritos" v-model="labQuimicoNitritos" />
                                                <label for="labQuimicoNitritos">Nitritos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoLeucocitos" v-model="labQuimicoLeucocitos" />
                                                <label for="labQuimicoLeucocitos">Leucocitos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoBilirrubina" v-model="labQuimicoBilirrubina" />
                                                <label for="labQuimicoBilirrubina">Bilirrubina </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoUrobilinogeno"
                                                    v-model="labQuimicoUrobilinogeno" />
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
                                            <Textarea v-model="feedLabQuimico" autoResize rows="3" cols="30" />
                                            <label for="feedLabQuimico">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabQuimico" :options="scoreLabQuimico"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                    v-model="labEspecialProteurinaria" />
                                                <label for="labEspecialProteurinaria">Proteurinaria </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labEspecialCreatinuria"
                                                    v-model="labEspecialCreatinuria" />
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
                                                    v-model="labEspecialMicroalbuminuria" />
                                                <label for="labEspecialMicroalbuminuria">Microalbuminuria </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labEspecialClearenceCreatinina"
                                                    v-model="labEspecialClearenceCreatinina" />
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
                                            <Textarea v-model="feedLabSed" autoResize rows="3" cols="30" />
                                            <label for="feedLabSed">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabSedimento" :options="scoreLabSedimento"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                <InputText id="labHematologicoGrupo" v-model="labHematologicoGrupo" />
                                                <label for="labHematologicoGrupo">GrupoSanguineo </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHematologicoFactor" v-model="labHematologicoFactor" />
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
                                                    v-model="labHematologicoObservaciones" />
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
                                            <Textarea v-model="feedLabBiometriaHematica" autoResize rows="3"
                                                cols="30" />
                                            <label for="feedLabBiometriaHematica">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabBiometriaHematica"
                                                :options="scoreLabBiometriaHematica" optionLabel="name"
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
                                                <InputText id="labiometriaHematicaRojos"
                                                    v-model="labiometriaHematicaRojos" />
                                                <label for="labiometriaHematicaRojos">Globulos Rojos </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labiometriaHematicaBlancos"
                                                    v-model="labiometriaHematicaBlancos" />
                                                <label for="labiometriaHematicaBlancos">Globulos Blancos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labiometriaHematicaHemoglobina"
                                                    v-model="labiometriaHematicaHemoglobina" />
                                                <label for="labiometriaHematicaHemoglobina">Hemoglobina </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labiometriaHematicaHematrocito"
                                                    v-model="labiometriaHematicaHematrocito" />
                                                <label for="labiometriaHematicaHematrocito">Hematrocito </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labiometriaHematicaVes"
                                                    v-model="labiometriaHematicaVes" />
                                                <label for="labiometriaHematicaVes">VES</label>
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
                                            <Textarea v-model="feedLabHematologico" autoResize rows="3" cols="30" />
                                            <label for="feedLabHematologico">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabHematologico" :options="scoreLabHematologico"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                <InputText id="labIndiceVcm" v-model="labIndiceVcm" />
                                                <label for="labIndiceVcm">VCM </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labIndiceHbcm" v-model="labIndiceHbcm" />
                                                <label for="labIndiceHbcm">HBCM </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labIndiceChbcm" v-model="labIndiceChbcm" />
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
                                            <Textarea v-model="feedLabIndice" autoResize rows="3" cols="30" />
                                            <label for="feedLabIndice">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabIndice" :options="scoreLabIndice"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                    v-model="labRecuentoCayadosRelativo" />
                                                <label for="labRecuentoCayadosRelativo">Cayados Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoCayadosAbsoluto"
                                                    v-model="labRecuentoCayadosAbsoluto" />
                                                <label for="labRecuentoCayadosAbsoluto">Cayados Absoluto [cpm.]</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoLinfocitosRelativo"
                                                    v-model="labRecuentoLinfocitosRelativo" />
                                                <label for="labRecuentoLinfocitosRelativo">Linfocitos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoLinfocitosAbsoluto"
                                                    v-model="labRecuentoLinfocitosAbsoluto" />
                                                <label for="labRecuentoLinfocitosAbsoluto">Linfocitos Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoEosinofilosRelativo"
                                                    v-model="labRecuentoEosinofilosRelativo" />
                                                <label for="labRecuentoEosinofilosRelativo">Eosinofilos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labRecuentoEosinofilosAbsoluto"
                                                    v-model="labRecuentoEosinofilosAbsoluto" />
                                                <label for="labRecuentoEosinofilosAbsoluto">Eosinofilos Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoBasofilosRelativo"
                                                    v-model="labRecuentoBasofilosRelativo" />
                                                <label for="labRecuentoBasofilosRelativo">Basofilos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoBasofilosAbsoluto"
                                                    v-model="labRecuentoBasofilosAbsoluto" />
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
                                                    v-model="labRecuentoSegmentadosRelativo" />
                                                <label for="labRecuentoSegmentadosRelativo">Segmentados Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoSegmentadosAbsoluto"
                                                    v-model="labRecuentoSegmentadosAbsoluto" />
                                                <label for="labRecuentoSegmentadosAbsoluto">Segmentados Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoMonocitosRelativo"
                                                    v-model="labRecuentoMonocitosRelativo" />
                                                <label for="labRecuentoMonocitosRelativo">Monocitos Relativo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labRecuentoMonocitosAbsoluto"
                                                    v-model="labRecuentoMonocitosAbsoluto" />
                                                <label for="labRecuentoMonocitosAbsoluto">Monocitos Absoluto</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoPlaquetas" v-model="labRecuentoPlaquetas" />
                                                <label for="labRecuentoPlaquetas">Recuento de Plaquetas</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labRecuentoReticulos" v-model="labRecuentoReticulos" />
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
                                            <Textarea v-model="feedLabRecuento" autoResize rows="3" cols="30" />
                                            <label for="feedLabRecuento">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabRecuento" :options="scoreLabRecuento"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                    v-model="labHemostaseaCoagulacion" />
                                                <label for="labHemostaseaCoagulacion">Tiempo de Coagulación </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaSangria" v-model="labHemostaseaSangria" />
                                                <label for="labHemostaseaSangria">Tiempo de Sangria </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaProtrombina"
                                                    v-model="labHemostaseaProtrombina" />
                                                <label for="labHemostaseaProtrombina">Tiempo de Protrombina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaInr" v-model="labHemostaseaInr" />
                                                <label for="labHemostaseaInr">INR</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaActividad"
                                                    v-model="labHemostaseaActividad" />
                                                <label for="labHemostaseaActividad">Actividad Protrombinica </label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaDimeroD" v-model="labHemostaseaDimeroD" />
                                                <label for="labHemostaseaDimeroD">Dimero D</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaFibrinogeno"
                                                    v-model="labHemostaseaFibrinogeno" />
                                                <label for="labHemostaseaFibrinogeno">Fibrinogeno</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaControl" v-model="labHemostaseaControl" />
                                                <label for="labHemostaseaControl">Tiempo de Control </label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labHemostaseaTroboplastina"
                                                    v-model="labHemostaseaTroboplastina" />
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
                                            <Textarea v-model="feedLabHemostasea" autoResize rows="3" cols="30" />
                                            <label for="feedLabHemostasea">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabHemostasea" :options="scoreLabHemostasea"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                <InputText id="labSerologiaProteinaC" v-model="labSerologiaProteinaC" />
                                                <label for="labSerologiaProteinaC">Proteina C</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSerologiaFactor" v-model="labSerologiaFactor" />
                                                <label for="labSerologiaFactor">Factor Reumatico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSerologiaRPR" v-model="labSerologiaRPR" />
                                                <label for="labSerologiaRPR">RPR Sifilis</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labSerologiaPrueba" v-model="labSerologiaPrueba" />
                                                <label for="labSerologiaPrueba">Prueba SIfilis</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSerologiaVIH" v-model="labSerologiaVIH" />
                                                <label for="labSerologiaVIH">Prueba VIH/SIDA</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labSerologiaHepatitis" v-model="labSerologiaHepatitis" />
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
                                            <Textarea v-model="feedLabSerologia" autoResize rows="3" cols="30" />
                                            <label for="feedLabSerologia">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabSerologia" :options="scoreLabSerologia"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                <InputText id="labElectrolitosCalcio" v-model="labElectrolitosCalcio" />
                                                <label for="labElectrolitosCalcio">Calcio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosSodio" v-model="labElectrolitosSodio" />
                                                <label for="labElectrolitosSodio">Sodio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosPotasio"
                                                    v-model="labElectrolitosPotasio" />
                                                <label for="labElectrolitosPotasio">Potasio</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosCloro" v-model="labElectrolitosCloro" />
                                                <label for="labElectrolitosCloro">Cloro</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosFoforo" v-model="labElectrolitosFoforo" />
                                                <label for="labElectrolitosFoforo">Foforo</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labElectrolitosMagnesio"
                                                    v-model="labElectrolitosMagnesio" />
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
                                            <Textarea v-model="feedLabElectrolitos" autoResize rows="3" cols="30" />
                                            <label for="feedLabElectrolitos">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabElectrolitos" :options="scoreLabElectrolitos"
                                                optionLabel="name" placeholder="Elige una opción" checkmark
                                                :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                                    v-model="labQuimicoSanguineoGlicemia" />
                                                <label for="labQuimicoSanguineoGlicemia">Glicemia</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoCreatinina"
                                                    v-model="labQuimicoSanguineoCreatinina" />
                                                <label for="labQuimicoSanguineoCreatinina">Creatinina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoNitrogeno"
                                                    v-model="labQuimicoSanguineoNitrogeno" />
                                                <label for="labQuimicoSanguineoNitrogeno">Nitrogeno Ureico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoUrea"
                                                    v-model="labQuimicoSanguineoUrea" />
                                                <label for="labQuimicoSanguineoUrea">Urea</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoAcidoUrico"
                                                    v-model="labQuimicoSanguineoAcidoUrico" />
                                                <label for="labQuimicoSanguineoAcidoUrico">Acido Urico</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoBilirrubinaTotal"
                                                    v-model="labQuimicoSanguineoBilirrubinaTotal" />
                                                <label for="labQuimicoSanguineoBilirrubinaTotal">Bilirrubina
                                                    Total</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoBilirrubinaDirecta"
                                                    v-model="labQuimicoSanguineoBilirrubinaDirecta" />
                                                <label for="labQuimicoSanguineoBilirrubinaDirecta">Bilirrubina
                                                    Directa</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoBilirrubinaIndirecta"
                                                    v-model="labQuimicoSanguineoBilirrubinaIndirecta" />
                                                <label for="labQuimicoSanguineoBilirrubinaIndirecta">Bilirrubina
                                                    Indirecta</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoTransaminasaGPT"
                                                    v-model="labQuimicoSanguineoTransaminasaGPT" />
                                                <label for="labQuimicoSanguineoTransaminasaGPT">Transaminasa GPT</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 ">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoTransaminasaGOT"
                                                    v-model="labQuimicoSanguineoTransaminasaGOT" />
                                                <label for="labQuimicoSanguineoTransaminasaGOT">Transaminasa GOT</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoLactato"
                                                    v-model="labQuimicoSanguineoLactato" />
                                                <label for="labQuimicoSanguineoLactato">Lactato Deshidrogenasa</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoFosfatosa"
                                                    v-model="labQuimicoSanguineoFosfatosa" />
                                                <label for="labQuimicoSanguineoFosfatosa">Fosfatosa Alcalina</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 md:col-6">
                                    <div class="grid p-fluid pt-1">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoProteinas"
                                                    v-model="labQuimicoSanguineoProteinas" />
                                                <label for="labQuimicoSanguineoProteinas">Proteinas Totales</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoAlbumina"
                                                    v-model="labQuimicoSanguineoAlbumina" />
                                                <label for="labQuimicoSanguineoAlbumina">Albumina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoGlobulina"
                                                    v-model="labQuimicoSanguineoGlobulina" />
                                                <label for="labQuimicoSanguineoGlobulina">Globulina</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoRelacion"
                                                    v-model="labQuimicoSanguineoRelacion" />
                                                <label for="labQuimicoSanguineoRelacion">Relación ALB-GLO</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoColesterol"
                                                    v-model="labQuimicoSanguineoColesterol" />
                                                <label for="labQuimicoSanguineoColesterol">Colesterol Total</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoTrigliceridos"
                                                    v-model="labQuimicoSanguineoTrigliceridos" />
                                                <label for="labQuimicoSanguineoTrigliceridos">Trigliceridos</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoHemoglobina"
                                                    v-model="labQuimicoSanguineoHemoglobina" />
                                                <label for="labQuimicoSanguineoHemoglobina">Hemoglobina
                                                    Glicosilada</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoHdl"
                                                    v-model="labQuimicoSanguineoHdl" />
                                                <label for="labQuimicoSanguineoHdl">HDL Colesterol</label>
                                            </FloatLabel>
                                        </div>
                                    </div>
                                    <div class="grid p-fluid pt-3">
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoLdl"
                                                    v-model="labQuimicoSanguineoLdl" />
                                                <label for="labQuimicoSanguineoLdl">LDL Colesterol</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoVldl"
                                                    v-model="labQuimicoSanguineoVldl" />
                                                <label for="labQuimicoSanguineoVldl">VLDL Colesterol</label>
                                            </FloatLabel>
                                        </div>
                                        <div class="col md:col-6 pt-3">
                                            <FloatLabel>
                                                <InputText id="labQuimicoSanguineoGlicemia"
                                                    v-model="labQuimicoSanguineoGlicemia" />
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
                                            <Textarea v-model="feedLabQuimicoSanguineo" autoResize rows="3" cols="30" />
                                            <label for="feedLabQuimicoSanguineo">Retroalimentación</label>
                                        </FloatLabel>
                                    </div>
                                    <div class="col md:col-6 pt-1">
                                        <FloatLabel>
                                            <Dropdown v-model="puntajeLabQuimicoSanguineo"
                                                :options="scoreLabQuimicoSanguineo" optionLabel="name"
                                                placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                                class="w-full md:w-14rem" />
                                            <label for="puntajeLabQuimicoSanguineo">Puntaje Asignado</label>
                                        </FloatLabel>
                                    </div>
                                </div>
                            </div>

                            <h5>Selecciona los estudios de imagenologia para el caso</h5>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="imagen" :options="imagenesDisponibles" optionLabel="name"
                                    multiple aria-labelledby="multiple" />
                            </div>
                            <h5>Imagen 1</h5>
                            <div class="grid p-fluid">
                                <div class="col md:col-5">
                                    <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)"
                                        :multiple="false" chooseLabel="Elegir Imagen" cancelLabel="Cancelar"
                                        :showUploadButton="false" :maxFileSize="1000000" class="p-fileupload-file-size">
                                        <template #empty>
                                            <p>Elige y arrastra una imagen.</p>
                                        </template>
                                    </FileUpload>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="interpretacionSubespecialidad" autoResize rows="3"
                                            cols="30" />
                                        <label for="interpretacionSubespecialidad">Interpretación</label>
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
                            </div>

                            <div class="flex py-4 gap-2">
                                <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
                            </div>
                        </template>
                    </StepperPanel>


                    <StepperPanel header="Intervenir">
                        <template #content="{ prevCallback, nextCallback }">
                            <h5>Selecciona los medicamentos para el caso</h5>
                            <div class="grid">
                                <div class="col-12">
                                    <h5>Sedación/Analgesia</h5>
                                </div>
                            </div>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="medicamentos" :options="medicamentosDisponibles"
                                    optionLabel="name" multiple aria-labelledby="multiple" />
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <h6>Medicamento 1</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedMedicamento" autoResize rows="3" cols="30" />
                                        <label for="feedMedicamento">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeMedicamentos">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Medicamento 2</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedMedicamento" autoResize rows="3" cols="30" />
                                        <label for="feedMedicamento">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeMedicamentos">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Medicamento 3</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedMedicamentos" autoResize rows="3" cols="30" />
                                        <label for="feedMedicamentos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeMedicamentos">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                            </div>

                            <div class="grid">
                                <div class="col-12">
                                    <h5>Antibióticos</h5>
                                </div>
                            </div>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="medicamentos" :options="medicamentosDisponibles"
                                    optionLabel="name" multiple aria-labelledby="multiple" />
                            </div>
                            <div class="grid">
                                <div class="col md:col-4">
                                    <h6>Medicamento 1</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedMedicamentos" autoResize rows="3" cols="30" />
                                        <label for="feedMedicamentos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeMedicamentos">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Medicamento 2</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedMedicamentos" autoResize rows="3" cols="30" />
                                        <label for="feedMedicamentos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeMedicamentos">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1"></div>
                                <div class="col md:col-4">
                                    <h6>Medicamento 3</h6>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedMedicamentos" autoResize rows="3" cols="30" />
                                        <label for="feedMedicamentos">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeMedicamentos">Puntaje Asignado</label>
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


                    <StepperPanel header="Traspaso">
                        <template #content="{ prevCallback }">

                            <h5>¿Cual es el siguiente paso para el paciente?</h5>
                            <div class="grid pt-3">
                                <div class="col md:col-4">
                                    <h5>Ingresar al paciente a una unidade de cuidados intensivos</h5>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedTraspasoUCI" autoResize rows="3" cols="30" />
                                        <label for="feedTraspasoUCI">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeTraspasoUCI" :options="scoreTraspasoUCI"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeTraspasoUCI">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1">
                                    <h5></h5>
                                </div>

                                <div class="col md:col-4 pt-3">
                                    <h5>Ingresar al paciente a una habitación de hospitalización general</h5>
                                </div>
                                <div class="col md:col-4 pt-3">
                                    <FloatLabel>
                                        <Textarea v-model="feedTraspasoInternar" autoResize rows="3" cols="30" />
                                        <label for="feedTraspasoInternar">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3 pt-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeTraspasoInternar" :options="scoreTraspasoInternar"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeTraspasoInternar">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1 pt-3">
                                    <h5></h5>
                                </div>

                                <div class="col md:col-4">
                                    <h5>Preparar al paciente para una cirugía</h5>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedTraspasoCirugia" autoResize rows="3" cols="30" />
                                        <label for="feedTraspasoCirugia">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeTraspasoCirugia" :options="scoreTraspasoCirugia"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeTraspasoCirugia">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-1">
                                    <h5></h5>
                                </div>
                            </div>

                            <h5>¿Cual es el diagnostico final?</h5>
                            <div class="grid">
                                <div class="col-12">
                                    <h5>Alergia/Inmunológico</h5>
                                </div>
                            </div>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="diagnosticoFinal" :options="diagnosticosDiferenciales"
                                    optionLabel="name" aria-labelledby="basic" />
                            </div>
                            <div class="grid">
                                <div class="col-12">
                                    <h5>Cardiovascular</h5>
                                </div>
                            </div>
                            <div class="card flex justify-content-center">
                                <SelectButton v-model="diagnosticoFinal" :options="diagnosticosDiferenciales"
                                    optionLabel="name" aria-labelledby="basic" />
                            </div>


                            <div class="flex py-4 gap-2">
                                <Button label="Atras" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
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
