import api from './userService';

export const itemService = {
  getAll: () => api.get('/item/all'),
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
