<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.25rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div v-if="isLogin" class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/layout/images/logo.png" alt="Image" height="100" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                    </div>

                    <!-- Login Form -->
                    <div>
                        <label for="username" class="block text-900 text-xl font-medium mb-2">Usuario</label>
                        <InputText id="username" type="text" placeholder="Username" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="username" @keyup.enter="login" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true"
                            :feedback="false" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"
                            @keyup.enter="login">
                        </Password>
                        <Button label="Iniciar Sesión" class="w-full p-3 text-xl" @click="login"></Button>

                        <div class="mt-3 grid">
                            <div class="col md:col-6 pt-4 text-right">
                                <span>¿No tienes una cuenta?</span>
                            </div>
                            <div class="col md:col-6 pt-3 text-left">
                                <Button label="Registrarse" class="p-button-link" @click="switchToRegister"></Button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Registration Form -->
                <div v-else class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Regístrate</div>
                    </div>

                    <div>
                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="nombre">Nombre</label>
                                <InputText id="nombre" v-model="nombre" placeholder="Nombre"
                                    class="p-2 border-1 border-solid surface-border border-round w-full" />
                            </div>
                            <div class="field col">
                                <label for="paterno">Apellido Paterno</label>
                                <InputText id="paterno" v-model="paterno" placeholder="Apellido Paterno"
                                    class="p-2 border-1 border-solid surface-border border-round w-full" />
                            </div>
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="materno">Apellido Materno</label>
                                <InputText id="materno" v-model="materno" placeholder="Apellido Materno"
                                    class="p-2 border-1 border-solid surface-border border-round w-full" />
                            </div>
                            <div class="field col">
                                <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                                <Calendar v-model="fecha_nacimiento" dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy"
                                    class="w-full" />
                            </div>
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="username">Nombre de Usuario</label>
                                <InputText id="username" v-model="username" placeholder="Nombre de Usuario"
                                    class="p-2 border-1 border-solid surface-border border-round w-full" />
                            </div>
                            <div class="field col">

                            </div>
                        </div>

                        <div class="formgrid grid">
                            <div class="field col">
                                <label for="password">Contraseña</label>
                                <Password v-model="password" promptLabel="Escribe la Contraseña" weakLabel="Muy Simple"
                                    mediumLabel="Algo Seguro" strongLabel="Muy Seguro" class="w-full" />
                            </div>
                            <div class="field col">
                                <label for="confirmPassword">Repite la Contraseña</label>
                                <Password v-model="confirmPassword" promptLabel="Repite la Contraseña"
                                    weakLabel="Muy Simple" mediumLabel="Algo Seguro" strongLabel="Muy Seguro"
                                    class="w-full" />
                            </div>
                        </div>

                        <Button label="Registrarse" class="w-full p-3 text-xl" @click="register"></Button>

                        <div class="mt-3 grid">
                            <div class="col md:col-6 pt-4 text-right">
                                <span>¿Ya tienes una cuenta?</span>
                            </div>
                            <div class="col md:col-6 pt-3 text-left">
                                <Button label="Iniciar sesión" class="p-button-link" @click="switchToLogin"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser, createUser } from '@/services/userService';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const nombre = ref('');
const paterno = ref('');
const materno = ref('');
const fecha_nacimiento = ref('');
const isLogin = ref(true);
const router = useRouter();

const login = async () => {
    try {
        if (!username.value || !password.value) {
            alert('Por favor, ingrese su usuario y contraseña.');
            return;
        }

        const response = await loginUser({ username: username.value, password: password.value });
        localStorage.setItem('token', response.data.accessToken);
        router.push('/dashboard');
    } catch (error) {
        alert(`Error: ${error.response.data.error}`);
        username.value = '';
        password.value = '';
    }
};


const switchToRegister = () => {
    isLogin.value = false;
};

const switchToLogin = () => {
    isLogin.value = true;
};

const register = async () => {
    try {
        if (!username.value || !password.value || !confirmPassword.value || !nombre.value || !paterno.value || !materno.value || !fecha_nacimiento.value) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (password.value !== confirmPassword.value) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const userData = {
            username: username.value,
            password: password.value,
            nombre: nombre.value,
            paterno: paterno.value,
            materno: materno.value,
            fecha_nacimiento: fecha_nacimiento.value,
            id_rol: 3  // Esto dependerá del rol que desees asignar por defecto
        };

        // eslint-disable-next-line no-unused-vars
        const response = await createUser(userData);
        alert('Registro exitoso. Inicie sesión.');
        switchToLogin();
    } catch (error) {
        alert(`Error: ${error.response.data.error}`);
    }
};

</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
