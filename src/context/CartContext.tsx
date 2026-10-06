"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { track } from "@/lib/track";

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
  /** The table a guest scanned (QR on the table), kept for the visit. Null = not ordering at a table. */
  table: string | null;
  setTable: (table: string | null) => void;
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [table, setTableState] = useState<string | null>(null);

  // Remember the table for this visit (a refresh or a trip to another page must not forget it).
  useEffect(() => {
    try {
      setTableState(sessionStorage.getItem("kokoland.table"));
    } catch {
      /* storage unavailable: the table lives in memory only */
    }
  }, []);
  const setTable = (next: string | null) => {
    setTableState(next);
    try {
      if (next) sessionStorage.setItem("kokoland.table", next);
      else sessionStorage.removeItem("kokoland.table");
    } catch {
      /* ignore */
    }
  };

  const addItem = (id: string, name: string, price: number) => {
    track("add_to_cart", { currency: "EUR", value: price, items: [{ item_id: id, item_name: name, price, quantity: 1 }] });
    setItems((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) {
        return prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, name, price, qty: 1 }];
    });
  };

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
      value={{ items, addItem, removeItem, setQty, clear, table, setTable, count, total, open, setOpen }}
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