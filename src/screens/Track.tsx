"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Circle, Loader2, AlertTriangle } from "lucide-react";
import { supabase, isSupabaseConfigured, DISHDATA_SLUG } from "@/lib/supabase";
import { formatEur } from "@/data/menu";
import {
  deriveStage,
  isTerminal,
  hasLiveLocation,
  type PublicOrderStatus,
} from "@/lib/orderStatus";

// react-leaflet touches `window` at import time — must never be server-rendered.
const RiderMap = dynamic(() => import("@/components/RiderMap"), { ssr: false });

const POLL_MS = 7000;

export default function Track() {
  const { t } = useTranslation();
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const [order, setOrder] = useState<PublicOrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !DISHDATA_SLUG) {
      setError(t("track.unavailable") || "Order tracking isn't available right now.");
      setLoading(false);
      return;
    }

    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      const { data, error: rpcError } = await supabase.rpc("get_public_order_status", {
        _slug: DISHDATA_SLUG,
        _order_id: orderId,
      });
      if (!active) return;

      if (rpcError) {
        setError(t("track.not_found") || "We couldn't find that order.");
        setLoading(false);
        return;
      }

      const result = data as PublicOrderStatus;
      setOrder(result);
      setError(null);
      setLoading(false);

      if (!isTerminal(result)) {
        timer = setTimeout(poll, POLL_MS);
      }
    };

    poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-forest text-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lime" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-forest text-cream flex flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertTriangle className="w-10 h-10 text-chili-text" />
        <p className="text-cream/70">{error}</p>
      </div>
    );
  }

  const { stages, index, failed } = deriveStage(order);
  const showMap = hasLiveLocation(order);

  return (
    <div className="min-h-screen bg-forest text-cream px-5 py-16">
      <div className="max-w-lg mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-lime mb-2">
          {t("track.kicker") || "Order status"}
        </p>
        <h1 className="font-display font-extrabold text-3xl mb-1">{order.order_number}</h1>
        <p className="text-cream/60 mb-8">
          {t("track.placed_at") || "Placed"} {new Date(order.created_at).toLocaleTimeString()}
        </p>

        {failed ? (
          <div className="rounded-2xl border-2 border-chili/50 bg-chili/10 p-5 mb-8">
            <p className="text-chili-text font-semibold">
              {t("track.failed") || "There's an issue with delivery — we'll be in touch shortly."}
            </p>
          </div>
        ) : (
          <div className="mb-8">
            {stages.map((s, i) => {
              const done = i < index;
              const active = i === index;
              return (
                <div key={s.key} className="flex items-start gap-3 pb-6 last:pb-0 relative">
                  {i < stages.length - 1 && (
                    <div
                      className={`absolute left-[11px] top-6 w-0.5 h-full ${
                        done ? "bg-lime" : "bg-cream/15"
                      }`}
                    />
                  )}
                  {done ? (
                    <CheckCircle2 className="w-6 h-6 text-lime shrink-0" />
                  ) : (
                    <Circle
                      className={`w-6 h-6 shrink-0 ${active ? "text-lime" : "text-cream/45"}`}
                      fill={active ? "currentColor" : "none"}
                    />
                  )}
                  <span
                    className={`font-medium pt-0.5 ${
                      done || active ? "text-cream" : "text-cream/60"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {showMap && order.rider_lat != null && order.rider_lng != null && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-cream/60 mb-2">
              {t("track.rider_location") || "Your rider"}
            </p>
            <RiderMap lat={order.rider_lat} lng={order.rider_lng} />
          </div>
        )}

        <div className="rounded-2xl border border-cream/15 p-5 space-y-2">
          <p className="font-display font-bold text-sm uppercase tracking-widest text-lime mb-2">
            {t("checkout.order_summary") || "Order summary"}
          </p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-cream/70">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{formatEur(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between font-display font-bold text-lg text-lime pt-2 border-t border-cream/10 mt-2">
            <span>{t("checkout.total") || "Total"}</span>
            <span>{formatEur(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
