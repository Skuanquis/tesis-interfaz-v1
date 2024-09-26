<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import {
    obtenerCasosClinicos, cambiarEstadoCaso,
    obtenerCasoClinicoPorId, obtenerPaciente,
    obtenerPuntaje,

} from '../services/casoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const casosClinicos = ref([]);
const visible = ref(false);
const casoSeleccionado = ref(null);

const paciente = ref({});
const scoreSignosVitales = ref([]);

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


const mostrarDetalleCaso = async (idCaso) => {
    try {
        const response = await obtenerCasoClinicoPorId(idCaso);
        casoSeleccionado.value = response.data;

        await cargarDatosPaciente(casoSeleccionado.value.id_historia_clinica);
        await cargarPuntajeSignosVitales(casoSeleccionado.value.id_historia_clinica);
        visible.value = true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el caso clínico', life: 3000 });
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
                </Stepper>
                <div class="flex justify-content-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click=cerrarDialogo></Button>
                    <Button type=" button" label="Guardar" @click="visible = false"></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>