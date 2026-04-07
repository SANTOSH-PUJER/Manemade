import api from './userService';

export const itemService = {
  getAll: (category) => api.get(`/items${category ? `?category=${category}` : ''}`),
  getBySlug: (slug) => api.get(`/items/slug/${slug}`),
  getByCategory: (categoryId) => api.get(`/items/category/${categoryId}`),
  search: (query) => api.get(`/items/search?q=${encodeURIComponent(query)}`),
  create: (itemData) => api.post('/items/create', itemData),
  update: (id, itemData) => api.put(`/items/${id}`, itemData),
  delete: (id) => api.delete(`/items/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories/all'),
  create: (categoryData) => api.post('/categories/create', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllOrders: () => api.get('/order/all'),
};

export const orderService = {
  placeOrder: (orderData) => api.post('/order/place', orderData),
  getUserOrders: (userId) => api.get(`/order/user/${userId}`),
};

export const cartService = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addItem: (payload) => api.post('/cart/add', payload),
  updateItem: (userId, itemId, payload) => api.put(`/cart/${userId}/items/${itemId}`, payload),
  removeItem: (userId, itemId) => api.delete(`/cart/${userId}/items/${itemId}`),
  clearCart: (userId) => api.delete(`/cart/${userId}/clear`),
};

export const paymentService = {
  getByUser: (userId) => api.get(`/payment/user/${userId}`),
  getByOrder: (orderId) => api.get(`/payment/order/${orderId}`),
};
