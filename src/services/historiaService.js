import api from './api'

export const getListaHistoriasClinicas = () => {
  return api.get('/historias')
}

export const getInfoHistoria = (id_historia_clinica) => {
  return api.get(`/info-historia/${id_historia_clinica}`)
}

export const getExamenFisicoGeneral = (id_historia_clinica) => {
  return api.get(`/examen-fisico/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentario = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario/${id_historia_clinica}`)
}

export const getExamenObstetrico = (id_historia_clinica) => {
  return api.get(`/examen-obstetrico/${id_historia_clinica}`)
}

export const getExamenFisicoOrina = (id_historia_clinica) => {
  return api.get(`/laboratorio-fisico-orina/${id_historia_clinica}`)
}

export const getExamenSedimentoUrinario = (id_historia_clinica) => {
  return api.get(`/laboratorio-sedimento-urinario/${id_historia_clinica}`)
}

export const getExamenQuimicoUrinario = (id_historia_clinica) => {
  return api.get(`/laboratorio-quimico-urinario/${id_historia_clinica}`)
}

export const getExamenesEspecialesOrina = (id_historia_clinica) => {
  return api.get(`/laboratorio-especial-urinario/${id_historia_clinica}`)
}
