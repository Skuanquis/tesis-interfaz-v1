export default {
  namespaced: true,
  state: {
    realizados: {}
  },
  mutations: {
    setLaboratorioRealizado(state, { categoria, subanalisis }) {
      state.realizados = {
        ...state.realizados,
        [categoria]: subanalisis
      }
    },
    limpiarLaboratorios(state) {
      state.realizados = {}
    }
  },
  actions: {
    realizarLaboratorio({ commit }, { categoria, subanalisis }) {
      commit('setLaboratorioRealizado', { categoria, subanalisis })
    },
    limpiarLaboratorios({ commit }) {
      commit('limpiarLaboratorios')
    }
  },
  getters: {
    laboratoriosRealizados: (state) => state.realizados
  }
}
