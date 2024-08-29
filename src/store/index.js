import { createStore } from 'vuex'
import userModule from './modules/user'
import timerModule from './modules/timer'
import navigation from './modules/navigation'
import examenesModule from './modules/examenes'

const store = createStore({
  modules: {
    user: userModule,
    timer: timerModule,
    navigation,
    examenes: examenesModule
  }
})

export default store
