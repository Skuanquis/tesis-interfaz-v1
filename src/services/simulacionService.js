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