export const COORDINATOR_PHONE = "50364465489";

export const LINKS = {
  maps: "https://www.google.com/maps/search/?api=1&query=QJRR%2BHH2%2C%20San%20Juan%20Opico",
  waze: "https://waze.com/ul?ll=13.7915625%2C-89.3586875&navigate=yes",
  instagram: "https://www.instagram.com/shekinahelsalvador",
  facebook: "https://www.facebook.com/share/1L6qRECBoy/",
  youtube: "https://www.youtube.com/results?search_query=Iglesia+Shekinah+Versalles",
} as const;

export const SCHEDULE = [
  { dayKey: "common.tuesday", titleKey: "schedule.tuesdayActivity", time: "7:00 p.m. - 8:30 p.m." },
  { dayKey: "common.thursday", titleKey: "schedule.thursdayActivity", time: "7:00 p.m. - 8:30 p.m." },
  { dayKey: "common.saturday", titleKey: "schedule.saturdayActivity", time: "4:30 p.m. - 6:00 p.m." },
] as const;

export const SUNDAY_SCHEDULE = [
  { dayKey: "common.sunday", titleKey: "schedule.sunday1Activity", time: "8:30 a.m. - 9:40 a.m." },
  { dayKey: "common.sunday", titleKey: "schedule.sunday2Activity", time: "10:00 a.m. - 11:30 a.m." },
] as const;

export const MINISTRIES = [
  { num: "01", titleKey: "ministerios.item1Title", descKey: "ministerios.item1Desc" },
  { num: "02", titleKey: "ministerios.item2Title", descKey: "ministerios.item2Desc" },
  { num: "03", titleKey: "ministerios.item3Title", descKey: "ministerios.item3Desc" },
  { num: "04", titleKey: "ministerios.item4Title", descKey: "ministerios.item4Desc" },
  { num: "05", titleKey: "ministerios.item5Title", descKey: "ministerios.item5Desc" },
] as const;

export const EVENTS = [
  { tagKey: "eventos.item1Tag", titleKey: "eventos.item1Title", descKey: "eventos.item1Desc" },
  { tagKey: "eventos.item2Tag", titleKey: "eventos.item2Title", descKey: "eventos.item2Desc" },
  { tagKey: "nav.redes", titleKey: "eventos.item3Title", descKey: "eventos.item3Desc" },
] as const;

export const GALLERY_ITEMS = [
  {
    src: "/assets/fotos/congregacion-culto.webp",
    alt: "Congregación reunida durante un culto",
    tagKey: "galeria.item1Tag",
    titleKey: "galeria.item1Title",
    large: true,
    width: 1080,
    height: 732,
  },
  {
    src: "/assets/fotos/ministerio-ninos.webp",
    alt: "Niños participando en actividad de la iglesia",
    tagKey: "galeria.item2Tag",
    titleKey: "galeria.item2Title",
    width: 1280,
    height: 576,
  },
  {
    src: "/assets/fotos/aniversario-shekinah.webp",
    alt: "Celebración de aniversario de Iglesia Bautista Shekinah",
    tagKey: "galeria.item3Tag",
    titleKey: "galeria.item3Title",
    width: 1200,
    height: 1600,
  },
  {
    src: "/assets/fotos/liderazgo-pastoral.webp",
    alt: "Liderazgo pastoral de Iglesia Bautista Shekinah",
    tagKey: "galeria.item4Tag",
    titleKey: "galeria.item4Title",
    width: 1600,
    height: 1353,
  },
  {
    src: "/assets/fotos/predicacion-shekinah.webp",
    alt: "Predicación en Iglesia Bautista Shekinah",
    tagKey: "galeria.item5Tag",
    titleKey: "galeria.item5Title",
    width: 883,
    height: 1600,
  },
  {
    src: "/assets/fotos/predicacion-horarios.webp",
    alt: "Enseñanza bíblica en Iglesia Bautista Shekinah",
    tagKey: "galeria.item6Tag",
    titleKey: "galeria.item6Title",
    width: 1300,
    height: 1950,
  },
  {
    src: "/assets/fotos/presentacion-ninos.webp",
    alt: "Niños participando en una presentación bíblica",
    tagKey: "galeria.item7Tag",
    titleKey: "galeria.item7Title",
    width: 640,
    height: 480,
  },
] as const;

export const HELP_TYPES = [
  { value: "General", labelKey: "ayuda.typeDefault" },
  { value: "Oracion", labelKey: "helpTypes.oracion" },
  { value: "Viveres", labelKey: "helpTypes.viveres" },
  { value: "Visita", labelKey: "helpTypes.visita" },
  { value: "Santa Cena", labelKey: "helpTypes.santaCena" },
  { value: "Misiones", labelKey: "helpTypes.misiones" },
  { value: "Otra ayuda", labelKey: "helpTypes.otra" },
] as const;

export const SUPABASE_URL = "https://yjhnqxubicaglqfroiqk.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_Ab-n3U4ens-djPBRbrIyhQ_geFdri1b";
