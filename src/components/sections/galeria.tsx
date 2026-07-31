"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { GALLERY_ITEMS } from "@/lib/constants";

const VISIBLE_GALLERY = GALLERY_ITEMS.slice(0, 4);

export function Galeria() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const current = VISIBLE_GALLERY[index];

  const showImage = (nextIndex: number) => {
    const total = VISIBLE_GALLERY.length;
    setIndex((nextIndex + total) % total);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + VISIBLE_GALLERY.length) % VISIBLE_GALLERY.length);
      }
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % VISIBLE_GALLERY.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <section id="galeria" className="section-padding section-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("galeria.eyebrow")}</p>
          <h2 className="section-title">{t("galeria.title")}</h2>
          <p className="section-desc">{t("galeria.description")}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {VISIBLE_GALLERY.map((item, itemIndex) => (
            <Reveal key={item.src} delay={Math.min(itemIndex * 0.04, 0.16)}>
              <button
                type="button"
                aria-label={t(item.titleKey)}
                onClick={() => {
                  setIndex(itemIndex);
                  setOpen(true);
                }}
                className="group relative block h-full w-full overflow-hidden rounded-[12px] border border-white/15 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <strong className="absolute bottom-0 left-0 right-0 p-3 text-left text-sm font-semibold text-white">
                    {t(item.titleKey)}
                  </strong>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-5xl border-0 bg-transparent p-2 shadow-none ring-0 sm:p-4"
          aria-label={t("galeria.viewerAria")}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">{t(current.titleKey)}</DialogTitle>
          <div className="relative flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
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
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => showImage(index + 1)}
              aria-label="Foto siguiente"
            >
              <ChevronRight />
            </Button>
          </div>
          <p className="text-center text-sm text-white/90">{t(current.titleKey)}</p>
          <Button
            type="button"
            variant="ghost"
            className="mx-auto text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
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
