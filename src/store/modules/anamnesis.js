export default {
  namespaced: true,
  state: {
    anamnesisCardiovascular: null,
    anamnesisEndocrino: null,
    anamnesisGastrointestinal: null,
    anamnesisGenitourinario: null,
    anamnesisHematico: null,
    anamnesisLocomotor: null,
    anamnesisNeurologico: null,
    anamnesisPsiquiatrico: null,
    anamnesisRespiratorio: null,
    anamnesisTegumentario: null
  },
  mutations: {
    setAnamnesisCardiovascular(state, data) {
      state.anamnesisCardiovascular = data
    },
    setAnamnesisEndocrino(state, data) {
      state.anamnesisEndocrino = data
    },
    setAnamnesisGastrointestinal(state, data) {
      state.anamnesisGastrointestinal = data
    },
    setAnamnesisGenitourinario(state, data) {
      state.anamnesisGenitourinario = data
    },
    setAnamnesisHematico(state, data) {
      state.anamnesisHematico = data
    },
    setAnamnesisLocomotor(state, data) {
      state.anamnesisLocomotor = data
    },
    setAnamnesisNeurologico(state, data) {
      state.anamnesisNeurologico = data
    },
    setAnamnesisPsiquiatrico(state, data) {
      state.anamnesisPsiquiatrico = data
    },
    setAnamnesisRespiratorio(state, data) {
      state.anamnesisRespiratorio = data
    },
    setAnamnesisTegumentario(state, data) {
      state.anamnesisTegumentario = data
    },

    // Nueva mutación para limpiar el estado
    limpiarAnamnesis(state) {
      state.anamnesisCardiovascular = null
      state.anamnesisEndocrino = null
      state.anamnesisGastrointestinal = null
      state.anamnesisGenitourinario = null
      state.anamnesisHematico = null
      state.anamnesisLocomotor = null
      state.anamnesisNeurologico = null
      state.anamnesisPsiquiatrico = null
      state.anamnesisRespiratorio = null
      state.anamnesisTegumentario = null
    }
  },
  actions: {
    saveAnamnesisCardiovascular({ commit }, data) {
      commit('setAnamnesisCardiovascular', data)
    },
    saveAnamnesisEndocrino({ commit }, data) {
      commit('setAnamnesisEndocrino', data)
    },
    saveAnamnesisGastrointestinal({ commit }, data) {
      commit('setAnamnesisGastrointestinal', data)
    },
    saveAnamnesisGenitourinario({ commit }, data) {
      commit('setAnamnesisGenitourinario', data)
    },
    saveAnamnesisHematico({ commit }, data) {
      commit('setAnamnesisHematico', data)
    },
    saveAnamnesisLocomotor({ commit }, data) {
      commit('setAnamnesisLocomotor', data)
    },
    saveAnamnesisNeurologico({ commit }, data) {
      commit('setAnamnesisNeurologico', data)
    },
    saveAnamnesisPsiquiatrico({ commit }, data) {
      commit('setAnamnesisPsiquiatrico', data)
    },
    saveAnamnesisRespiratorio({ commit }, data) {
      commit('setAnamnesisRespiratorio', data)
    },
    saveAnamnesisTegumentario({ commit }, data) {
      commit('setAnamnesisTegumentario', data)
    },
    // Nueva acción para limpiar los exámenes
    limpiarAnamnesis({ commit }) {
      commit('limpiarAnamnesis')
    }
  },
  getters: {
    anamnesisCardiovascular: (state) => state.anamnesisCardiovascular,
    anamnesisEndocrino: (state) => state.anamnesisEndocrino,
    anamnesisGastrointestinal: (state) => state.anamnesisGastrointestinal,
    anamnesisGenitourinario: (state) => state.anamnesisGenitourinario,
    anamnesisHematico: (state) => state.anamnesisHematico,
    anamnesisLocomotor: (state) => state.anamnesisLocomotor,
    anamnesisNeurologico: (state) => state.anamnesisNeurologico,
    anamnesisPsiquiatrico: (state) => state.anamnesisPsiquiatrico,
    anamnesisRespiratorio: (state) => state.anamnesisRespiratorio,
    anamnesisTegumentario: (state) => state.anamnesisTegumentario
  }
}
