"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
const logo = "/assets/brand/kokoland-logo.png";

const Auth = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params?.get("redirect") || "/";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name },
            emailRedirectTo: `${window.location.origin}${redirect}`,
          },
        });
        if (error) throw error;
        setInfo(t("auth.confirm_info"));
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        router.replace(redirect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest text-cream flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-lime transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {t("auth.back")}
        </Link>

        <div className="rounded-3xl bg-forest-700 border border-cream/10 p-8 soft-shadow">
          <img src={logo} alt="kokoland" className="h-9 object-contain mb-6" />
          <h1 className="font-display font-extrabold text-3xl mb-1">
            {mode === "login" ? t("auth.login_title") : t("auth.signup_title")}
          </h1>
          <p className="text-sm text-cream/60 mb-6">
            {mode === "login" ? t("auth.login_sub") : t("auth.signup_sub")}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <Field label={t("auth.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            )}
            <Field label={t("auth.email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field
              label={t("auth.password")}
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
            />

            {error && <p className="text-sm text-chili-text bg-chili/10 rounded-lg px-3 py-2">{error}</p>}
            {info && <p className="text-sm text-lime bg-lime/10 rounded-lg px-3 py-2">{info}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full py-3.5 hover:bg-chili hover:text-cream transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === "login" ? t("auth.login_btn") : t("auth.signup_btn")}
            </button>
          </form>

          <button
            onClick={() => {
              setMode((m) => (m === "login" ? "signup" : "login"));
              setError("");
              setInfo("");
            }}
            className="mt-6 text-sm text-cream/60 hover:text-lime transition-colors"
          >
            {mode === "login" ? t("auth.to_signup") : t("auth.to_login")}
          </button>
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-forest rounded-xl border-2 border-cream/10 px-4 py-3 outline-none focus:border-lime transition-colors [color-scheme:dark]"
      />
    </div>
  );
};

export default Auth;