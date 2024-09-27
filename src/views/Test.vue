<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import {
    obtenerCasosClinicos,
    cambiarEstadoCaso,
    obtenerCasoClinicoPorId,
    obtenerPaciente,

} from '../services/casoService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const casosClinicos = ref([]);
const visible = ref(false);
const casoSeleccionado = ref(null);
const paciente = ref({});



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
                <Stepper linear orientation="vertical">
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
                    <Button label="Guardar" @click="guardarSubespecialidades" severity="success" icon="pi pi-save" />
                    <Button type=" button" label="Guardar" @click="visible = false"></Button>
                </div>
            </div>
        </Dialog>
    </div>
</template>