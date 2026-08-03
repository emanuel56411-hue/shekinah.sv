import { Hero } from "@/components/sections/hero";
import { MensajePastor } from "@/components/sections/mensaje-pastor";
import { Horarios } from "@/components/sections/horarios";
import { Ubicacion } from "@/components/sections/ubicacion";
import { AyudaDonaciones } from "@/components/sections/ayuda-donaciones";
import { Scripture } from "@/components/sections/somos-scripture";
import { Galeria } from "@/components/sections/galeria";
import { Eventos, Ministerios } from "@/components/sections/eventos-ministerios";
// Sección "Síguenos" movida al menú (panel/modal).
// import { Redes } from "@/components/sections/redes";

export default function HomePage() {
  return (
    <main className="pt-[4.25rem]">
      {/* IMPORTANTE: las secciones usan <Reveal> para el scroll interactivo. NO quitar. */}
      <Hero />
      <Horarios />
      <AyudaDonaciones />
      <Galeria />
      <MensajePastor />
      <Ubicacion />
      <Eventos />
      <Ministerios />
      <Scripture />
      {/* <Redes /> */}
    </main>
  );
}
