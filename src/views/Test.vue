<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import {
    obtenerCasosClinicos, cambiarEstadoCaso,
    obtenerCasoClinicoPorId,
    obtenerPaciente, actualizarPaciente,
    obtenerAntecedentesPatologicos, actualizarAntecedentesPatologicos,
    obtenerAntecedentesNoPatologicos, actualizarAntecedentesNoPatologicos,
    obtenerAntecedentesFamiliares, actualizarAntecedentesFamiliares,
    obtenerAnamnesisSistemas, actualizarAnamnesisSistemas,
    obtenerMotivosConsulta, agregarMotivoConsulta, eliminarMotivoConsulta,
    obtenerPuntaje, actualizarMotivoConsulta
} from '../services/casoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const casosClinicos = ref([]);
const visible = ref(false);
const casoSeleccionado = ref(null);

const paciente = ref({});
const antecedentesPatologicos = ref({});
const antecedentesNoPatologicos = ref({});
const antecedentesFamiliares = ref({});
const anamnesisSistemas = ref({});
const motivosConsulta = ref([]);
const puntajes = ref([]);
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

// Cargar antecedentes patológicos
const cargarAntecedentesPatologicos = async (id_historia_clinica) => {
    try {
        const response = await obtenerAntecedentesPatologicos(id_historia_clinica);
        antecedentesPatologicos.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes patológicos', life: 3000 });
    }
};

// Cargar antecedentes no patológicos
const cargarAntecedentesNoPatologicos = async (id_historia_clinica) => {
    try {
        const response = await obtenerAntecedentesNoPatologicos(id_historia_clinica);
        antecedentesNoPatologicos.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes no patológicos', life: 3000 });
    }
};

// Cargar antecedentes familiares
const cargarAntecedentesFamiliares = async (id_historia_clinica) => {
    try {
        const response = await obtenerAntecedentesFamiliares(id_historia_clinica);
        antecedentesFamiliares.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener antecedentes familiares', life: 3000 });
    }
};

// Cargar anamnesis por sistemas
const cargarAnamnesisSistemas = async (id_historia_clinica) => {
    try {
        const response = await obtenerAnamnesisSistemas(id_historia_clinica);
        anamnesisSistemas.value = response.data[0];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener anamnesis por sistemas', life: 3000 });
    }
};

// Cargar motivos de consulta
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
        puntajes.value = response.data.map(item => ({
            name: item.codigo, value: item.valor
        }));
    } catch (error) {
        console.log(error)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener puntajes', life: 3000 });
    }
};

const mostrarDetalleCaso = async (idCaso) => {
    try {
        const response = await obtenerCasoClinicoPorId(idCaso);
        casoSeleccionado.value = response.data;
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

const guardarTodosLosCambios = async () => {
    try {
        // Guardar paciente
        await actualizarPaciente(paciente.value.id_paciente, paciente.value);

        // Guardar antecedentes patológicos
        console.log("antecedentesPatologicos: ", antecedentesPatologicos.value)
        await actualizarAntecedentesPatologicos(paciente.value.id_historia_clinica, antecedentesPatologicos.value);

        // Guardar antecedentes no patológicos
        await actualizarAntecedentesNoPatologicos(paciente.value.id_historia_clinica, antecedentesNoPatologicos.value);

        // Guardar antecedentes familiares
        await actualizarAntecedentesFamiliares(paciente.value.id_historia_clinica, antecedentesFamiliares.value);

        // Guardar anamnesis por sistemas
        await actualizarAnamnesisSistemas(anamnesisSistemas.value.id_anamnesis_sistemas, anamnesisSistemas.value);

        for (const motivo of motivosConsulta.value) {
            if (motivo.id_motivo_consulta) {
                // Actualizar motivo existente
                await actualizarMotivoConsulta(motivo.id_motivo_consulta, motivo);
            } else {
                // Agregar nuevo motivo
                const response = await agregarMotivoConsulta(motivo);
                motivo.id_motivo_consulta = response.data.id_motivo_consulta;
            }
        }
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Todos los cambios se han guardado correctamente', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar los cambios', life: 3000 });
    }
};

// Agregar un nuevo motivo de consulta
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


// Eliminar un motivo de consulta
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

                            <div class="flex py-4 gap-2">
                                <Button label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                                    @click="prevCallback" />
                                <Button label="Guardar" severity="success" icon="pi pi-save"
                                    @click="guardarTodosLosCambios" />
                                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right"
                                    @click="nextCallback" />
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