import axios from 'axios';

const AUTH_STORAGE_KEY = 'manemade_user';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null');
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  register: (userData) => api.post('/user/register', userData),
  login: (credentials) => api.post('/user/login', credentials),
  generateOtp: (email) => api.post('/user/generate-otp', { email }),
  verifyOtp: (otpData) => api.post('/user/verify-otp', otpData),
  resetPassword: (resetData) => api.post('/user/reset-password', resetData),
  getUserProfile: (id) => api.get(`/user/${id}`),
  updateUserProfile: (id, userData) => api.put(`/user/${id}`, userData),
  changePassword: (id, passwordData) => api.put(`/user/${id}/change-password`, passwordData),
};

export const addressService = {
  getAddresses: (userId) => api.get(`/address/user/${userId}`),
  addAddress: (userId, addressData) => api.post(`/address/user/${userId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/address/${addressId}`),
  setDefaultAddress: (userId, addressId) => api.put(`/address/${addressId}/set-default/user/${userId}`),
};

export const categoryService = {
  getStats: () => api.get('/category/all'),
};

export default api;
