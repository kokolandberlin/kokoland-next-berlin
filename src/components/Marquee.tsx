"use client";

import { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  /** Seconds for one full loop; defaults to the stylesheet's speed. */
  duration?: number;
  pauseOnHover?: boolean;
};

// Children are rendered twice so the 50% translate loops seamlessly.
const Marquee = ({ children, reverse, className = "", duration, pauseOnHover }: MarqueeProps) => (
  <div className={`group/marquee overflow-hidden whitespace-nowrap ${className}`}>
    <div
      className={`inline-flex items-center ${reverse ? "animate-marquee-reverse" : "animate-marquee"} ${pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""}`}
      style={duration ? { animationDuration: `${duration}s` } : undefined}
    >
      <div className="inline-flex items-center shrink-0">{children}</div>
      <div className="inline-flex items-center shrink-0" aria-hidden>
        {children}
      </div>
    </div>
  </div>
);

export default Marquee;
