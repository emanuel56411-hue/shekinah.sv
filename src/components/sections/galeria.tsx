"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { GALLERY_ITEMS } from "@/lib/constants";
import { fetchPublicSiteGalleryItems } from "@/lib/supabase";

type GalleryDisplayItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  tag: string;
};

export function Galeria() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [dynamicItems, setDynamicItems] = useState<GalleryDisplayItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicSiteGalleryItems().then((rows) => {
      if (cancelled || rows.length === 0) return;
      setDynamicItems(
        rows.map((item) => ({
          id: item.id,
          src: item.image_url,
          alt: item.alt || item.title,
          title: item.title,
          tag: item.tag,
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items =
    dynamicItems.length > 0
      ? dynamicItems
      : GALLERY_ITEMS.map((item) => ({
          id: item.src,
          src: item.src,
          alt: item.alt,
          title: t(item.titleKey),
          tag: t(item.tagKey),
        }));

  const current = items[index] ?? items[0];

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + items.length) % items.length);
      }
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % items.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [items.length, open]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [index, items.length]);

  return (
    <section id="galeria" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="section-title mt-0">{t("galeria.title")}</h2>
          <p className="section-desc">{t("galeria.description")}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 md:gap-4">
          {items.map((item, itemIndex) => (
            <Reveal key={item.id} delay={Math.min(itemIndex * 0.04, 0.2)} className="min-w-0">
              <button
                type="button"
                aria-label={item.title}
                onClick={() => {
                  setIndex(itemIndex);
                  setOpen(true);
                }}
                className="group relative block aspect-square w-full overflow-hidden rounded-[12px] bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah focus-visible:ring-offset-2"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading={itemIndex < 3 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left text-white opacity-100 transition-opacity duration-200 sm:p-4 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  {item.tag ? (
                    <span className="mb-1 inline-block rounded-[12px] bg-black/45 px-2 py-0.5 text-[0.65rem] font-medium text-white/95">
                      {item.tag}
                    </span>
                  ) : null}
                  <strong className="block text-sm font-semibold sm:text-base">{item.title}</strong>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl border-0 bg-black/90 p-0 text-white shadow-none sm:max-w-4xl"
          overlayClassName="bg-black/80"
        >
          <DialogTitle className="sr-only">{t("galeria.viewerAria")}</DialogTitle>
          <div className="relative aspect-[4/3] w-full sm:aspect-video">
            <img
              src={current.src}
              alt={current.alt}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <p className="min-w-0 truncate text-sm font-medium">{current.title}</p>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setIndex((i) => (i + 1) % items.length)}
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
