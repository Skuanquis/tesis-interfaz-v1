<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onBeforeUnmount, nextTick, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const display = ref(true);
const router = useRouter();
const position = ref('left');
const loading = ref(false);

const store = useStore();

const dataFetched = computed(() => store.getters['signosVitales/dataFetched']);
const signosVitalesData = computed(() => store.getters['signosVitales/signosVitalesData']);
const heartRateData = computed(() => store.getters['signosVitales/heartRateData']);
const saturationData = computed(() => store.getters['signosVitales/saturationData']);
const systolicData = computed(() => store.getters['signosVitales/systolicData']);
const diastolicData = computed(() => store.getters['signosVitales/diastolicData']);
const temperatureData = computed(() => store.getters['signosVitales/temperatureData']);

let charts = {};

const heartCanvasRef = ref(null);
const saturationCanvasRef = ref(null);
const pressureCanvasRef = ref(null);
const temperatureCanvasRef = ref(null);

function closeDialog() {
    display.value = false;
    router.push('/app');
}

function onDialogHide() {
    if (!display.value) {
        router.push('/app');
    }
}

async function fetchSignosVitales() {
    loading.value = true;
    await store.dispatch('signosVitales/fetchSignosVitales');
    loading.value = false;

    await nextTick();
    initCharts();
}

onMounted(async () => {
    if (dataFetched.value) {
        await nextTick();
        initCharts();
    }
});

function initCharts() {
    if (heartCanvasRef.value) {
        const ctxHeart = heartCanvasRef.value.getContext('2d');
        charts.heartRateChart = new Chart(ctxHeart, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Frecuencia Cardiaca (BPM)',
                    data: heartRateData.value.slice(),
                    borderColor: 'rgb(255, 0, 0)',
                    tension: 0.1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Tiempo (s)' },
                        ticks: {
                            callback: function (value) {
                                return value.toFixed(1) + 's';
                            }
                        }
                    },
                    y: {
                        title: { display: true, text: 'BPM' },
                        min: 50,
                        max: 150
                    }
                }
            }
        });

        watch(heartRateData, (newData) => {
            if (charts.heartRateChart) {
                charts.heartRateChart.data.datasets[0].data = newData.slice();
                charts.heartRateChart.update('none');
            }
        }, { deep: true });
    } else {
        console.error("El heartCanvasRef no está disponible.");
    }

    if (saturationCanvasRef.value) {
        const ctxSaturation = saturationCanvasRef.value.getContext('2d');
        charts.saturationChart = new Chart(ctxSaturation, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Saturación (%)',
                    data: saturationData.value.slice(),
                    borderColor: 'rgb(0, 0, 255)',
                    tension: 0.1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Tiempo (s)' },
                        ticks: {
                            callback: function (value) {
                                return value.toFixed(1) + 's';
                            }
                        }
                    },
                    y: {
                        title: { display: true, text: '%' },
                        min: 85,
                        max: 100
                    }
                }
            }
        });

        watch(saturationData, (newData) => {
            if (charts.saturationChart) {
                charts.saturationChart.data.datasets[0].data = newData.slice();
                charts.saturationChart.update('none');
            }
        }, { deep: true });
    }

    if (pressureCanvasRef.value) {
        const ctxPressure = pressureCanvasRef.value.getContext('2d');
        charts.pressureChart = new Chart(ctxPressure, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Presión Sistólica (mmHg)',
                        data: systolicData.value.slice(),
                        borderColor: 'rgb(0, 255, 0)',
                        tension: 0.1,
                        fill: false,
                    },
                    {
                        label: 'Presión Diastólica (mmHg)',
                        data: diastolicData.value.slice(),
                        borderColor: 'rgb(255, 165, 0)',
                        tension: 0.1,
                        fill: false,
                    },
                ]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Tiempo (s)' },
                        ticks: {
                            callback: function (value) {
                                return value.toFixed(1) + 's';
                            }
                        }
                    },
                    y: {
                        title: { display: true, text: 'mmHg' },
                        min: 60,
                        max: 150
                    }
                }
            }
        });

        watch([systolicData, diastolicData], ([newSystolicData, newDiastolicData]) => {
            if (charts.pressureChart) {
                charts.pressureChart.data.datasets[0].data = newSystolicData.slice();
                charts.pressureChart.data.datasets[1].data = newDiastolicData.slice();
                charts.pressureChart.update('none');
            }
        }, { deep: true });
    }

    if (temperatureCanvasRef.value) {
        const ctxTemperature = temperatureCanvasRef.value.getContext('2d');
        charts.temperatureChart = new Chart(ctxTemperature, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: temperatureData.value.slice(),
                    borderColor: 'rgb(128, 0, 128)',
                    tension: 0.1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Tiempo (s)' },
                        ticks: {
                            callback: function (value) {
                                return value.toFixed(1) + 's';
                            }
                        }
                    },
                    y: {
                        title: { display: true, text: '°C' },
                        min: 35,
                        max: 39
                    }
                }
            }
        });

        watch(temperatureData, (newData) => {
            if (charts.temperatureChart) {
                charts.temperatureChart.data.datasets[0].data = newData.slice();
                charts.temperatureChart.update('none');
            }
        }, { deep: true });
    }
}

onBeforeUnmount(() => {

    if (charts.heartRateChart) {
        charts.heartRateChart.destroy();
    }
    if (charts.saturationChart) {
        charts.saturationChart.destroy();
    }
    if (charts.pressureChart) {
        charts.pressureChart.destroy();
    }
    if (charts.temperatureChart) {
        charts.temperatureChart.destroy();
    }
});
</script>

<template>
    <Dialog header="Estabilizar" v-model:visible="display" :style="{ width: '45vw', height: '100%' }" :modal="true"
        class="p-fluid" @hide="onDialogHide" :position="position" :draggable="false">

        <h5 class="text-center datos-paciente">Procedimientos Disponibles</h5>

        <div class="grid pt-2">
            <div class="col md:col-8 pt-1">
                <h5>Monitor de Signos Vitales</h5>
            </div>
            <div class="col md:col-4">
                <Button v-if="!dataFetched" :label="loading ? 'Habilitando...' : 'Habilitar'" :disabled="loading"
                    style="background-color: #7ABF5A; border: 0px" @click="fetchSignosVitales" />
            </div>
        </div>

        <div v-if="dataFetched" class="pt-4">
            <!-- Canvas para los gráficos, referenciados con los canvasRef correspondientes -->
            <div>
                <canvas ref="heartCanvasRef" width="400" height="150"></canvas>
                <p>Frecuencia Cardiaca: {{ signosVitalesData.frecuencia_cardiaca.toFixed(0) }} BPM</p>
            </div>
            <div>
                <canvas ref="saturationCanvasRef" width="400" height="150"></canvas>
                <p>Saturación: {{ signosVitalesData.saturacion.toFixed(0) }}%</p>
            </div>
            <div>
                <canvas ref="pressureCanvasRef" width="400" height="150"></canvas>
                <p>Presión Sanguínea: {{ signosVitalesData.presion_sanguinea_sistole.toFixed(0) }}/{{
                    signosVitalesData.presion_sanguinea_distole.toFixed(0) }} mmHg</p>
            </div>
            <div>
                <canvas ref="temperatureCanvasRef" width="400" height="150"></canvas>
                <p>Temperatura: {{ signosVitalesData.temperatura.toFixed(1) }} °C</p>
            </div>
        </div>

        <div class="grid pt-4">
            <div class="col md:col-9"></div>
            <div class="col md:col-3">
                <Button style="background-color: #BAC8D9; border: 0px" label="Ok" @click="closeDialog"
                    icon="pi pi-check" />
            </div>
        </div>
    </Dialog>
</template>




<style scoped>
.gestion-title {
    font-size: 2em;
    font-weight: bold;
    color: #bb86fc;
}

.total-casos {
    font-size: 1.3em;
    font-weight: bold;
    color: #e0e0e0;
}

.info-data,
.case-data {
    font-size: 1em;
    color: #fff9e3;
}

.info-data-dialog {
    font-size: 1.2em;
    color: #cfcfcf;
}

.case-data {
    font-weight: normal;
    padding-bottom: 0.5em;
}

.info-data {
    font-weight: bold;
    padding-bottom: 0.3em;
}

.month-name {
    font-size: 1.1em;
    font-weight: bold;
    color: #bb86fc;
    margin-bottom: 0.3em;
}

.datos-paciente {
    font-size: 1.4em;
    font-weight: bold;
    color: #9BF272;
    margin-bottom: 0.3em;
}

.data-section {
    padding: 2px 0;
    border-bottom: 1px solid #444;
    margin: 0 10px;
}

.data-section:last-child {
    border-bottom: none;
}

h5 {
    margin: 0;
    padding: 2px 0;
}

.data-text {
    font-size: 0.85em;
    color: #b0b0b0;
}

.card-mes:hover {
    background-color: #333;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
</style>
