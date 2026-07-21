"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatEur } from "@/data/menu";
import { useModalA11y } from "@/hooks/useModalA11y";
import CheckoutModal from "./CheckoutModal";

const CartDrawer = () => {
  const { t } = useTranslation();
  const { items, open, setOpen, setQty, removeItem, total, clear, count } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const dialogRef = useModalA11y(open, () => setOpen(false));

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-forest/70 backdrop-blur-sm"
            />
            <motion.aside
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-drawer-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-forest text-cream flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-cream/15">
                <h3 id="cart-drawer-title" className="font-display font-bold text-2xl flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-lime" />
                  {t("cart.title")}
                  {count > 0 && <span className="text-lime">({count})</span>}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="hover:text-lime transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-cream/60 gap-3">
                    <ShoppingBag className="w-12 h-12" />
                    <p className="font-display font-bold text-xl">{t("cart.empty_t")}</p>
                    <p className="text-sm">{t("cart.empty_d")}</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={item.name}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="flex items-center gap-3 rounded-2xl border border-cream/15 p-3"
                      >
                        <div className="flex-1">
                          <p className="font-display font-semibold">{item.name}</p>
                          <p className="text-xs text-lime">{formatEur(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(item.name, item.qty - 1)}
                            aria-label={`${t("cart.decrease") || "Decrease quantity of"} ${item.name}`}
                            className="w-7 h-7 rounded-full border border-cream/30 flex items-center justify-center hover:bg-lime hover:text-forest transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold" aria-live="polite">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.name, item.qty + 1)}
                            aria-label={`${t("cart.increase") || "Increase quantity of"} ${item.name}`}
                            className="w-7 h-7 rounded-full border border-cream/30 flex items-center justify-center hover:bg-lime hover:text-forest transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.name)}
                          className="text-cream/40 hover:text-chili transition-colors"
                          aria-label={`${t("cart.remove")} ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-5 border-t border-cream/15 space-y-4">
                  <div className="flex items-center justify-between font-display font-bold text-xl">
                    <span>{t("cart.sum")}</span>
                    <span className="text-lime">{formatEur(total)}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setOpen(false);
                      setShowCheckout(true);
                    }}
                    className="w-full font-semibold text-lg rounded-full py-4 bg-lime text-forest hover:bg-chili hover:text-cream transition-colors"
                  >
                    {t("cart.checkout")}
                  </motion.button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => {
          clear();
          setShowCheckout(false);
        }}
      />
    </>
  );
};

export default CartDrawer;