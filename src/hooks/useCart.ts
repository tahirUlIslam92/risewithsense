"use client";

import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

const CART_KEY = "watchstore-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// Global state — shared across all components
let globalItems: CartItem[] = [];
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(globalItems);

  useEffect(() => {
    globalItems = loadCart();
    setItems(globalItems);

    const listener = () => setItems([...globalItems]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    const existing = globalItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, item.stock);
    } else {
      globalItems.push({ ...item, quantity: qty });
    }
    saveCart(globalItems);
    notify();
  }, []);

  const removeItem = useCallback((id: string) => {
    globalItems = globalItems.filter((i) => i.id !== id);
    saveCart(globalItems);
    notify();
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    const item = globalItems.find((i) => i.id === id);
    if (item) item.quantity = Math.min(qty, item.stock);
    saveCart(globalItems);
    notify();
  }, [removeItem]);

  const clearCart = useCallback(() => {
    globalItems = [];
    saveCart(globalItems);
    notify();
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal };
}