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
  // Más generoso en móvil: dispara un poco antes de entrar
  return rect.top < vh + 40 && rect.bottom > -40;
}

/**
 * Scroll reveal — SIEMPRE debe existir en las secciones principales.
 * NO ELIMINAR ni desactivar (regla del proyecto / usuario).
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    amount: 0.05,
    margin: "120px 0px 120px 0px",
  });
  const [ready, setReady] = useState(false);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    // Si ya está en pantalla al montar, no lo escondas
    if (el && isOnScreen(el)) {
      setForced(true);
    }
    setReady(true);
  }, []);

  // Respaldo: al hacer scroll, si entra en pantalla → animar / mostrar
  useEffect(() => {
    if (!ready || reduceMotion || forced) return;

    const revealIfVisible = () => {
      const el = ref.current;
      if (!el) return;
      if (isOnScreen(el)) setForced(true);
    };

    window.addEventListener("scroll", revealIfVisible, { passive: true });
    window.addEventListener("touchmove", revealIfVisible, { passive: true });
    window.addEventListener("resize", revealIfVisible);
    const interval = window.setInterval(revealIfVisible, 300);

    return () => {
      window.removeEventListener("scroll", revealIfVisible);
      window.removeEventListener("touchmove", revealIfVisible);
      window.removeEventListener("resize", revealIfVisible);
      window.clearInterval(interval);
    };
  }, [ready, reduceMotion, forced]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // Mientras no está listo: contenido visible (nunca pantalla en blanco)
  if (!ready) {
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
      initial={forced ? false : { opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: visible && inView && !forced ? delay : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
