"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import type { FoodPhoto } from "@/data/food-photos";

export interface PlateSpot {
  photo: FoodPhoto;
  /** Position inside the stage, in %. */
  left: string;
  top: string;
  /** Width as a share of the viewport, clamped to [min, max] px. */
  vw: number;
  min?: number;
  max: number;
  /** How far it drifts vertically across the scroll (px, +down / -up) and how much it turns (deg). */
  drift: number;
  spin: number;
  /** Starting tilt (deg). */
  tilt?: number;
  /** Centre the plate on `left` (instead of starting at it): used for the middle plate on phones. */
  centerX?: boolean;
  /** Hide on phones, where the stage is too narrow for every plate. */
  desktopOnly?: boolean;
}

// Scroll turns each plate several times what its spin says and drifts it further,
// on top of a slow idle spin, so the movement reads clearly.
const SPIN_GAIN = 4;
const DRIFT_GAIN = 2;

const Plate = ({ spot, progress, still, index }: { spot: PlateSpot; progress: MotionValue<number>; still: boolean; index: number }) => {
  const y = useTransform(progress, [0, 1], [-spot.drift * DRIFT_GAIN, spot.drift * DRIFT_GAIN]);
  const rotate = useTransform(progress, [0, 1], [(spot.tilt ?? 0) - spot.spin * SPIN_GAIN, (spot.tilt ?? 0) + spot.spin * SPIN_GAIN]);
  return (
    <motion.div
      aria-hidden
      className={`absolute ${spot.desktopOnly ? "hidden md:block" : ""}`}
      style={{
        left: spot.left,
        top: spot.top,
        width: `clamp(${spot.min ?? 84}px, ${spot.vw}vw, ${spot.max}px)`,
        x: spot.centerX ? "-50%" : 0,
        y: still ? 0 : y,
        rotate: still ? spot.tilt ?? 0 : rotate,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={spot.photo.src}
        alt=""
        width={760}
        height={760}
        loading="lazy"
        decoding="async"
        draggable={false}
        animate={still ? undefined : { rotate: spot.spin < 0 ? -360 : 360 }}
        transition={{ duration: 16 + (index % 4) * 5, repeat: Infinity, ease: "linear" }}
        className="h-auto w-full select-none drop-shadow-[0_18px_22px_rgba(19,64,51,0.22)]"
      />
    </motion.div>
  );
};

/**
 * Cut-out plates that drift and turn as the section scrolls past, in the manner of
 * Dotin's reservation page. Decorative only (alt text lives on the photos used
 * elsewhere), so it is hidden from assistive tech and holds still with
 * prefers-reduced-motion. `progress` is the scroll progress (0 → 1) of the section.
 */
const FloatingPlates = ({ spots, progress, rings = true, ringClassName = "border-forest/10", ringSizes = [560, 860, 1160] }: { spots: PlateSpot[]; progress: MotionValue<number>; rings?: boolean; ringClassName?: string; ringSizes?: number[] }) => {
  const still = !!useReducedMotion();
  const ringTurn = useTransform(progress, [0, 1], [-90, 90]);
  const ringTurnBack = useTransform(progress, [0, 1], [90, -90]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {rings && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {ringSizes.map((d, i) => (
            <motion.div
              key={d}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${ringClassName} ${i === 1 ? "border-dashed" : ""}`}
              style={{ width: d, height: d, rotate: still ? 0 : i === 1 ? ringTurn : ringTurnBack }}
            />
          ))}
        </div>
      )}
      {spots.map((s, i) => (
        <Plate key={s.photo.src + s.left + s.top} spot={s} progress={progress} still={still} index={i} />
      ))}
    </div>
  );
};

export default FloatingPlates;
