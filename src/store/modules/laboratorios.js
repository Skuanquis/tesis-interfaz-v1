export default {
  namespaced: true,
  state: {
    examenOrina: null,
    examenSedimento: null,
    examenQuimicoUrinario: null,
    examenEspecialOrina: null,
    examenBiometriaHematica: null,
    examenRecuentoDiferencial: null,
    examenIndiceEritrocitario: null,
    examenQuimicoSanguineo: null,
    examenHemostasea: null,
    examenSerologia: null,
    examenElectrolitos: null
  },
  mutations: {
    setExamenOrina(state, data) {
      state.examenOrina = data
    },
    setExamenSedimento(state, data) {
      state.examenSedimento = data
    },
    setExamenQuimicoUrinario(state, data) {
      state.examenQuimicoUrinario = data
    },
    setExamenEspecialOrina(state, data) {
      state.examenEspecialOrina = data
    },
    setExamenBiometriaHematica(state, data) {
      state.examenBiometriaHematica = data
    },
    setExamenRecuentoDiferencial(state, data) {
      state.examenRecuentoDiferencial = data
    },
    setExamenIndiceEritrocitario(state, data) {
      state.examenIndiceEritrocitario = data
    },
    setExamenQuimicoSanguineo(state, data) {
      state.examenQuimicoSanguineo = data
    },
    setExamenHemostasea(state, data) {
      state.examenHemostasea = data
    },
    setExamenSerologia(state, data) {
      state.examenSerologia = data
    },
    setExamenElectrolitos(state, data) {
      state.examenElectrolitos = data
    },
    limpiarLaboratorios(state) {
      ;(state.examenOrina = null),
        (state.examenSedimento = null),
        (state.examenQuimicoUrinario = null),
        (state.examenEspecialOrina = null),
        (state.examenBiometriaHematica = null),
        (state.examenRecuentoDiferencial = null),
        (state.examenIndiceEritrocitario = null),
        (state.examenQuimicoSanguineo = null),
        (state.examenHemostasea = null),
        (state.examenSerologia = null),
        (state.examenElectrolitos = null)
    }
  },
  actions: {
    saveExamenOrina({ commit }, data) {
      commit('setExamenOrina', data)
    },
    saveExamenSedimento({ commit }, data) {
      commit('setExamenSedimento', data)
    },
    saveExamenQuimicoUrinario({ commit }, data) {
      commit('setExamenQuimicoUrinario', data)
    },
    saveExamenEspecialOrina({ commit }, data) {
      commit('setExamenEspecialOrina', data)
    },
    saveExamenBiometriaHematica({ commit }, data) {
      commit('setExamenBiometriaHematica', data)
    },
    saveExamenRecuentoDiferencial({ commit }, data) {
      commit('setExamenRecuentoDiferencial', data)
    },
    saveExamenIndiceEritrocitario({ commit }, data) {
      commit('setExamenIndiceEritrocitario', data)
    },
    saveExamenQuimicoSanguineo({ commit }, data) {
      commit('setExamenQuimicoSanguineo', data)
    },
    saveExamenHemostasea({ commit }, data) {
      commit('setExamenHemostasea', data)
    },
    saveExamenSerologia({ commit }, data) {
      commit('setExamenSerologia', data)
    },
    saveExamenElectrolitos({ commit }, data) {
      commit('setExamenElectrolitos', data)
    },
    limpiarLaboratorios({ commit }, data) {
      commit('limpiarLaboratorios', data)
    }
  },
  getters: {
    examenOrina: (state) => state.examenOrina,
    examenSedimento: (state) => state.examenSedimento,
    examenQuimicoUrinario: (state) => state.examenQuimicoUrinario,
    examenEspecialOrina: (state) => state.examenEspecialOrina,
    examenBiometriaHematica: (state) => state.examenBiometriaHematica,
    examenRecuentoDiferencial: (state) => state.examenRecuentoDiferencial,
    examenIndiceEritrocitario: (state) => state.examenIndiceEritrocitario,
    examenQuimicoSanguineo: (state) => state.examenQuimicoSanguineo,
    examenHemostasea: (state) => state.examenHemostasea,
    examenSerologia: (state) => state.examenSerologia,
    examenElectrolitos: (state) => state.examenElectrolitos
  }
}
