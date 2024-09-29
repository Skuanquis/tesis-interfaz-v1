<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getListaPacientes, obtenerCategoriasSimulacionConsultaExterna, getPacientesFiltrados } from '@/services/pacienteService';
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
        console.log(pacientes.value)
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la informacion del paciente.', life: 3000 });
    }
}

const fetchCategorias = async () => {
    try {
        const response = await obtenerCategoriasSimulacionConsultaExterna();
        categorias.value = [{ name: 'Todos', code: 'T' }, ...response.data.map(categoria => ({
            name: categoria.nombre,
            code: categoria.id_categoria_simulacion
        }))];
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías', life: 3000 });
    }
}
const iniciar = (id_paciente, id_historia_clinica) => {
    localStorage.setItem('id_paciente', JSON.stringify(id_paciente));
    localStorage.setItem('id_historia_clinica', JSON.stringify(id_historia_clinica));
    iniciarSimulacion(id_paciente);
    router.replace('/app');
    start()
}

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

const selectedDificultad = ref({ name: 'Todos', code: 'T' });
const dificultad = ref([
    { name: 'Principiante', code: 'Principiante' },
    { name: 'Intermedio', code: 'Intermedio' },
    { name: 'Avanzado', code: 'Avanzado' },
    { name: 'Todos', code: 'T' }
]);
const selectedCategoria = ref({ name: 'Todos', code: 'T' });
const categorias = ref([]);

const clearFilters = () => {
    selectedDificultad.value = { name: 'Todos', code: 'T' };
    selectedCategoria.value = { name: 'Todos', code: 'T' };
    fetchPacientes();
};

const filterPacientes = async () => {
    try {
        const categoriaId = selectedCategoria.value ? selectedCategoria.value.code : 'T';
        const dificultad = selectedDificultad.value ? selectedDificultad.value.name : 'T';
        if (categoriaId === 'T' && dificultad === 'T') {
            await fetchPacientes();
        } else {
            const response = await getPacientesFiltrados(categoriaId, dificultad);
            pacientes.value = response.data;
            console.log(pacientes.value)
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al filtrar los pacientes.', life: 3000 });
    }
};
onMounted(() => {
    fetchPacientes();
    fetchCategorias();
})

</script>
<template>
    <div class="grid pt-4">
        <div class="col md:col-3"></div>
        <div class="col md:col-6">
            <Card>
                <template #content>
                    <div class="grid p-fluid">
                        <div class="col md:col-4">
                            <Dropdown v-model="selectedDificultad" :options="dificultad" optionLabel="name"
                                placeholder="Elige la dificultad" checkmark :highlightOnSelect="false" class="w-full" />
                        </div>
                        <div class="col md:col-4">
                            <Dropdown v-model="selectedCategoria" :options="categorias" optionLabel="name"
                                placeholder="Elige la categoria" checkmark :highlightOnSelect="false" class="w-full" />
                        </div>
                        <div class="col md:col-2">
                            <Button label="Filtrar" severity="success" icon="pi pi-filter" iconPos="left"
                                :disabled="!selectedDificultad || !selectedCategoria" @click="filterPacientes" />
                        </div>
                        <div class="col md:col-2">
                            <Button label="Limpiar" severity="info" icon="pi pi-filter-slash" iconPos="left"
                                @click="clearFilters" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <div class="col md:col-3"></div>
    <div class="grid">
        <div class="col md:col-3"></div>
        <div class="col md:col-6">
            <div v-for="(paciente, index) in pacientes" :key="index" class="pt-4">
                <Card>
                    <template #title>Caso N° {{ paciente.id_caso_clinico }}</template>
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
                        <div class="grid">
                            <div class="col md:col-4 text-lg"><strong>Autor: </strong>{{ paciente.autor }}</div>
                            <div class="col md:col-4">
                            </div>
                            <div class="col md:col-4">
                            </div>
                        </div>
                        <p class="m-0 text-justify text-lg">
                            {{ paciente.descripcion }}.
                        </p>
                        <br>
                        <div class="grid p-fluid">
                            <div class="col md:col-4"><strong>Dificultad: </strong>
                                <Tag :value="paciente.difucultad"
                                    :severity="getDificultadSeverity(paciente.difucultad)" />
                            </div>
                            <div class="col md:col-4"><strong>Categoria: </strong>
                                <Tag :value="paciente.categoria" severity="info"></Tag>
                            </div>
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