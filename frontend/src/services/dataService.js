import api from './userService';

export const itemService = {
  getAll: () => api.get('/item/all'),
  getBySlug: (slug) => api.get(`/item/slug/${slug}`),
  getByCategory: (categoryId) => api.get(`/item/category/${categoryId}`),
  search: (query) => api.get(`/item/search?q=${encodeURIComponent(query)}`),
  create: (itemData) => api.post('/item/create', itemData),
};

export const categoryService = {
  getAll: () => api.get('/category/all'),
  create: (categoryData) => api.post('/category/create', categoryData),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllOrders: () => api.get('/order/all'),
};

export const cartService = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addItem: (userId, payload) => api.post(`/cart/${userId}/items`, payload),
  updateItem: (userId, itemId, payload) => api.put(`/cart/${userId}/items/${itemId}`, payload),
  removeItem: (userId, itemId) => api.delete(`/cart/${userId}/items/${itemId}`),
  clearCart: (userId) => api.delete(`/cart/${userId}/clear`),
};

export const paymentService = {
  getByUser: (userId) => api.get(`/payment/user/${userId}`),
  getByOrder: (orderId) => api.get(`/payment/order/${orderId}`),
};
