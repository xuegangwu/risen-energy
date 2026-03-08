import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (pkg, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(item => item._id === pkg._id);
        
        if (existingIndex >= 0) {
          items[existingIndex].quantity += quantity;
          set({ items: [...items] });
        } else {
          set({ items: [...items, { ...pkg, quantity }] });
        }
      },
      
      removeItem: (id) => {
        const items = get().items.filter(item => item._id !== id);
        set({ items });
      },
      
      updateQuantity: (id, quantity) => {
        const items = get().items.map(item => 
          item._id === id ? { ...item, quantity } : item
        );
        set({ items });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          const price = item.groupPrice || item.basePrice;
          return total + price * item.quantity;
        }, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
