"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (id: string, name: string, price: number) => void;
  removeItem: (name: string) => void;
  setQty: (name: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const addItem = (id: string, name: string, price: number) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, name, price, qty: 1 }];
    });

  const removeItem = (name: string) =>
    setItems((prev) => prev.filter((i) => i.name !== name));

  const setQty = (name: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.name !== name)
        : prev.map((i) => (i.name === name ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQty, clear, count, total, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};