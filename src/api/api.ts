import axios, { type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const URL_API = BASE_URL + "/api";

const apiClient = axios.create({
  baseURL: URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const getXsrfToken = () =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')
    .slice(1)
    .join('=');

const initCsrf = async () => {
  if (!getXsrfToken()) {
    await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true });
  }
};

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const mutatingMethods = ['post', 'put', 'patch', 'delete'];
    if (config.method && mutatingMethods.includes(config.method.toLowerCase())) {
      await initCsrf();

      // Axios envía el cookie XSRF-TOKEN tal cual (URL-encoded), pero Laravel
      // necesita el valor decodificado para poder descifrarlo. Lo leemos y
      // decodificamos manualmente para evitar el error 419.
      const raw = getXsrfToken();

      if (raw) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(raw);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('Error 401: No autorizado');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
