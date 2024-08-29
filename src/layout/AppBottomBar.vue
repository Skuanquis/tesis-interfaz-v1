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

            accept: () => {
                stop();
                //store.dispatch('navigation/confirmNavigation');
                router.push('/app/resultados');
                toast.add({ severity: 'info', summary: 'Confirmaste', detail: 'Terminaste la simulación', life: 3000 });
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
