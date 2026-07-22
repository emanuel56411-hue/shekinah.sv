"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function MobileCta() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("mobileCta.aria")}
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur md:hidden"
    >
      <Link href="#reuniones" className="px-3 py-3 text-center text-sm font-medium transition-colors hover:text-shekinah">
        {t("mobileCta.schedule")}
      </Link>
      <Link href="#ubicacion" className="border-x border-border px-3 py-3 text-center text-sm font-medium transition-colors hover:text-shekinah">
        {t("mobileCta.directions")}
      </Link>
      <a
        href={buildWhatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-3 text-center text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
      >
        {t("mobileCta.whatsapp")}
      </a>
    </nav>
  );
}
