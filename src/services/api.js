import axios from 'axios'

// URL base del backend Django
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

// Interceptor — agrega el token JWT automáticamente a cada petición
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── ENDPOINTS DE EMPRESAS ───
export const registroEmpresa = (datos) => API.post('/empresas/registro/', datos)
export const loginEmpresa = (datos) => API.post('/empresas/login/', datos)
export const getPerfil = () => API.get('/empresas/perfil/')
export const getDashboard = () => API.get('/empresas/dashboard/')
export const getPlanes = () => API.get('/empresas/planes/')
export const asignarPlan = (plan) => API.post('/empresas/planes/asignar/', { plan })
export const getEmpresas = () => API.get('/empresas/listar/')

export default API