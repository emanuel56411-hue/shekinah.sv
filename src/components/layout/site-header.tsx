"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Heart,
  Images,
  Menu,
  MessageCircle,
  Phone,
  Share2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { CalendarModal } from "@/components/calendar/calendar-modal";
import { BibleIcon } from "@/components/icons/bible-icon";
import { useCalendarModal } from "@/components/providers/calendar-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { SocialPanel } from "@/components/social/social-panel";
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

type NavIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

type NavItem = {
  href: string;
  titleKey: string;
  icon: NavIcon;
  action?: "social";
};

const navItems: NavItem[] = [
  { href: "#palabra", titleKey: "nav.palabra", icon: BibleIcon },
  { href: "#ayuda", titleKey: "nav.ayuda", icon: Heart },
  { href: "#redes", titleKey: "nav.redes", icon: Share2, action: "social" },
  { href: "#ministerios", titleKey: "nav.ministerios", icon: Users },
  { href: "#galeria", titleKey: "nav.galeria", icon: Images },
];

const navLinkClass =
  "rounded-[12px] px-3 py-2 text-sm font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_2px_10px_rgba(0,0,0,0.45)] transition-colors hover:bg-white/12 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah";

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
  const [socialOpen, setSocialOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const openSocial = () => {
    setOpen(false);
    setSocialOpen(true);
  };

  const handleSocialOpenChange = (next: boolean) => {
    setSocialOpen(next);
    if (!next && typeof window !== "undefined" && window.location.hash === "#redes") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === "#redes") setSocialOpen(true);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    lastScrollY.current = getScrollY();

    const update = () => {
      ticking.current = false;
      const current = getScrollY();
      const delta = current - lastScrollY.current;

      if (open || current < 72) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
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
          "motion-reduce:transition-none",
          shouldHide && "pointer-events-none"
        )}
        style={{
          transform: shouldHide ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
          opacity: shouldHide ? 0 : 1,
          transition:
            "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        data-header-hidden={shouldHide ? "true" : "false"}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
          <Link href="#inicio" aria-label={t("header.brandAria")} className="flex min-w-0 items-center gap-3">
            <Image
              src="/assets/logo-shekinah.png"
              alt="Logo Shekinah"
              width={64}
              height={64}
              className="h-12 w-12 shrink-0 rounded-[12px] bg-white object-contain p-1 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/70 sm:h-14 sm:w-14"
              priority
            />
            <span className="min-w-0 leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.65)]">
              <strong className="block truncate text-sm font-semibold text-white sm:text-[0.95rem]">
                Iglesia Bautista Shekinah
              </strong>
              <small className="block text-xs font-medium text-white/95">San Juan Opico</small>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <nav aria-label={t("header.navAria")} className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) =>
                item.action === "social" ? (
                  <button key={item.href} type="button" onClick={openSocial} className={navLinkClass}>
                    {t(item.titleKey)}
                  </button>
                ) : (
                  <Link key={item.href} href={item.href} className={navLinkClass}>
                    {t(item.titleKey)}
                  </Link>
                )
              )}
              <button type="button" onClick={openCalendar} className={navLinkClass}>
                {t("nav.calendario")}
              </button>
              <button
                type="button"
                onClick={() => setLang(lang === "es" ? "en" : "es")}
                className="ml-1 rounded-[12px] border border-white/25 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shekinah"
                aria-label={lang === "es" ? t("lang.ariaToEnglish") : t("lang.ariaToSpanish")}
              >
                {lang === "es" ? t("lang.toEnglish") : t("lang.toSpanish")}
              </button>
            </nav>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "surface-glass gap-2 border-white/30 text-white [text-shadow:0_0_4px_rgba(0,0,0,0.9)] hover:text-white lg:hidden"
                )}
                aria-label={t("menu.openAria")}
              >
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">{t("menu.title")}</span>
              </SheetTrigger>

              <SheetContent
                side="left"
                showCloseButton
                className="flex w-[min(100%,20rem)] flex-col gap-0 border-r border-white/20 bg-black/90 p-0 text-white shadow-[8px_0_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:max-w-xs [&>button]:text-white [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
              >
                <SheetHeader className="border-b border-white/10 px-4 py-5 text-left">
                  <div className="flex items-center gap-3 pr-8">
                    <Image
                      src="/assets/logo-shekinah.png"
                      alt="Logo Shekinah"
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-[12px] bg-white object-contain p-1"
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
                      if (item.action === "social") {
                        return (
                          <li key={item.href}>
                            <button
                              type="button"
                              onClick={openSocial}
                              className="group flex w-full items-center gap-4 rounded-[12px] px-4 py-3 text-left text-[1.05rem] font-medium text-white transition-colors hover:bg-white/10"
                            >
                              <Icon className="h-[1.35rem] w-[1.35rem] shrink-0" strokeWidth={1.75} />
                              <span>{t(item.titleKey)}</span>
                            </button>
                          </li>
                        );
                      }
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            className="group flex items-center gap-4 rounded-[12px] px-4 py-3 text-[1.05rem] font-medium text-white transition-colors hover:bg-white/10"
                          >
                            <Icon className="h-[1.35rem] w-[1.35rem] shrink-0" strokeWidth={1.75} />
                            <span>{t(item.titleKey)}</span>
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        type="button"
                        onClick={handleOpenCalendar}
                        className="group flex w-full items-center gap-4 rounded-[12px] px-4 py-3 text-left text-[1.05rem] font-medium text-white transition-colors hover:bg-white/10"
                      >
                        <CalendarDays className="h-[1.35rem] w-[1.35rem] shrink-0" strokeWidth={1.75} />
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
                    className="btn-skeuo flex w-full items-center justify-center gap-2 rounded-[12px] px-5 py-3.5 text-sm font-bold"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t("menu.whatsappCta")}
                  </a>
                  <a
                    href={buildTelUrl()}
                    onClick={closeMenu}
                    aria-label={t("menu.callAria")}
                    className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-white/25 bg-white px-4 py-3 text-sm font-semibold text-black"
                  >
                    <Phone className="h-4 w-4" strokeWidth={1.75} />
                    {t("menu.call")}
                  </a>
                  <button
                    type="button"
                    onClick={() => setLang(lang === "es" ? "en" : "es")}
                    className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-white/20 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                    aria-label={lang === "es" ? t("lang.ariaToEnglish") : t("lang.ariaToSpanish")}
                  >
                    {lang === "es" ? t("lang.toEnglish") : t("lang.toSpanish")}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CalendarModal open={calendarOpen} onOpenChange={setCalendarOpen} />
      <SocialPanel open={socialOpen} onOpenChange={handleSocialOpenChange} />
    </>
  );
}
