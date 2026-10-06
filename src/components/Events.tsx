"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CalendarHeart } from "lucide-react";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal";
import { Motif } from "./Brand";
import { useEvents } from "@/hooks/useEvents";

const Events = () => {
  const { t, i18n } = useTranslation();
  const { events, loading } = useEvents();
  const lang = i18n.language || "en";
  const when = (ymd: string) => new Date(`${ymd}T12:00:00`);

  return (
    <section id="events" className="relative bg-forest text-cream py-28 overflow-hidden">
      <Motif name="palm-fronds" className="absolute top-16 right-12 w-28 text-lime/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl leading-[0.95]">
              {t("events.title_pre")} <span className="text-lime">{t("events.title_accent")}</span>
            </h2>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">
              {t("events.kicker")}
            </span>
          </div>
        </Reveal>

        <div className="space-y-3">
          {events.map((e, i) => {
            const d = when(e.event_date);
            const href = e.cta_url || "#reservation";
            const external = /^https?:\/\//.test(href);
            return (
              <motion.a
                key={e.id}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex items-center gap-6 rounded-3xl border-2 border-cream/10 p-6 hover:border-lime hover:bg-cream hover:text-forest transition-all duration-300"
                data-cursor="hover"
              >
                <div className="flex flex-col items-center justify-center w-20 shrink-0 text-center">
                  <span className="font-display font-extrabold text-3xl text-lime group-hover:text-chili transition-colors uppercase">
                    {d.toLocaleDateString(lang, { weekday: "short" }).replace(".", "")}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 mt-1">
                    {d.toLocaleDateString(lang, { day: "numeric", month: "short" })}
                    {e.event_time ? ` · ${e.event_time}` : ""}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display font-bold text-2xl lg:text-3xl">{e.title}</h3>
                    {e.tag && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full border border-current px-2.5 py-0.5 text-lime group-hover:text-chili">
                        {e.tag}
                      </span>
                    )}
                  </div>
                  {e.description && <p className="text-sm opacity-60 mt-1 max-w-xl">{e.description}</p>}
                </div>
                <ArrowUpRight className="w-7 h-7 opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition-all shrink-0" />
              </motion.a>
            );
          })}

          {!loading && events.length === 0 && (
            <a
              href="#contact"
              className="group flex items-center gap-6 rounded-3xl border-2 border-dashed border-cream/20 p-6 hover:border-lime transition-colors"
            >
              <CalendarHeart className="w-10 h-10 text-lime shrink-0" />
              <div className="flex-1">
                <h3 className="font-display font-bold text-2xl lg:text-3xl">{t("events.empty_title")}</h3>
                <p className="text-sm opacity-60 mt-1 max-w-xl">{t("events.empty_desc")}</p>
              </div>
              <ArrowUpRight className="w-7 h-7 opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition-all shrink-0" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
