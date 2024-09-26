export default {
  namespaced: true,
  state: {
    examenFisico: null,
    examenSegmentarioCabeza: null,
    examenSegmentarioCuello: null,
    examenSegmentarioTorax: null,
    examenSegmentarioCorazon: null,
    examenSegmentarioMamas: null,
    examenSegmentarioAbdomen: null,
    examenSegmentarioGenitourinario: null,
    examenSegmentarioExtremidades: null,
    examenSegmentarioNeurologico: null,
    examenObstetrico: null
  },
  mutations: {
    setExamenFisico(state, data) {
      state.examenFisico = data
    },
    setExamenSegmentarioCabeza(state, data) {
      state.examenSegmentarioCabeza = data
    },
    setExamenSegmentarioCuello(state, data) {
      state.examenSegmentarioCuello = data
    },
    setExamenSegmentarioTorax(state, data) {
      state.examenSegmentarioTorax = data
    },
    setExamenSegmentarioCorazon(state, data) {
      state.examenSegmentarioCorazon = data
    },
    setExamenSegmentarioMamas(state, data) {
      state.examenSegmentarioMamas = data
    },
    setExamenSegmentarioAbdomen(state, data) {
      state.examenSegmentarioAbdomen = data
    },
    setExamenSegmentarioGenitourinario(state, data) {
      state.examenSegmentarioGenitourinario = data
    },
    setExamenSegmentarioExtremidades(state, data) {
      state.examenSegmentarioExtremidades = data
    },
    setExamenSegmentarioNeurologico(state, data) {
      state.examenSegmentarioNeurologico = data
    },
    setExamenObstetrico(state, data) {
      state.examenObstetrico = data
    },
    // Nueva mutación para limpiar el estado
    limpiarExamenes(state) {
      state.examenFisico = null
      state.examenSegmentarioCabeza = null
      state.examenSegmentarioCuello = null
      state.examenSegmentarioTorax = null
      state.examenSegmentarioCorazon = null
      state.examenSegmentarioMamas = null
      state.examenSegmentarioAbdomen = null
      state.examenSegmentarioGenitourinario = null
      state.examenSegmentarioExtremidades = null
      state.examenSegmentarioNeurologico = null
      state.examenObstetrico = null
    }
  },
  actions: {
    saveExamenFisico({ commit }, data) {
      commit('setExamenFisico', data)
    },
    saveExamenSegmentarioCabeza({ commit }, data) {
      commit('setExamenSegmentarioCabeza', data)
    },
    saveExamenSegmentarioCuello({ commit }, data) {
      commit('setExamenSegmentarioCuello', data)
    },
    saveExamenSegmentarioTorax({ commit }, data) {
      commit('setExamenSegmentarioTorax', data)
    },
    saveExamenSegmentarioCorazon({ commit }, data) {
      commit('setExamenSegmentarioCorazon', data)
    },
    saveExamenSegmentarioMamas({ commit }, data) {
      commit('setExamenSegmentarioMamas', data)
    },
    saveExamenSegmentarioAbdomen({ commit }, data) {
      commit('setExamenSegmentarioAbdomen', data)
    },
    saveExamenSegmentarioGenitourinario({ commit }, data) {
      commit('setExamenSegmentarioGenitourinario', data)
    },
    saveExamenSegmentarioExtremidades({ commit }, data) {
      commit('setExamenSegmentarioExtremidades', data)
    },
    saveExamenSegmentarioNeurologico({ commit }, data) {
      commit('setExamenSegmentarioNeurologico', data)
    },
    saveExamenObstetrico({ commit }, data) {
      commit('setExamenObstetrico', data)
    },
    // Nueva acción para limpiar los exámenes
    limpiarExamenes({ commit }) {
      commit('limpiarExamenes')
    }
  },
  getters: {
    examenFisico: (state) => state.examenFisico,
    examenSegmentarioCabeza: (state) => state.examenSegmentarioCabeza,
    examenSegmentarioCuello: (state) => state.examenSegmentarioCuello,
    examenSegmentarioTorax: (state) => state.examenSegmentarioTorax,
    examenSegmentarioCorazon: (state) => state.examenSegmentarioCorazon,
    examenSegmentarioMamas: (state) => state.examenSegmentarioMamas,
    examenSegmentarioAbdomen: (state) => state.examenSegmentarioAbdomen,
    examenSegmentarioGenitourinario: (state) => state.examenSegmentarioGenitourinario,
    examenSegmentarioExtremidades: (state) => state.examenSegmentarioExtremidades,
    examenSegmentarioNeurologico: (state) => state.examenSegmentarioNeurologico,
    examenObstetrico: (state) => state.examenObstetrico
  }
}
