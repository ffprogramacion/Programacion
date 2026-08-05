import axios from 'axios';

// Toma la URL del .env (tanto en desarrollo como en producción).
// Si no existe la variable, usa 'http://127.0.0.1:8000/api' por defecto.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para inyectar el token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;