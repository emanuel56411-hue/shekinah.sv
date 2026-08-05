/** URL canónica del sitio. En Vercel: NEXT_PUBLIC_SITE_URL=https://tudominio.sv */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shekinah-sv.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Iglesia Bautista Shekinah";
export const SITE_LOCALITY = "San Juan Opico, La Libertad, El Salvador";

export const SITE_DESCRIPTION =
  "Iglesia Bautista Shekinah en San Juan Opico, El Salvador: horarios de culto, ubicación, ministerios, ayuda y contacto.";

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}
