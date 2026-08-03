"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { GALLERY_ITEMS } from "@/lib/constants";

export function Galeria() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const current = GALLERY_ITEMS[index];

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
      }
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % GALLERY_ITEMS.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <section id="galeria" className="section-padding section-surface">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="section-title mt-0">{t("galeria.title")}</h2>
          <p className="section-desc">{t("galeria.description")}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {GALLERY_ITEMS.map((item, itemIndex) => {
            const isLarge = "large" in item && item.large;

            return (
              <Reveal
                key={item.src}
                delay={Math.min(itemIndex * 0.04, 0.2)}
                className={isLarge ? "col-span-2 row-span-2" : undefined}
              >
                <button
                  type="button"
                  aria-label={t(item.titleKey)}
                  onClick={() => {
                    setIndex(itemIndex);
                    setOpen(true);
                  }}
                  className="group relative block h-full w-full overflow-hidden rounded-[12px] bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah focus-visible:ring-offset-2"
                >
                  <div className={`relative w-full ${isLarge ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-square"}`}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-left text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4">
                      <span className="mb-1 inline-block rounded-[12px] bg-black/45 px-2 py-0.5 text-[0.65rem] font-medium text-white/95">
                        {t(item.tagKey)}
                      </span>
                      <strong className="block text-sm font-semibold sm:text-base">{t(item.titleKey)}</strong>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl border-white/15 bg-black/90 p-0 text-white sm:max-w-4xl"
          overlayClassName="bg-black/80"
        >
          <DialogTitle className="sr-only">{t("galeria.viewerAria")}</DialogTitle>
          <div className="relative aspect-[4/3] w-full sm:aspect-video">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <p className="min-w-0 truncate text-sm font-medium">{t(current.titleKey)}</p>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setIndex((i) => (i - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)}
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setIndex((i) => (i + 1) % GALLERY_ITEMS.length)}
                aria-label="Siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
                aria-label={t("galeria.closeAria")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
