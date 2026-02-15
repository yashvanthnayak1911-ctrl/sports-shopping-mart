import axios from 'axios';

// Use env var for hosted API (Render); otherwise empty string to use relative path (proxy)
const apiBase = process.env.REACT_APP_API_BASE_URL || '';

axios.defaults.baseURL = apiBase;

// Add request interceptor to log requests and add auth token
axios.interceptors.request.use(
  config => {
    console.log('API Request:', config.method.toUpperCase(), config.url);

    // Add token to requests if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses and errors
axios.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axios;
