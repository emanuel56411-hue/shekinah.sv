import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { FabWhatsapp, ScrollTop } from "@/components/layout/floating-actions";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://emanuel56411-hue.github.io/shekinah.sv"),
  title: "Iglesia Bautista Shekinah",
  description:
    "Sitio web de Iglesia Bautista Shekinah: horarios, ubicación, ministerios, ayuda, donaciones y redes sociales.",
  openGraph: {
    type: "website",
    url: "https://emanuel56411-hue.github.io/shekinah.sv/",
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
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <AppProviders>
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
