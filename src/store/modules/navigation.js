const state = {
  confirmedNavigation: false
}

const mutations = {
  setConfirmedNavigation(state, status) {
    state.confirmedNavigation = status
  }
}

const actions = {
  confirmNavigation({ commit }) {
    commit('setConfirmedNavigation', true)
  },
  resetNavigation({ commit }) {
    commit('setConfirmedNavigation', false)
  }
}

const getters = {
  isNavigationConfirmed: (state) => state.confirmedNavigation
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
