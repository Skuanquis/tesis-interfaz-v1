import api from './api'

export const obtenerGrupos = (id_usuario_medico, rol) => {
  return api.get(`/grupos/${id_usuario_medico}/${rol}`)
}

export const obtenerTodosLosGrupos = () => {
  return api.get(`/grupos`)
}

export const crearGrupo = (grupoData) => {
  return api.post('/grupo', grupoData)
}

export const actualizarGrupo = (id_grupo, grupoData) => {
  return api.put(`/grupo/${id_grupo}`, grupoData)
}

export const eliminarGrupo = (id_grupo) => {
  return api.delete(`/grupo/${id_grupo}`)
}

export const matricularEstudiante = (id_grupo, id_usuario_estudiante) => {
  return api.post('/matricular', { id_grupo, id_usuario_estudiante })
}

export const desvincularEstudiante = (id_grupo, id_usuario_estudiante) => {
  return api.post('/desvincular', { id_grupo, id_usuario_estudiante })
}

export const obtenerGruposMatriculados = (id_usuario_estudiante) => {
  return api.get(`/matriculados/${id_usuario_estudiante}`)
}

export const obtenerGruposNoMatriculados = (id_usuario_estudiante) => {
  return api.get(`/no-matriculados/${id_usuario_estudiante}`)
}

export const validarCodigoAcceso = (id_grupo, codigo_acceso) => {
  return api.post('/validar-codigo', { id_grupo, codigo_acceso })
}

export const obtenerEstudiantesPorGrupo = (id_grupo) => {
  return api.get(`/estudiantes/${id_grupo}`)
}
