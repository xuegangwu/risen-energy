import { create } from 'zustand';
import { authAPI } from '../api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (username, password) => {
    const res = await authAPI.login({ username, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
    return user;
  },
  
  register: async (data) => {
    const res = await authAPI.register(data);
    return res.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateProfile: async (data) => {
    const res = await authAPI.updateProfile(data);
    const user = res.data.user;
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
    return user;
  }
}));
