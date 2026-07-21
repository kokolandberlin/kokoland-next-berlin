"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCookieConsent, type ConsentCategory } from "@/context/CookieConsentContext";

const CookieBanner = () => {
  const { t } = useTranslation();
  const { consent, bannerOpen, acceptAll, rejectNonEssential, savePreferences, closeSettings, hasDecided } =
    useCookieConsent();
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  // Reopening from the footer "Cookie Settings" link (hasDecided already true)
  // should land directly on the expanded panel with the saved choices, not
  // the first-visit compact banner.
  useEffect(() => {
    if (bannerOpen && hasDecided) {
      setAnalytics(consent?.analytics ?? false);
      setMarketing(consent?.marketing ?? false);
      setExpanded(true);
    }
    if (!bannerOpen) setExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerOpen]);

  if (!bannerOpen) return null;

  const save = () => {
    savePreferences({ analytics, marketing } as Record<ConsentCategory, boolean>);
    setExpanded(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-5"
      >
        <div className="max-w-3xl mx-auto rounded-3xl bg-forest text-cream border-2 border-lime/30 soft-shadow overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-9 h-9 shrink-0 rounded-full bg-lime/15 flex items-center justify-center">
                <Cookie className="w-4 h-4 text-lime" />
              </div>
              <div>
                <p className="font-display font-bold text-base">
                  {t("cookies.title") || "We use cookies"}
                </p>
                <p className="text-sm text-cream/70 mt-1">
                  {t("cookies.body") ||
                    "We use necessary cookies to run kokoland (cart, login, language). With your consent we'd also like to use analytics cookies to understand how the site is used. You can change this anytime in Cookie Settings."}
                </p>
              </div>
              {hasDecided && (
                <button
                  onClick={closeSettings}
                  className="shrink-0 text-cream/40 hover:text-lime transition-colors"
                  aria-label={t("cookies.close") || "Close"}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:shrink-0">
              <button
                onClick={rejectNonEssential}
                className="order-3 sm:order-1 text-sm font-medium text-cream/70 hover:text-lime transition-colors px-4 py-2.5 rounded-full border border-cream/15 hover:border-lime/40"
              >
                {t("cookies.reject") || "Reject non-essential"}
              </button>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="order-2 flex items-center justify-center gap-1 text-sm font-medium text-cream/70 hover:text-lime transition-colors px-4 py-2.5 rounded-full border border-cream/15 hover:border-lime/40"
              >
                {t("cookies.customize") || "Customize"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={acceptAll}
                className="order-1 sm:order-3 text-sm font-semibold bg-lime text-forest hover:bg-chili hover:text-cream transition-colors px-5 py-2.5 rounded-full"
              >
                {t("cookies.accept") || "Accept all"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-cream/10"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  <CategoryRow
                    label={t("cookies.necessary_label") || "Necessary"}
                    desc={
                      t("cookies.necessary_desc") ||
                      "Required for the site to work — cart, login session, language and cookie preference. Always on."
                    }
                    checked
                    disabled
                  />
                  <CategoryRow
                    label={t("cookies.analytics_label") || "Analytics"}
                    desc={
                      t("cookies.analytics_desc") ||
                      "Helps us understand which pages and dishes are popular so we can improve the site."
                    }
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                  <CategoryRow
                    label={t("cookies.marketing_label") || "Marketing"}
                    desc={
                      t("cookies.marketing_desc") ||
                      "Lets us measure the effect of promotions and offers. Not used yet, off by default."
                    }
                    checked={marketing}
                    onChange={setMarketing}
                  />
                  <button
                    onClick={save}
                    className="w-full sm:w-auto text-sm font-semibold bg-lime text-forest hover:bg-chili hover:text-cream transition-colors px-5 py-2.5 rounded-full"
                  >
                    {t("cookies.save") || "Save preferences"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const CategoryRow = ({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-cream/60 mt-0.5">{desc}</p>
    </div>
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`shrink-0 h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-lime" : "bg-cream/15"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`block h-[18px] w-[18px] rounded-full bg-forest transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  </div>
);

export default CookieBanner;
