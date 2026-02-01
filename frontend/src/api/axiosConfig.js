import axios from 'axios';

// Set the base URL for all axios requests
// Use env var for hosted API; fallback to dynamic local IP for dev
const hostname = window.location.hostname;
// Assume backend is on port 5000 if running locally
const backendUrl = hostname === 'localhost' ? 'http://localhost:5000' : `http://${hostname}:5000`;

// If env var is just a hostname (from Render), prepend https://
let apiBase = process.env.REACT_APP_API_BASE_URL || backendUrl;
if (apiBase && !apiBase.startsWith('http')) {
  apiBase = `https://${apiBase}`;
}
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
