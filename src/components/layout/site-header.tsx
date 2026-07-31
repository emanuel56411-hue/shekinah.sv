"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Heart,
  Home,
  Images,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CalendarModal } from "@/components/calendar/calendar-modal";
import { useCalendarModal } from "@/components/providers/calendar-provider";
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
  { href: "#ubicacion", titleKey: "nav.ubicacion", icon: MapPin },
  { href: "#ayuda", titleKey: "nav.ayuda", icon: Heart },
  { href: "#ministerios", titleKey: "nav.ministerios", icon: Users },
  { href: "#galeria", titleKey: "nav.galeria", icon: Images },
];

function getScrollY() {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function SiteHeader() {
  const { t, lang, setLang } = useLanguage();
  const { open: calendarOpen, setOpen: setCalendarOpen, openCalendar } = useCalendarModal();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = getScrollY();

    const update = () => {
      ticking.current = false;
      const current = getScrollY();
      const delta = current - lastScrollY.current;

      // Menú abierto o cerca del tope: siempre visible
      if (open || current < 64) {
        setHidden(false);
      } else if (delta > 4) {
        // Bajando
        setHidden(true);
      } else if (delta < -4) {
        // Subiendo
        setHidden(false);
      }

      lastScrollY.current = current;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleOpenCalendar = () => {
    setOpen(false);
    openCalendar();
  };

  const shouldHide = open || hidden;

  return (
    <>
      <header
        className={cn(
          "site-header-overlay fixed inset-x-0 top-0 z-[100] border-b border-transparent will-change-transform",
          "transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none",
          shouldHide && "pointer-events-none"
        )}
        style={{
          transform: shouldHide ? "translate3d(0, -110%, 0)" : "translate3d(0, 0, 0)",
          opacity: open ? 0 : 1,
        }}
        data-header-hidden={shouldHide ? "true" : "false"}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
          <Link href="#inicio" aria-label={t("header.brandAria")} className="flex min-w-0 items-center gap-3">
            <Image
              src="/assets/logo-shekinah.png"
              alt="Logo Shekinah"
              width={64}
              height={64}
              className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain p-1 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-white/80 sm:h-16 sm:w-16"
              priority
            />
            <span className="min-w-0 leading-tight [text-shadow:0_0_4px_rgba(0,0,0,0.95),0_0_10px_rgba(0,0,0,0.7)]">
              <strong className="block truncate text-sm font-bold text-white sm:text-base">
                Iglesia Bautista Shekinah
              </strong>
              <small className="block text-xs font-medium text-white">San Juan Opico</small>
            </span>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "surface-glass gap-2 border-white/30 text-white [text-shadow:0_0_4px_rgba(0,0,0,0.9)] hover:text-white"
              )}
              aria-label={t("menu.openAria")}
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">{t("menu.title")}</span>
            </SheetTrigger>

            <SheetContent
              side="left"
              showCloseButton
              className="flex w-[min(100%,20rem)] flex-col gap-0 border-r border-white/20 bg-black/90 p-0 text-white shadow-[8px_0_40px_-12px_rgba(0,0,0,0.65),inset_-1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:max-w-xs [&>button]:text-white [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
            >
              <SheetHeader className="border-b border-white/10 px-4 py-5 text-left">
                <div className="flex items-center gap-3 pr-8">
                  <Image
                    src="/assets/logo-shekinah.png"
                    alt="Logo Shekinah"
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-1"
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
                      onClick={handleOpenCalendar}
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
                  className="btn-skeuo flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
