"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";

export function Somos() {
  return (
    <section id="somos" className="section-padding bg-muted/20" aria-label="Somos Shekinah">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card-hover">
            <Image
              src="/assets/fotos/equipo-alabanza.webp"
              alt="Equipo de alabanza de Iglesia Bautista Shekinah"
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Scripture() {
  const { t } = useLanguage();

  return (
    <section className="section-padding-sm" aria-label={t("scripture.aria")}>
      <Reveal>
        <blockquote className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">{t("scripture.verseText")}</p>
          <cite className="mt-4 block text-sm font-semibold not-italic text-shekinah">{t("scripture.verseRef")}</cite>
        </blockquote>
      </Reveal>
    </section>
  );
}
