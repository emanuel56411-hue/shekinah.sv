"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

function isOnScreen(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh + 48 && rect.bottom > -48;
}

/**
 * Scroll reveal — SIEMPRE debe existir en las secciones principales.
 * NO ELIMINAR ni desactivar (regla del proyecto / usuario).
 *
 * NUNCA dejar contenido atrapado en opacity:0 (sobre todo en móvil).
 * Debe haber respaldo por scroll/touch si el observer falla.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -8% 0px",
  });
  const [ready, setReady] = useState(false);
  const [mountVisible, setMountVisible] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el && isOnScreen(el)) setMountVisible(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || reduceMotion || mountVisible || scrollVisible || inView) return;

    const revealIfVisible = () => {
      const el = ref.current;
      if (!el) return;
      if (isOnScreen(el)) setScrollVisible(true);
    };

    window.addEventListener("scroll", revealIfVisible, { passive: true });
    window.addEventListener("touchmove", revealIfVisible, { passive: true });
    window.addEventListener("resize", revealIfVisible);
    const interval = window.setInterval(revealIfVisible, 350);

    return () => {
      window.removeEventListener("scroll", revealIfVisible);
      window.removeEventListener("touchmove", revealIfVisible);
      window.removeEventListener("resize", revealIfVisible);
      window.clearInterval(interval);
    };
  }, [ready, reduceMotion, mountVisible, scrollVisible, inView]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  if (!ready) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const visible = inView || mountVisible || scrollVisible;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={mountVisible ? false : { opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: visible && !mountVisible ? delay : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
