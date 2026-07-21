"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, ShoppingBag, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useDeliveryZones } from "@/hooks/useDeliveryZones";
import { useModalA11y } from "@/hooks/useModalA11y";
import { supabase, isSupabaseConfigured, DISHDATA_SLUG } from "@/lib/supabase";
import { formatEur } from "@/data/menu";

type OrderType = "delivery" | "takeaway";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const CheckoutModal = ({ open, onClose, onSuccess }: Props) => {
  const { t } = useTranslation();
  const { items, total } = useCart();
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

  const handleSelectType = (type: OrderType) => {
    setOrderType(type);
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

  const canProceedStep1 = () => {
    if (!orderType) return false;
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
      _table_name: null,
      _notes: notes || null,
      _email: email || null,
      _code: discountCode || null,
      _order_type: orderType,
      _address: orderType === "delivery" ? address : null,
      _postcode: orderType === "delivery" ? postcode : null,
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
                    <p className="text-cream/60 text-sm">How would you like to receive your order?</p>
                    <div className="grid grid-cols-2 gap-4">
                      {(["delivery", "takeaway"] as OrderType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleSelectType(type)}
                          className={`flex flex-col items-center gap-3 rounded-3xl border-2 p-6 transition-all ${
                            orderType === type
                              ? "border-lime bg-lime/10 text-lime"
                              : "border-cream/15 hover:border-cream/40 text-cream"
                          }`}
                        >
                          {type === "delivery" ? (
                            <Truck className="w-8 h-8" />
                          ) : (
                            <ShoppingBag className="w-8 h-8" />
                          )}
                          <span className="font-display font-bold text-lg capitalize">
                            {type === "delivery"
                              ? t("checkout.delivery") || "Delivery"
                              : t("checkout.takeaway") || "Takeaway"}
                          </span>
                        </button>
                      ))}
                    </div>

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

                    <button
                      disabled={!canProceedStep1()}
                      onClick={() => setStep(2)}
                      className="w-full bg-lime text-forest font-semibold text-lg rounded-full py-4 hover:bg-chili hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue →
                    </button>
                  </div>
                )}

                {/* Step 2 — Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <Field
                      label={t("checkout.name") || "Your name"}
                      value={name}
                      onChange={setName}
                      required
                    />
                    <Field
                      label={t("checkout.email") || "Email address"}
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required
                    />
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

                    {/* Order summary */}
                    <div className="rounded-2xl border border-cream/15 p-4 space-y-2">
                      <p className="font-display font-bold text-sm uppercase tracking-widest text-lime mb-3">
                        {t("checkout.order_summary") || "Order summary"}
                      </p>
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
                      <button
                        onClick={() => setStep(1)}
                        aria-label={t("checkout.back") || "Back"}
                        className="rounded-full px-6 py-4 border-2 border-cream/20 font-medium hover:border-cream/40 transition-colors"
                      >
                        ←
                      </button>
                      <button
                        disabled={placing || !name.trim() || !email.trim()}
                        onClick={placeOrder}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full py-4 hover:bg-chili hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {placing && <Loader2 className="w-5 h-5 animate-spin" />}
                        {placing
                          ? t("checkout.placing") || "Placing order…"
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
                        {t("checkout.success_sub") || "We'll prepare your order and be in touch."}
                      </p>
                      {confirmedTotal != null && (
                        <p className="font-display font-bold text-lg text-lime mb-2">
                          {formatEur(confirmedTotal)}
                        </p>
                      )}
                      {orderNumber && (
                        <p className="font-mono text-xs bg-cream/10 rounded-full px-4 py-1.5 inline-block text-cream/70">
                          {orderNumber}
                        </p>
                      )}
                    </div>
                    {orderId && (
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cream/5 border-2 border-cream/15 rounded-xl px-4 py-3 outline-none focus:border-lime transition-colors text-cream placeholder:text-cream/30"
      />
    </div>
  );
};

export default CheckoutModal;