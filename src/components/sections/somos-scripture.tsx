"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";

export function Somos() {
  return (
    <section id="somos" className="section-padding section-surface" aria-label="Somos Shekinah">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-black/10 shadow-card-hover">
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
      className="section-surface-alt relative overflow-hidden border-y border-shekinah/10 py-20 sm:py-28"
      aria-label={t("scripture.aria")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-shekinah/25 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-shekinah/25 to-transparent"
      />

      <Reveal>
        <blockquote className="relative mx-auto max-w-3xl rounded-2xl bg-[#FAF8F3]/88 px-6 py-8 text-center shadow-[0_8px_28px_-12px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:px-10 sm:py-10">
          <span
            aria-hidden
            className="mb-4 block font-heading text-5xl font-normal leading-none text-shekinah/45 sm:text-6xl"
          >
            “
          </span>
          <p className="font-heading text-[1.55rem] font-medium leading-snug tracking-tight text-[#1a1214] drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)] sm:text-[1.85rem] md:text-[2.1rem] md:leading-[1.35]">
            {t("scripture.verseText")}
          </p>
          <cite className="mt-8 block font-sans text-xs font-semibold not-italic uppercase tracking-[0.22em] text-shekinah">
            {t("scripture.verseRef")}
          </cite>
        </blockquote>
      </Reveal>
    </section>
  );
}
