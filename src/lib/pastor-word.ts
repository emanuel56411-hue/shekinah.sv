/** Ventana de visibilidad pública de la Palabra del Día. */
export const PASTOR_WORD_VISIBLE_MS = 24 * 60 * 60 * 1000;

export function isPastorWordActive(publishedAt: string, now = Date.now()) {
  const published = new Date(publishedAt).getTime();
  if (Number.isNaN(published)) return false;
  return now - published < PASTOR_WORD_VISIBLE_MS;
}
