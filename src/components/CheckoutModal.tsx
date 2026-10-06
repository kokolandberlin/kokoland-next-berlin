"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, ShoppingBag, CheckCircle2, Loader2, MapPin, UtensilsCrossed, Clock, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { useModalA11y } from "@/hooks/useModalA11y";
import { supabase, isSupabaseConfigured, DISHDATA_SLUG } from "@/lib/supabase";
import { formatEur } from "@/data/menu";
import { DELIVERY_LIVE, DELIVERY_PARTNERS } from "@/lib/site";
import { usePaymentsEnabled } from "@/hooks/usePaymentsEnabled";
import { useMyAccount } from "@/hooks/useMyAccount";

// Timed takeaway and dine-in orders above this amount are paid online (the server enforces the same limit).
const PREPAY_OVER = 25;
import { berlinToISO, berlinToday, isClosedDay, timeSlots } from "@/lib/berlin-time";

type OrderType = "delivery" | "takeaway" | "dine_in";

const strings = (de: boolean) =>
  de
    ? {
        how: "Wie möchtest du dein Essen bekommen?",
        soon: "Bald",
        leadHint: "Wir kochen passend zu deiner Zeit. Bitte wähle mindestens 30 Minuten im Voraus.",
        tableSend: "An die Küche senden",
        tableName: (t: string) => `Tisch ${t}`,
        tableOptionalName: "Name (optional)",
        tableOptionalEmail: "E-Mail für Punkte (optional)",
        tableSent: (t: string) => `Deine Bestellung ist in der Küche, Tisch ${t}.`,
        tableTotal: "Bisher auf deinem Tisch",
        tablePay: "Bezahlt wird am Tresen oder beim Servicepersonal. Du kannst jederzeit nachbestellen.",
        payHow: "Bezahlung",
        payOnline: "Online bezahlen",
        payOnlineHint: "Sicher mit Karte oder Wallet. Dein Tisch und dein Essen sind dann fest eingeplant.",
        payLater: "Im Restaurant bezahlen",
        payRequired: (n: number) => `Vorbestellungen über ${n} € bezahlst du online. So planen wir nichts für Gäste, die nicht kommen.`,
        payNowBtn: "Jetzt bezahlen",
        toPayment: "Weiter zur Zahlung …",
        orderPage: "Deine Bestellung ansehen",
        payPending: "Deine Bestellung ist angelegt, die Zahlung steht noch aus. Öffne die Bestellseite, um zu bezahlen.",
        checkInNote: "Tippe auf der Bestellseite „Ich bin unterwegs“, damit die Küche weiß, dass du kommst.",
        deliveryVia: "Lieferung bei uns kommt bald. Bis dahin bestellst du sie über:",
        dineIn: "Vor Ort essen",
        dineInHint: "Bestell vor, wir reservieren deinen Tisch und das Essen ist fertig, wenn du dich setzt. Keine Wartezeit.",
        when: "Wann?",
        asap: "So schnell wie möglich",
        pickTime: "Zeit wählen",
        date: "Datum",
        time: "Uhrzeit",
        chooseTime: "Zeit wählen",
        guests: "Personen",
        closedDay: "Montags ist Ruhetag. Bitte wähle Dienstag bis Sonntag.",
        noSlots: "Für diesen Tag gibt es keine freien Zeiten mehr.",
        phone: "Telefonnummer",
        phoneHint: "Damit wir dich erreichen, falls etwas ist.",
        bookedFor: (when: string, n: number) => `Dein Tisch für ${n} ist am ${when} reserviert.`,
        readyAt: (when: string) => `Fertig am ${when}.`,
        noWait: "Dein Essen wird passend zu deiner Ankunft gekocht: keine Wartezeit, nichts wird umsonst zubereitet.",
        payAtRestaurant: "Bezahlt wird im Restaurant.",
        continue: "Weiter →",
        yourTable: "Tisch & Vorbestellung",
      }
    : {
        how: "How would you like to receive your order?",
        soon: "Soon",
        leadHint: "We cook to your time, so please pick a time at least 30 minutes ahead.",
        tableSend: "Send to the kitchen",
        tableName: (t: string) => `Table ${t}`,
        tableOptionalName: "Name (optional)",
        tableOptionalEmail: "Email for points (optional)",
        tableSent: (t: string) => `Your order is with the kitchen, table ${t}.`,
        tableTotal: "So far on your table",
        tablePay: "You pay at the counter or to your waiter. Order more any time.",
        payHow: "Payment",
        payOnline: "Pay online",
        payOnlineHint: "Secure, by card or wallet. Your table and food are then locked in.",
        payLater: "Pay at the restaurant",
        payRequired: (n: number) => `Pre-orders over €${n} are paid online. That way we never prepare food for guests who do not show up.`,
        payNowBtn: "Pay now",
        toPayment: "Taking you to payment…",
        orderPage: "View your order",
        payPending: "Your order is saved but not paid yet. Open your order page to pay.",
        checkInNote: "On your order page, tap \"I'm on my way\" so the kitchen knows you are coming.",
        deliveryVia: "Delivery from us is coming soon. Until then, order delivery on:",
        dineIn: "Dine in",
        dineInHint: "Order ahead and we book your table. Your food is ready when you sit down. No waiting.",
        when: "When?",
        asap: "As soon as possible",
        pickTime: "Pick a time",
        date: "Date",
        time: "Time",
        chooseTime: "Choose a time",
        guests: "Guests",
        closedDay: "We are closed on Mondays. Please pick Tuesday to Sunday.",
        noSlots: "No times left for this day.",
        phone: "Phone number",
        phoneHint: "So we can reach you if anything changes.",
        bookedFor: (when: string, n: number) => `Your table for ${n} is booked for ${when}.`,
        readyAt: (when: string) => `Ready ${when}.`,
        noWait: "We cook to your arrival, so there is no waiting and nothing is made for nothing.",
        payAtRestaurant: "You pay at the restaurant.",
        continue: "Continue →",
        yourTable: "Table & pre-order",
      };

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const CheckoutModal = ({ open, onClose, onSuccess }: Props) => {
  const { t, i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const x = strings(de);
  const { items, total, table } = useCart();
  // A guest who scanned a table QR orders straight to the kitchen for that table and pays at the counter.
  const atTable = !!table;
  const { findZone } = useDeliveryZones();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState<"asap" | "later">("asap");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [scheduledLabel, setScheduledLabel] = useState("");
  const [payChoice, setPayChoice] = useState<"online" | "restaurant">("restaurant");
  const payEnabled = usePaymentsEnabled(open);
  // A signed-in guest checks out as their DishData customer: details pre-filled, email fixed
  // so points and order history land on their account.
  const { account } = useMyAccount();
  useEffect(() => {
    if (!open || !account) return;
    setName((v) => v || account.customer.name);
    setEmail(account.customer.email ?? "");
    setPhone((v) => v || account.customer.phone || "");
  }, [open, account]);
  const [discountCode, setDiscountCode] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);
  const [err, setErr] = useState("");

  const reset = () => {
    setStep(1);
    setOrderType(null);
    setPostcode("");
    setPostcodeError("");
    setDeliveryFee(0);
    setName("");
    setEmail("");
    setAddress("");
    setNotes("");
    setPhone("");
    setWhen("asap");
    setDate("");
    setTime("");
    setGuests(2);
    setScheduledLabel("");
    setPayChoice("restaurant");
    setDiscountCode("");
    setPlacing(false);
    setOrderNumber("");
    setOrderId("");
    setConfirmedTotal(null);
    setErr("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const dialogRef = useModalA11y(open, handleClose);

  // Table guests skip the choice of how to receive the order.
  useEffect(() => {
    if (open && atTable && step === 1) {
      setOrderType("dine_in");
      setStep(2);
    }
  }, [open, atTable, step]);

  const handleSelectType = (type: OrderType) => {
    setOrderType(type);
    // A table needs a time; delivery and takeaway can go now.
    if (type === "dine_in") setWhen("later");
    setPostcode("");
    setPostcodeError("");
    setDeliveryFee(0);
  };

  const handlePostcodeBlur = () => {
    if (orderType !== "delivery" || !postcode.trim()) return;
    const zone = findZone(postcode.trim());
    if (!zone) {
      setPostcodeError(t("checkout.postcode_error") || "Sorry, we don't deliver to this postcode yet.");
      setDeliveryFee(0);
    } else {
      setPostcodeError("");
      setDeliveryFee(zone.delivery_fee);
    }
  };

  const timed = !atTable && (orderType === "dine_in" || when === "later");
  const slots = useMemo(() => timeSlots(date), [date]);
  const closed = !!date && isClosedDay(date);
  // Online payment is on offer for takeaway and dine-in once Stripe is connected.
  const canPayOnline = payEnabled && !atTable && orderType !== null && orderType !== "delivery";
  const mustPayOnline = canPayOnline && timed && total > PREPAY_OVER;
  const payOnline = canPayOnline && (mustPayOnline || payChoice === "online");

  const canProceedStep1 = () => {
    if (!orderType) return false;
    if (timed && (!date || !time || closed || !slots.includes(time))) return false;
    if (orderType === "delivery") {
      if (!postcode.trim()) return false;
      if (postcodeError) return false;
      const zone = findZone(postcode.trim());
      if (!zone) return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!orderType) return;
    setPlacing(true);
    setErr("");

    const scheduledFor = timed ? berlinToISO(date, time) : null;
    setScheduledLabel(
      timed
        ? new Date(scheduledFor!).toLocaleString(de ? "de-DE" : "en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })
        : "",
    );

    if (!isSupabaseConfigured || !DISHDATA_SLUG) {
      await new Promise((r) => setTimeout(r, 800));
      setOrderNumber("KOK-DEMO");
      setConfirmedTotal(total + deliveryFee);
      setStep(3);
      setPlacing(false);
      return;
    }

    // place_public_order computes tax, validates the delivery zone/min-order,
    // and re-derives the fee server-side — the client's `deliveryFee` above
    // is only a pre-submit estimate for display, never what's actually charged.
    const { data, error } = await supabase.rpc("place_public_order", {
      _slug: DISHDATA_SLUG,
      _items: items.map((i) => ({ recipe_id: i.id, qty: i.qty })),
      _guest_name: name || "Guest",
      _table_name: atTable ? table : null,
      _notes: notes || null,
      _email: email || null,
      _code: discountCode || null,
      _order_type: orderType,
      _address: orderType === "delivery" ? address : null,
      _postcode: orderType === "delivery" ? postcode : null,
      // Only sent when used, so plain "as soon as possible" orders keep working
      // even before DishData migration 0074 (timed orders) has been applied.
      ...(scheduledFor ? { _scheduled_for: scheduledFor } : {}),
      ...(orderType === "dine_in" && !atTable ? { _party_size: guests } : {}),
      ...(phone.trim() ? { _phone: phone.trim() } : {}),
      ...(payOnline ? { _prepay: true } : {}),
    });

    setPlacing(false);

    if (error) {
      setErr(error.message);
      return;
    }

    const result = data as {
      order_number: string;
      order_id: string;
      total: number;
      discount: number;
      delivery_fee: number;
    };
    setOrderNumber(result.order_number ?? "KOK-???");
    setOrderId(result.order_id);
    setConfirmedTotal(result.total);

    if (payOnline) {
      // The order waits as unpaid until Stripe confirms; send the guest to pay now.
      setPlacing(true);
      const res = await fetch("/api/pay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId: result.order_id, lang: de ? "de" : "en" }) }).catch(() => null);
      const pay = res ? await res.json().catch(() => null) : null;
      if (res?.ok && pay?.url) {
        window.location.href = pay.url;
        return;
      }
      setPlacing(false);
    }
    // Pay-at-restaurant: send the confirmation emails now. (Online-paid orders are emailed once the payment lands.)
    if (!payOnline && !atTable) {
      fetch("/api/notify-order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId: result.order_id, lang: de ? "de" : "en" }) }).catch(() => null);
    }
    setStep(3);
  };

  const subtotal = total;
  const orderTotal = subtotal + deliveryFee;

  const steps = [
    t("checkout.delivery") || "Order type",
    t("checkout.title") || "Details",
    t("checkout.success_title") || "Done",
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-forest/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-modal-title"
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-forest text-cream soft-shadow pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-forest z-10 px-7 pt-7 pb-4 border-b border-cream/10">
                <div className="flex items-center justify-between mb-5">
                  <h2 id="checkout-modal-title" className="font-display font-extrabold text-2xl text-lime">
                    {t("checkout.title") || "Checkout"}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                  {steps.map((label, i) => {
                    const idx = i + 1;
                    const active = step === idx;
                    const done = step > idx;
                    return (
                      <div key={i} className="flex items-center gap-2 flex-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            done
                              ? "bg-lime text-forest"
                              : active
                              ? "bg-lime text-forest"
                              : "bg-cream/15 text-cream/65"
                          }`}
                        >
                          {idx}
                        </div>
                        <span
                          className={`text-xs font-medium hidden sm:inline transition-colors ${
                            active ? "text-lime" : done ? "text-cream/60" : "text-cream/30"
                          }`}
                        >
                          {label}
                        </span>
                        {i < steps.length - 1 && (
                          <div className={`h-px flex-1 transition-colors ${done ? "bg-lime/50" : "bg-cream/15"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-7 py-6 space-y-6">
                {/* Step 1 — Order type */}
                {step === 1 && (
                  <div className="space-y-4">
                    <p className="text-cream/60 text-sm">{x.how}</p>
                    <div className="grid grid-cols-3 gap-3">
                      {(["delivery", "takeaway", "dine_in"] as OrderType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleSelectType(type)}
                          disabled={type === "delivery" && !DELIVERY_LIVE}
                          className={`relative flex flex-col items-center gap-2.5 rounded-3xl border-2 px-2 py-5 transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                            orderType === type
                              ? "border-lime bg-lime/10 text-lime"
                              : "border-cream/15 hover:border-cream/40 text-cream"
                          }`}
                        >
                          {type === "delivery" ? (
                            <Truck className="w-7 h-7" />
                          ) : type === "takeaway" ? (
                            <ShoppingBag className="w-7 h-7" />
                          ) : (
                            <UtensilsCrossed className="w-7 h-7" />
                          )}
                          <span className="font-display font-bold text-base capitalize">
                            {type === "delivery"
                              ? t("checkout.delivery") || "Delivery"
                              : type === "takeaway"
                              ? t("checkout.takeaway") || "Takeaway"
                              : x.dineIn}
                          </span>
                          {type === "delivery" && !DELIVERY_LIVE && (
                            <span className="absolute -top-2 right-2 rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest">
                              {x.soon}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {!DELIVERY_LIVE && (
                      <div className="rounded-2xl border border-cream/15 px-4 py-3">
                        <p className="text-sm text-cream/70">{x.deliveryVia}</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {DELIVERY_PARTNERS.map((p) => (
                            <a
                              key={p.name}
                              href={p.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border-2 border-lime px-4 py-1.5 text-sm font-semibold text-lime transition-colors hover:bg-lime hover:text-forest"
                            >
                              {p.name} ↗
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {orderType === "delivery" && (
                      <div className="space-y-2">
                        <label htmlFor="checkout-postcode" className="block text-xs font-semibold uppercase tracking-widest text-cream/60">
                          {t("checkout.postcode") || "Postcode"}
                        </label>
                        <input
                          id="checkout-postcode"
                          type="text"
                          value={postcode}
                          onChange={(e) => {
                            setPostcode(e.target.value);
                            setPostcodeError("");
                          }}
                          onBlur={handlePostcodeBlur}
                          placeholder={t("checkout.postcode_placeholder") || "e.g. 10115"}
                          className="w-full bg-cream/5 border-2 border-cream/15 rounded-xl px-4 py-3 outline-none focus:border-lime transition-colors text-cream placeholder:text-cream/30"
                        />
                        {postcodeError && (
                          <p className="text-chili-text text-sm">{postcodeError}</p>
                        )}
                        {!postcodeError && deliveryFee > 0 && (
                          <p className="text-lime text-sm">
                            {t("checkout.delivery_fee") || "Delivery fee"}: {formatEur(deliveryFee)}
                          </p>
                        )}
                        {!postcodeError && deliveryFee === 0 && postcode && findZone(postcode.trim()) && (
                          <p className="text-lime text-sm">
                            {t("checkout.delivery_fee") || "Delivery fee"}: {t("checkout.free") || "Free"}
                          </p>
                        )}
                      </div>
                    )}

                    {orderType === "dine_in" && (
                      <p className="rounded-2xl bg-lime/10 px-4 py-3 text-sm text-lime">{x.dineInHint}</p>
                    )}

                    {orderType && (
                      <div className="space-y-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cream/60">
                          <Clock className="h-3.5 w-3.5" /> {x.when}
                        </p>
                        {orderType !== "dine_in" && (
                          <div className="grid grid-cols-2 gap-3" role="group">
                            {(["asap", "later"] as const).map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() => setWhen(w)}
                                aria-pressed={when === w}
                                className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                                  when === w ? "border-lime bg-lime/10 text-lime" : "border-cream/15 text-cream hover:border-cream/40"
                                }`}
                              >
                                {w === "asap" ? x.asap : x.pickTime}
                              </button>
                            ))}
                          </div>
                        )}
                        {timed && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <label className="block">
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cream/60">{x.date}</span>
                                <input
                                  type="date"
                                  min={berlinToday()}
                                  value={date}
                                  onChange={(e) => {
                                    setDate(e.target.value);
                                    setTime("");
                                  }}
                                  className="w-full rounded-xl border-2 border-cream/15 bg-cream/5 px-3 py-3 text-cream outline-none transition-colors focus:border-lime [color-scheme:dark]"
                                />
                              </label>
                              <label className="block">
                                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cream/60">{x.time}</span>
                                <select
                                  value={time}
                                  onChange={(e) => setTime(e.target.value)}
                                  disabled={!date || closed || slots.length === 0}
                                  className="w-full rounded-xl border-2 border-cream/15 bg-forest px-3 py-3 text-cream outline-none transition-colors focus:border-lime disabled:opacity-40"
                                >
                                  <option value="">{x.chooseTime}</option>
                                  {slots.map((sl) => (
                                    <option key={sl} value={sl}>{sl}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <p className="text-xs text-cream/50">{x.leadHint}</p>
                            {closed && <p className="text-sm text-chili-text">{x.closedDay}</p>}
                            {!closed && date && slots.length === 0 && <p className="text-sm text-chili-text">{x.noSlots}</p>}
                          </div>
                        )}
                        {orderType === "dine_in" && (
                          <div>
                            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cream/60">{x.guests}</span>
                            <div className="flex items-center gap-4 rounded-xl border-2 border-cream/15 bg-cream/5 p-1.5">
                              <button type="button" aria-label="-" onClick={() => setGuests((n) => Math.max(1, n - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 hover:bg-lime hover:text-forest">
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="flex-1 text-center font-display text-2xl font-extrabold text-lime" aria-live="polite">{guests}</span>
                              <button type="button" aria-label="+" onClick={() => setGuests((n) => Math.min(12, n + 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 hover:bg-lime hover:text-forest">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      disabled={!canProceedStep1()}
                      onClick={() => setStep(2)}
                      className="w-full bg-lime text-forest font-semibold text-lg rounded-full py-4 hover:bg-chili hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {x.continue}
                    </button>
                  </div>
                )}

                {/* Step 2 — Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    {atTable && <p className="rounded-2xl bg-lime/10 px-4 py-3 text-sm font-semibold text-lime">{x.tableName(table!)}</p>}
                    <Field
                      label={atTable ? x.tableOptionalName : t("checkout.name") || "Your name"}
                      value={name}
                      onChange={setName}
                      required={!atTable}
                    />
                    <Field
                      label={atTable ? x.tableOptionalEmail : t("checkout.email") || "Email address"}
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required={!atTable}
                      readOnly={!!account?.customer.email}
                    />
                    {!atTable && <div>
                      <Field
                        label={x.phone}
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        required={orderType === "dine_in"}
                      />
                      {orderType === "dine_in" && <p className="mt-1.5 text-xs text-cream/50">{x.phoneHint}</p>}
                    </div>}
                    {orderType === "delivery" && (
                      <div>
                        <label htmlFor="checkout-address" className="block text-xs font-semibold uppercase tracking-widest mb-2 text-cream/60">
                          {t("checkout.address") || "Delivery address"}
                        </label>
                        <textarea
                          id="checkout-address"
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-cream/5 border-2 border-cream/15 rounded-xl px-4 py-3 outline-none focus:border-lime transition-colors text-cream placeholder:text-cream/30 resize-none"
                        />
                      </div>
                    )}
                    <Field
                      label={t("checkout.notes") || "Special requests"}
                      value={notes}
                      onChange={setNotes}
                    />
                    <Field
                      label={t("checkout.discount") || "Discount code"}
                      value={discountCode}
                      onChange={setDiscountCode}
                    />

                    {canPayOnline && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-cream/60">{x.payHow}</p>
                        <div className="grid grid-cols-2 gap-3" role="group">
                          {(["online", "restaurant"] as const).map((c) => {
                            const active = (mustPayOnline ? "online" : payChoice) === c;
                            return (
                              <button
                                key={c}
                                type="button"
                                disabled={mustPayOnline && c === "restaurant"}
                                onClick={() => setPayChoice(c)}
                                aria-pressed={active}
                                className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                  active ? "border-lime bg-lime/10 text-lime" : "border-cream/15 text-cream hover:border-cream/40"
                                }`}
                              >
                                {c === "online" ? x.payOnline : x.payLater}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-cream/50">{mustPayOnline ? x.payRequired(PREPAY_OVER) : payOnline ? x.payOnlineHint : x.payAtRestaurant}</p>
                      </div>
                    )}

                    {/* Order summary */}
                    <div className="rounded-2xl border border-cream/15 p-4 space-y-2">
                      <p className="font-display font-bold text-sm uppercase tracking-widest text-lime mb-3">
                        {t("checkout.order_summary") || "Order summary"}
                      </p>
                      {timed && date && time && (
                        <p className="mb-2 text-sm text-cream/80">
                          {orderType === "dine_in" ? `${x.yourTable}: ` : ""}
                          {new Date(berlinToISO(date, time)).toLocaleString(de ? "de-DE" : "en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })}
                          {orderType === "dine_in" ? ` · ${guests}` : ""}
                        </p>
                      )}
                      {items.map((item) => (
                        <div key={item.name} className="flex justify-between text-sm">
                          <span className="text-cream/70">
                            {item.name} × {item.qty}
                          </span>
                          <span>{formatEur(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t border-cream/10 pt-2 mt-2 space-y-1">
                        <div className="flex justify-between text-sm text-cream/60">
                          <span>{t("checkout.subtotal") || "Subtotal"}</span>
                          <span>{formatEur(subtotal)}</span>
                        </div>
                        {orderType === "delivery" && (
                          <div className="flex justify-between text-sm text-cream/60">
                            <span>{t("checkout.delivery_fee") || "Delivery fee"}</span>
                            <span>
                              {deliveryFee === 0
                                ? t("checkout.free") || "Free"
                                : formatEur(deliveryFee)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-display font-bold text-lg text-lime pt-1">
                          <span>{t("checkout.total") || "Total"}</span>
                          <span>{formatEur(orderTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {err && (
                      <p className="text-chili-text text-sm bg-chili/10 rounded-lg px-3 py-2">{err}</p>
                    )}

                    <div className="flex gap-3">
                      {!atTable && <button
                        onClick={() => setStep(1)}
                        aria-label={t("checkout.back") || "Back"}
                        className="rounded-full px-6 py-4 border-2 border-cream/20 font-medium hover:border-cream/40 transition-colors"
                      >
                        ←
                      </button>}
                      <button
                        disabled={placing || (!atTable && (!name.trim() || !email.trim() || (orderType === "dine_in" && phone.trim().length < 5)))}
                        onClick={placeOrder}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full py-4 hover:bg-chili hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {placing && <Loader2 className="w-5 h-5 animate-spin" />}
                        {placing
                          ? payOnline && orderId
                            ? x.toPayment
                            : t("checkout.placing") || "Placing order…"
                          : payOnline
                          ? x.payNowBtn
                          : atTable
                          ? x.tableSend
                          : t("checkout.place_order") || "Place order"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 — Confirmation */}
                {step === 3 && (
                  <div className="flex flex-col items-center text-center py-4 gap-5">
                    <div className="w-20 h-20 rounded-full bg-lime/15 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-lime" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-3xl text-lime mb-2">
                        {t("checkout.success_title") || "Order placed!"}
                      </h3>
                      <p className="text-cream/60 mb-2">
                        {atTable
                          ? x.tableSent(table!)
                          : payOnline
                          ? x.payPending
                          : orderType === "dine_in"
                          ? x.bookedFor(scheduledLabel, guests)
                          : scheduledLabel
                          ? x.readyAt(scheduledLabel)
                          : t("checkout.success_sub") || "We'll prepare your order and be in touch."}
                      </p>
                      {atTable && <p className="mb-2 text-sm text-cream/60">{x.tablePay}</p>}
                      {orderType === "dine_in" && !payOnline && !atTable && (
                        <p className="mb-2 text-sm text-cream/60">
                          {x.noWait} {x.payAtRestaurant}
                        </p>
                      )}
                      {confirmedTotal != null && (
                        <p className="font-display font-bold text-lg text-lime mb-2">
                          {atTable ? `${x.tableTotal}: ` : ""}{formatEur(confirmedTotal)}
                        </p>
                      )}
                      {orderNumber && (
                        <p className="font-mono text-xs bg-cream/10 rounded-full px-4 py-1.5 inline-block text-cream/70">
                          {orderNumber}
                        </p>
                      )}
                    </div>
                    {orderId && orderType !== "delivery" && !atTable && (
                      <>
                        {scheduledLabel && !payOnline && <p className="text-sm text-cream/60">{x.checkInNote}</p>}
                        <Link
                          href={`/order/${orderId}`}
                          onClick={() => {
                            onSuccess();
                            reset();
                          }}
                          className="inline-flex items-center gap-2 border-2 border-lime text-lime font-semibold rounded-full px-6 py-3 hover:bg-lime hover:text-forest transition-colors"
                        >
                          {x.orderPage}
                        </Link>
                      </>
                    )}
                    {orderId && orderType === "delivery" && (
                      <Link
                        href={`/track/${orderId}`}
                        onClick={() => {
                          onSuccess();
                          reset();
                        }}
                        className="inline-flex items-center gap-2 border-2 border-lime text-lime font-semibold rounded-full px-6 py-3 hover:bg-lime hover:text-forest transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        {t("checkout.track_link") || "Track your order"}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        onSuccess();
                        reset();
                      }}
                      className="bg-lime text-forest font-semibold text-lg rounded-full px-8 py-4 hover:bg-chili hover:text-cream transition-colors"
                    >
                      {t("checkout.back_to_menu") || "Back to menu"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) => {
  const id = `checkout-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest mb-2 text-cream/60">
        {label}
        {required && <span className="text-chili-text ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-cream/5 border-2 border-cream/15 rounded-xl px-4 py-3 outline-none focus:border-lime transition-colors text-cream placeholder:text-cream/30 ${readOnly ? "opacity-60" : ""}`}
      />
    </div>
  );
};

export default CheckoutModal;