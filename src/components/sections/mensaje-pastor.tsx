"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { BibleIcon } from "@/components/icons/bible-icon";
import { useLanguage } from "@/components/providers/language-provider";
import { toVideoEmbedUrl } from "@/lib/pastor-media";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchPublicPastorPosts()
      .then((posts) => {
        if (!cancelled) setPost(posts[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const typeLabel = post ? typeLabelFor(post, t) : "";
  const videoSrc =
    post?.media_kind === "video" && post.media_url
      ? toVideoEmbedUrl(post.media_url) || post.media_url
      : null;
  const showQuoteMarks =
    post &&
    post.content &&
    post.media_kind === "none" &&
    (post.post_type === "versiculo" || post.post_type === "mensaje" || post.post_type === "oracion");

  return (
    <section id="palabra" className="section-padding section-surface-alt" aria-label={t("pastor.aria")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <h2 className="section-title mt-0 text-center">{t("pastor.title")}</h2>
          <p className="section-desc mx-auto text-center">{t("pastor.description")}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10">
            {loading ? (
              <div className="space-y-4 py-10 text-center" aria-busy="true" aria-label={t("pastor.loading")}>
                <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-white/15" />
                <div className="mx-auto h-6 w-2/3 animate-pulse rounded bg-white/15" />
                <div className="mx-auto h-20 w-full max-w-xl animate-pulse rounded bg-white/10" />
              </div>
            ) : post ? (
              <article className="px-1 py-4 text-center sm:px-2">
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
                    <p className="font-heading text-[1.45rem] font-medium leading-snug tracking-tight text-balance text-white sm:text-[1.85rem] md:text-[2.05rem] md:leading-[1.35]">
                      {showQuoteMarks ? `“${post.content}”` : post.content}
                    </p>
                    {post.reference ? (
                      <cite className="mt-6 block font-sans text-sm font-medium not-italic text-[#f3c4cb]">
                        {post.reference}
                      </cite>
                    ) : null}
                  </blockquote>
                ) : post.reference ? (
                  <cite className="mt-6 block font-sans text-sm font-medium not-italic text-[#f3c4cb]">
                    {post.reference}
                  </cite>
                ) : null}

                <time dateTime={post.published_at} className="mt-7 block text-sm text-white/65">
                  {formatPostDate(post.published_at, lang)}
                </time>
              </article>
            ) : (
              <div className="flex flex-col items-center gap-4 px-2 py-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/80">
                  <BibleIcon className="h-8 w-8" strokeWidth={1.5} />
                </span>
                <p className="font-heading text-xl font-semibold text-white sm:text-2xl">
                  {t("pastor.emptyTitle")}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-white/70">
                  {t("pastor.emptyDesc")}
                </p>
                <Link
                  href="#ayuda"
                  className="mt-1 inline-flex rounded-[12px] border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/16"
                >
                  {t("pastor.emptyCta")}
                </Link>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
