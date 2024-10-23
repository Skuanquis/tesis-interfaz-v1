export default {
  namespaced: true,
  state: {
    selectedProcedimientos: []
  },
  mutations: {
    setSelectedProcedimientos(state, procedimientos) {
      state.selectedProcedimientos = procedimientos
    },
    limpiarProcedimientos(state) {
      state.selectedProcedimientos = []
    }
  },
  actions: {
    saveSelectedProcedimientos({ commit }, procedimientos) {
      commit('setSelectedProcedimientos', procedimientos)
    },
    limpiarProcedimientos({ commit }) {
      commit('limpiarProcedimientos')
    }
  },
  getters: {
    selectedProcedimientos: (state) => state.selectedProcedimientos
  }
}
