import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { FabWhatsapp, ScrollTop } from "@/components/layout/floating-actions";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shekinah-sv.vercel.app"),
  title: "Iglesia Bautista Shekinah",
  description:
    "Sitio web de Iglesia Bautista Shekinah: horarios, ubicación, ministerios, ayuda, donaciones y redes sociales.",
  openGraph: {
    type: "website",
    url: "https://shekinah-sv.vercel.app/",
    title: "Iglesia Bautista Shekinah",
    description:
      "Horarios, ubicación, ministerios y contacto de Iglesia Bautista Shekinah en San Juan Opico, El Salvador.",
    images: ["/assets/fotos/congregacion-culto.webp"],
    locale: "es_SV",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iglesia Bautista Shekinah",
    description:
      "Horarios, ubicación, ministerios y contacto de Iglesia Bautista Shekinah en San Juan Opico, El Salvador.",
    images: ["/assets/fotos/congregacion-culto.webp"],
  },
};

export const viewport = {
  themeColor: "#65101a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${sourceSans.variable} ${cormorant.variable} min-h-screen font-sans antialiased`}>
        <Script id="force-light-theme" strategy="beforeInteractive">
          {`document.documentElement.classList.remove("dark");try{localStorage.removeItem("shekinah-theme")}catch(e){}`}
        </Script>
        <AppProviders>
          <div className="site-bg" aria-hidden />
          <SiteHeader />
          {children}
          <SiteFooter />
          <MobileCta />
          <FabWhatsapp />
          <ScrollTop />
        </AppProviders>
      </body>
    </html>
  );
}
