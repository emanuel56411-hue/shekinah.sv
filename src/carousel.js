import Swiper from "swiper";
import { A11y, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export function initializeFeaturedCarousel() {
  const carousel = document.querySelector("[data-featured-carousel]");

  if (!carousel) {
    return null;
  }

  return new Swiper(carousel, {
    modules: [A11y, Keyboard, Pagination],
    a11y: {
      enabled: true,
      containerMessage: "Próximas actividades de la iglesia",
      paginationBulletMessage: "Ir a la actividad {{index}}",
      slideRole: "article",
    },
    grabCursor: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    pagination: {
      el: carousel.querySelector(".swiper-pagination"),
      clickable: true,
    },
    slidesPerView: 1.08,
    spaceBetween: 14,
    watchOverflow: true,
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      1040: {
        slidesPerView: 3,
        allowTouchMove: false,
      },
    },
  });
}
