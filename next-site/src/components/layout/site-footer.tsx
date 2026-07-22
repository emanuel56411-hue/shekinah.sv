"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/providers/language-provider";
import { COORDINATOR_PHONE, LINKS } from "@/lib/constants";
import { buildWhatsappUrl, formatPhone } from "@/lib/whatsapp";

export function SiteFooter() {
  const { t } = useLanguage();

  const links = [
    { href: "#reuniones", label: t("nav.horarios") },
    { href: "#ubicacion", label: t("nav.ubicacion") },
    { href: "#ayuda", label: t("nav.ayuda") },
    { href: "#galeria", label: t("galeria.title") },
    { href: LINKS.instagram, label: "Instagram", external: true },
  ];

  return (
    <footer className="border-t border-border bg-shekinah text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-lg font-bold">Iglesia Bautista Shekinah</p>
            <p className="mt-2 text-sm text-white/80">{t("footer.tagline")}</p>
            <p className="mt-4 text-sm">
              WhatsApp:{" "}
              <a href={buildWhatsappUrl()} className="font-semibold underline-offset-4 hover:underline">
                {formatPhone(COORDINATOR_PHONE)}
              </a>
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-white/85 hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="my-8 bg-white/20" />
        <p className="text-center text-xs text-white/70">
          © {new Date().getFullYear()} Iglesia Bautista Shekinah. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
