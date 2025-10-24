import axios from 'axios';

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
          localStorage.setItem('access', res.data.access);
          API.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token expired or invalid");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
