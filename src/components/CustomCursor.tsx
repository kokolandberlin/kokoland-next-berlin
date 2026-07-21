"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 28 });
  const ringY = useSpring(y, { stiffness: 300, damping: 28 });
  const [hovering, setHovering] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setTouch(true);
      return;
    }
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (touch) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[100] pointer-events-none w-2.5 h-2.5 rounded-full bg-lime"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[100] pointer-events-none rounded-full border border-lime mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          backgroundColor: hovering ? "rgba(192,242,82,0.20)" : "rgba(192,242,82,0)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </>
  );
};

export default CustomCursor;