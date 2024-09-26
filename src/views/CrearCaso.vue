<script setup>
import { ref } from 'vue';

const nombre = ref('');
const paterno = ref('');
const materno = ref('');
const fecha_nacimiento = ref(null);
const peso = ref();
const talla = ref();
const sexo = ref();
const sexoOpciones = ([
    { name: 'Masculino', code: 'M' },
    { name: 'Femenino', code: 'F' }
]);
const descripcionHistoria = ref('');
const historiaEnfermedadActual = ref('');
const motivoConsulta = ref('');

const puntajeAnamnesis = ref();
const scoreAnamnesis = ([
    { name: 'A', code: 'A' },
    { name: 'B', code: 'B' },
    { name: 'C', code: 'C' },
    { name: 'D', code: 'D' },
    { name: 'E', code: 'E' }
]);


const puntajeEstabilizar = ref();
const scoreEstabilizar = ([
    { name: 'A', code: 'A' },
    { name: 'B', code: 'B' },
    { name: 'C', code: 'C' },
    { name: 'D', code: 'D' },
    { name: 'E', code: 'E' }
]);

const puntajeExamenFisico = ref();
const scoreExamenFisico = ([
    { name: 'A', code: 'A' },
    { name: 'B', code: 'B' },
    { name: 'C', code: 'C' },
    { name: 'D', code: 'D' },
    { name: 'E', code: 'E' }
]);

const diagnosticoFinal = ref(null);
const diagnosticos = ref(null);
const diagnosticosDiferenciales = ref([
    { name: 'Diagnostico 1', value: 1 },
    { name: 'Diagnostico 2', value: 2 },
    { name: 'Diagnostico 3', value: 3 },
    { name: 'Diagnostico 1', value: 1 },
    { name: 'Diagnostico 2', value: 2 },
    { name: 'Diagnostico 3', value: 3 },
    { name: 'Diagnostico 1', value: 1 },
    { name: 'Diagnostico 2', value: 2 },
    { name: 'Diagnostico 3', value: 3 },
    { name: 'Diagnostico 1', value: 1 },
    { name: 'Diagnostico 2', value: 2 },
    { name: 'Diagnostico 3', value: 3 }
]);


const puntajeDiagnosticoDiferencial = ref();
const scoreDiagnosticoDiferencial = ([
    { name: 'A', code: 'A' },
    { name: 'B', code: 'B' },
    { name: 'C', code: 'C' },
    { name: 'D', code: 'D' },
    { name: 'E', code: 'E' }
]);


const puntajeLaboratorioOrina = ref();
const scoreLaboratorioOrina = ([
    { name: 'A', code: 'A' },
    { name: 'B', code: 'B' },
    { name: 'C', code: 'C' },
    { name: 'D', code: 'D' },
    { name: 'E', code: 'E' }
]);

const puntajeLabSedimento = ref();
const scoreLabSedimento = ([
    { name: 'A', code: 'A' },
    { name: 'B', code: 'B' },
    { name: 'C', code: 'C' },
    { name: 'D', code: 'D' },
    { name: 'E', code: 'E' }
]);


const medicamentos = ref(null);
const medicamentosDisponibles = ref([
    { name: 'Medicamento 1', value: 1 },
    { name: 'Medicamento 2', value: 2 },
    { name: 'Medicamento 3', value: 3 },
    { name: 'Medicamento 4', value: 1 },
    { name: 'Medicamento 5', value: 2 },
    { name: 'Medicamento 6', value: 3 },
    { name: 'Medicamento 7', value: 1 },
    { name: 'Medicamento 8', value: 2 },
    { name: 'Medicamento 9', value: 3 },
    { name: 'Medicamento 10', value: 1 },
    { name: 'Medicamento 11', value: 2 },
    { name: 'Medicamento 12', value: 3 }
]);


const subespecialidades = ref(null);
const subespecialidadesDisponibles = ref([
    { name: 'Cardiología', value: 1 },
    { name: 'Endocrinología', value: 2 },
    { name: 'Gastroenterología', value: 3 },
    { name: 'Cirugía General', value: 1 },
    { name: 'Hematología', value: 2 },
    { name: 'Oncología', value: 3 },
    { name: 'Enfermedades Infecciosas', value: 1 },
    { name: 'Neurología', value: 2 },
    { name: 'Neurocirujano', value: 3 },
    { name: 'Ortopedia', value: 1 },
    { name: 'Psiquiatría', value: 2 },
    { name: 'Neumología', value: 3 }
]);


const imagen = ref(null);
const imagenesDisponibles = ref([
    { name: 'Imagen 1', value: 1 },
    { name: 'Imagen 2', value: 2 },
    { name: 'Imagen 3', value: 3 },
    { name: 'Imagen 1', value: 1 },
    { name: 'Imagen 2', value: 2 },
    { name: 'Imagen 3', value: 3 },
    { name: 'Imagen 1', value: 1 },
    { name: 'Imagen 2', value: 2 },
    { name: 'Imagen 3', value: 3 },
    { name: 'Imagen 1', value: 1 },
    { name: 'Imagen 2', value: 2 },
    { name: 'Imagen 3', value: 3 }
]);

const tiempoAsignado = ref();

</script>

<template>
    <div class="card justify-content-center">
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
                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                <label for="categoriaSimulacion">Elige una categoria</label>
                            </FloatLabel>
                        </div>
                        <div class="col md:col-4">
                            <FloatLabel>
                                <Dropdown v-model="dificultad" :options="dificultadSimulacion" optionLabel="name"
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
                            <div class="grid p-fluid">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="rubrica" v-model="rubrica" />
                                        <label for="rubrica">Rubrica</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="codigoPuntajeSimulacion" v-model="codigoPuntajeSimulacion" />
                                        <label for="codigoPuntajeSimulacion">Codigo</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputNumber id="valorPuntaje" v-model="valorPuntaje" inputId="locale-user"
                                            :minFractionDigits="2" />
                                        <label for="valorPuntaje">Puntos</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6"></div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputText id="rubrica" v-model="rubrica" />
                                        <label for="rubrica">Rubrica</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputText id="codigoPuntajeSimulacion" v-model="codigoPuntajeSimulacion" />
                                        <label for="codigoPuntajeSimulacion">Codigo</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputNumber id="valorPuntaje" v-model="valorPuntaje" inputId="locale-user"
                                            :minFractionDigits="2" />
                                        <label for="valorPuntaje">Puntos</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6"></div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputText id="rubrica" v-model="rubrica" />
                                        <label for="rubrica">Rubrica</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputText id="codigoPuntajeSimulacion" v-model="codigoPuntajeSimulacion" />
                                        <label for="codigoPuntajeSimulacion">Codigo</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputNumber id="valorPuntaje" v-model="valorPuntaje" inputId="locale-user"
                                            :minFractionDigits="2" />
                                        <label for="valorPuntaje">Puntos</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 text-center pt-3">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Filter" />
                                    <Button icon="pi pi-times" severity="danger" text raised rounded
                                        aria-label="Cancel" />
                                </div>
                            </div>
                        </div>
                        <div class="col md:col-6">
                            <div class="grid p-fluid">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="tituloMensaje" v-model="tituloMensaje" />
                                        <label for="tituloMensaje">TituloMensaje</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="tiempoMensaje" v-model="tiempoMensaje" />
                                        <label for="tiempoMensaje">Tiempo [mm:ss]</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <Textarea v-model="descripciónMensaje" autoResize rows="3" cols="30" />
                                        <label for="descripciónMensaje">Descripción</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 text-center pt-4">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Filter" />
                                    <Button icon="pi pi-times" severity="danger" text raised rounded
                                        aria-label="Cancel" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex py-4 gap-2">
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
                                        <InputText id="nombre" v-model="nombre" />
                                        <label for="nombre">Nombre</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="paterno" v-model="paterno" />
                                        <label for="paterno">Apellido Paterno</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="materno" v-model="materno" />
                                        <label for="materno">Apellido Materno</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Calendar inputId="fecha_nacimiento" v-model="fecha_nacimiento"
                                            dateFormat="dd/mm/yy"></Calendar>
                                        <label for="fecha_nacimiento">Fecha de nacimiento</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <h5>Información basica del paciente</h5>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputNumber id="peso" v-model="peso" inputId="locale-user"
                                            :minFractionDigits="2" />
                                        <label for="peso">Peso [Kg.]</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputNumber id="talla" v-model="talla" inputId="locale-user"
                                            :minFractionDigits="2" />
                                        <label for="talla">Talla [m.]</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Dropdown v-model="sexo" :options="sexoOpciones" optionLabel="name"
                                            placeholder="Elige una opción" checkmark :highlightOnSelect="false"
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
                                        <Textarea v-model="descripcionHistoria" autoResize rows="5" cols="30" />
                                        <label for="descripcionHistoria">Descripción</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-12">
                                    <FloatLabel>
                                        <Textarea v-model="historiaEnfermedadActual" autoResize rows="5" cols="30" />
                                        <label for="historiaEnfermedadActual">Historia de la enfermedad actual</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <h5>Motivo de la consulta</h5>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-9">
                                    <FloatLabel>
                                        <InputText id="motivoConsulta" v-model="motivoConsulta" />
                                        <label for="peso">Motivo de la consulta</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <Button icon="pi pi-plus" text raised rounded aria-label="Filter" />
                                    <Button icon="pi pi-times" severity="danger" text raised rounded
                                        aria-label="Cancel" />
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
                                        <Textarea v-model="alergias" autoResize rows="3" cols="30" />
                                        <label for="alergias">Alergias</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="cirugias" autoResize rows="3" cols="30" />
                                        <label for="cirugias">Cirugias</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="traumatismos" autoResize rows="3" cols="30" />
                                        <label for="traumatismos">Traumatismos</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="intoxicaciones" autoResize rows="3" cols="30" />
                                        <label for="intoxicaciones">Intoxicaciones</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="hospitalizaciones" autoResize rows="3" cols="30" />
                                        <label for="hospitalizaciones">Hospitalizaciones</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="enfermedades" autoResize rows="3" cols="30" />
                                        <label for="enfermedades">Enfermedades</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="patologiaAsociada" autoResize rows="3" cols="30" />
                                        <label for="patologiaAsociada">Patologias Asociadas</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="enfermedadesCongenitas" autoResize rows="3" cols="30" />
                                        <label for="enfermedadesCongenitas">Enfermedades Congenitas</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="enfermedadesInfancia" autoResize rows="3" cols="30" />
                                        <label for="enfermedadesInfancia">Enfermedades de la Infancia</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="enfermedadesAdolescencia" autoResize rows="3" cols="30" />
                                        <label for="enfermedadesAdolescencia">Enfermedades de la Adolescencia</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="enfermedadesAdulto" autoResize rows="3" cols="30" />
                                        <label for="enfermedadesAdulto">Enfermedades de Adulto</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="transfusiones" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="antecedentesNacimiento" autoResize rows="3" cols="30" />
                                        <label for="antecedentesNacimiento">Antecedentes de Nacimiento</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="habitos" autoResize rows="3" cols="30" />
                                        <label for="habitos">Habitos</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="factoresRiesgo" autoResize rows="3" cols="30" />
                                        <label for="factoresRiesgo">Factores de Riesgo</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="padre" autoResize rows="3" cols="30" />
                                        <label for="padre">Padre</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="madre" autoResize rows="3" cols="30" />
                                        <label for="madre">Madre</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="hermanos" autoResize rows="3" cols="30" />
                                        <label for="hermanos">Hermanos</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="conyugue" autoResize rows="3" cols="30" />
                                        <label for="conyugue">Conyugue</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Textarea v-model="hijos" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="sistemaCardiovascular" autoResize rows="3" cols="30" />
                                        <label for="sistemaCardiovascular">Sistema Cardiovascular</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaCardiovascular" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaCardiovascular">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaEndocrino" autoResize rows="3" cols="30" />
                                        <label for="sistemaEndocrino">Sistema Endocrino</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaEndocrino" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaEndocrino">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaGastrointestinal" autoResize rows="3" cols="30" />
                                        <label for="sistemaGastrointestinal">Sistema Gastrointestinal</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaGastrointestinal" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaGastrointestinal">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaGenitourinario" autoResize rows="3" cols="30" />
                                        <label for="sistemaGenitourinario">Sistema Genitourinario</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaGenitourinario" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaGenitourinario">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaRespiratorio" autoResize rows="3" cols="30" />
                                        <label for="sistemaRespiratorio">Sistema Respiratorio</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaRespiratorio" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaRespiratorio">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaNeurologico" autoResize rows="3" cols="30" />
                                        <label for="sistemaNeurologico">Sistema Neurologico</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaNeurologico" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaNeurologico">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaLocomotor" autoResize rows="3" cols="30" />
                                        <label for="sistemaLocomotor">Sistema Locomotor</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaLocomotor" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaLocomotor">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaHematico" autoResize rows="3" cols="30" />
                                        <label for="sistemaHematico">Sistema Hematico</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaHematico" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaHematico">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaPsiquiatrico" autoResize rows="3" cols="30" />
                                        <label for="sistemaPsiquiatrico">Sistema Psiquiatrico</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaPsiquiatrico" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaPsiquiatrico">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="grid p-fluid pt-1">
                                <div class="col md:col-5">
                                    <FloatLabel>
                                        <Textarea v-model="sistemaTegumentario" autoResize rows="3" cols="30" />
                                        <label for="sistemaTegumentario">Sistema Tegumentario</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSistemaTegumentario" autoResize rows="3" cols="30" />
                                        <label for="feedSistemaTegumentario">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-3">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeAnamnesis" :options="scoreAnamnesis"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
                                            :highlightOnSelect="false" class="w-full md:w-14rem" />
                                        <label for="puntajeAnamnesis">Puntaje Asignado</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex py-4 gap-2">
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
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
                                        <Textarea v-model="descripcionExamenFisico" autoResize rows="5" cols="30" />
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
                                        <InputNumber id="examenTemperatura" v-model="temperatura" inputId="locale-user"
                                            :minFractionDigits="2" />
                                        <label for="examenTemperatura">Temperatura [°C.]</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-6">
                            <div class="grid p-fluid pt-2">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputNumber id="examenTalla" v-model="examenTalla" inputId="locale-user"
                                            :minFractionDigits="2" />
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
                                        <Textarea v-model="examenFisicoGeneralRetroalimentacion" autoResize rows="3"
                                            cols="30" />
                                        <label for="examenFisicoGeneralRetroalimentacion">Retroalimentación</label>
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
                                        <Textarea v-model="examenSegmentarioCabeza" autoResize rows="3" cols="30" />
                                        <label for="examenSegmentarioCabeza">Cabeza</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSegmentarioCabeza" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="examenSegmentarioCuello" autoResize rows="3" cols="30" />
                                        <label for="examenSegmentarioCuello">Cuello</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSegmentarioCuello" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="examenSegmentarioTorax" autoResize rows="3" cols="30" />
                                        <label for="examenSegmentarioTorax">Torax</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSegmentarioTorax" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="examenSegmentarioCorazon" autoResize rows="3" cols="30" />
                                        <label for="examenSegmentarioCorazon">Corazón</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSegmentarioCorazon" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="examenSegmentarioMamas" autoResize rows="3" cols="30" />
                                        <label for="examenSegmentarioMamas">Mamas</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSegmentarioMamas" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="examenSegmentarioAbdomen" autoResize rows="3" cols="30" />
                                        <label for="examenSegmentarioAbdomen">Abdomen</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-4">
                                    <FloatLabel>
                                        <Textarea v-model="feedSegmentarioAbdomen" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="feedSegmentarioExtremidades" autoResize rows="3" cols="30" />
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
                                        <Textarea v-model="feedSegmentarioNeurologico" autoResize rows="3" cols="30" />
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
                                        <InputText id="examenObstetricoSituacion" v-model="examenObstetricoSituacion" />
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
                                        <InputText id="examenObstetricoPelvis" v-model="examenObstetricoPelvis" />
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
                                        <InputText id="examenObstetricoMembranas" v-model="examenObstetricoMembranas" />
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
                                        <Textarea v-model="feedExamenObstetrico" autoResize rows="2" cols="30" />
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
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
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
                                        <InputNumber id="signosFrecuenciaCardiaca" v-model="signosFrecuenciaCardiaca"
                                            inputId="locale-user" :minFractionDigits="2" />
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
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
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
                        <SelectButton v-model="diagnosticos" :options="diagnosticosDiferenciales" optionLabel="name"
                            multiple aria-labelledby="multiple" />
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
                                <Dropdown v-model="puntajeDiagnosticoDiferencial" :options="scoreDiagnosticoDiferencial"
                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeDiagnosticoDiferencial" :options="scoreDiagnosticoDiferencial"
                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeDiagnosticoDiferencial" :options="scoreDiagnosticoDiferencial"
                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                        <SelectButton v-model="diagnosticos" :options="diagnosticosDiferenciales" optionLabel="name"
                            multiple aria-labelledby="multiple" />
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
                                <Dropdown v-model="puntajeDiagnosticoDiferencial" :options="scoreDiagnosticoDiferencial"
                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeDiagnosticoDiferencial" :options="scoreDiagnosticoDiferencial"
                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeDiagnosticoDiferencial" :options="scoreDiagnosticoDiferencial"
                                    optionLabel="name" placeholder="Elige una opción" checkmark
                                    :highlightOnSelect="false" class="w-full md:w-14rem" />
                                <label for="puntajeDiagnosticoDiferencial">Puntaje Asignado</label>
                            </FloatLabel>
                        </div>
                        <div class="col md:col-1"></div>
                    </div>

                    <div class="flex py-4 gap-2">
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
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
                                        <Textarea v-model="feedLaboratorioOrina" autoResize rows="3" cols="30" />
                                        <label for="feedLaboratorioOrina">Retroalimentación</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <Dropdown v-model="puntajeLaboratorioOrina" :options="scoreLaboratorioOrina"
                                            optionLabel="name" placeholder="Elige una opción" checkmark
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
                                        <label for="labSedEritrocitarios">Cilindros Eritrocitarios [cpm.]</label>
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
                                        <InputText id="labQuimicoUrobilinogeno" v-model="labQuimicoUrobilinogeno" />
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
                                    <Dropdown v-model="puntajeLabQuimico" :options="scoreLabQuimico" optionLabel="name"
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
                                        <InputText id="labEspecialProteurinaria" v-model="labEspecialProteurinaria" />
                                        <label for="labEspecialProteurinaria">Proteurinaria </label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="labEspecialCreatinuria" v-model="labEspecialCreatinuria" />
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
                                    <Textarea v-model="feedLabBiometriaHematica" autoResize rows="3" cols="30" />
                                    <label for="feedLabBiometriaHematica">Retroalimentación</label>
                                </FloatLabel>
                            </div>
                            <div class="col md:col-6 pt-1">
                                <FloatLabel>
                                    <Dropdown v-model="puntajeLabBiometriaHematica" :options="scoreLabBiometriaHematica"
                                        optionLabel="name" placeholder="Elige una opción" checkmark
                                        :highlightOnSelect="false" class="w-full md:w-14rem" />
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
                                        <InputText id="labiometriaHematicaRojos" v-model="labiometriaHematicaRojos" />
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
                                        <InputText id="labiometriaHematicaVes" v-model="labiometriaHematicaVes" />
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
                                    <Dropdown v-model="puntajeLabIndice" :options="scoreLabIndice" optionLabel="name"
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
                                        <InputText id="labHemostaseaCoagulacion" v-model="labHemostaseaCoagulacion" />
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
                                        <InputText id="labHemostaseaProtrombina" v-model="labHemostaseaProtrombina" />
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
                                        <InputText id="labHemostaseaActividad" v-model="labHemostaseaActividad" />
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
                                        <InputText id="labHemostaseaFibrinogeno" v-model="labHemostaseaFibrinogeno" />
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
                                        <label for="labHemostaseaTroboplastina">Tiempo Troboplastina Parcial</label>
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
                                        <InputText id="labElectrolitosPotasio" v-model="labElectrolitosPotasio" />
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
                                        <InputText id="labElectrolitosMagnesio" v-model="labElectrolitosMagnesio" />
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
                                        <InputText id="labQuimicoSanguineoUrea" v-model="labQuimicoSanguineoUrea" />
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
                                        <label for="labQuimicoSanguineoBilirrubinaTotal">Bilirrubina Total</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputText id="labQuimicoSanguineoBilirrubinaDirecta"
                                            v-model="labQuimicoSanguineoBilirrubinaDirecta" />
                                        <label for="labQuimicoSanguineoBilirrubinaDirecta">Bilirrubina Directa</label>
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
                                        <label for="labQuimicoSanguineoHemoglobina">Hemoglobina Glicosilada</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6 pt-3">
                                    <FloatLabel>
                                        <InputText id="labQuimicoSanguineoHdl" v-model="labQuimicoSanguineoHdl" />
                                        <label for="labQuimicoSanguineoHdl">HDL Colesterol</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div class="grid p-fluid pt-3">
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="labQuimicoSanguineoLdl" v-model="labQuimicoSanguineoLdl" />
                                        <label for="labQuimicoSanguineoLdl">LDL Colesterol</label>
                                    </FloatLabel>
                                </div>
                                <div class="col md:col-6">
                                    <FloatLabel>
                                        <InputText id="labQuimicoSanguineoVldl" v-model="labQuimicoSanguineoVldl" />
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
                                    <Dropdown v-model="puntajeLabQuimicoSanguineo" :options="scoreLabQuimicoSanguineo"
                                        optionLabel="name" placeholder="Elige una opción" checkmark
                                        :highlightOnSelect="false" class="w-full md:w-14rem" />
                                    <label for="puntajeLabQuimicoSanguineo">Puntaje Asignado</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>

                    <h5>Selecciona los estudios de imagenologia para el caso</h5>
                    <div class="card flex justify-content-center">
                        <SelectButton v-model="imagen" :options="imagenesDisponibles" optionLabel="name" multiple
                            aria-labelledby="multiple" />
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
                                <Textarea v-model="interpretacionSubespecialidad" autoResize rows="3" cols="30" />
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
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
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
                        <SelectButton v-model="medicamentos" :options="medicamentosDisponibles" optionLabel="name"
                            multiple aria-labelledby="multiple" />
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
                                <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos" optionLabel="name"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos" optionLabel="name"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos" optionLabel="name"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
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
                        <SelectButton v-model="medicamentos" :options="medicamentosDisponibles" optionLabel="name"
                            multiple aria-labelledby="multiple" />
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
                                <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos" optionLabel="name"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos" optionLabel="name"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
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
                                <Dropdown v-model="puntajeMedicamentos" :options="scoreMedicamentos" optionLabel="name"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
                                <label for="puntajeMedicamentos">Puntaje Asignado</label>
                            </FloatLabel>
                        </div>
                        <div class="col md:col-1"></div>
                    </div>

                    <div class="flex py-4 gap-2">
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
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
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback" />
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
                                <Dropdown v-model="puntajeTraspasoUCI" :options="scoreTraspasoUCI" optionLabel="name"
                                    placeholder="Elige una opción" checkmark :highlightOnSelect="false"
                                    class="w-full md:w-14rem" />
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
                        <SelectButton v-model="diagnosticoFinal" :options="diagnosticosDiferenciales" optionLabel="name"
                            aria-labelledby="basic" />
                    </div>
                    <div class="grid">
                        <div class="col-12">
                            <h5>Cardiovascular</h5>
                        </div>
                    </div>
                    <div class="card flex justify-content-center">
                        <SelectButton v-model="diagnosticoFinal" :options="diagnosticosDiferenciales" optionLabel="name"
                            aria-labelledby="basic" />
                    </div>


                    <div class="flex py-4 gap-2">
                        <Button label="Atras" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                        <Button label="Crear" severity="primary" icon="pi pi-check" @click="prevCallback" />
                    </div>
                </template>
            </StepperPanel>
        </Stepper>
    </div>
</template>