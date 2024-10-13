<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { obtenerGrupos, crearGrupo, actualizarGrupo, eliminarGrupo, obtenerEstudiantesPorGrupo, desvincularEstudiante } from '@/services/grupoService';
import { jwtDecode } from "jwt-decode";

const confirm = useConfirm();
const toast = useToast();

const dialogoEditarGrupo = ref(false);
const dialogoCrearGrupo = ref(false);
const dialogoVerGrupo = ref(false);
const grupos = ref([]);
const grupoSeleccionado = reactive({});
const nuevoGrupo = reactive({
    nombre: '',
    descripcion: '',
    codigo_acceso: ''
});
const estudiantes = ref([]);

const cargarGrupos = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el token de autenticación', life: 3000 });
            return;
        }
        const decodedToken = jwtDecode(token);
        const id_usuario_medico = decodedToken.id;
        const rol = decodedToken.role;

        if (!id_usuario_medico || rol === undefined) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener la información del usuario del token', life: 3000 });
            return;
        }

        const response = await obtenerGrupos(id_usuario_medico, rol);
        grupos.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los grupos', life: 3000 });
    }
};



const crearNuevoGrupo = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se encontró el token de autenticación', life: 3000 });
            return;
        }
        const decodedToken = jwtDecode(token);
        const id_usuario_medico = decodedToken.id;
        if (!id_usuario_medico) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el id de usuario del token', life: 3000 });
            return;
        }
        nuevoGrupo.id_usuario_medico = id_usuario_medico;
        await crearGrupo(nuevoGrupo);

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo creado exitosamente', life: 3000 });
        dialogoCrearGrupo.value = false;
        cargarGrupos();
        resetearNuevoGrupo();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el grupo', life: 3000 });
    }
};


const resetearNuevoGrupo = () => {
    nuevoGrupo.nombre = '';
    nuevoGrupo.descripcion = '';
    nuevoGrupo.codigo_acceso = '';
};

const editarGrupo = async () => {
    try {
        await actualizarGrupo(grupoSeleccionado.id_grupo, grupoSeleccionado);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Grupo actualizado exitosamente', life: 3000 });
        dialogoEditarGrupo.value = false;
        cargarGrupos();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el grupo', life: 3000 });
    }
};

const eliminarGrupoConfirmado = (id_grupo) => {
    confirm.require({
        message: '¿Estás seguro que quieres eliminar el grupo?',
        header: 'Atención',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Eliminar',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await eliminarGrupo(id_grupo);
                toast.add({ severity: 'info', summary: 'Confirmado', detail: 'Grupo eliminado', life: 3000 });
                cargarGrupos();
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el grupo', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelado', detail: 'Acción cancelada', life: 3000 });
        }
    });
};


const verEstudiantesDelGrupo = async (id_grupo) => {
    try {
        grupoSeleccionado.id_grupo = id_grupo;
        const response = await obtenerEstudiantesPorGrupo(id_grupo);
        estudiantes.value = response.data;
        dialogoVerGrupo.value = true;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los estudiantes del grupo', life: 3000 });
    }
};

const formatearFecha = (fecha) => {
    console.log("Fecha recibida:", fecha);
    const fechaObj = new Date(fecha);
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    const año = String(fechaObj.getFullYear()).slice(-2);
    const horas = String(fechaObj.getHours()).padStart(2, '0');
    const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
    const segundos = String(fechaObj.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
};

// Función para confirmar la desmatriculación
const confirmarDesmatricular = (id_usuario_estudiante) => {
    console.log('Confirmar desmatriculación para estudiante ID:', id_usuario_estudiante);
    confirm.require({
        message: '¿Estás seguro que quieres desmatricular a este estudiante?',
        header: 'Confirmar Desmatriculación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptClass: 'p-button-danger',
        rejectClass: 'p-button-secondary',
        accept: () => {
            desmatricularEstudiante(grupoSeleccionado.id_grupo, id_usuario_estudiante);
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Acción cancelada', life: 3000 });
        }
    });
};

const desmatricularEstudiante = async (id_grupo, id_usuario_estudiante) => {
    console.log('Desmatricular estudiante:', id_grupo, id_usuario_estudiante);
    try {
        await desvincularEstudiante(id_grupo, id_usuario_estudiante);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estudiante desmatriculado exitosamente', life: 3000 });
        // Actualizar la lista de estudiantes
        verEstudiantesDelGrupo(id_grupo);
    } catch (error) {
        console.error('Error al desmatricular al estudiante:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Error al desmatricular al estudiante',
            life: 3000
        });
    }
};

onMounted(() => {
    cargarGrupos();
});
</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <div class="grid">
        <div v-for="grupo in grupos" :key="grupo.id_grupo" class="col md:col-4">
            <Card style="height: 20rem">
                <template #title>
                    <h5 class="text-xl">{{ grupo.nombre }}</h5>
                </template>
                <template #content>
                    <h6 class="text-base capitalize"><strong>Docente: </strong>{{ (grupo.nombre_usuario + " " +
                        grupo.paterno_usuario
                        + " " +
                        grupo.materno_usuario) || "" }}</h6>
                    <p class="m-0 text-lg">{{ grupo.descripcion }}</p>
                </template>
                <template #footer>
                    <div class="flex gap-3 mt-1">
                        <Button icon="pi pi-trash" label="Eliminar" severity="danger" raised class="w-full"
                            @click="eliminarGrupoConfirmado(grupo.id_grupo)" />
                        <Button icon="pi pi-pencil" label="Editar" severity="warning" class="w-full"
                            @click="(dialogoEditarGrupo = true, grupoSeleccionado.nombre = grupo.nombre, grupoSeleccionado.descripcion = grupo.descripcion, grupoSeleccionado.codigo_acceso = grupo.codigo_acceso, grupoSeleccionado.id_grupo = grupo.id_grupo)" />
                    </div>
                    <div class="flex gap-3 mt-1 pt-2">
                        <Button icon="pi pi-eye" label="Ver" severity="info" class="w-full"
                            @click="verEstudiantesDelGrupo(grupo.id_grupo)" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <div class="grid pt-2">
        <div class="col md:col-4"></div>
        <div class="col md:col-4">
            <Button icon="pi pi-plus" label="Crear Grupo" severity="success" class="w-full"
                @click="dialogoCrearGrupo = true" />
        </div>
        <div class="col md:col-4"></div>
    </div>

    <Dialog v-model:visible="dialogoEditarGrupo" modal header="Editar Grupo" :style="{ width: '25rem' }">
        <div class="flex align-items-center gap-3 mb-3">
            <label for="nombre" class="font-semibold w-6rem">Nombre del grupo</label>
            <InputText id="nombre" v-model="grupoSeleccionado.nombre" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
            <label for="descripcion" class="font-semibold w-6rem">Descripción</label>
            <Textarea id="descripcion" v-model="grupoSeleccionado.descripcion" autoResize rows="3" cols="35"
                class="flex-auto" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
            <label for="codigo_acceso" class="font-semibold w-6rem">Código de acceso</label>
            <InputText id="codigo_acceso" v-model="grupoSeleccionado.codigo_acceso" class="flex-auto"
                autocomplete="off" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button icon="pi pi-times" type="button" label="Cancelar" severity="secondary"
                @click="dialogoEditarGrupo = false"></Button>
            <Button icon="pi pi-check" type="button" label="Guardar" @click="editarGrupo"></Button>
        </div>
    </Dialog>

    <Dialog v-model:visible="dialogoCrearGrupo" modal header="Crear Grupo" :style="{ width: '25rem' }">
        <div class="flex align-items-center gap-3 mb-3">
            <label for="nombre" class="font-semibold w-6rem">Nombre del grupo</label>
            <InputText id="nombre" v-model="nuevoGrupo.nombre" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex align-items-center gap-3 mb-5">
            <label for="descripcion" class="font-semibold w-6rem">Descripción</label>
            <Textarea id="descripcion" v-model="nuevoGrupo.descripcion" autoResize rows="3" cols="35"
                class="flex-auto" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
            <label for="codigo_acceso" class="font-semibold w-6rem">Código de acceso</label>
            <InputText id="codigo_acceso" v-model="nuevoGrupo.codigo_acceso" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button icon="pi pi-times" type="button" label="Cancelar" severity="secondary"
                @click="dialogoCrearGrupo = false"></Button>
            <Button icon="pi pi-check" type="button" label="Crear" @click="crearNuevoGrupo"></Button>
        </div>
    </Dialog>

    <Dialog v-model:visible="dialogoVerGrupo" maximizable modal header="Información del grupo"
        :style="{ width: '80rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <DataTable :value="estudiantes" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <Column field="nom" header="Nombre" style="width: 20%"></Column>
            <Column field="apellido_paterno" header="Apellido Paterno" style="width: 20%"></Column>
            <Column field="apellido_materno" header="Apellido Materno" style="width: 20%"></Column>
            <Column header="Fecha de Matriculación" style="width: 20%">
                <template #body="data">
                    {{ formatearFecha(data.data.fecha_matriculacion) }}
                </template>
            </Column>
            <Column header="Acción" style="width: 20%">
                <template #body="data">
                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger"
                        @click="confirmarDesmatricular(data.data.id_usuario)" tooltip="Desmatricular"
                        tooltipOptions="{ position: 'top' }" />
                </template>
            </Column>
        </DataTable>
        <div class="flex justify-content-end gap-2">
            <Button icon="pi pi-times" type="button" label="Cerrar" severity="secondary"
                @click="dialogoVerGrupo = false"></Button>
        </div>
    </Dialog>
</template>
