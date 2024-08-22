<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getListaPacientes } from '@/services/pacienteService';
import { useRouter } from 'vue-router';

const pacientes = ref([]);
const toast = useToast();
const router = useRouter();

const fetchPacientes = async () => {
    try {
        const response = await getListaPacientes();
        pacientes.value = response.data;
    } catch (error) {
        toast.error('Error al cargar operadores');
    }
}

const iniciar = (id_paciente, id_historia_clinica) => {
    localStorage.setItem('id_paciente', JSON.stringify(id_paciente));
    localStorage.setItem('id_historia_clinica', JSON.stringify(id_historia_clinica));
    router.replace('/app');
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
                            <div class="col md:col-4"><strong>Paterno: </strong>{{ paciente.paterno.toUpperCase() }}
                            </div>
                            <div class="col md:col-4"><strong>Materno: </strong>{{ paciente.materno.toUpperCase() }}
                            </div>
                            <div class="col md:col-4"><strong>Nombre: </strong>{{ paciente.nombre.toUpperCase() }}
                            </div>
                        </div>
                        <div class="grid">
                            <div class="col md:col-4"><strong>Edad: </strong>{{ paciente.edad }} años</div>
                            <div class="col md:col-4"><strong>CI: </strong>{{ paciente.ci }}</div>
                        </div>
                        <p class="m-0">
                            {{ paciente.descripcion }}
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