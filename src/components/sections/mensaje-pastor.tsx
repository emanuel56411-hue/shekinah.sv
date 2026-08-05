"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { useLanguage } from "@/components/providers/language-provider";
import { toVideoEmbedUrl } from "@/lib/pastor-media";
import { fetchPublicPastorPosts, type PublicPastorPost } from "@/lib/supabase";

const WORD_VISIBLE_MS = 24 * 60 * 60 * 1000;

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

function isWithinLast24Hours(publishedAt: string) {
  const published = new Date(publishedAt).getTime();
  if (Number.isNaN(published)) return false;
  return Date.now() - published < WORD_VISIBLE_MS;
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

  useEffect(() => {
    let cancelled = false;

    fetchPublicPastorPosts()
      .then((posts) => {
        if (cancelled) return;
        const latest = posts[0] ?? null;
        if (latest && isWithinLast24Hours(latest.published_at)) {
          setPost(latest);
        } else {
          setPost(null);
        }
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Opción A: oculta si no hay post o ya pasaron 24h (se evalúa en cada carga)
  if (!ready || !post) return null;

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

        <Reveal delay={0.08}>
          <article className="mt-10 px-1 py-4 text-center sm:px-2">
            <p className="text-[0.75rem] font-medium text-[#f3c4cb]">{typeLabel}</p>

            {post.media_kind === "image" && post.media_url ? (
              <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[12px]">
                <Image
                  src={post.media_url}
                  alt={post.content || typeLabel}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 576px"
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
