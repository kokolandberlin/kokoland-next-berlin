"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grain relative bg-forest text-cream min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">{children}</main>
      <Footer />
    </div>
  );
}
