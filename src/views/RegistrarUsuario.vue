<script setup>
import { ref } from 'vue';
import { createUser } from '../services/userService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const roles = ref([
    { name: 'Estudiante', code: '3' },
    { name: 'Medico', code: '2' }
])
const nombre = ref('');
const paterno = ref('');
const materno = ref('');
const fecha_nacimiento = ref(null);
const userAsignada = ref('');
const passwordAsignada = ref('');
const rol = ref('');

const resetForm = () => {
    nombre.value = '';
    paterno.value = '';
    materno.value = '';
    fecha_nacimiento.value = null;
    userAsignada.value = '';
    passwordAsignada.value = '';
    rol.value = null;
}

const validateForm = () => {
    if (!nombre.value || !nombre.value || !paterno.value || !materno.value || !userAsignada.value || !passwordAsignada.value) {
        toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son obligatorios', life: 3000 });
        return false;
    }
    return true;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        const userData = {
            username: userAsignada.value,
            password: passwordAsignada.value,
            paterno: paterno.value,
            materno: materno.value,
            nombre: nombre.value,
            fecha_nacimiento: fecha_nacimiento.value,
            id_rol: rol.value.code
        };
        const response = await createUser(userData);
        toast.add({ severity: 'success', summary: 'Éxito', detail: response.data.message, life: 3000 });
        resetForm();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar usuario', life: 3000 });
    }
};

</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 md:col-6">
            <div class="card">
                <h5>Nombre</h5>
                <div class="grid formgrid">
                    <div class="col-12 mb-2 ">
                        <InputText type="text" v-model="nombre" placeholder="Nombre" :disabled="false">
                        </InputText>
                    </div>
                </div>
                <div class="grid p-flujid">
                    <div class="col-6">
                        <h5>Paterno</h5>
                        <InputText v-model="paterno" placeholder="Apellido Paterno"></InputText>
                    </div>
                    <div class="col-6">
                        <h5>Materno</h5>
                        <InputText v-model="materno" placeholder="Apellido Materno"></InputText>
                    </div>
                </div>
                <div class="grid p-flujid">
                    <div class="col-6">
                        <h5>Fecha de nacimiento</h5>
                        <Calendar inputId="calendar" v-model="fecha_nacimiento" dateFormat="dd/mm/yy"></Calendar>
                    </div>
                    <div class="col-6">
                        <h5>Rol</h5>
                        <Dropdown id="dropdown" :options="roles" v-model="rol" optionLabel="name"></Dropdown>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="card">
                <h5>Nombre de Usuario</h5>
                <div class="grid formgrid">
                    <div class="col-12 mb-2">
                        <InputText type="text" placeholder="Asignar Usuario" v-model="userAsignada"></InputText>
                    </div>
                </div>
                <h5>Constraseña</h5>
                <div class="grid formgrid">
                    <div class="col-12 mb-2">
                        <InputText type="text" placeholder="Asignar Contraseña" v-model="passwordAsignada"></InputText>
                    </div>
                </div>
                <h5></h5>
                <Button label="Registrar" class="mr-2 mb-2" @click="handleSubmit"></Button>
            </div>
        </div>
    </div>
</template>
