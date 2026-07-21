"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail, Send, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal";
import { Motif } from "./Brand";

const info = [
  { icon: MapPin, key: "visit" },
  { icon: Clock, key: "hours" },
  { icon: Phone, key: "call" },
  { icon: Mail, key: "mail" },
];

const Contact = () => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || form.message.length < 5) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", message: "" });
    }, 2600);
  };

  return (
    <section id="contact" className="relative bg-cream text-forest py-28 overflow-hidden">
      <Motif name="palm-tree" className="absolute -left-10 bottom-0 w-52 text-lime animate-sway origin-bottom pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 relative z-10">
        {/* Info side */}
        <div>
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-chili">{t("contact.kicker")}</span>
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl mt-4 leading-[0.95]">
              {t("contact.title_get")}
              <br />
              <span className="relative inline-block">
                {t("contact.title_touch")}
                <span className="absolute left-0 -bottom-1 w-full h-3 bg-lime -z-10" />
              </span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4 mt-12">
            {info.map((item, i) => (
              <Reveal key={item.key} delay={i * 0.08}>
                <div className="group rounded-2xl border-2 border-forest/10 p-6 h-full hover:border-lime hover:bg-forest hover:text-cream transition-colors">
                  <item.icon className="w-7 h-7 mb-4 group-hover:text-lime transition-colors" />
                  <h3 className="font-display font-bold text-xl mb-2">{t(`contact.info_${item.key}_t`)}</h3>
                  <p className="text-sm opacity-70">{t(`contact.info_${item.key}_1`)}</p>
                  {t(`contact.info_${item.key}_2`, "") && (
                    <p className="text-sm opacity-70">{t(`contact.info_${item.key}_2`, "")}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Form side */}
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="rounded-3xl bg-forest text-cream p-8 soft-shadow">
            <h3 className="font-display font-bold text-3xl mb-6">{t("contact.form_title")}</h3>

            <div className="space-y-5">
              {[
                { key: "name", label: t("contact.f_name"), type: "text" },
                { key: "email", label: t("contact.f_email"), type: "email" },
              ].map((f) => (
                <div key={f.key}>
                  <label htmlFor={`contact-${f.key}`} className="block text-xs font-semibold uppercase tracking-widest mb-2 text-lime">
                    {f.label}
                  </label>
                  <input
                    id={`contact-${f.key}`}
                    type={f.type}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-forest-700 rounded-xl border-2 border-cream/10 px-4 py-3 outline-none focus:border-lime transition-colors"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-widest mb-2 text-lime">
                  {t("contact.f_message")}
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-forest-700 rounded-xl border-2 border-cream/10 px-4 py-3 outline-none focus:border-lime transition-colors resize-none"
                />
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
                    <Check className="w-5 h-5" /> {t("contact.sent")}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> {t("contact.send")}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;