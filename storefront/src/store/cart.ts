"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
};

const computeSubtotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      subtotal: 0,
      addItem: (product, size, quantity = 1) =>
        set((state) => {
          const key = `${product.slug}-${size}`;
          const existing = state.items.find((item) => item.key === key);
          const items = existing
            ? state.items.map((item) =>
                item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
              )
            : [
                ...state.items,
                {
                  key,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0],
                  size,
                  price: product.price,
                  quantity,
                },
              ];

          return { items, isOpen: true, subtotal: computeSubtotal(items) };
        }),
      removeItem: (key) =>
        set((state) => {
          const items = state.items.filter((item) => item.key !== key);
          return { items, subtotal: computeSubtotal(items) };
        }),
      updateQuantity: (key, quantity) =>
        set((state) => {
          const items = state.items.map((item) => (item.key === key ? { ...item, quantity } : item));
          return { items, subtotal: computeSubtotal(items) };
        }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ items: [], subtotal: 0, isOpen: false }),
    }),
    {
      name: "naistyles-cart",
      partialize: (state) => ({ items: state.items, subtotal: state.subtotal }),
    },
  ),
);
