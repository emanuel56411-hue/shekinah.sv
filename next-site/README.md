# Shekinah — Next.js (rediseño)

Versión moderna del sitio de Iglesia Bautista Shekinah, construida con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **shadcn/ui**.

El sitio HTML original (`index.html`, `styles.css`, `script.js`) **no se modificó**; vive en la raíz del repo para comparar antes de publicar.

## Comandos

```bash
cd next-site
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run start    # servir build
```

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + paleta `#65101a` (shekinah)
- shadcn/ui (Button, Card, Dialog, Sheet, Input, Select, etc.)
- Framer Motion (animaciones al scroll)
- next/font (Inter)
- next/image (fotos optimizadas)

## Estructura

```
src/
  app/           layout.tsx, page.tsx, globals.css
  components/
    sections/    Hero, Horarios, Ubicacion, Ayuda, Galeria, etc.
    layout/      Header, Footer, FAB WhatsApp, CTA móvil
    providers/   Tema claro/oscuro + i18n ES/EN
    motion/      Reveal (fade-in + slide-up)
  lib/           constants, i18n, whatsapp, supabase (fetch REST)
public/assets/  Logo e imágenes copiadas del sitio original
```

## Notas

- WhatsApp: `50364465489`
- Formulario de ayuda: guarda en Supabase (best-effort) y **siempre** abre WhatsApp
- Modo oscuro/claro e idioma ES/EN conservados (localStorage)
