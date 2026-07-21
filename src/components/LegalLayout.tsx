"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Shared wrapper for Impressum / Datenschutz / AGB. These are published in
// German (the legally relevant language for a German entity) with an English
// summary — not run through the 8-language i18n system, since machine-style
// translation of binding legal text serves no one and needs a lawyer anyway.
export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="grain relative bg-forest text-cream min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-5">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/60 hover:text-lime transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to kokoland
          </Link>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-lime mb-2">{title}</h1>
          <p className="text-cream/60 text-xs uppercase tracking-widest mb-10">Last updated: {updated}</p>
          <div className="prose-legal space-y-8 text-cream/80 text-sm leading-relaxed">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const LegalSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h2 className="font-display font-bold text-xl text-cream mb-3">{title}</h2>
    <div className="space-y-3">{children}</div>
  </section>
);

// Marks a field that needs the client's real business data before this page
// can go live — impossible to miss, and easy to grep for ("TODO_LEGAL").
export const Placeholder = ({ children }: { children: ReactNode }) => (
  <span className="inline-block bg-chili/20 text-chili-text px-1.5 py-0.5 rounded font-semibold" data-todo-legal>
    {children}
  </span>
);
