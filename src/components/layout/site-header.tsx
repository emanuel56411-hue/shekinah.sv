"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CalendarDays,
  Clock,
  Heart,
  Home,
  Images,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Share2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { CalendarModal } from "@/components/calendar/calendar-modal";
import { useLanguage } from "@/components/providers/language-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  titleKey: string;
  icon: LucideIcon;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "#inicio", titleKey: "nav.inicio", icon: Home },
  { href: "#reuniones", titleKey: "nav.horarios", icon: Clock },
  { href: "#eventos", titleKey: "nav.eventos", icon: Calendar },
  { href: "#ministerios", titleKey: "nav.ministerios", icon: Users },
  { href: "#ayuda", titleKey: "nav.ayuda", icon: Heart },
  { href: "#ubicacion", titleKey: "nav.ubicacion", icon: MapPin },
  { href: "#galeria", titleKey: "nav.galeria", icon: Images },
  { href: "#redes", titleKey: "nav.redes", icon: Share2 },
];

export function SiteHeader() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const openCalendar = () => {
    setOpen(false);
    setCalendarOpen(true);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-black/15 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="#inicio" aria-label={t("header.brandAria")} className="flex min-w-0 items-center gap-3">
            <Image
              src="/assets/logo-shekinah.png"
              alt="Logo Shekinah"
              width={46}
              height={46}
              className="h-[46px] w-[46px] shrink-0 rounded-full"
            />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-sm font-bold text-[#1a1214] sm:text-base">
                Iglesia Bautista Shekinah
              </strong>
              <small className="block text-xs font-medium text-[#65101a]/80">San Juan Opico</small>
            </span>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
              aria-label={t("menu.openAria")}
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">{t("menu.title")}</span>
            </SheetTrigger>

            <SheetContent
              side="left"
              showCloseButton
              className="flex w-[min(100%,20rem)] flex-col gap-0 border-r border-white/10 bg-black p-0 text-white sm:max-w-xs [&>button]:text-white [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
            >
              <SheetHeader className="border-b border-white/10 px-4 py-5 text-left">
                <div className="flex items-center gap-3 pr-8">
                  <Image
                    src="/assets/logo-shekinah.png"
                    alt="Logo Shekinah"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <SheetTitle className="font-heading text-base font-semibold text-white">
                      Shekinah
                    </SheetTitle>
                    <p className="text-xs text-white/60">San Juan Opico</p>
                  </div>
                </div>
              </SheetHeader>

              <nav aria-label={t("menu.title")} className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="group flex items-center gap-4 rounded-full px-4 py-3 text-[1.05rem] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
                        >
                          <Icon className="h-[1.35rem] w-[1.35rem] shrink-0 text-white" strokeWidth={1.75} />
                          <span>{t(item.titleKey)}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <button
                      type="button"
                      onClick={openCalendar}
                      className="group flex w-full items-center gap-4 rounded-full px-4 py-3 text-left text-[1.05rem] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
                    >
                      <CalendarDays className="h-[1.35rem] w-[1.35rem] shrink-0 text-white" strokeWidth={1.75} />
                      <span>{t("nav.calendario")}</span>
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="mt-auto space-y-3 border-t border-white/10 p-4">
                <a
                  href={buildWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-shekinah px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-shekinah-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t("menu.whatsappCta")}
                </a>

                <p className="px-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/50">
                  {t("menu.settings")}
                </p>

                <a
                  href={buildTelUrl()}
                  onClick={closeMenu}
                  aria-label={t("menu.callAria")}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.75} />
                  {t("menu.call")}
                </a>

                <button
                  type="button"
                  onClick={() => setLang(lang === "es" ? "en" : "es")}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
                  aria-label={lang === "es" ? t("lang.ariaToEnglish") : t("lang.ariaToSpanish")}
                >
                  {lang === "es" ? t("lang.toEnglish") : t("lang.toSpanish")}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <CalendarModal open={calendarOpen} onOpenChange={setCalendarOpen} />
    </>
  );
}
