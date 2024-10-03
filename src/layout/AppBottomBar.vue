<template>
    <Dock :model="itemsBot" position="bottom">
        <template #icon="{ item }">
            <div class="flex flex-col items-center justify-center relative overflow-hidden cursor-pointer w-16 h-16"
                @click="onDockItemClick(item)" @keydown.enter="onDockItemClick(item)">
                <img :alt="item.label" :src="item.icon" style="width: 100%" />
            </div>
        </template>
    </Dock>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import Dock from 'primevue/dock';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useStore } from 'vuex';
import { finalizarSimulacion } from '@/services/simulacionService';

const confirm = useConfirm();
const toast = useToast();
const store = useStore();
const router = useRouter();
const isActive = computed(() => store.state.timer.isActive);

function stop() {
    if (isActive.value) {
        store.dispatch('timer/stopTimer');
        store.dispatch('timer/resetTimer');
    }
}

const itemsBot = ref([
    {
        label: 'LOGS',
        icon: '/layout/images/logs.png',
        routeName: 'logs'
    },
    {
        label: 'SALIR',
        icon: '/layout/images/salir.png',
        routeName: 'salir'
    },
    {
        label: 'AYUDA',
        icon: '/layout/images/ayuda.png',
        routeName: 'ayuda'
    }
]);

function onDockItemClick(item) {
    if (item.routeName === 'salir') {
        confirm.require({
            header: 'Confirmación',
            message: '¿Estás seguro de que deseas salir de la simulación? tu reporte estara disponible mas adelante. ',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Si',
            acceptIcon: 'pi pi-check',
            rejectLabel: 'No',
            rejectIcon: 'pi pi-times',

            accept: async () => {

                const id_simulacion = localStorage.getItem('id_simulacion');
                const minutos = localStorage.getItem('minutos');
                const segundos = localStorage.getItem('segundos');
                const tiempo_empleado = `${minutos.padStart(2, '0')}:${segundos.padStart(2, '0')}`;
                console.log(tiempo_empleado)
                try {
                    await finalizarSimulacion(id_simulacion, tiempo_empleado);
                    toast.add({ severity: 'info', summary: 'Simulación Finalizada', detail: 'Has finalizado la simulación', life: 3000 });
                    router.push('/app/resultados');
                } catch (error) {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al finalizar la simulación', life: 3000 });
                }
                stop();
                store.dispatch('examenes/limpiarExamenes');
                store.dispatch('anamnesis/limpiarAnamnesis');
                store.dispatch('diferencial/limpiarDiferencial');
                store.dispatch('imagenologia/limpiarImagenologia');
                store.dispatch('laboratorios/limpiarLaboratorios');
                store.dispatch('medicamentos/limpiarMedicamentos');
                store.dispatch('diferencial/limpiarDiferencial');
                store.dispatch('subespecialidades/limpiarSubespecialidades');
            },
            reject: () => {
                toast.add({ severity: 'warn', summary: 'Cancelado', detail: 'Has cancelado la acción', life: 3000 });
            }
        });
    } else if (item.routeName) {
        router.push({ name: item.routeName });
    }
}
</script>
