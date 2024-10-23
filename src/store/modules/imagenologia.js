export default {
  namespaced: true,
  state: {
    imagenologias: {},
    displayedImages: {}
  },
  mutations: {
    setImagenologias(state, imagenologias) {
      state.imagenologias = imagenologias
    },
    showImage(state, nombre) {
      state.displayedImages[nombre] = true
    },
    limpiarImagenologias(state) {
      state.imagenologias = {}
      state.displayedImages = {}
    }
  },
  actions: {
    saveImagenologias({ commit }, imagenologias) {
      commit('setImagenologias', imagenologias)
    },
    realizarImagenologia({ commit }, nombre) {
      commit('showImage', nombre)
    },
    limpiarImagenologias({ commit }) {
      commit('limpiarImagenologias')
    }
  },
  getters: {
    imagenologias: (state) => state.imagenologias,
    displayedImages: (state) => state.displayedImages
  }
}
