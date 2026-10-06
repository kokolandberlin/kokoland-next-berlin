"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/track";

/**
 * Where a table QR code lands (kokoland.de/t/T1). Remembers the table for this visit and
 * sends the guest to the menu; everything they order from then on goes to the kitchen
 * for that table and is paid at the counter.
 */
export default function TableEntry() {
  const params = useParams<{ table: string }>();
  const router = useRouter();
  const { setTable } = useCart();

  useEffect(() => {
    // Table names are short labels like "T1" or "Window 2": keep it tame before it travels anywhere.
    const raw = decodeURIComponent(params.table ?? "").trim().slice(0, 24);
    if (/^[\p{L}\p{N} ._-]+$/u.test(raw)) {
      setTable(raw);
      track("table_scan", { table: raw });
    }
    router.replace("/menu#all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.table]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-forest">
      <Loader2 className="h-8 w-8 animate-spin text-lime" aria-hidden />
    </main>
  );
}
