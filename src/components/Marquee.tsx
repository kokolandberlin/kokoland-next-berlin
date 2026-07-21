"use client";

import { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
};

// Children are rendered twice so the 50% translate loops seamlessly.
const Marquee = ({ children, reverse, className = "" }: MarqueeProps) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`}>
    <div
      className={`inline-flex items-center ${
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      }`}
    >
      <div className="inline-flex items-center shrink-0">{children}</div>
      <div className="inline-flex items-center shrink-0" aria-hidden>
        {children}
      </div>
    </div>
  </div>
);

export default Marquee;