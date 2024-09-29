import { createStore } from 'vuex'
import userModule from './modules/user'
import timerModule from './modules/timer'
import navigation from './modules/navigation'
import examenesModule from './modules/examenes'
import anamnesisModule from './modules/anamnesis'
import diferencialModule from './modules/diferencial'
import medicamentosModule from './modules/medicamentos'
const store = createStore({
  modules: {
    user: userModule,
    timer: timerModule,
    navigation,
    examenes: examenesModule,
    anamnesis: anamnesisModule,
    diferencial: diferencialModule,
    medicamentos: medicamentosModule
  }
})

export default store
