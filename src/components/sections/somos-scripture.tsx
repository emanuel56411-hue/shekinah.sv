"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";

export function Somos() {
  return (
    <section id="somos" className="section-padding section-surface" aria-label="Somos Shekinah">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] shadow-card-hover">
            <Image
              src="/assets/fotos/equipo-alabanza.webp"
              alt="Equipo de alabanza de Iglesia Bautista Shekinah"
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Scripture() {
  const { t } = useLanguage();

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      aria-label={t("scripture.aria")}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,248,230,0.95)_0%,rgba(250,248,243,0.9)_35%,rgba(255,255,255,1)_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22)_0%,rgba(101,16,26,0.08)_40%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-shekinah/30 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-shekinah/30 to-transparent"
      />

      <Reveal>
        <blockquote className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">
          <p className="font-heading text-[1.65rem] font-medium italic leading-snug tracking-tight text-foreground drop-shadow-sm sm:text-3xl md:text-[2.35rem] md:leading-tight">
            {t("scripture.verseText")}
          </p>
          <cite className="mt-6 block font-sans text-sm font-semibold not-italic uppercase tracking-[0.2em] text-shekinah dark:text-shekinah-300">
            {t("scripture.verseRef")}
          </cite>
        </blockquote>
      </Reveal>
    </section>
  );
}
