import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  register: (userData) => api.post('/user/register', userData),
  login: (credentials) => api.post('/user/login', credentials),
  generateOtp: (email) => api.post(`/user/generate-otp?email=${email}`),
  verifyOtp: (otpData) => api.post('/user/verify-otp', otpData)
};

export const categoryService = {
  getStats: () => api.get('/category/all')
};

export default api;
