import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          if (response.data.refresh) {
            localStorage.setItem('refresh_token', response.data.refresh);
          }
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ───
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  refreshToken: (refresh) => api.post('/auth/login/refresh/', { refresh }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  getUsers: (page = 1) => api.get(`/auth/users/?page=${page}`),
  getUserDetail: (id) => api.get(`/auth/users/${id}/`),
};

// ─── Products APIs ───
export const productsAPI = {
  getCategories: () => api.get('/products/categories/'),
  createCategory: (data) => api.post('/products/categories/', data),
  updateCategory: (id, data) => api.patch(`/products/categories/${id}/`, data),
  deleteCategory: (id) => api.delete(`/products/categories/${id}/`),

  getProducts: (params = {}) => api.get('/products/', { params }),
  getFeaturedProducts: () => api.get('/products/featured/'),
  getProduct: (id) => api.get(`/products/${id}/`),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (id, data) => api.patch(`/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/products/${id}/`),
};

// ─── Cart APIs ───
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (productId, quantity = 1) =>
    api.post('/cart/add/', { product_id: productId, quantity }),
  updateCartItem: (itemId, quantity) =>
    api.patch(`/cart/update/${itemId}/`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/remove/${itemId}/`),
  clearCart: () => api.delete('/cart/clear/'),
};

// ─── Orders APIs ───
export const ordersAPI = {
  checkout: (data) => api.post('/orders/checkout/', data),
  getOrders: (page = 1) => api.get(`/orders/?page=${page}`),
  getOrder: (id) => api.get(`/orders/${id}/`),
  updateOrderStatus: (id, status) =>
    api.patch(`/orders/${id}/status/`, { status }),
};

// ─── Settings APIs ───
export const settingsAPI = {
  getSettings: () => api.get('/orders/settings/'),
  updateSettings: (data) => api.patch('/orders/settings/', data),
};

// ─── Coupons APIs ───
export const couponsAPI = {
  getCoupons: () => api.get('/coupons/'),
  getAvailableCoupons: () => api.get('/coupons/available/'),
  createCoupon: (data) => api.post('/coupons/', data),
  updateCoupon: (id, data) => api.patch(`/coupons/${id}/`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}/`),
  validateCoupon: (code, orderAmount) =>
    api.post('/coupons/validate/', { code, order_amount: orderAmount }),
};

// ─── Analytics APIs ───
export const analyticsAPI = {
  getDashboard: (lastCheck) => api.get('/analytics/dashboard/', { params: { last_check: lastCheck } }),
  getSalesChart: (period = 'daily') =>
    api.get(`/analytics/sales-chart/?period=${period}`),
};

export default api;
