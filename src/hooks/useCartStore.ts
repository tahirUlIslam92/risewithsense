"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCartItems, addToCart, removeFromCart, updateCartQuantity } from "@/app/actions/cart";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    images: string[] | null;
  };
}

interface CartStore {
  items: CartItem[];
  loading: boolean;
  userId: string | null;
  
  setUserId: (id: string | null) => void;
  fetchFromDB: () => Promise<void>;
  addItem: (productId: string, qty?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  clearCart: () => void;
  getCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      userId: null,

      setUserId: (id) => set({ userId: id }),

      fetchFromDB: async () => {
        const { userId } = get();
        if (!userId) return;
        set({ loading: true });
        const data = await getCartItems();
        if (data.length > 0) {
          set({ items: data, loading: false });
        } else {
          set({ loading: false });
        }
      },

      addItem: async (productId, qty = 1) => {
        const { userId, items } = get();
        if (!userId) return;

        // Optimistic local update
        const existing = items.find(i => i.product_id === productId);
        if (existing) {
          set({
            items: items.map(i =>
              i.product_id === productId ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        }

        // DB sync in background
        await addToCart(productId, qty);
        // Refetch to sync
        get().fetchFromDB();
      },

      removeItem: async (productId) => {
        // Optimistic local update
        set(state => ({
          items: state.items.filter(i => i.product_id !== productId),
        }));

        // DB sync
        await removeFromCart(productId);
      },

      updateQty: async (productId, qty) => {
        if (qty < 1) {
          get().removeItem(productId);
          return;
        }

        // Optimistic local update
        set(state => ({
          items: state.items.map(i =>
            i.product_id === productId ? { ...i, quantity: qty } : i
          ),
        }));

        // DB sync
        await updateCartQuantity(productId, qty);
      },

      clearCart: () => set({ items: [] }),

      getCount: () => get().items.reduce((s, i) => s + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((s, i) => s + Number(i.products?.price || 0) * i.quantity, 0),
    }),
    {
      name: "risewithsense-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);