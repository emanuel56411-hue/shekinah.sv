"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { PastorWordSkeleton } from "@/components/ui/section-skeleton";
import { useLanguage } from "@/components/providers/language-provider";
import { toVideoEmbedUrl } from "@/lib/pastor-media";
import { isPastorWordActive } from "@/lib/pastor-word";
import { fetchPublicPastorPosts, type PublicPastorPost } from "@/lib/supabase";

function formatPostDate(value: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-SV", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value.slice(0, 10);
  }
}

function typeLabelFor(post: PublicPastorPost, t: (key: string) => string) {
  switch (post.post_type) {
    case "versiculo":
      return t("pastor.typeVersiculo");
    case "anuncio":
      return t("pastor.typeAnuncio");
    case "oracion":
      return t("pastor.typeOracion");
    case "foto":
      return t("pastor.typeFoto");
    case "video":
      return t("pastor.typeVideo");
    default:
      return t("pastor.typeMensaje");
  }
}

export function MensajePastor() {
  const { t, lang } = useLanguage();
  const [post, setPost] = useState<PublicPastorPost | null>(null);
  const [ready, setReady] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    // Solo mostrar skeleton si la carga tarda un poco (evita parpadeo en redes rápidas)
    const skeletonTimer = window.setTimeout(() => setShowSkeleton(true), 180);
    let cancelled = false;

    fetchPublicPastorPosts()
      .then((posts) => {
        if (cancelled) return;
        const latest = posts[0] ?? null;
        if (latest && isPastorWordActive(latest.published_at)) {
          setPost(latest);
        } else {
          setPost(null);
        }
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      })
      .finally(() => {
        if (!cancelled) {
          window.clearTimeout(skeletonTimer);
          setShowSkeleton(false);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(skeletonTimer);
    };
  }, []);

  // Sin post vigente: no renderizar (después de cargar)
  if (ready && !post) return null;

  // Cargando: skeleton suave (solo si tardó >180ms)
  if (!ready) {
    if (!showSkeleton) return null;
    return (
      <section id="palabra" className="section-padding" aria-label={t("pastor.aria")}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <h2 className="section-title mt-0 text-center">{t("pastor.title")}</h2>
            <p className="section-desc mx-auto text-center">{t("pastor.description")}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <PastorWordSkeleton label={t("pastor.loading")} />
          </Reveal>
        </div>
      </section>
    );
  }

  if (!post) return null;

  const typeLabel = typeLabelFor(post, t);
  const videoSrc =
    post.media_kind === "video" && post.media_url
      ? toVideoEmbedUrl(post.media_url) || post.media_url
      : null;
  const showQuoteMarks =
    Boolean(post.content) &&
    post.media_kind === "none" &&
    (post.post_type === "versiculo" || post.post_type === "mensaje" || post.post_type === "oracion");

  return (
    <section id="palabra" className="section-padding" aria-label={t("pastor.aria")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <h2 className="section-title mt-0 text-center">{t("pastor.title")}</h2>
          <p className="section-desc mx-auto text-center">{t("pastor.description")}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="mt-10 px-1 py-4 text-center sm:px-2">
            <p className="text-[0.75rem] font-medium text-[#f3c4cb]">{typeLabel}</p>

            {post.media_kind === "image" && post.media_url ? (
              <div className="mx-auto mt-6 w-full max-w-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.media_url}
                  alt={post.content || typeLabel}
                  className="mx-auto h-auto max-h-[70vh] w-auto max-w-full rounded-[12px] object-contain"
                />
              </div>
            ) : null}

            {videoSrc ? (
              <div className="relative mx-auto mt-6 aspect-video w-full max-w-xl overflow-hidden rounded-[12px] bg-black/40">
                <iframe
                  src={videoSrc}
                  title={post.content || typeLabel}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : null}

            {post.content && !["Foto", "Video"].includes(post.content) ? (
              <blockquote className="mt-5">
                <p className="font-heading text-[clamp(1.7rem,4.6vw,2.35rem)] font-medium leading-[1.28] tracking-tight text-balance text-white md:leading-[1.32]">
                  {showQuoteMarks ? `“${post.content}”` : post.content}
                </p>
                {post.reference ? (
                  <cite className="mt-6 block font-sans text-[clamp(0.95rem,2.4vw,1.15rem)] font-semibold uppercase not-italic tracking-[0.04em] text-[#f3c4cb]">
                    {post.reference}
                  </cite>
                ) : null}
              </blockquote>
            ) : post.reference ? (
              <cite className="mt-6 block font-sans text-[clamp(0.95rem,2.4vw,1.15rem)] font-semibold uppercase not-italic tracking-[0.04em] text-[#f3c4cb]">
                {post.reference}
              </cite>
            ) : null}

            <time dateTime={post.published_at} className="mt-7 block text-sm text-white/65">
              {formatPostDate(post.published_at, lang)}
            </time>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
