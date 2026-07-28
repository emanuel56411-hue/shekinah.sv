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
      className="section-surface relative overflow-hidden border-y border-white/10 py-20 sm:py-28"
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
        <blockquote
          className="relative mx-auto min-h-[16rem] max-w-3xl overflow-hidden rounded-2xl border border-white/25 bg-cover bg-center bg-no-repeat shadow-[0_12px_32px_-10px_rgba(0,0,0,0.45)] sm:min-h-[18rem]"
          style={{ backgroundImage: 'url("/assets/fotos/fondo-versiculo.png")' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/58 to-black/65"
          />
          <div className="relative z-10 flex min-h-[16rem] flex-col items-center justify-center px-6 py-10 text-center sm:min-h-[18rem] sm:px-10 sm:py-12">
            <span
              aria-hidden
              className="mb-4 block font-heading text-5xl font-normal leading-none text-[#f4a8b1] sm:text-6xl"
            >
              “
            </span>
            <p className="font-heading text-[1.55rem] font-medium leading-snug tracking-tight text-[#f5f5f5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] sm:text-[1.85rem] md:text-[2.1rem] md:leading-[1.35]">
              {t("scripture.verseText")}
            </p>
            <cite className="mt-8 block font-sans text-xs font-semibold not-italic uppercase tracking-[0.22em] text-[#f4a8b1] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              {t("scripture.verseRef")}
            </cite>
          </div>
        </blockquote>
      </Reveal>
    </section>
  );
}
