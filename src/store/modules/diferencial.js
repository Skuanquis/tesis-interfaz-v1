export default {
  namespaced: true,
  state: {
    selectedCategories: []
  },
  mutations: {
    setSelectedCategories(state, categories) {
      state.selectedCategories = categories
    },
    limpiarDiferencial(state) {
      state.selectedCategories = []
    }
  },
  actions: {
    saveSelectedCategories({ commit }, categories) {
      commit('setSelectedCategories', categories)
    },
    limpiarDiferencial({ commit }) {
      commit('limpiarDiferencial')
    }
  },
  getters: {
    selectedCategories: (state) => state.selectedCategories
  }
}
