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
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import Image from 'primevue/image'
import Checkbox from 'primevue/checkbox'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Stepper from 'primevue/stepper'
import StepperPanel from 'primevue/stepperpanel'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import SelectButton from 'primevue/selectbutton'
import FileUpload from 'primevue/fileupload'
import InputMask from 'primevue/inputmask'
import ProgressBar from 'primevue/progressbar'
import Knob from 'primevue/knob'

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
app.component('ConfirmDialog', ConfirmDialog)
app.component('Image', Image)
app.component('Checkbox', Checkbox)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Stepper', Stepper)
app.component('StepperPanel', StepperPanel)
app.component('InputNumber', InputNumber)
app.component('Textarea', Textarea)
app.component('SelectButton', SelectButton)
app.component('FileUpload', FileUpload)
app.component('InputMask', InputMask)
app.component('ProgressBar', ProgressBar)
app.component('Knob', Knob)

app.use(ConfirmationService)
app.use(ToastService)

app.mount('#app')
