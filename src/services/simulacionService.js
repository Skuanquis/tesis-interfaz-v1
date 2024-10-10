import api from './api'

export const comenzarSimulacion = (simulacionData) => {
  return api.post('/comezar-simulacion', simulacionData)
}

export const marcarSimulacionIncompleta = (id_simulacion) => {
  return api.put(`/simulacion/incompleta/${id_simulacion}`)
}

export const finalizarSimulacion = (id_simulacion, tiempo_empleado) => {
  return api.put(`/simulacion/finalizar/${id_simulacion}`, { tiempo_empleado })
}

export const obtenerSimulacion = (id_simulacion) => {
  return api.get(`/simulacion/${id_simulacion}`)
}

export const registrarAccion = (accionData) => {
  return api.post('/simulacion/registrar-accion', accionData)
}

export const obtenerAccionesSimulacion = (id_simulacion) => {
  return api.get(`/simulacion/${id_simulacion}/acciones`)
}

export const eliminarAccion = (id_simulacion, descripcion) => {
  return api.delete('/accion/eliminar', {
    data: { id_simulacion, descripcion }
  })
}

export const obtenerMensaje = (id_caso_clinico) => {
  return api.get(`/mensajes/${id_caso_clinico}`)
}

export const enviarDiagnosticoFinal = (id_simulacion, diagnostico_final) => {
  return api.put(`/enviar-diagnostico/${id_simulacion}`, { diagnostico_final })
}

export const actualizarPuntajePorcentaje = (id_simulacion, puntaje_porcentaje) => {
  return api.put(`/realiza-simulacion/${id_simulacion}`, { puntaje_porcentaje })
}

export const obtenerSimulaciones = (id_usuario, id_grupo) => {
  const params = {}
  if (id_grupo && id_grupo !== '0') {
    params.id_grupo = id_grupo
  }
  return api.get(`/simulaciones/${id_usuario}`, { params })
}

export const obtenerDetallesSimulacion = async (id_realiza_simulacion) => {
  try {
    const response = await api.get(`/info-simulaciones/${id_realiza_simulacion}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener detalles de la simulación:', error)
    throw error
  }
}
