/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
//import './assets/main.css'
import '@/assets/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import store from './store'

import PrimeVue from 'primevue/config'
import RadioButton from 'primevue/radiobutton'
import Dock from 'primevue/dock'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import FloatLabel from 'primevue/floatlabel'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)
app.use(PrimeVue, { ripple: true })
app.component('RadioButton', RadioButton)
app.component('Dock', Dock)
app.component('Dialog', Dialog)
app.component('Button', Button)
app.component('Card', Card)
app.component('Divider', Divider)
app.component('Toast', Toast)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Calendar', Calendar)
app.component('Dropdown', Dropdown)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Tag', Tag)
app.component('FloatLabel', FloatLabel)

app.use(ToastService)

app.mount('#app')
