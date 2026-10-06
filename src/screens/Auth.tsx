"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/track";
const logo = "/assets/brand/kokoland-logo-wide.png";

const strings = (de: boolean) =>
  de
    ? {
        title: "Anmelden oder registrieren",
        sub: "Wir schicken dir einen Code per E-Mail. Kein Passwort nötig. Dein Konto sammelt Punkte und merkt sich deine Bestellungen.",
        name: "Name (nur beim ersten Mal)",
        email: "E-Mail",
        send: "Code senden",
        sentTo: (e: string) => `Wir haben einen Code an ${e} geschickt. Gib ihn hier ein.`,
        code: "Code",
        verify: "Anmelden",
        other: "Andere E-Mail verwenden",
        resend: "Code erneut senden",
        privacy: "Mit dem Weiter stimmst du unserer",
        privacyLink: "Datenschutzerklärung",
        error: "Das hat nicht geklappt. Bitte versuche es nochmal.",
        badCode: "Der Code stimmt nicht oder ist abgelaufen.",
      }
    : {
        title: "Sign in or sign up",
        sub: "We email you a code. No password needed. Your account collects points and remembers your orders.",
        name: "Name (first time only)",
        email: "Email",
        send: "Send code",
        sentTo: (e: string) => `We sent a code to ${e}. Enter it here.`,
        code: "Code",
        verify: "Sign in",
        other: "Use a different email",
        resend: "Send the code again",
        privacy: "By continuing you agree to our",
        privacyLink: "privacy policy",
        error: "That did not work. Please try again.",
        badCode: "The code is wrong or has expired.",
      };

const Auth = () => {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const x = strings(de);
  const [step, setStep] = useState<"email" | "code">("email");
  const [form, setForm] = useState({ name: "", email: "", code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params?.get("redirect") || "/account";

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    // DishData emails the code in kokoland's branding (see /api/auth/request-code).
    const res = await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.email.trim(), name: form.name.trim() || undefined, lang: de ? "de" : "en" }),
    }).catch(() => null);
    setLoading(false);
    if (!res?.ok) {
      const data = res ? await res.json().catch(() => null) : null;
      return setError(res?.status === 429 && data?.error ? data.error : x.error);
    }
    setStep("code");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const email = form.email.trim();
    const token = form.code.trim();
    let { error: err } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    // A code made by the server can be filed as a magic-link code: accept either.
    if (err) ({ error: err } = await supabase.auth.verifyOtp({ email, token, type: "magiclink" }));
    setLoading(false);
    if (err) return setError(x.badCode);
    track("login", { method: "email_code" });
    router.replace(redirect);
  };

  return (
    <div className="min-h-screen bg-forest text-cream flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-lime transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {de ? "Zurück" : "Back"}
        </Link>

        <div className="rounded-3xl bg-forest-700 border border-cream/10 p-8 soft-shadow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="kokoland" className="h-9 object-contain mb-6" />
          <h1 className="font-display font-extrabold text-3xl mb-1">{x.title}</h1>
          <p className="text-sm text-cream/60 mb-6">{step === "email" ? x.sub : x.sentTo(form.email.trim())}</p>

          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <Field label={x.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label={x.email} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              {error && <p className="text-sm text-chili-text bg-chili/10 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full py-3.5 hover:bg-chili hover:text-cream transition-colors disabled:opacity-60">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />} {x.send}
              </button>
              <p className="text-xs text-cream/50">
                {x.privacy} <Link href="/datenschutz" className="underline hover:text-lime">{x.privacyLink}</Link>.
              </p>
            </form>
          ) : (
            <form onSubmit={verify} className="space-y-4">
              <Field label={x.code} value={form.code} onChange={(v) => setForm({ ...form, code: v })} required inputMode="numeric" autoComplete="one-time-code" />
              {error && <p className="text-sm text-chili-text bg-chili/10 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading || form.code.trim().length < 6} className="w-full flex items-center justify-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full py-3.5 hover:bg-chili hover:text-cream transition-colors disabled:opacity-60">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />} {x.verify}
              </button>
              <div className="flex flex-wrap justify-between gap-3 text-sm text-cream/60">
                <button type="button" onClick={() => sendCode()} className="hover:text-lime transition-colors">{x.resend}</button>
                <button type="button" onClick={() => { setStep("email"); setForm({ ...form, code: "" }); setError(""); }} className="hover:text-lime transition-colors">{x.other}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
}) => {
  const id = `auth-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest mb-2 text-lime">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-forest rounded-xl border-2 border-cream/10 px-4 py-3 outline-none focus:border-lime transition-colors [color-scheme:dark]"
      />
    </div>
  );
};

export default Auth;
