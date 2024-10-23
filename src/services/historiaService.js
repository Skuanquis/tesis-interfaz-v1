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

export const getExamenFisicoSegmentarioCabeza = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-cabeza/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentarioCuello = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-cuello/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentarioTorax = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-torax/${id_historia_clinica}`)
}
export const getExamenFisicoSegmentarioCorazon = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-corazon/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentarioMamas = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-mamas/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentarioAbdomen = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-abdomen/${id_historia_clinica}`)
}
export const getExamenFisicoSegmentarioGenitourinario = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-genitourinario/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentarioExtremidades = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-extremidades/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentarioNeurologico = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-neurologico/${id_historia_clinica}`)
}

export const getExamenFisicoSegmentarioPiel = (id_historia_clinica) => {
  return api.get(`/examen-fisico-segmentario-piel/${id_historia_clinica}`)
}

export const getExamenCirculatorio = (id_historia_clinica) => {
  return api.get(`/examen-fisico-circulatorio/${id_historia_clinica}`)
}

export const getExamenRespiratorio = (id_historia_clinica) => {
  return api.get(`/examen-fisico-respiratorio/${id_historia_clinica}`)
}

export const getExamenViaAerea = (id_historia_clinica) => {
  return api.get(`/examen-fisico-via-aerea/${id_historia_clinica}`)
}

export const getExamenPsicologico = (id_historia_clinica) => {
  return api.get(`/examen-fisico-psicologico/${id_historia_clinica}`)
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

export const getExamenEspecialOrina = (id_historia_clinica) => {
  return api.get(`/laboratorio-especial-urinario/${id_historia_clinica}`)
}

export const getExamenBiometriaHematica = (id_historia_clinica) => {
  return api.get(`/laboratorio-biometria-hematica/${id_historia_clinica}`)
}

export const getExamenRecuentoDiferencialHematico = (id_historia_clinica) => {
  return api.get(`/laboratorio-recuento-diferencial-hematico/${id_historia_clinica}`)
}

export const getExamenIndiceEritrocitario = (id_historia_clinica) => {
  return api.get(`/laboratorio-indice-eritrocitario/${id_historia_clinica}`)
}

export const getExamenQuimicoSanguineo = (id_historia_clinica) => {
  return api.get(`/laboratorio-quimico-sanguineo/${id_historia_clinica}`)
}

export const getExamenHemostaseaSanguinea = (id_historia_clinica) => {
  return api.get(`/laboratorio-hemostasea-sanguinea/${id_historia_clinica}`)
}

export const getExamenSerologiaSanguinea = (id_historia_clinica) => {
  return api.get(`/laboratorio-serologia-sanguinea/${id_historia_clinica}`)
}

export const getExamenElectrolitosSanguineos = (id_historia_clinica) => {
  return api.get(`/laboratorio-electrolitos-sanguineos/${id_historia_clinica}`)
}

export const getExamenImagenPrueba = () => {
  return api.get(`/imagen`)
}

export const getAnamnesisTegumentario = (id_historia_clinica) => {
  return api.get(`/anamnesis-tegumentario/${id_historia_clinica}`)
}

export const getAnamnesisCardiovascular = (id_historia_clinica) => {
  return api.get(`/anamnesis-cardiovascular/${id_historia_clinica}`)
}

export const getAnamnesisEndocrino = (id_historia_clinica) => {
  return api.get(`/anamnesis-endocrino/${id_historia_clinica}`)
}

export const getAnamnesisGastrointestinal = (id_historia_clinica) => {
  return api.get(`/anamnesis-gastrointestinal/${id_historia_clinica}`)
}

export const getAnamnesisGenitourinario = (id_historia_clinica) => {
  return api.get(`/anamnesis-genitourinario/${id_historia_clinica}`)
}

export const getAnamnesisHematico = (id_historia_clinica) => {
  return api.get(`/anamnesis-hematico/${id_historia_clinica}`)
}

export const getAnamnesisLocomotor = (id_historia_clinica) => {
  return api.get(`/anamnesis-locomotor/${id_historia_clinica}`)
}

export const getAnamnesisNeurologico = (id_historia_clinica) => {
  return api.get(`/anamnesis-neurologico/${id_historia_clinica}`)
}

export const getAnamnesisPsiquiatrico = (id_historia_clinica) => {
  return api.get(`/anamnesis-psiquiatrico/${id_historia_clinica}`)
}

export const getAnamnesisRespiratorio = (id_historia_clinica) => {
  return api.get(`/anamnesis-respiratorio/${id_historia_clinica}`)
}

export const getDiagnosticosDiferenciales = (id_historia_clinica) => {
  return api.get(`/diferencial/diagnosticos/${id_historia_clinica}`)
}

export const obtenerMedicamentos = (id_historia_clinica) => {
  return api.get(`/medicamentos/${id_historia_clinica}`)
}

export const obtenerProcedimientos = (id_historia_clinica) => {
  return api.get(`/procedimientos/${id_historia_clinica}`)
}

export const obtenerAnalisis = (id_historia_clinica) => {
  return api.get(`/analisis/${id_historia_clinica}`)
}

export const obtenerSubespecialidades = (id_historia_clinica) => {
  return api.get(`/consulta-externa/${id_historia_clinica}`)
}

export const obtenerImagenologia = (id_historia_clinica) => {
  return api.get(`/imagenologia/${id_historia_clinica}`)
}
