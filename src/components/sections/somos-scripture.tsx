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
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label={t("scripture.aria")}
    >
      <Image
        src="/assets/fotos/predicacion-shekinah.webp"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#3a0a10]/88 via-[#65101a]/90 to-[#2d060c]/92"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FAF8F3]/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/25 to-transparent"
      />

      <Reveal>
        <blockquote className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
          <span
            aria-hidden
            className="mb-2 block font-heading text-6xl leading-none text-white/25 sm:text-7xl"
          >
            “
          </span>
          <p className="font-heading text-[1.7rem] font-medium italic leading-snug tracking-tight text-white sm:text-3xl md:text-[2.4rem] md:leading-tight">
            {t("scripture.verseText")}
          </p>
          <cite className="mt-8 block font-sans text-sm font-semibold not-italic uppercase tracking-[0.22em] text-white/80">
            — {t("scripture.verseRef")}
          </cite>
        </blockquote>
      </Reveal>
    </section>
  );
}
