"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Minus, Plus, Cake, Heart, Sparkles, Users, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
const interior = "/assets/restaurant-interior.svg";
import Reveal from "./Reveal";
import { Motif, BadgeIcon } from "./Brand";

const occasions = [
  { icon: Cake, key: "occ_birthday" },
  { icon: Heart, key: "occ_anniversary" },
  { icon: Sparkles, key: "occ_celebration" },
  { icon: Users, key: "occ_business" },
];

const featureKeys = ["feature1", "feature2", "feature3"];

const infoCards = [
  { icon: MapPin, key: "location", lines: 2 },
  { icon: Clock, key: "hours", lines: 2 },
  { icon: Phone, key: "phone", lines: 1 },
  { icon: Mail, key: "email", lines: 1 },
];

const Reservation = () => {
  const { t } = useTranslation();
  const [partySize, setPartySize] = useState(2);
  const [occasion, setOccasion] = useState("");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", phone: "", email: "", date: "", time: "" });
      setOccasion("");
      setPartySize(2);
    }, 2800);
  };

  return (
    <section id="reservation" className="relative bg-cream text-forest py-28 overflow-hidden">
      <Motif name="palm-fronds" className="absolute top-12 right-10 w-28 text-lime pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block bg-lime text-forest text-xs font-semibold uppercase tracking-widest rounded-full px-4 py-1.5">
              {t("reservation.badge")}
            </span>
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl mt-5 leading-[0.95]">
              {t("reservation.title_pre")} <span className="text-chili">{t("reservation.title_accent")}</span>
            </h2>
            <p className="mt-5 text-lg text-forest/70">{t("reservation.sub")}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              {featureKeys.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-forest/15 px-4 py-2 text-sm font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-lime" />
                  {t(`reservation.${f}`)}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Image + info */}
          <Reveal>
            <div className="space-y-6">
              <div className="relative overflow-hidden arch-top rounded-b-3xl border-4 border-forest h-72 lg:h-80">
                <img src={interior} alt="kokoland interior" className="w-full h-full object-cover" />
                <BadgeIcon name="pure" className="absolute bottom-4 right-4 w-16 h-16 drop-shadow-lg" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {infoCards.map((c) => (
                  <div
                    key={c.key}
                    className="group rounded-2xl border-2 border-forest/10 p-5 hover:border-lime hover:bg-forest hover:text-cream transition-colors"
                  >
                    <c.icon className="w-6 h-6 mb-3 group-hover:text-lime transition-colors" />
                    <h3 className="font-display font-bold mb-1">{t(`reservation.info_${c.key}_t`)}</h3>
                    <p className="text-sm opacity-70">{t(`reservation.info_${c.key}_1`)}</p>
                    {c.lines === 2 && (
                      <p className="text-sm opacity-70">{t(`reservation.info_${c.key}_2`)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Booking form */}
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="rounded-3xl bg-forest text-cream p-8 soft-shadow">
              <h3 className="font-display font-bold text-3xl mb-1 text-lime">{t("reservation.form_title")}</h3>
              <p className="text-sm text-cream/60 mb-6">{t("reservation.form_sub")}</p>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("reservation.f_name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label={t("reservation.f_phone")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                </div>
                <Field label={t("reservation.f_email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("reservation.f_date")} type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
                  <Field label={t("reservation.f_time")} type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
                </div>

                {/* Party size */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-lime">
                    {t("reservation.f_guests")}
                  </label>
                  <div className="flex items-center gap-4 rounded-xl bg-forest-700 border-2 border-cream/10 p-2">
                    <button
                      type="button"
                      onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                      aria-label={t("reservation.f_guests_decrease") || "Decrease party size"}
                      className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-lime hover:text-forest transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center" aria-live="polite">
                      <div className="font-display font-extrabold text-3xl text-lime leading-none">{partySize}</div>
                      <div className="text-[10px] uppercase tracking-widest text-cream/65 mt-0.5">{t("reservation.f_guests_unit")}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPartySize((n) => Math.min(10, n + 1))}
                      aria-label={t("reservation.f_guests_increase") || "Increase party size"}
                      className="w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center hover:bg-lime hover:text-forest transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-lime">
                    {t("reservation.f_occasion")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {occasions.map((o) => (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => setOccasion((cur) => (cur === o.key ? "" : o.key))}
                        className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                          occasion === o.key
                            ? "border-lime bg-lime/10 text-lime"
                            : "border-cream/15 text-cream/80 hover:border-cream/40"
                        }`}
                      >
                        <o.icon className="w-4 h-4" />
                        {t(`reservation.${o.key}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center justify-center gap-2 font-semibold text-lg rounded-full py-4 transition-colors ${
                    sent ? "bg-lime text-forest" : "bg-chili text-cream hover:bg-lime hover:text-forest"
                  }`}
                >
                  {sent ? (
                    <>
                      <Check className="w-5 h-5" /> {t("reservation.sent")}
                    </>
                  ) : (
                    t("reservation.submit")
                  )}
                </motion.button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => {
  const id = `reservation-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest mb-2 text-lime">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-forest-700 rounded-xl border-2 border-cream/10 px-4 py-3 outline-none focus:border-lime transition-colors [color-scheme:dark]"
      />
    </div>
  );
};

export default Reservation;