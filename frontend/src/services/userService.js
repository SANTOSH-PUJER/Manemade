import axios from 'axios';

const AUTH_STORAGE_KEY = 'manemade_user';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const authService = {
  register: (userData) => api.post('/user/register', userData),
  login: (credentials) => api.post('/user/login', credentials),
  generateOtp: (email) => api.post('/user/generate-otp', { email }),
  verifyOtp: (otpData) => api.post('/user/verify-otp', otpData),
  resetPassword: (resetData) => api.post('/user/reset-password', resetData),
  getUserProfile: (id) => api.get(`/user/${id}`),
  updateUserProfile: (id, userData) => api.put(`/user/${id}`, userData),
  getMe: () => api.get('/user/me'),
  logout: () => api.post('/user/logout'),
};

export const addressService = {
  getAddresses: (userId) => api.get(`/address/user/${userId}`),
  addAddress: (userId, addressData) => api.post(`/address/user/${userId}`, addressData),
  updateAddress: (userId, addressId, addressData) => api.put(`/address/${addressId}/user/${userId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/address/${addressId}`),
  setDefaultAddress: (userId, addressId) => api.put(`/address/${addressId}/set-default/user/${userId}`),
};

export const categoryService = {
  getStats: () => api.get('/categories/all'),
};

export default api;
