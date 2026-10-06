"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Loader2, Footprints, CreditCard } from "lucide-react";
import { supabase, isSupabaseConfigured, DISHDATA_SLUG } from "@/lib/supabase";
import { formatEur } from "@/data/menu";

interface OrderCard {
  order_number: string;
  order_type: "dine_in" | "takeaway" | "delivery";
  total: number;
  status: "open" | "paid" | "void" | "refunded";
  payment_state: "awaiting" | "paid" | null;
  scheduled_for: string | null;
  checked_in_at: string | null;
  party_size: number | null;
}

const strings = (de: boolean) =>
  de
    ? {
        loading: "Wird geladen …",
        notFound: "Wir konnten diese Bestellung nicht finden.",
        title: "Deine Bestellung",
        awaiting: "Die Zahlung ist noch offen. Erst nach der Zahlung reservieren wir deinen Tisch und kochen für dich.",
        payNow: "Jetzt bezahlen",
        paying: "Weiter zur Zahlung …",
        paidThanks: "Bezahlt, danke! Wir kochen für dich, passend zu deiner Ankunft.",
        cancelled: "Die Zahlung wurde abgebrochen. Du kannst es nochmal versuchen.",
        when: "Wann",
        guests: "Personen",
        total: "Gesamt",
        payAtRestaurant: "Bezahlt wird im Restaurant.",
        checkInTitle: "Fast da?",
        checkInBody: "Tippe, wenn du etwa 10 Minuten entfernt bist. Dann fangen wir an zu kochen, damit dein Essen fertig ist, wenn du ankommst.",
        checkIn: "Ich bin in 10 Minuten da",
        checkedIn: "Super, die Küche weiß Bescheid. Bis gleich!",
        cancelPolicy: "Du musst absagen? Ruf uns bitte spätestens 2 Stunden vorher an: +49 176 24404981. Danach können wir bereits Gekochtes nicht erstatten.",
        home: "Zur Startseite",
        error: "Das hat nicht geklappt. Bitte versuche es nochmal.",
      }
    : {
        loading: "Loading…",
        notFound: "We couldn't find that order.",
        title: "Your order",
        awaiting: "Payment is still open. We book your table and start cooking once it is paid.",
        payNow: "Pay now",
        paying: "Taking you to payment…",
        paidThanks: "Paid, thank you! We cook to your arrival.",
        cancelled: "The payment was cancelled. You can try again.",
        when: "When",
        guests: "Guests",
        total: "Total",
        payAtRestaurant: "You pay at the restaurant.",
        checkInTitle: "Nearly here?",
        checkInBody: "Tap when you are about 10 minutes away. We start cooking then, so your food is ready when you arrive.",
        checkIn: "I'm 10 minutes away",
        checkedIn: "Great, the kitchen knows. See you soon!",
        cancelPolicy: "Need to cancel? Please call us at least 2 hours before: +49 176 24404981. After that we cannot refund food that is already cooked.",
        home: "Back to home",
        error: "That did not work. Please try again.",
      };

export default function OrderPage() {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const x = strings(de);
  const { orderId } = useParams<{ orderId: string }>();
  const search = useSearchParams();
  const [order, setOrder] = useState<OrderCard | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured || !DISHDATA_SLUG) return setState("missing");
    const { data, error } = await supabase.rpc("get_public_order_card", { _slug: DISHDATA_SLUG, _order_id: orderId });
    if (error || !data) return setState("missing");
    setOrder(data as OrderCard);
    setState("ready");
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  // The Stripe webhook can land a moment after the guest returns: keep checking while payment is pending.
  useEffect(() => {
    if (order?.payment_state !== "awaiting") return;
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [order?.payment_state, load]);

  const pay = async () => {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/pay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId, lang: de ? "de" : "en" }) }).catch(() => null);
    const data = res ? await res.json().catch(() => null) : null;
    if (!res?.ok || !data?.url) {
      setBusy(false);
      setErr(data?.error ?? x.error);
      return;
    }
    window.location.href = data.url;
  };

  const checkIn = async () => {
    setBusy(true);
    setErr("");
    const { error } = await supabase.rpc("guest_check_in", { _slug: DISHDATA_SLUG, _order_id: orderId });
    setBusy(false);
    if (error) return setErr(error.message);
    load();
  };

  if (state === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-forest text-cream">
        <Loader2 className="h-8 w-8 animate-spin text-lime" aria-label={x.loading} />
      </main>
    );
  }

  if (state === "missing" || !order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest px-5 text-center text-cream">
        <p>{x.notFound}</p>
        <Link href="/" className="rounded-full bg-lime px-6 py-3 font-semibold text-forest">{x.home}</Link>
      </main>
    );
  }

  const awaiting = order.payment_state === "awaiting";
  const paid = order.payment_state === "paid";
  const when = order.scheduled_for
    ? new Date(order.scheduled_for).toLocaleString(de ? "de-DE" : "en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })
    : null;
  const canCheckIn = !awaiting && !!order.scheduled_for;

  return (
    <main className="min-h-screen bg-forest px-5 py-16 text-cream">
      <div className="mx-auto max-w-md space-y-6">
        <header className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-lime">{x.title}</h1>
          <p className="mt-2 inline-block rounded-full bg-cream/10 px-4 py-1.5 font-mono text-xs text-cream/70">{order.order_number}</p>
        </header>

        <section className="space-y-2 rounded-3xl border border-cream/15 p-5 text-sm">
          {when && <Row label={x.when} value={when} />}
          {order.party_size && <Row label={x.guests} value={String(order.party_size)} />}
          <Row label={x.total} value={formatEur(order.total)} strong />
          {!awaiting && !paid && <p className="pt-2 text-cream/60">{x.payAtRestaurant}</p>}
        </section>

        {search.get("cancelled") && awaiting && <p className="rounded-xl bg-chili/10 px-4 py-3 text-sm text-chili-text">{x.cancelled}</p>}

        {awaiting && (
          <div className="space-y-3 text-center">
            <p className="text-cream/70">{x.awaiting}</p>
            <button
              onClick={pay}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime py-4 text-lg font-semibold text-forest transition-colors hover:bg-chili hover:text-cream disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
              {busy ? x.paying : x.payNow}
            </button>
          </div>
        )}

        {paid && (
          <p className="flex items-center justify-center gap-2 text-center text-lime">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> {x.paidThanks}
          </p>
        )}

        {canCheckIn && (
          <section className="space-y-3 rounded-3xl bg-lime/10 p-5 text-center">
            <p className="font-display text-lg font-bold text-lime">{x.checkInTitle}</p>
            {order.checked_in_at ? (
              <p className="flex items-center justify-center gap-2 text-cream/90">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-lime" /> {x.checkedIn}
              </p>
            ) : (
              <>
                <p className="text-sm text-cream/70">{x.checkInBody}</p>
                <button
                  onClick={checkIn}
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-lime py-3.5 font-semibold text-lime transition-colors hover:bg-lime hover:text-forest disabled:opacity-50"
                >
                  <Footprints className="h-5 w-5" /> {x.checkIn}
                </button>
              </>
            )}
          </section>
        )}

        {err && <p role="alert" className="rounded-xl bg-chili/10 px-4 py-3 text-sm text-chili-text">{err}</p>}
        {!!order.scheduled_for && <p className="text-center text-xs text-cream/50">{x.cancelPolicy}</p>}
        <p className="text-center">
          <Link href="/" className="text-sm text-cream/60 underline hover:text-lime">{x.home}</Link>
        </p>
      </div>
    </main>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-cream/60">{label}</span>
      <span className={strong ? "font-display text-lg font-bold text-lime" : ""}>{value}</span>
    </div>
  );
}
