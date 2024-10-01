import { obtenerImagenologia } from '@/services/historiaService'

const imagenologiaModule = {
  namespaced: true,
  state: {
    imagenologias: {},
    selectedCategories: []
  },
  mutations: {
    SET_IMAGENOLOGIAS(state, imagenologias) {
      state.imagenologias = imagenologias
    },
    ADD_SELECTED_CATEGORY(state, categoryName) {
      if (!state.selectedCategories.includes(categoryName)) {
        state.selectedCategories.push(categoryName)
      }
    }
  },
  actions: {
    async fetchImagenologias({ commit }, id_historia_clinica) {
      try {
        const response = await obtenerImagenologia(id_historia_clinica)
        commit('SET_IMAGENOLOGIAS', response.data)
      } catch (error) {
        console.error('Error fetching imagenologías:', error)
      }
    },
    realizarCategoria({ commit }, categoryName) {
      commit('ADD_SELECTED_CATEGORY', categoryName)
    }
  },
  getters: {
    imagenologias(state) {
      return state.imagenologias
    },
    selectedCategories(state) {
      return state.selectedCategories
    }
  }
}

export default imagenologiaModule
