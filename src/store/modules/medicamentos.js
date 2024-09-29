export default {
  namespaced: true,
  state: {
    selectedMedicamentos: []
  },
  mutations: {
    setSelectedMedicamentos(state, medicamentos) {
      state.selectedMedicamentos = medicamentos
    },
    limpiarMedicamentos(state) {
      state.selectedMedicamentos = []
    }
  },
  actions: {
    saveSelectedMedicamentos({ commit }, medicamentos) {
      commit('setSelectedMedicamentos', medicamentos)
    },
    limpiarMedicamentos({ commit }) {
      commit('limpiarMedicamentos')
    }
  },
  getters: {
    selectedMedicamentos: (state) => state.selectedMedicamentos
  }
}
