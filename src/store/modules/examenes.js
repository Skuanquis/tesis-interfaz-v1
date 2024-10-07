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
    examenSegmentarioPiel: null,
    examenSegmentarioCirculatorio: null,
    examenSegmentarioRespiratorio: null,
    examenSegmentarioViaAerea: null,
    examenSegmentarioPsicologico: null,
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
    setExamenSegmentarioPiel(state, data) {
      state.examenSegmentarioPiel = data
    },
    setExamenSegmentarioCirculatorio(state, data) {
      state.examenSegmentarioCirculatorio = data
    },
    setExamenSegmentarioRespiratorio(state, data) {
      state.examenSegmentarioRespiratorio = data
    },
    setExamenSegmentarioViaAerea(state, data) {
      state.examenSegmentarioViaAerea = data
    },
    setExamenSegmentarioPsicologico(state, data) {
      state.examenSegmentarioPsicologico = data
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
      state.examenSegmentarioPiel = null
      state.examenSegmentarioCirculatorio = null
      ;(state.examenSegmentarioRespiratorio = null),
        (state.examenSegmentarioViaAerea = null),
        (state.examenSegmentarioPsicologico = null),
        (state.examenObstetrico = null)
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
    saveExamenSegmentarioPiel({ commit }, data) {
      commit('setExamenSegmentarioPiel', data)
    },
    saveExamenSegmentarioCirculatorio({ commit }, data) {
      commit('setExamenSegmentarioCirculatorio', data)
    },
    saveExamenSegmentarioRespiratorio({ commit }, data) {
      commit('setExamenSegmentarioRespiratorio', data)
    },
    saveExamenSegmentarioViaAerea({ commit }, data) {
      commit('setExamenSegmentarioViaAerea', data)
    },
    saveExamenSegmentarioPsicologico({ commit }, data) {
      commit('setExamenSegmentarioPsicologico', data)
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
    examenSegmentarioPiel: (state) => state.examenSegmentarioPiel,
    examenSegmentarioCirculatorio: (state) => state.examenSegmentarioCirculatorio,
    examenSegmentarioRespiratorio: (state) => state.examenSegmentarioRespiratorio,
    examenSegmentarioViaAerea: (state) => state.examenSegmentarioViaAerea,
    examenSegmentarioPsicologico: (state) => state.examenSegmentarioPsicologico,
    examenObstetrico: (state) => state.examenObstetrico
  }
}
