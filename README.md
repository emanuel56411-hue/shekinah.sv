# Iglesia Bautista Shekinah

Sitio web de Iglesia Bautista Shekinah (San Juan Opico, El Salvador).

## URLs en producción

- GitHub Pages: https://emanuel56411-hue.github.io/shekinah.sv/
- Vercel: https://shekinah-sv.vercel.app/

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Build

```bash
npm run build          # Vercel / producción sin subcarpeta
GITHUB_PAGES=true npm run build   # GitHub Pages (genera carpeta out/)
```

## Estructura

- `src/` — componentes React (Next.js 14 + Tailwind + shadcn/ui)
- `public/assets/` — logo y fotos
- `legacy-static/` — respaldo del sitio HTML anterior
