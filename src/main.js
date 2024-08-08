/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
//import './assets/main.css'
import '@/assets/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import RadioButton from 'primevue/radiobutton'
import Dock from 'primevue/dock'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, { ripple: true })
app.component('RadioButton', RadioButton)
app.component('Dock', Dock)
app.component('Dialog', Dialog)
app.component('Button', Button)

app.mount('#app')
