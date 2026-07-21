"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";
const celebration = "/assets/celebration.svg";
import Reveal from "./Reveal";
import { Motif, BadgeIcon, IconName } from "./Brand";
import { StampField } from "./BrandDecor";

const services: { icon: IconName; key: string }[] = [
  { icon: "pure", key: "service1" },
  { icon: "mortar", key: "service2" },
  { icon: "fresh", key: "service3" },
];

const Catering = () => {
  const { t } = useTranslation();
  const [openQuote, setOpenQuote] = useState(false);

  return (
    <section id="catering" className="relative bg-forest text-cream py-28 overflow-hidden">
      <Motif name="palm-tree" className="absolute -left-12 bottom-0 w-60 text-lime/10 animate-sway origin-bottom pointer-events-none" />
      <Motif name="elephants" className="absolute top-16 right-10 w-28 text-lime/15 pointer-events-none" />

      <StampField variant="catering" />

      <div className="max-w-7xl mx-auto px-5 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <Reveal>
          <div className="relative overflow-hidden arch-top rounded-b-3xl border-4 border-lime soft-shadow order-2 lg:order-1">
            <img src={celebration} alt="Kerala celebration catering" className="w-full h-[400px] object-cover" />
            <div className="absolute top-4 left-4 bg-chili text-cream font-display font-bold text-sm rounded-full px-4 py-2 rotate-[-4deg]">
              {t("catering.badge")}
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-lime/15 text-lime rounded-full px-4 py-1.5 text-sm font-semibold">
              {t("catering.kicker")}
            </span>
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl mt-5 leading-[0.95]">
              {t("catering.title_pre")} <span className="text-lime">{t("catering.title_accent")}</span>
            </h2>
            <p className="mt-5 text-lg text-cream/75 max-w-lg">{t("catering.body")}</p>
          </Reveal>

          <div className="mt-8 space-y-3">
            {services.map((s, i) => (
              <Reveal key={s.key} delay={0.08 * i}>
                <div className="group flex items-center gap-4 rounded-2xl border-2 border-cream/10 p-4 hover:border-lime hover:bg-cream hover:text-forest transition-all duration-300">
                  <BadgeIcon name={s.icon} className="w-12 h-12 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg">{t(`catering.${s.key}_t`)}</h3>
                    <p className="text-sm opacity-70 mt-0.5">{t(`catering.${s.key}_d`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <button
              onClick={() => setOpenQuote(true)}
              className="mt-8 inline-flex items-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full px-8 py-4 hover:bg-chili hover:text-cream transition-colors soft-shadow"
            >
              <FileText className="w-5 h-5" />
              {t("catering.cta")}
            </button>
          </Reveal>
        </div>
      </div>

      <QuoteModal open={openQuote} onClose={() => setOpenQuote(false)} />
    </section>
  );
};

const QuoteModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    guests: "",
    type: "",
    details: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", date: "", guests: "", type: "", details: "" });
      onClose();
    }, 2600);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-forest-900/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-cream text-forest p-8 soft-shadow">
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-display font-extrabold text-3xl">{t("catering.modal_title")}</h3>
                <button onClick={onClose} className="text-forest/50 hover:text-chili transition-colors" aria-label="Close">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <QField label={t("catering.f_name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <QField label={t("catering.f_email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <QField label={t("catering.f_date")} type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
                  <QField label={t("catering.f_guests")} type="number" value={form.guests} onChange={(v) => setForm({ ...form, guests: v })} />
                </div>
                <QField label={t("catering.f_type")} value={form.type} onChange={(v) => setForm({ ...form, type: v })} placeholder={t("catering.f_type_ph")} />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-chili">
                    {t("catering.f_details")}
                  </label>
                  <textarea
                    rows={3}
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder={t("catering.f_details_ph")}
                    className="w-full bg-bone rounded-xl border-2 border-forest/15 px-4 py-3 outline-none focus:border-lime transition-colors resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center justify-center gap-2 font-semibold text-lg rounded-full py-4 transition-colors ${
                    sent ? "bg-lime text-forest" : "bg-forest text-cream hover:bg-chili"
                  }`}
                >
                  {sent ? (
                    <>
                      <Check className="w-5 h-5" /> {t("catering.sent")}
                    </>
                  ) : (
                    t("catering.submit")
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const QField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-chili">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-bone rounded-xl border-2 border-forest/15 px-4 py-3 outline-none focus:border-lime transition-colors"
    />
  </div>
);

export default Catering;