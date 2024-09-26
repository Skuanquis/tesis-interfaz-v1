import api from './api'

export const obtenerCasosClinicos = () => {
  return api.get('/casos')
}

export const cambiarEstadoCaso = (id, estado) => {
  return api.put(`/casos/${id}/estado`, { estado })
}

export const obtenerCategoriasSimulacion = () => {
  return api.get('/categorias')
}

export const obtenerCasoClinicoPorId = (id) => {
  return api.get(`/casos/${id}`)
}

export const obtenerPuntajes = (id_historia_clinica) => {
  return api.get(`/casos/${id_historia_clinica}/puntajes`)
}

export const obtenerMensajes = (id_caso_clinico) => {
  return api.get(`/casos/${id_caso_clinico}/mensajes`)
}

export const actualizarPuntaje = (id_valor_puntaje, data) => {
  return api.put(`/puntajes/${id_valor_puntaje}`, data)
}

export const actualizarMensaje = (id_mensajes_simulacion, data) => {
  return api.put(`/mensajes/${id_mensajes_simulacion}`, data)
}

export const actualizarCasoClinico = (id_caso_clinico, data) => {
  return api.put(`/casos/${id_caso_clinico}`, data)
}

export const agregarNuevoPuntaje = (data) => {
  return api.post(`/puntajes`, data)
}

export const eliminarPuntajes = (id_valor_puntaje) => {
  return api.delete(`/puntajes/${id_valor_puntaje}`)
}

export const agregarNuevoMensaje = (data) => {
  return api.post(`/mensajes`, data)
}

export const eliminarMensajes = (id_mensajes_simulacion) => {
  return api.delete(`/mensajes/${id_mensajes_simulacion}`)
}

export const obtenerPaciente = (id_historia_clinica) => {
  return api.get(`/paciente/${id_historia_clinica}`)
}

export const actualizarPaciente = (id_paciente, data) => {
  return api.put(`/paciente/${id_paciente}`, data)
}

export const obtenerAntecedentesPatologicos = (id_historia_clinica) => {
  return api.get(`/antecedentes_patologicos/${id_historia_clinica}`)
}

export const actualizarAntecedentesPatologicos = (id_historia_clinica, data) => {
  return api.put(`/antecedentes_patologicos/${id_historia_clinica}`, data)
}

export const obtenerAntecedentesNoPatologicos = (id_historia_clinica) => {
  return api.get(`/antecedentes_no_patologicos/${id_historia_clinica}`)
}

export const actualizarAntecedentesNoPatologicos = (id_historia_clinica, data) => {
  return api.put(`/antecedentes_no_patologicos/${id_historia_clinica}`, data)
}

export const obtenerAntecedentesFamiliares = (id_historia_clinica) => {
  return api.get(`/antecedentes_familiares/${id_historia_clinica}`)
}

export const actualizarAntecedentesFamiliares = (id_historia_clinica, data) => {
  return api.put(`/antecedentes_familiares/${id_historia_clinica}`, data)
}

export const obtenerAnamnesisSistemas = (id_historia_clinica) => {
  return api.get(`/anamnesis_sistemas/${id_historia_clinica}`)
}

export const actualizarAnamnesisSistemas = (id_anamnesis_sistemas, data) => {
  return api.put(`/anamnesis_sistemas/${id_anamnesis_sistemas}`, data)
}

export const obtenerMotivosConsulta = (id_historia_clinica) => {
  return api.get(`/motivos_consulta/${id_historia_clinica}`)
}

export const agregarMotivoConsulta = (data) => {
  return api.post(`/motivos_consulta`, data)
}

export const eliminarMotivoConsulta = (id_motivo_consulta) => {
  return api.delete(`/motivos_consulta/${id_motivo_consulta}`)
}

export const obtenerPuntaje = (id_historia_clinica) => {
  return api.get(`/puntaje/${id_historia_clinica}`)
}

export const actualizarMotivoConsulta = (id_motivo_consulta, data) => {
  return api.put(`/motivos_consulta/${id_motivo_consulta}`, data)
}
