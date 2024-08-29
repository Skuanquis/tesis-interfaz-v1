<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfo, updateUserProfile, updateUserPassword } from '@/services/userService';
import { useToast } from 'primevue/usetoast';
//import { useStore } from 'vuex';

const nombre = ref('');
const paterno = ref('');
const materno = ref('');
const fecha_nacimiento = ref('');
const toast = useToast();
const router = useRouter();
const passwordAnterior = ref('');
const nuevaPassword = ref('');
const repetirNuevaPassword = ref('');

const loadUserInfo = async () => {
    try {
        const response = await getUserInfo();
        const user = response.data;
        nombre.value = user.nombre.toUpperCase();
        paterno.value = user.paterno.toUpperCase();
        materno.value = user.materno.toUpperCase();
        fecha_nacimiento.value = new Date(user.fecha_nacimiento);
    } catch (error) {
        console.error('Error fetching user info:', error);
        localStorage.removeItem('token');
        router.push('/');
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la informacion del usuario.', life: 3000 });
    }
}

const actualizarInformacion = async () => {
    try {
        await updateUserProfile({
            nombre: nombre.value.toLowerCase(),
            paterno: paterno.value.toLocaleLowerCase(),
            materno: materno.value.toLowerCase(),
            fecha_nacimiento: fecha_nacimiento.value
        })
        toast.add({ severity: 'success', summary: 'Éxito', detail: "Información personal actualizada correctamente", life: 3000 });
    } catch (error) {
        console.error('Error updating profile:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la información', life: 3000 });
    }
}

const actualizarContrasena = async () => {
    if (nuevaPassword.value !== repetirNuevaPassword.value) {
        toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Las nuevas contraseñas no coinciden', life: 3000 });
        return;
    }

    try {
        await updateUserPassword({
            passwordAnterior: passwordAnterior.value,
            nuevaPassword: nuevaPassword.value,
        });
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada con éxito', life: 3000 });
        passwordAnterior.value = '';
        nuevaPassword.value = '';
        repetirNuevaPassword.value = '';
    } catch (error) {
        console.error('Error updating password:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la contraseña', life: 3000 });
    }
};

onMounted(() => {
    loadUserInfo();
});

</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 md:col-6">
            <div class="card">
                <h5>Nombre</h5>
                <div class="grid formgrid">
                    <div class="col-12 mb-2 ">
                        <InputText v-model="nombre" placeholder="Tu nombre"></InputText>
                    </div>
                </div>
                <div class="grid p-flujid">
                    <div class="col-6">
                        <h5>Paterno</h5>
                        <InputText v-model="paterno" placeholder="Tu nombre"></InputText>
                    </div>
                    <div class="col-6">
                        <h5>Materno</h5>
                        <InputText v-model="materno" placeholder="Tu nombre"></InputText>
                    </div>
                </div>
                <div class="grid p-flujid">
                    <div class="col-6">
                        <h5>Fecha de nacimiento</h5>
                        <Calendar inputId="calendar" v-model="fecha_nacimiento" dateFormat="dd/mm/yy"></Calendar>
                    </div>
                    <div class="col-6 pt-6">
                        <Button label="Actualizar Información" class="mr-2 mb-2"
                            @click="actualizarInformacion"></Button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-6">
            <div class="card">
                <h5>Anterior Contraseña</h5>
                <div class="grid formgrid">
                    <div class="col-12 mb-2">
                        <InputText type="password" v-model="passwordAnterior" placeholder="Contraseña Anterior">
                        </InputText>
                    </div>
                </div>
                <h5>Nueva Contraseña</h5>
                <div class="grid formgrid">
                    <div class="col-12 mb-2">
                        <Password id="nuevopass" v-model="nuevaPassword" placeholder="Nueva Contraseña"
                            promptLabel="Ingrese su nueva contraseña" weakLabel="Muy Simple" mediumLabel="Algo Seguro"
                            strongLabel="Muy Seguro" :toggleMask="true"></Password>
                    </div>
                </div>
                <h5>Repita la Nueva Contraseña</h5>
                <div class="grid formgrid">
                    <div class="col-12 mb-2">
                        <Password id="repitenuevopass" v-model="repetirNuevaPassword"
                            promptLabel="Repita su nueva contraseña" weakLabel="Muy Simple" mediumLabel="Algo Seguro"
                            strongLabel="Muy Seguro" placeholder="Repita la Nueva Contraseña" :toggleMask="true">
                        </Password>
                    </div>
                </div>
                <br>
                <Button label="Actualizar Contraseña" class="mr-2 mb-2" @click="actualizarContrasena"></Button>
            </div>
        </div>
    </div>
</template>