"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { BibleIcon } from "@/components/icons/bible-icon";
import { useLanguage } from "@/components/providers/language-provider";
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

  const typeLabel =
    post?.post_type === "versiculo"
      ? t("pastor.typeVersiculo")
      : post?.post_type === "anuncio"
        ? t("pastor.typeAnuncio")
        : t("pastor.typeMensaje");

  return (
    <section id="palabra" className="section-padding section-surface" aria-label={t("pastor.aria")}>
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
              <article className="text-center">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#f3c4cb]">
                  {typeLabel}
                </p>
                <blockquote className="mt-5">
                  <p className="font-heading text-[1.45rem] font-medium leading-snug tracking-tight text-balance text-white sm:text-[1.85rem] md:text-[2.05rem] md:leading-[1.35]">
                    “{post.content}”
                  </p>
                  {post.reference ? (
                    <cite className="mt-7 block font-sans text-[0.75rem] font-semibold not-italic uppercase tracking-[0.22em] text-[#f3c4cb]">
                      {post.reference}
                    </cite>
                  ) : null}
                </blockquote>
                <time
                  dateTime={post.published_at}
                  className="mt-8 block text-sm text-white/65"
                >
                  {formatPostDate(post.published_at, lang)}
                </time>
              </article>
            ) : (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80">
                  <BibleIcon className="h-8 w-8" strokeWidth={1.5} />
                </span>
                <p className="font-heading text-xl font-semibold text-white sm:text-2xl">
                  {t("pastor.emptyTitle")}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-white/65">
                  {t("pastor.emptyDesc")}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
