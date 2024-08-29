export default {
  namespaced: true,
  state: {
    timer: null,
    segundos: 0,
    minutos: 0,
    isActive: false,
    startTime: null
  },
  mutations: {
    startTimer(state) {
      state.isActive = true
      state.startTime = new Date().getTime()
      localStorage.setItem('startTime', state.startTime)
      localStorage.setItem('isActive', true)

      state.timer = setInterval(() => {
        const now = new Date().getTime()
        const elapsedTime = now - state.startTime
        state.minutos = Math.floor(elapsedTime / 60000)
        state.segundos = Math.floor((elapsedTime % 60000) / 1000)

        localStorage.setItem('minutos', state.minutos)
        localStorage.setItem('segundos', state.segundos)
      }, 1000)
    },
    stopTimer(state) {
      clearInterval(state.timer)
      state.isActive = false
      localStorage.setItem('isActive', false)
    },
    resetTimer(state) {
      clearInterval(state.timer)
      state.segundos = 0
      state.minutos = 0
      state.isActive = false
      state.timer = null
      state.startTime = null
      localStorage.removeItem('segundos')
      localStorage.removeItem('minutos')
      localStorage.removeItem('startTime')
      localStorage.setItem('isActive', false)
    },
    resumeTimer(state) {
      const now = new Date().getTime()
      const elapsedTime = now - parseInt(localStorage.getItem('startTime'), 10)
      state.minutos = Math.floor(elapsedTime / 60000)
      state.segundos = Math.floor((elapsedTime % 60000) / 1000)
      state.isActive = true

      state.timer = setInterval(() => {
        const now = new Date().getTime()
        const elapsedTime = now - parseInt(localStorage.getItem('startTime'), 10)
        state.minutos = Math.floor(elapsedTime / 60000)
        state.segundos = Math.floor((elapsedTime % 60000) / 1000)

        localStorage.setItem('minutos', state.minutos)
        localStorage.setItem('segundos', state.segundos)
      }, 1000)
    }
  },
  actions: {
    startTimer({ commit }) {
      commit('startTimer')
    },
    stopTimer({ commit }) {
      commit('stopTimer')
    },
    resetTimer({ commit }) {
      commit('resetTimer')
    },
    resumeTimer({ commit }) {
      commit('resumeTimer')
    }
  }
}
