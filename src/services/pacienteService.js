import api from './api'

export const getListaPacientes = () => {
  return api.get('/pacientes')
}
