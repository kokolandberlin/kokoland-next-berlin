"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Minus, Plus, Cake, Heart, Sparkles, Users, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
const feastPhoto = "/assets/story-feast.jpg";
import Reveal from "./Reveal";
import { Motif } from "./Brand";
import FloatingPlates, { type PlateSpot } from "./FloatingPlates";
import { plates } from "@/data/food-photos";
import { supabasePublic as supabase, DISHDATA_SLUG } from "@/lib/supabase";
import { berlinToISO } from "@/lib/berlin-time";

// Plates around the headline; they drift and turn as the section scrolls by.
// Phones: three plates in a band above the headline and three below the text, so none sit on the words.
const PLATE_SPOTS_PHONE: PlateSpot[] = [
  { photo: plates.porottaBeef, left: "-3%", top: "-3%", vw: 25, min: 84, max: 130, drift: 12, spin: 55, tilt: -8 },
  { photo: plates.coconutPudding, left: "50%", top: "-1%", vw: 17, min: 58, max: 90, drift: 14, spin: -60, tilt: 0, centerX: true },
  { photo: plates.paneerChilli, left: "76%", top: "-3%", vw: 24, min: 80, max: 120, drift: 12, spin: -50, tilt: 0 },
  { photo: plates.samosa, left: "-2%", top: "89%", vw: 27, min: 88, max: 135, drift: 12, spin: 50, tilt: 10 },
  { photo: plates.kappaBiryani, left: "50%", top: "91%", vw: 21, min: 70, max: 105, drift: 10, spin: 45, tilt: 0, centerX: true },
  { photo: plates.beefDry, left: "74%", top: "89%", vw: 26, min: 84, max: 130, drift: 12, spin: -45, tilt: -6 },
];

const PLATE_SPOTS: PlateSpot[] = [
  { photo: plates.porottaBeef, left: "-3%", top: "-6%", vw: 17, max: 250, drift: 70, spin: 38, tilt: -12 },
  { photo: plates.kappaBiryani, left: "81%", top: "-8%", vw: 18, max: 270, drift: 90, spin: -42, tilt: 10 },
  { photo: plates.coconutPudding, left: "-2%", top: "46%", vw: 10, min: 64, max: 160, drift: 55, spin: 55, tilt: 20, desktopOnly: true },
  { photo: plates.paneerChilli, left: "86%", top: "52%", vw: 12, min: 70, max: 180, drift: 60, spin: -50, tilt: -8 },
  { photo: plates.samosa, left: "24%", top: "-14%", vw: 9, min: 60, max: 150, drift: 40, spin: 30, tilt: 8, desktopOnly: true },
];

const occasions = [
  { icon: Cake, key: "occ_birthday" },
  { icon: Heart, key: "occ_anniversary" },
  { icon: Sparkles, key: "occ_celebration" },
  { icon: Users, key: "occ_business" },
];

// Staff read the note, so occasions are written in English regardless of site language.
const OCCASION_NOTE: Record<string, string> = {
  occ_birthday: "Birthday",
  occ_anniversary: "Anniversary",
  occ_celebration: "Celebration",
  occ_business: "Business",
};

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
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "" });
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // The section warms from cream to a blush as it crosses the screen and settles back.
  const bg = useTransform(scrollYProgress, [0, 0.25, 0.6, 1], ["#F9F1E4", "#F8E3D9", "#F8E3D9", "#F9F1E4"]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || !form.name.trim() || !form.phone.trim() || !form.date || !form.time) return;
    setSending(true);
    setFailed(false);
    const note = [form.email.trim() && `Email: ${form.email.trim()}`, occasion && `Occasion: ${OCCASION_NOTE[occasion]}`, "Booked on the website"]
      .filter(Boolean)
      .join(" | ");
    const { error } = await supabase.rpc("place_public_reservation", {
      _slug: DISHDATA_SLUG,
      _guest_name: form.name.trim(),
      _phone: form.phone.trim(),
      _party_size: partySize,
      _starts_at: berlinToISO(form.date, form.time),
      _note: note,
    });
    setSending(false);
    if (error) {
      setFailed(true);
      return;
    }
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", phone: "", email: "", date: "", time: "" });
      setOccasion("");
      setPartySize(2);
    }, 4000);
  };

  return (
    <motion.section ref={sectionRef} id="reservation" style={{ backgroundColor: bg }} className="relative bg-cream text-forest py-14 md:py-28 overflow-hidden">
      <Motif name="palm-fronds" className="absolute top-12 right-10 hidden w-28 text-lime pointer-events-none md:block" />

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <div className="relative mb-10 pb-40 pt-28 md:mb-14 md:py-24">
          <div className="absolute inset-0 md:hidden">
            <FloatingPlates spots={PLATE_SPOTS_PHONE} progress={scrollYProgress} rings={false} />
          </div>
          <div className="absolute inset-0 hidden md:block">
            <FloatingPlates spots={PLATE_SPOTS} progress={scrollYProgress} />
          </div>
        <Reveal>
          <div className="relative text-center max-w-3xl mx-auto">
            <span className="inline-block bg-lime text-forest text-xs font-semibold uppercase tracking-widest rounded-full px-4 py-1.5">
              {t("reservation.badge")}
            </span>
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl mt-5 leading-[0.95]">
              {t("reservation.title_pre")} <span className="text-chili">{t("reservation.title_accent")}</span>
            </h2>
            <p className="mt-5 text-lg text-forest/70">{t("reservation.sub")}</p>
          </div>
        </Reveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Image + info */}
          <Reveal>
            <div className="space-y-6">
              <div className="group relative overflow-hidden arch-top rounded-b-3xl border-4 border-forest h-80 sm:h-96 lg:h-[27rem]">
                <img
                  src={feastPhoto}
                  alt="The kokoland spread: Kerala dishes laid out across the table"
                  className="w-full h-full object-cover object-[25%_35%] origin-left scale-[1.07] group-hover:scale-[1.12] transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-5 -rotate-6 rounded-full bg-chili px-5 py-3 font-display text-sm font-bold text-cream soft-shadow">
                  {t("reservation.photo_badge")}
                </div>
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
                  <Field label={t("reservation.f_name")} required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label={t("reservation.f_phone")} type="tel" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                </div>
                <Field label={t("reservation.f_email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t("reservation.f_date")} type="date" min={today} required value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
                  <Field label={t("reservation.f_time")} type="time" required value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
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
                  ) : sending ? (
                    t("reservation.sending")
                  ) : (
                    t("reservation.submit")
                  )}
                </motion.button>
                {failed && (
                  <p role="alert" className="text-sm text-chili-text text-center">
                    {t("reservation.error")}
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </motion.section>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  min,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  min?: string;
  required?: boolean;
}) => {
  const id = `reservation-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest mb-2 text-lime">{label}</label>
      <input
        id={id}
        type={type}
        min={min}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-forest-700 rounded-xl border-2 border-cream/10 px-4 py-3 outline-none focus:border-lime transition-colors [color-scheme:dark]"
      />
    </div>
  );
};

export default Reservation;