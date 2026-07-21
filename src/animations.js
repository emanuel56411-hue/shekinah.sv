import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function createScrollProgress() {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: ({ progress: value }) => {
      gsap.set(progress, { scaleX: value });
    },
  });
}

function animateHero() {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  timeline
    .fromTo(".hero-content h1", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.85 })
    .fromTo(".hero-content > p", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.65 }, "-=0.5")
    .fromTo(
      ".hero-actions .button",
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 },
      "-=0.4"
    )
    .fromTo(".hero-panel", { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.7 }, "-=0.55");

  gsap.to(".hero", {
    backgroundPosition: "70% 58%",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
    },
  });
}

function animateSections() {
  const headings = gsap.utils.toArray(
    ".section-heading, .section-copy, .scripture-quote-standalone, .identity-visual"
  );

  headings.forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
          once: true,
        },
      }
    );
  });

  const cardGroups = [
    ".schedule-list .schedule-item",
    ".route-actions .action-link",
    ".help-board .help-card",
    ".ministry-grid article",
    ".social-cards .social-card",
    ".photo-grid .photo-card",
  ];

  cardGroups.forEach((selector) => {
    ScrollTrigger.batch(selector, {
      start: "top 90%",
      once: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: true,
          }
        ),
    });
  });
}

function animateAnniversary() {
  const number = document.querySelector(".anniversary-number");
  const target = Number(number?.textContent);

  if (!number || !Number.isFinite(target)) {
    return;
  }

  const counter = { value: 0 };
  gsap.to(counter, {
    value: target,
    duration: 1.2,
    ease: "power2.out",
    snap: { value: 1 },
    scrollTrigger: {
      trigger: number,
      start: "top 92%",
      once: true,
    },
    onUpdate: () => {
      number.textContent = String(counter.value);
    },
  });
}

export function initializeAnimations() {
  createScrollProgress();

  if (reduceMotionQuery.matches) {
    document.documentElement.classList.add("motion-reduced");
    return;
  }

  document.documentElement.classList.add("motion-ready");
  animateHero();
  animateSections();
  animateAnniversary();

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
}
