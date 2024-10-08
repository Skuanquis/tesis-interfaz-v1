import api from './api'

export const obtenerDiagnosticosDiferencialesPorCategoria = () => {
  return api.get(`/configuracion-diagnosticos`)
}

export const eliminarDiagnostico = (id_diagnostico) => {
  return api.delete(`/configuracion-diagnosticos/${id_diagnostico}`)
}

export const actualizarDiagnostico = (id_diagnostico, data) => {
  return api.put(`/configuracion-diagnosticos/${id_diagnostico}`, {
    nombre: data.diagnostico
  })
}

export const agregarDiagnostico = (data) => {
  return api.post(`/configuracion-diagnosticos`, {
    id_categoria_diferencial: data.id_categoria_diferencial,
    nombre: data.diagnostico
  })
}

export const agregarCategoriaConDiagnosticos = (data) => {
  return api.post('/configuracion-categorias', data)
}

export const obtenerMedicamentosPorCategoria = () => {
  return api.get('/configuracion-medicamentos')
}

export const eliminarMedicamento = (id_medicamento) => {
  return api.delete(`/configuracion-medicamentos/${id_medicamento}`)
}

export const actualizarMedicamento = (id_medicamento, data) => {
  return api.put(`/configuracion-medicamentos/${id_medicamento}`, {
    nombre: data.medicamento
  })
}

export const agregarMedicamento = (data) => {
  return api.post('/configuracion-medicamentos', {
    id_categoria_medicamento: data.id_categoria_medicamento,
    nombre: data.medicamento
  })
}

export const agregarCategoriaConMedicamentos = (data) => {
  return api.post('/configuracion-categorias-medicamentos', data)
}

export const obtenerSubespecialidades = () => {
  return api.get('/subespecialidades')
}

export const agregarSubespecialidad = (data) => {
  return api.post('/subespecialidades', data)
}

export const actualizarSubespecialidad = (id_subespecialidad, data) => {
  return api.put(`/subespecialidades/${id_subespecialidad}`, data)
}

export const eliminarSubespecialidad = (id_subespecialidad) => {
  return api.delete(`/subespecialidades/${id_subespecialidad}`)
}

export const obtenerCategoriasImagenologia = () => {
  return api.get('/categorias-imagenologia')
}

export const agregarCategoriaImagenologia = (data) => {
  return api.post('/categorias-imagenologia', data)
}

export const actualizarCategoriaImagenologia = (id_categoria_imagenologia, data) => {
  return api.put(`/categorias-imagenologia/${id_categoria_imagenologia}`, data)
}

export const eliminarCategoriaImagenologia = (id_categoria_imagenologia) => {
  return api.delete(`/categorias-imagenologia/${id_categoria_imagenologia}`)
}
