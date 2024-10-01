export default {
  namespaced: true,
  state: {
    selectedSubespecialidades: []
  },
  mutations: {
    setSelectedSubespecialidades(state, subespecialidades) {
      state.selectedSubespecialidades = subespecialidades
    },
    limpiarSubespecialidades(state) {
      state.selectedSubespecialidades = []
    }
  },
  actions: {
    saveSelectedSubespecialidades({ commit }, subespecialidades) {
      commit('setSelectedSubespecialidades', subespecialidades)
    },
    limpiarSubespecialidades({ commit }) {
      commit('limpiarSubespecialidades')
    }
  },
  getters: {
    selectedSubespecialidades: (state) => state.selectedSubespecialidades
  }
}
