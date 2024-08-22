import api from './api'

export const loginUser = (credentials) => {
  return api.post('/login', credentials)
}

export const getUserInfo = () => {
  return api.get('/info')
}

export const updateUserProfile = (profileData) => {
  return api.put('/perfil', profileData)
}

export const updateUserPassword = (passwordData) => {
  return api.put('/password', passwordData)
}

export const createUser = (userData) => {
  return api.post('/registrar-usuario', userData)
}

export const getUsuarios = () => {
  return api.get('/usuarios')
}

export const getUserById = (id) => {
  return api.get(`/info/${id}`)
}

export const updateUsuario = (id, usuarioData) => {
  return api.put(`/usuario/${id}`, usuarioData)
}
