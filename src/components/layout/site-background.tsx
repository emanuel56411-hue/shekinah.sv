import Image from "next/image";

/**
 * Fondo fijo del sitio. Con output: "export" + images.unoptimized,
 * pre-generamos WebP/JPG y usamos picture + srcset para servir el tamaño correcto.
 */
export function SiteBackground() {
  return (
    <div className="site-bg" aria-hidden>
      <picture>
        <source
          type="image/webp"
          srcSet="/assets/fotos/hero-congregacion-sm.webp 1600w, /assets/fotos/hero-congregacion.webp 2560w"
          sizes="100vw"
        />
        <Image
          src="/assets/fotos/hero-congregacion.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="site-bg__image"
        />
      </picture>
    </div>
  );
}
