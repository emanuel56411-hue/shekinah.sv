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
      <AnniversaryNote />
      <QuickStrip />
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
