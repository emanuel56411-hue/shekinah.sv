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
 * Fade + translateY al entrar en viewport al hacer scroll.
 * Failsafe SOLO si el bloque ya está en pantalla y el observer falla
 * (nunca forzar toda la página a visible a los 1–2s: eso mata la experiencia).
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -40px 0px" });
  const [ready, setReady] = useState(false);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Failsafe puntual: solo si YA está en el viewport y no entró el observer
  useEffect(() => {
    if (!ready || reduceMotion) return;

    const id = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const alreadyOnScreen = rect.top < window.innerHeight * 0.92 && rect.bottom > 40;
      if (alreadyOnScreen) setForced(true);
    }, 2200);

    return () => window.clearTimeout(id);
  }, [ready, reduceMotion]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // Antes de montar motion: oculto (sin flash de contenido abajo)
  if (!ready) {
    return (
      <div ref={ref} className={className} style={{ opacity: 0, transform: "translateY(36px)" }}>
        {children}
      </div>
    );
  }

  const visible = inView || forced;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
        delay: visible && inView && !forced ? delay : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
