<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { getUsuarios, getUserById, updateUsuario } from '@/services/userService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const usuarios = ref([]);
const loading1 = ref(false);

const usuario = ref({
    id_usuario: null,
    nombre: '',
    paterno: '',
    materno: '',
    fecha_nacimiento: null,
    username: '',
    password: '',
    estado: '',
    rol: ''
});

const roles = ref([
    { name: 'medico', code: '2' },
    { name: 'estudiante', code: '3' }
]);


const estados = ref([
    { name: 'Activo', code: 'activo' },
    { name: 'Inactivo', code: 'inactivo' }
]);

const loadUsuarios = async () => {
    loading1.value = true;
    try {
        const response = await getUsuarios();
        usuarios.value = response.data;
    } catch (error) {
        console.error('Error fetching pasantes:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los usuarios', life: 3000 });
    } finally {
        loading1.value = false;
    }
};

const nuevaPassword = ref('');
const editarUsuario = ref(false);
const submitted = ref(false);

const hideDialog = () => {
    editarUsuario.value = false;
    submitted.value = false;
    usuario.value = {
        id_usuario: null,
        nombre: '',
        paterno: '',
        fecha_nacimiento: null,
        username: '',
        password: '',
        estado: '',
        rol: ''
    };
    nuevaPassword.value = '';
};

const getSeverity = (status) => {
    switch (status) {
        case 'inactivo':
            return 'danger';
        case 'activo':
            return 'success';
        default:
            return 'info';
    }
};

const infoUsuario = async (infoUsuario) => {

    try {
        const response = await getUserById(infoUsuario.id_usuario);
        const estadoActual = estados.value.find(e => e.name.toLowerCase() === response.data.estado.toLowerCase());
        const rolActual = roles.value.find(r => r.name === response.data.rol);
        usuario.value = {
            ...response.data,
            fecha_nacimiento: new Date(response.data.fecha_nacimiento),
            estado: estadoActual ? estadoActual.code : '',
            rol: rolActual ? rolActual.code : ''
        };
        editarUsuario.value = true;
    } catch (error) {
        console.error('Error fetching pasante:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la información del pasante', life: 3000 });
    }
};

const guardarCambios = async () => {
    submitted.value = true;
    if (!usuario.value.nombre || !usuario.value.paterno || !usuario.value.materno || !usuario.value.fecha_nacimiento) {
        toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos.', life: 3000 });
        return;
    }

    const dataToSend = {
        nombre: usuario.value.nombre,
        paterno: usuario.value.paterno,
        materno: usuario.value.materno,
        fecha_nacimiento: usuario.value.fecha_nacimiento,
        estado: usuario.value.estado,
        id_rol: usuario.value.rol
    };


    if (nuevaPassword.value) {
        dataToSend.password = nuevaPassword.value;
    }
    try {

        await updateUsuario(usuario.value.id_usuario, dataToSend);
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pasante actualizado con éxito', life: 3000 });
        hideDialog();
        loadUsuarios();
    } catch (error) {
        console.error('Error updating usuario:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el usuario', life: 3000 });
    }
};


const filtros = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    paterno: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    materno: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    rol: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    estado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const iniciarFiltros = () => {
    filtros.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        paterno: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        materno: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        rol: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        estado: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    };
};

const limpiarFiltros = () => iniciarFiltros();

const formatDate = (value) => {
    return new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

onMounted(() => {
    loadUsuarios();
});

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Usuarios Registrados</h5>
                <DataTable :value="usuarios" :paginator="true" :rows="10" dataKey="id" :rowHover="true"
                    v-model:filters="filtros" filterDisplay="menu" :loading="loading1" :filters="filtros"
                    :globalFilterFields="['nombre', 'paterno', 'materno', 'estado', 'rol']" showGridlines>
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Limpiar" outlined
                                @click="limpiarFiltros()" />
                            <IconField iconPosition="left">
                                <InputIcon class="pi pi-search" />
                                <InputText v-model="filtros['global'].value" placeholder="Buscar" style="width: 100%" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No se encontraron usuarios. </template>
                    <template #loading> Los datos se están cargando... </template>
                    <Column field="nombre" header="Nombre" style="width: 20%">
                        <template #body="{ data }">
                            {{ data.nombre }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                placeholder="Filtrar por nombre" />
                        </template>
                    </Column>
                    <Column field="paterno" header="Apellido Paterno" style="width: 10%">
                        <template #body="{ data }">
                            {{ data.paterno }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                placeholder="Filtrar por apellido paterno" />
                        </template>
                    </Column>
                    <Column field="materno" header="Apellido Materno" style="width: 10%">
                        <template #body="{ data }">
                            {{ data.materno }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                placeholder="Filtrar por apellido materno" />
                        </template>
                    </Column>
                    <Column field="fecha_nacimiento" header="Fecha de Nacimiento" style="width: 10%">
                        <template #body="{ data }">
                            {{ formatDate(data.fecha_nacimiento) }}
                        </template>
                    </Column>
                    <Column field="rol" header="Rol" style="width: 10%">
                        <template #body="{ data }">
                            {{ data.rol }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter"
                                placeholder="Filtrar por rol" />
                        </template>
                    </Column>
                    <Column field="estado" header="Estado" style="width: 10%" class="text-center">
                        <template #body="{ data }">
                            <Tag :severity="getSeverity(data.estado)">{{ data.estado.toUpperCase() }}</Tag>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" class="p-column-filter"
                                placeholder="Filtrar por estado" />
                        </template>
                    </Column>
                    <Column headerStyle="min-width:8rem; text-align: center;" header="Acciones" style="width: 10%">
                        <template #body="slotProps">
                            <div style="text-align: center;" class="grid">
                                <div class="col md:col-12">
                                    <Button icon="pi pi-pencil" severity="primary" rounded
                                        @click="infoUsuario(slotProps.data)" />
                                </div>
                            </div>

                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="editarUsuario" :style="{ width: '450px' }" header="Modificar Pasante"
                    :modal="true" class="p-fluid">
                    <div v-if="usuario">
                        <div class="field">
                            <h5>Datos del usuario</h5>
                            <div class="p-fluid mt-3 pt-3">
                                <FloatLabel>
                                    <InputText type="text" :id="'inputtext1' + usuario.id_usuario"
                                        v-model="usuario.nombre" />
                                    <label :for="'inputtext1' + usuario.id_usuario">Nombre</label>
                                </FloatLabel>
                                <br>
                                <br>
                                <FloatLabel>
                                    <InputText type="text" id="inputtext" v-model="usuario.paterno" />
                                    <label for="inputtext">Apellido Paterno</label>
                                </FloatLabel>
                                <br>
                                <br>
                                <FloatLabel>
                                    <InputText type="text" id="inputtext" v-model="usuario.materno">
                                    </InputText>
                                    <label for="inputtext">Apellido Materno</label>
                                </FloatLabel>
                                <br>
                                <br>
                                <FloatLabel>
                                    <Calendar inputId="calendar" v-model="usuario.fecha_nacimiento"></Calendar>
                                    <label for="calendar">Fecha de Nacimiento</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div class="field">
                            <h5>Asignar nueva contraseña</h5>
                            <div class="p-fluid mt-3 pt-3">
                                <FloatLabel>
                                    <InputText type="password" id="inputtext2" v-model="nuevaPassword" />
                                    <label for="inputtext2">Nueva Contraseña</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div class="field">
                            <h5>Rol</h5>
                            <div class="p-fluid mt-3 pt-3">
                                <FloatLabel>
                                    <Dropdown v-model="usuario.rol" :options="roles" optionLabel="name"
                                        optionValue="code" />
                                    <label for="dropdown">Rol</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div class="field">
                            <h5>Estado</h5>
                            <div class="p-fluid mt-3 pt-3">
                                <FloatLabel>
                                    <Dropdown id="dropdown" :options="estados" v-model="usuario.estado"
                                        optionLabel="name" optionValue="code" />
                                    <label for="dropdown">Estado</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" text="" @click="guardarCambios" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>