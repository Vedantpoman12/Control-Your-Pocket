import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const useCartStore = create((set, get) => ({
  cart: [],
  user: null,
  loading: false,
  error: null,

  fetchUser: async () => {
    try {
      const res = await axios.get(`${API_BASE}/user`);
      set({ user: res.data });
    } catch (err) {
      set({ error: "Failed to fetch user" });
    }
  },

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}/cart`);
      set({ cart: res.data, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch cart", loading: false });
    }
  },

  addItem: async (item) => {
    try {
      await axios.post(`${API_BASE}/cart`, item);
      get().fetchCart();
    } catch (err) {
      set({ error: "Failed to add item" });
    }
  },

  removeItem: async (id) => {
    try {
      await axios.post(`${API_BASE}/cart/remove`, { id });
      get().fetchCart();
    } catch (err) {
      set({ error: "Failed to remove item" });
    }
  },

  analyzeCart: async () => {
    const { user } = get();
    try {
      const res = await axios.post(`${API_BASE}/cart/analyze`, { monthly_income: user.monthly_income });
      return res.data;
    } catch (err) {
      return { error: "AI Engine error" };
    }
  }
}));
