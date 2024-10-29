// store/modules/signosVitales.js

import { getSignosVitales } from '@/services/historiaService' // Asegúrate de que esta importación es correcta

let monitorInterval = null

const state = () => ({
  dataFetched: false,
  signosVitalesData: {
    frecuencia_cardiaca: 0,
    saturacion: 0,
    presion_sanguinea_sistole: 0,
    presion_sanguinea_distole: 0,
    temperatura: 0
  },
  heartRateData: [],
  saturationData: [],
  systolicData: [],
  diastolicData: [],
  temperatureData: [],
  startTime: null
})

const mutations = {
  SET_DATA_FETCHED(state, value) {
    state.dataFetched = value
  },
  SET_SIGNOS_VITALES_DATA(state, data) {
    state.signosVitalesData = data
  },
  SET_START_TIME(state, time) {
    state.startTime = time
  },
  UPDATE_HEART_RATE_DATA(state, point) {
    let newData = [...state.heartRateData, point]
    if (newData.length > 30) {
      newData = newData.slice(1)
    }
    state.heartRateData = newData
  },
  UPDATE_SATURATION_DATA(state, point) {
    let newData = [...state.saturationData, point]
    if (newData.length > 30) {
      newData = newData.slice(1)
    }
    state.saturationData = newData
  },
  UPDATE_SYSTOLIC_DATA(state, point) {
    let newData = [...state.systolicData, point]
    if (newData.length > 30) {
      newData = newData.slice(1)
    }
    state.systolicData = newData
  },
  UPDATE_DIASTOLIC_DATA(state, point) {
    let newData = [...state.diastolicData, point]
    if (newData.length > 30) {
      newData = newData.slice(1)
    }
    state.diastolicData = newData
  },
  UPDATE_TEMPERATURE_DATA(state, point) {
    let newData = [...state.temperatureData, point]
    if (newData.length > 30) {
      newData = newData.slice(1)
    }
    state.temperatureData = newData
  },
  CLEAR_MONITORING_DATA(state) {
    state.heartRateData = []
    state.saturationData = []
    state.systolicData = []
    state.diastolicData = []
    state.temperatureData = []
    state.startTime = null
    state.dataFetched = false
  }
}

const actions = {
  async fetchSignosVitales({ commit, dispatch }) {
    try {
      // Simular un retraso de 2 segundos para la llamada a la API (opcional)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Obtener id_historia_clinica del localStorage
      const idHistoriaClinica = localStorage.getItem('id_historia_clinica')

      if (!idHistoriaClinica) {
        throw new Error('id_historia_clinica no está disponible en localStorage')
      }

      // Llamar a la función real de servicio con el id correcto
      const response = await getSignosVitales(idHistoriaClinica)

      // Verificar que la respuesta tenga datos
      if (response.data && response.data.length > 0) {
        commit('SET_SIGNOS_VITALES_DATA', response.data[0])
        commit('SET_DATA_FETCHED', true)
        commit('SET_START_TIME', Date.now())

        dispatch('startMonitoring')
      } else {
        throw new Error('No se encontraron signos vitales para el id proporcionado')
      }
    } catch (error) {
      console.error('Error al obtener signos vitales:', error)
    }
  },
  startMonitoring({ state, commit }) {
    if (monitorInterval) {
      clearInterval(monitorInterval)
    }

    monitorInterval = setInterval(() => {
      // Simular la actualización de los signos vitales
      const newFrecuencia = getRandomValue(state.signosVitalesData.frecuencia_cardiaca, 60, 100)
      const newSaturacion = getRandomValue(state.signosVitalesData.saturacion, 90, 100)
      const newSistole = getRandomValue(state.signosVitalesData.presion_sanguinea_sistole, 110, 130)
      const newDiastole = getRandomValue(state.signosVitalesData.presion_sanguinea_distole, 70, 85)
      const newTemperatura = getRandomValue(state.signosVitalesData.temperatura, 36.5, 37.5)

      commit('SET_SIGNOS_VITALES_DATA', {
        frecuencia_cardiaca: newFrecuencia,
        saturacion: newSaturacion,
        presion_sanguinea_sistole: newSistole,
        presion_sanguinea_distole: newDiastole,
        temperatura: newTemperatura
      })

      // Calcular el tiempo actual
      const currentTime = (Date.now() - state.startTime) / 1000

      // Actualizar los datos para los gráficos
      commit('UPDATE_HEART_RATE_DATA', { x: currentTime, y: newFrecuencia })
      commit('UPDATE_SATURATION_DATA', { x: currentTime, y: newSaturacion })
      commit('UPDATE_SYSTOLIC_DATA', { x: currentTime, y: newSistole })
      commit('UPDATE_DIASTOLIC_DATA', { x: currentTime, y: newDiastole })
      commit('UPDATE_TEMPERATURE_DATA', { x: currentTime, y: newTemperatura })
    }, 1000)
  },
  stopMonitoring({ commit }) {
    if (monitorInterval) {
      clearInterval(monitorInterval)
      monitorInterval = null
    }
    commit('CLEAR_MONITORING_DATA')
  }
}

const getters = {
  dataFetched: (state) => state.dataFetched,
  signosVitalesData: (state) => state.signosVitalesData,
  heartRateData: (state) => state.heartRateData,
  saturationData: (state) => state.saturationData,
  systolicData: (state) => state.systolicData,
  diastolicData: (state) => state.diastolicData,
  temperatureData: (state) => state.temperatureData
}

function getRandomValue(base, min, max) {
  const variance = Math.random() * 0.05 * base
  let newValue = base + (Math.random() < 0.5 ? -variance : variance)
  return Math.min(Math.max(newValue, min), max)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
