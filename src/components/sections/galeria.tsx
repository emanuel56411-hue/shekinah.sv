"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { GALLERY_ITEMS } from "@/lib/constants";

export function Galeria() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const current = GALLERY_ITEMS[index];

  const showImage = (nextIndex: number) => {
    const total = GALLERY_ITEMS.length;
    setIndex((nextIndex + total) % total);
  };

  return (
    <section id="galeria" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("galeria.eyebrow")}</p>
          <h2 className="section-title">{t("galeria.title")}</h2>
          <p className="section-desc">{t("galeria.description")}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {GALLERY_ITEMS.map((item, itemIndex) => (
            <Reveal key={item.src} delay={itemIndex * 0.04}>
              <button
                type="button"
                aria-label={t(item.titleKey)}
                onClick={() => {
                  setIndex(itemIndex);
                  setOpen(true);
                }}
                className={`group relative overflow-hidden rounded-2xl shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah ${
                  "large" in item && item.large
                    ? "col-span-2 row-span-2 min-h-[280px] md:min-h-[360px]"
                    : "min-h-[180px]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={"large" in item && item.large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left text-white">
                  <Badge className="mb-2 bg-white/15 text-white">{t(item.tagKey)}</Badge>
                  <strong className="block text-sm font-semibold sm:text-base">{t(item.titleKey)}</strong>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl border-0 bg-black/95 p-2 sm:p-4" aria-label={t("galeria.viewerAria")}>
          <DialogTitle className="sr-only">{t(current.titleKey)}</DialogTitle>
          <div className="relative flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={() => showImage(index - 1)}
              aria-label="Foto anterior"
            >
              <ChevronLeft />
            </Button>

            <div className="relative mx-12 aspect-[3/4] w-full max-w-3xl sm:aspect-[4/3]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10"
              onClick={() => showImage(index + 1)}
              aria-label="Foto siguiente"
            >
              <ChevronRight />
            </Button>
          </div>
          <p className="text-center text-sm text-white/85">{t(current.titleKey)}</p>
          <Button
            type="button"
            variant="ghost"
            className="mx-auto text-white hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <X className="mr-2 h-4 w-4" />
            {t("galeria.closeBtn")}
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
