import { Hero } from "@/components/sections/hero";
import { AnniversaryNote, QuickStrip } from "@/components/sections/quick-strip";
import { Horarios } from "@/components/sections/horarios";
import { Ubicacion } from "@/components/sections/ubicacion";
import { AyudaDonaciones } from "@/components/sections/ayuda-donaciones";
import { Somos, Scripture } from "@/components/sections/somos-scripture";
import { Galeria } from "@/components/sections/galeria";
import { Eventos, Ministerios } from "@/components/sections/eventos-ministerios";
import { Redes } from "@/components/sections/redes";

export default function HomePage() {
  return (
    <main className="pb-24 pt-[4.25rem] md:pb-0">
      <Hero />
      {/* Fondo camino + fade suave desde el hero (hero intacto) */}
      <section className="post-hero-band" aria-label="Aniversario y accesos">
        <div className="post-hero-band__bg" aria-hidden />
        <div className="post-hero-band__seam" aria-hidden />
        <div className="relative z-10">
          <AnniversaryNote />
          <QuickStrip />
        </div>
      </section>
      <Horarios />
      <Ubicacion />
      <AyudaDonaciones />
      <Somos />
      <Scripture />
      <Galeria />
      <Eventos />
      <Ministerios />
      <Redes />
    </main>
  );
}
