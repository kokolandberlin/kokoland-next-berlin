"use client";

import { UtensilsCrossed, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";

/** A slim pill while a guest is ordering for a table, so they always know where the food goes. */
export default function TableBanner() {
  const { table, setTable } = useCart();
  const { i18n } = useTranslation();
  if (!table) return null;
  const de = (i18n.language || "en").startsWith("de");
  return (
    <div className="fixed left-1/2 top-[72px] z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-sm font-semibold text-forest shadow-lg">
      <UtensilsCrossed className="h-4 w-4" aria-hidden />
      {de ? `Tisch ${table}: Bestellung geht direkt in die Küche` : `Table ${table}: your order goes straight to the kitchen`}
      <button type="button" onClick={() => setTable(null)} aria-label={de ? "Tisch verlassen" : "Leave table"} className="ml-1 rounded-full p-0.5 hover:bg-forest/10">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
