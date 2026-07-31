"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-1.2C13 9.4 13.4 9 14 9z" />
    </svg>
  );
}

function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M22.5 7.2a2.9 2.9 0 0 0-2-2C18.7 4.8 12 4.8 12 4.8s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2A30 30 0 0 0 1.2 12a30 30 0 0 0 .3 4.8 2.9 2.9 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22.8 12a30 30 0 0 0-.3-4.8zM10 15.2V8.8L15.5 12 10 15.2z" />
    </svg>
  );
}

const socialLinks: {
  key: string;
  href: string;
  label: string;
  handle: string;
  icon: (props: { className?: string }) => ReactNode;
  iconClass: string;
  className: string;
}[] = [
  {
    key: "instagram",
    href: LINKS.instagram,
    label: "Instagram",
    handle: "@shekinahelsalvador",
    icon: InstagramGlyph,
    iconClass: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
    className: "hover:border-pink-400/40 hover:bg-white",
  },
  {
    key: "facebook",
    href: LINKS.facebook,
    label: "Facebook",
    handle: "Shekinah Versalles",
    icon: FacebookGlyph,
    iconClass: "bg-[#1877F2] text-white",
    className: "hover:border-blue-400/40 hover:bg-white",
  },
  {
    key: "youtube",
    href: LINKS.youtube,
    label: "YouTube",
    handle: "@Iglesia_ShekinahVersalles",
    icon: YoutubeGlyph,
    iconClass: "bg-[#FF0000] text-white",
    className: "hover:border-red-400/40 hover:bg-white",
  },
];

function BrandIcon({
  icon: Icon,
  className,
}: {
  icon: (props: { className?: string }) => ReactNode;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-[0_6px_14px_-6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.35)]",
        className
      )}
      aria-hidden
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

export function Redes() {
  const { t } = useLanguage();

  return (
    <section id="redes" className="section-padding section-surface-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("nav.redes")}</p>
          <h2 className="section-title">{t("redes.title")}</h2>
          <p className="section-desc">{t("redes.description")}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {socialLinks.map((social, index) => (
            <Reveal key={social.key} delay={index * 0.06}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah focus-visible:ring-offset-2"
              >
                <Card
                  className={cn(
                    "surface-porcelain h-full ring-0",
                    social.className
                  )}
                >
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{social.label}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                      <BrandIcon icon={social.icon} className={social.iconClass} />
                      <strong className="min-w-0 break-all text-base text-shekinah  sm:text-lg">
                        {social.handle}
                      </strong>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
