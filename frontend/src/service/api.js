// src/api.js
import axios from 'axios';

// Creamos una instancia de axios con la URL base de tu backend Django
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de Peticiones: Inyecta el Access Token
api.interceptors.request.use(
  (config) => {
    // CORRECCIÓN: Usamos la clave 'access' tal como la guarda el AuthContext
    const token = localStorage.getItem('access'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de Respuestas: Manejo de Expiración y Silent Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Guardamos la petición original que falló
    const originalRequest = error.config;

    // Si el error es 401 (No autorizado), NO lo hemos reintentado aún, 
    // y NO es un error proviniendo del propio endpoint de refresh (para evitar bucles infinitos)
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/token/refresh/') {
      originalRequest._retry = true; // Marcamos que ya estamos intentando solucionarlo

      try {
        const refreshToken = localStorage.getItem('refresh');
        
        if (refreshToken) {
          // Le pedimos a Django un nuevo access token
          const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
          
          // Usamos axios puro (no la instancia 'api') para evitar que pase por los interceptores y cause bucles
          const response = await axios.post(`${baseURL}/token/refresh/`, { 
            refresh: refreshToken 
          });

          // Si Django nos da un nuevo access token, lo guardamos
          const newAccessToken = response.data.access;
          localStorage.setItem('access', newAccessToken);

          // Actualizamos el header de la petición original que había fallado
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Volvemos a disparar la petición original con el nuevo token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si el refresh token también expiró o es inválido, forzamos el cierre de sesión
        console.warn("Sesión totalmente expirada. Redirigiendo a Login.");
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        // Redirigimos al usuario al login de tu app
        window.location.href = '/'; // Cambiar a '/login' si tu ruta se llama así
      }
    }

    // Si el error no es 401 o el refresh falló, devolvemos el error al componente
    return Promise.reject(error);
  }
);

export default api;