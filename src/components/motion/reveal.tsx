"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Scroll reveal — SIEMPRE debe existir en las secciones principales.
 * NO ELIMINAR ni desactivar (regla del proyecto / usuario).
 *
 * Fade + translateY al entrar en viewport.
 * Failsafe: si el observer no dispara, el contenido se muestra igual.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.18, margin: "0px 0px -32px 0px" });
  const [mounted, setMounted] = useState(false);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = window.setTimeout(() => setForced(true), 1400);
    return () => window.clearTimeout(id);
  }, []);

  if (reduceMotion || !mounted) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const visible = inView || forced;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: visible && inView && !forced ? delay : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
