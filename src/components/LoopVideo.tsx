"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

// Muted looping clip that plays only while it is on screen, and stays a still
// poster for visitors who prefer reduced motion.
//
// Phones are strict about autoplay (iOS Low Power Mode and data-saver modes block it), so this
// asks again whenever the clip loads, becomes visible again, or the visitor first touches the
// page. If the browser still refuses, a small play button appears so a tap starts it.
const LoopVideo = ({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }

    let visible = false;
    const tryPlay = () => {
      if (!visible || !v.paused) return;
      v.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) tryPlay();
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);

    // Ask again when the data arrives, when the tab comes back, and on the first touch or scroll.
    const events: [EventTarget, string][] = [
      [v, "loadeddata"],
      [v, "canplay"],
      [document, "visibilitychange"],
      [window, "touchstart"],
      [window, "scroll"],
    ];
    events.forEach(([t, e]) => t.addEventListener(e, tryPlay, { passive: true }));
    const onPlaying = () => setBlocked(false);
    v.addEventListener("playing", onPlaying);

    return () => {
      io.disconnect();
      events.forEach(([t, e]) => t.removeEventListener(e, tryPlay));
      v.removeEventListener("playing", onPlaying);
    };
  }, []);

  const tapToPlay = () => {
    const v = ref.current;
    if (v) v.play().then(() => setBlocked(false)).catch(() => {});
  };

  return (
    <div className="relative">
      <video
        ref={ref}
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={className}
      />
      {blocked && (
        <button
          type="button"
          onClick={tapToPlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-forest/20"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-forest shadow-lg">
            <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
};

export default LoopVideo;
