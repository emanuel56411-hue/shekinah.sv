"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function MobileCta() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("mobileCta.aria")}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-black/20 bg-background/95 backdrop-blur dark:border-white/15 md:hidden"
    >
      <Link
        href="#reuniones"
        className="px-3 py-3 text-center text-sm font-medium text-foreground transition-colors hover:text-shekinah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah dark:hover:text-shekinah-300"
      >
        {t("mobileCta.schedule")}
      </Link>
      <Link
        href="#ubicacion"
        className="border-x border-black/15 px-3 py-3 text-center text-sm font-medium text-foreground transition-colors hover:text-shekinah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah dark:border-white/15 dark:hover:text-shekinah-300"
      >
        {t("mobileCta.directions")}
      </Link>
      <a
        href={buildWhatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-shekinah focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-shekinah dark:hover:text-shekinah-300"
      >
        {t("mobileCta.whatsapp")}
      </a>
    </nav>
  );
}
