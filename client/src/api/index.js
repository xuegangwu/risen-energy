import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const packageAPI = {
  getList: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getList: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  createPayment: (id, data) => api.post(`/orders/${id}/create-payment`, data),
  checkPayment: (id) => api.post(`/orders/${id}/check-payment`),
  pay: (id) => api.put(`/orders/${id}/pay`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

export const groupAPI = {
  getList: (params) => api.get('/groups', { params }),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  join: (id) => api.post(`/groups/${id}/join`),
};

export default api;
