<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getListaPacientes } from '@/services/pacienteService';
import { comenzarSimulacion } from '@/services/simulacionService';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const isActive = computed(() => store.state.timer.isActive);
const store = useStore();

const pacientes = ref([]);
const toast = useToast();
const router = useRouter();

async function iniciarSimulacion(id_paciente) {
    try {
        const simulacionData = {
            id_paciente: id_paciente,
            estado: 'activo'
        };
        const response = await comenzarSimulacion(simulacionData);
        const id_simulacion = response.data.id_simulacion;
        localStorage.setItem('id_simulacion', id_simulacion);
        toast.add({ severity: 'success', summary: 'Concentrate!', detail: 'Comenzaste la simulación', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al iniciar la simulación', life: 3000 });
    }
}



function start() {
    if (!isActive.value) {
        store.dispatch('timer/startTimer');
    }
}

const fetchPacientes = async () => {
    try {
        const response = await getListaPacientes();
        pacientes.value = response.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la informacion del paciente.', life: 3000 });
    }
}

const iniciar = (id_paciente, id_historia_clinica) => {
    localStorage.setItem('id_paciente', JSON.stringify(id_paciente));
    localStorage.setItem('id_historia_clinica', JSON.stringify(id_historia_clinica));
    iniciarSimulacion(id_paciente);
    router.replace('/app');
    start()
}

onMounted(() => {
    fetchPacientes();
})

</script>
<template>
    <div class="grid">
        <div class="col md:col-3"></div>
        <div class="col md:col-6 pt-3">
            <div v-for="(paciente, index) in pacientes" :key="index" class="pt-4">
                <Card>
                    <template #title>Caso N° {{ index + 1 }}</template>
                    <template #content>
                        <div class="grid">
                            <div class="col md:col-4 text-lg"><strong>Paterno: </strong>{{
                                paciente.paterno.toUpperCase() }}
                            </div>
                            <div class="col md:col-4 text-lg"><strong>Materno: </strong>{{
                                paciente.materno.toUpperCase() }}
                            </div>
                            <div class="col md:col-4 text-lg"><strong>Nombre: </strong>{{ paciente.nombre.toUpperCase()
                                }}
                            </div>
                        </div>
                        <div class="grid">
                            <div class="col md:col-4 text-lg"><strong>Edad: </strong>{{ paciente.edad }} años</div>
                            <div class="col md:col-4 text-lg"><strong>Peso: </strong>{{ paciente.peso }} Kg.</div>
                            <div class="col md:col-4 text-lg"><strong>Talla: </strong>{{ paciente.talla }} m.</div>
                        </div>
                        <p class="m-0 text-justify text-lg">
                            {{ paciente.descripcion }}.
                        </p>
                        <br>
                        <div class="grid text-right">
                            <div class="col md:col-4"></div>
                            <div class="col md:col-4"></div>
                            <div class="col md:col-4"><Button label="Elegir Caso"
                                    @click="iniciar(paciente.id_paciente, paciente.id_historia_clinica)" /></div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <div class="col md:col-3"></div>
    </div>

</template>