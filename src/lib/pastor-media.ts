export type PastorMediaKind = "none" | "image" | "video";

/** Convierte enlaces de YouTube / Vimeo / Facebook a URL de embed, o null si no aplica. */
export function toVideoEmbedUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
      if (parts[0] === "shorts" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
      if (parts[0] === "live" && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`;
    }

    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }

    if (url.hostname.includes("facebook.com") || url.hostname.includes("fb.watch")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(value)}&show_text=false`;
    }

    if (url.pathname.includes("/embed/") || url.hostname.includes("player.")) {
      return value;
    }
  } catch {
    return null;
  }

  return null;
}

export function isLikelyImageUrl(raw: string): boolean {
  const value = raw.trim().toLowerCase();
  if (!value.startsWith("http://") && !value.startsWith("https://")) return false;
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(value) || value.includes("/storage/v1/object/public/");
}
