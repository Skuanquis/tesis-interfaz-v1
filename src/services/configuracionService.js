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

export const obtenerCategoriasConImagenologias = () => {
  return api.get(`/configuracion-imagenologias`)
}

export const eliminarImagenologia = (id_imagenologia) => {
  return api.delete(`/configuracion-imagenologias/${id_imagenologia}`)
}

export const actualizarImagenologia = (id_imagenologia, data) => {
  return api.put(`/configuracion-imagenologias/${id_imagenologia}`, {
    nombre: data.nombre
  })
}

export const agregarImagenologia = (data) => {
  return api.post(`/configuracion-imagenologias`, {
    id_categoria_imagenologia: data.id_categoria_imagenologia,
    nombre: data.nombre
  })
}

export const agregarCategoriaConImagenologias = (data) => {
  return api.post(`/configuracion-imagenologias-con-categoria`, data)
}

export const obtenerCategoriasConProcedimientos = () => {
  return api.get(`/configuracion-procedimientos`)
}

export const eliminarProcedimiento = (id_procedimiento) => {
  return api.delete(`/configuracion-procedimientos/${id_procedimiento}`)
}

export const actualizarProcedimiento = (id_procedimiento, data) => {
  return api.put(`/configuracion-procedimientos/${id_procedimiento}`, {
    nombre: data.nombre
  })
}

export const agregarProcedimiento = (data) => {
  return api.post(`/configuracion-procedimientos`, {
    id_categoria_procedimiento: data.id_categoria_procedimiento,
    nombre: data.nombre
  })
}

export const agregarCategoriaConProcedimientos = (data) => {
  return api.post(`/configuracion-procedimientos-con-categoria`, data)
}

export const obtenerCategoriasConSubcategorias = () => {
  return api.get(`/configuracion-analisis`)
}

export const eliminarSubcategoria = (id_subcategoria_analisis) => {
  return api.delete(`/configuracion-analisis/${id_subcategoria_analisis}`)
}

export const actualizarSubcategoria = (id_subcategoria_analisis, data) => {
  return api.put(`/configuracion-analisis/${id_subcategoria_analisis}`, {
    nombre_subcategoria: data.nombre_subcategoria
  })
}

export const agregarSubcategoria = (data) => {
  return api.post(`/configuracion-analisis`, {
    id_categoria_analisis: data.id_categoria_analisis,
    nombre_subcategoria: data.nombre_subcategoria
  })
}

export const agregarCategoriaConSubcategorias = (data) => {
  return api.post(`/configuracion-analisis-con-categoria`, data)
}
