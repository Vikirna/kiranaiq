import axios from 'axios'

const API = axios.create({
  baseURL: 'https://kiranaiq-production.up.railway.app.up.railway.app/api'
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const signup = (data) => API.post('/auth/signup', data)
export const verifyOTP = (data) => API.post('/auth/verify-otp', data)
export const login = (data) => API.post('/auth/login', data)
export const forgotPassword = (data) => API.post('/auth/forgot-password', data)
export const resetPassword = (data) => API.post('/auth/reset-password', data)
export const getMe = () => API.get('/auth/me')

export const getProducts = () => API.get('/products')
export const addProduct = (data) => API.post('/products', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

export const getSales = () => API.get('/sales')
export const addSale = (data) => API.post('/sales', data)
export const getWeeklySales = () => API.get('/sales/weekly')

export const getPredictions = () => API.get('/predictions')
export const runPredictions = () => API.post('/predictions/run')

export const getWeather = (city) => API.get(`/external/weather?city=${city}`)
export const getFestivals = () => API.get('/external/festivals')