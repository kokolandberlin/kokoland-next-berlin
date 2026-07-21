"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

const Reveal = ({ children, delay = 0, y = 40, className }: RevealProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.7, 0.25, 1] }}
  >
    {children}
  </motion.div>
);

export default Reveal;