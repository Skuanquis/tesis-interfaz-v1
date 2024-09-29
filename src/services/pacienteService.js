import api from './api'

export const getListaPacientes = () => {
  return api.get('/pacientes')
}

export const obtenerCategoriasSimulacionConsultaExterna = () => {
  return api.get('/categorias-consulta')
}

export const getPacientesFiltrados = (categoria, dificultad) => {
  return api.get('/pacientes-filtrados', {
    params: {
      categoria: categoria || 'T',
      dificultad: dificultad || 'T'
    }
  })
}
