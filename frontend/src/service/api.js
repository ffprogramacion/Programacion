import axios from 'axios';

const obtenerBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api`;
  }
  return 'http://127.0.0.1:8000/api';
};

const api = axios.create({
  baseURL: obtenerBaseURL(),
});

export default api;