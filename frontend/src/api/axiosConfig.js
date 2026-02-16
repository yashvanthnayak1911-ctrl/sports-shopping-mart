import axios from 'axios';

// Use env var for hosted API (Render), or fallback to hardcoded Render URL if missing
// Also ensure it starts with https:// if it's just a hostname
let apiBase = process.env.REACT_APP_API_BASE_URL;

if (!apiBase) {
  // Fallback for production if env var is missing
  if (process.env.NODE_ENV === 'production') {
    apiBase = 'https://sports-ecommerce-backend.onrender.com';
  } else {
    apiBase = ''; // Local development (proxy)
  }
} else if (!apiBase.startsWith('http')) {
  // If Render gives just the host (without https://), add it
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
