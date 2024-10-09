<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { matricularEstudiante, desvincularEstudiante, obtenerGruposMatriculados, obtenerGruposNoMatriculados, validarCodigoAcceso } from '@/services/grupoService';
import { jwtDecode } from "jwt-decode";

const confirm = useConfirm();
const toast = useToast();
const dialogoMatriculacion = ref(false);
const codigoAcceso = ref('');
const gruposMatriculados = ref([]);
const gruposNoMatriculados = ref([]);
const idUsuario = ref(null);
const grupoSeleccionado = ref({});

const cargarGrupos = async () => {
    try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);

        idUsuario.value = decodedToken.id;

        const matriculadosResponse = await obtenerGruposMatriculados(idUsuario.value);
        gruposMatriculados.value = matriculadosResponse.data;
        const noMatriculadosResponse = await obtenerGruposNoMatriculados(idUsuario.value);
        gruposNoMatriculados.value = noMatriculadosResponse.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los grupos', life: 3000 });
    }
};


const matricular = async () => {
    try {
        console.log(grupoSeleccionado.value)
        if (!grupoSeleccionado.value.id_grupo) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se seleccionó ningún grupo.', life: 3000 });
            return;
        }

        const response = await validarCodigoAcceso(grupoSeleccionado.value.id_grupo, codigoAcceso.value);
        if (response.status !== 200) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Código de acceso incorrecto', life: 3000 });
            return;
        }

        await matricularEstudiante(grupoSeleccionado.value.id_grupo, idUsuario.value);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Matriculado exitosamente', life: 3000 });
        dialogoMatriculacion.value = false;
        cerrarDialogoMatriculacion();
        cargarGrupos();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Código incorrecto o error al matricular', life: 3000 });
    }
};


const desvincular = async (id_grupo) => {
    confirm.require({
        message: '¿Estás seguro que quieres desvincularte de este grupo?',
        header: 'Atención',
        icon: 'pi pi-info-circle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                await desvincularEstudiante(id_grupo, idUsuario.value);
                toast.add({ severity: 'info', summary: 'Éxito', detail: 'Te has desvinculado del grupo', life: 3000 });
                cerrarDialogoMatriculacion();
                cargarGrupos();
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al desvincular', life: 3000 });
            }
        },
        reject: () => {
            toast.add({ severity: 'warn', summary: 'Cancelado', detail: 'Acción cancelada', life: 3000 });
        }
    });
};

const cerrarDialogoMatriculacion = () => {
    codigoAcceso.value = '';
    grupoSeleccionado.value = {};
    dialogoMatriculacion.value = false;
};

onMounted(() => {
    cargarGrupos();
});
</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <div>
        <h5>Mis Grupos</h5>
        <p class="text-lg" v-if="gruposMatriculados.length === 0">Aun no estás matriculado en ningún grupo.</p>
        <div v-else>
            <div class="grid">
                <div v-for="grupo in gruposMatriculados" :key="grupo.id_grupo" class="col md:col-4">
                    <Card style="height: 20rem">
                        <template #title>{{ grupo.nombre }}</template>
                        <template #content>
                            <h6 class="text-base capitalize"><strong>Docente: </strong>{{ (grupo.nombre_usuario + " " +
                                grupo.paterno_usuario
                                + " " +
                                grupo.materno_usuario) || "" }}</h6>
                            <p class="m-0 text-lg">{{ grupo.descripcion }}</p>
                        </template>
                        <template #footer>
                            <Button icon="pi pi-times" label="Desvincular" severity="danger" class="w-full"
                                @click="desvincular(grupo.id_grupo)" />
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </div>

    <div class="pt-3">
        <h5>Todos los grupos</h5>
        <div class="grid">
            <div v-for="grupo in gruposNoMatriculados" :key="grupo.id_grupo" class="col md:col-4">
                <Card style="height: 20rem">
                    <template #title>{{ grupo.nombre }}</template>
                    <template #content>
                        <h6 class="text-base capitalize"><strong>Docente: </strong>{{ (grupo.nombre_usuario + " " +
                            grupo.paterno_usuario
                            + " " +
                            grupo.materno_usuario) || "" }}</h6>
                        <p class="m-0 text-lg">{{ grupo.descripcion }}</p>
                    </template>
                    <template #footer>
                        <Button icon="pi pi-plus" label="Matricularme" severity="success" class="w-full"
                            @click="(dialogoMatriculacion = true, grupoSeleccionado.id_grupo = grupo.id_grupo)" />

                    </template>
                </Card>
            </div>
        </div>
    </div>

    <!-- Dialogo de matriculación -->
    <Dialog v-model:visible="dialogoMatriculacion" modal header="Matriculación" :style="{ width: '25rem' }">
        <div class="flex align-items-center gap-3 mb-3">
            <label for="codigo" class="font-semibold w-6rem">Código</label>
            <Password id="codigo" v-model="codigoAcceso" toggleMask :feedback="false" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button icon="pi pi-times" type="button" label="Cancelar" severity="secondary"
                @click="cerrarDialogoMatriculacion"></Button>
            <Button icon="pi pi-check" type="button" label="Matricular" @click="matricular"></Button>
        </div>
    </Dialog>
</template>
