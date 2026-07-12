const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector("#main-menu");
const menuClose = document.querySelector(".menu-close");
const themeToggle = document.querySelector(".theme-toggle");
const langToggle = document.querySelector(".lang-toggle");
const contactForm = document.querySelector(".contact-form");
const helpForm = document.querySelector(".help-form");
const helpBoard = document.querySelector(".help-board");
const helpStatus = document.querySelector(".form-status");
const coordinatorPhone = document.body.dataset.phone || "";
const phoneDisplayNodes = document.querySelectorAll("[data-phone-display]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const progressiveSections = document.querySelectorAll("main > section:not(.hero)");
const defaultHelpCards = Array.from(helpBoard.children).map((card) => card.cloneNode(true));
const nextServiceLabel = document.querySelector("[data-next-service-label]");
const nextServiceDay = document.querySelector("[data-next-service-day]");
const nextServiceTime = document.querySelector("[data-next-service-time]");
const nextServiceRowOneDay = document.querySelector("[data-next-service-row-one-day]");
const nextServiceRowOneTitle = document.querySelector("[data-next-service-row-one-title]");
const nextServiceRowTwoDay = document.querySelector("[data-next-service-row-two-day]");
const nextServiceRowTwoTitle = document.querySelector("[data-next-service-row-two-title]");
const helpShortcutButtons = document.querySelectorAll("[data-help-shortcut]");
const galleryTriggers = Array.from(document.querySelectorAll("[data-gallery-trigger]"));
const galleryLightbox = document.querySelector("[data-gallery-lightbox]");
const galleryImage = document.querySelector("[data-gallery-image]");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryClose = document.querySelector("[data-gallery-close]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const scrollTopButton = document.querySelector(".scroll-top");
const SUPABASE_URL = "https://yjhnqxubicaglqfroiqk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Ab-n3U4ens-djPBRbrIyhQ_geFdri1b";
const HELP_SUBMIT_COOLDOWN_MS = 60 * 1000;
const LAST_HELP_SUBMIT_KEY = "shekinah-last-help-submit";
const HELP_MESSAGE_MIN_LENGTH = 10;
const HELP_MESSAGE_MAX_LENGTH = 500;
const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
const supabaseClient =
  isSupabaseConfigured && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
let latestPublicHelpRequests = [];
let currentHelpStatus = null;
let currentGalleryIndex = 0;
let lastGalleryFocus = null;

function formatPhone(phone) {
  if (phone.length === 11 && phone.startsWith("503")) {
    return `+${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
  }

  return phone ? `+${phone}` : "";
}

function buildWhatsappUrl(message = "") {
  const baseUrl = `https://wa.me/${coordinatorPhone}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

function isOffline() {
  return typeof navigator !== "undefined" && "onLine" in navigator && !navigator.onLine;
}

phoneDisplayNodes.forEach((node) => {
  node.textContent = formatPhone(coordinatorPhone);
});

whatsappLinks.forEach((link) => {
  link.href = buildWhatsappUrl();
});

/* --- Selector de idioma (ES/EN) --- */

const translations = {
  es: {
    meta: {
      description:
        "Sitio web de Iglesia Bautista Shekinah: horarios, ubicación, ministerios, ayuda, donaciones y redes sociales.",
    },
    header: {
      brandAria: "Ir al inicio",
      navAria: "Navegación principal",
    },
    nav: {
      somos: "Somos",
      horarios: "Horarios",
      ubicacion: "Ubicación",
      ministerios: "Ministerios",
      ayuda: "Ayuda",
      redes: "Redes",
      eventos: "Eventos",
    },
    menu: {
      title: "Conéctate",
      connect: "Conéctate",
      discover: "Descubre",
      contact: "Contacto",
      openAria: "Abrir menú",
      closeAria: "Cerrar menú",
      scheduleDesc: "Encuentra el día y hora para congregarte.",
      eventsDesc: "Mira actividades y anuncios.",
      ministriesDesc: "Encuentra dónde servir.",
      helpDesc: "Pide oración o apoyo.",
      aboutDesc: "Conoce nuestra iglesia.",
      locationDesc: "Abre la ruta a la iglesia.",
      socialDesc: "Sigue nuestras redes.",
      messages: "Mensajes",
      messagesDesc: "Predicaciones y recursos por anunciar.",
      contactDesc: "Escríbenos para visitas o más información.",
      whatsappDesc: "Abre un chat directo con coordinación.",
    },
    theme: {
      toDark: "Oscuro",
      toLight: "Claro",
      ariaToDark: "Cambiar a modo oscuro",
      ariaToLight: "Cambiar a modo claro",
    },
    lang: {
      toEnglish: "EN",
      toSpanish: "ES",
      ariaToEnglish: "Cambiar a inglés",
      ariaToSpanish: "Cambiar a español",
    },
    quickStrip: {
      aria: "Accesos rápidos",
      visitTitle: "Visítanos",
      visitDesc: "Horarios de cultos",
      locationTitle: "Cómo llegar",
      locationDesc: "Ver en Waze",
      prayerTitle: "Pedir oración",
      prayerDesc: "Oración y apoyo",
      socialTitle: "Redes",
      socialDesc: "Instagram, Facebook y YouTube",
    },
    mobileCta: {
      aria: "Acciones principales",
      schedule: "Horarios",
      directions: "Llegar",
      whatsapp: "WhatsApp",
    },
    common: {
      sunday: "Domingo",
      tuesday: "Martes",
      thursday: "Jueves",
      saturday: "Sábado",
      sundayTimes: "8:30 a.m. y 10:00 a.m.",
      coordination: "Coordinación",
    },
    heroPanel: {
      aria: "Resumen de reuniones",
      welcome: "Bienvenido a casa",
    },
    hero: {
      eyebrow: "Biblia, adoración y servicio",
      description: "Conoce a Cristo, crece en fe y camina en familia.",
      ctaPrimary: "Ver horarios",
      ctaSecondary: "Cómo llegar",
      ctaWhatsapp: "Escribir por WhatsApp",
    },
    anniversary: {
      aria: "Aniversario de la iglesia",
      years: "años",
      text: "Llevamos 19 años sirviendo a Cristo en familia.",
    },
    schedule: {
      tuesdayActivity: "Estudio exegético",
      thursdayActivity: "Estudio bíblico",
      saturdayActivity: "Culto de jóvenes",
      sunday1Activity: "Primer culto devocional",
      sunday2Activity: "Segundo culto devocional",
    },
    somos: {
      eyebrow: "Somos Shekinah",
      title: "Una iglesia para conocer a Cristo",
      item1Title: "Palabra",
      item1Desc: "La Biblia nos guía.",
      item2Title: "Adoración",
      item2Desc: "Exaltamos a Dios.",
      item3Title: "Servicio",
      item3Desc: "Servimos con amor.",
    },
    scripture: {
      aria: "Versículo bíblico",
      verseRef: "Isaías 60:1",
      verseText:
        '"Levántate, resplandece; porque ha venido tu luz, y la gloria de Jehová ha nacido sobre ti."',
    },
    galeria: {
      eyebrow: "RECUERDOS DE LA IGLESIA",
      title: "Momentos que compartimos",
      description: "Cultos, servicio, familia y gratitud a Dios.",
      viewerAria: "Visor de fotos",
      closeAria: "Cerrar foto",
      closeBtn: "Cerrar",
      item1Tag: "Congregación",
      item1Title: "Nos reunimos como familia",
      item2Tag: "Niños",
      item2Title: "Formando nuevas generaciones",
      item3Tag: "Gratitud",
      item3Title: "Celebramos lo que Dios ha hecho",
      item4Tag: "Comunión",
      item4Title: "Sirviendo con unidad",
      item5Tag: "Palabra",
      item5Title: "La Biblia al centro",
      item6Tag: "Enseñanza",
      item6Title: "Aprendemos juntos la Palabra",
      item7Tag: "Familia, momentos",
      item7Title: "Recordando momentos de la iglesia",
    },
    reuniones: {
      eyebrow: "Reuniones",
      title: "Horarios de reunión",
      description: "Domingos y entre semana.",
    },
    ubicacion: {
      eyebrow: "Cómo llegar",
      title: "Encuéntranos en San Juan Opico",
      addressLabel: "Dirección",
      mapsBtn: "Google Maps",
      wazeBtn: "Waze",
      whatsappBtn: "WhatsApp",
      mapsHint: "Abrir ruta",
      wazeHint: "Navegar",
      whatsappHint: "Pedir referencia",
    },
    eventos: {
      eyebrow: "Eventos",
      title: "Próximas actividades",
      item1Tag: "Próximamente",
      item1Title: "Eventos por anunciar",
      item1Desc: "Vigilias, cultos especiales y actividades familiares.",
      item2Tag: "Acción social",
      item2Title: "Ayuda y donaciones",
      item2Desc: "Apoyo en oración, víveres y visitas.",
      item3Title: "Anuncios recientes",
      item3Desc: "Avisos, fotos y momentos en Facebook e Instagram.",
    },
    ministerios: {
      eyebrow: "Servicio",
      title: "Sirve con nosotros",
      item1Title: "Diaconado y oficiales",
      item1Desc: "Orden y apoyo espiritual en la iglesia.",
      item2Title: "Alabanza",
      item2Desc: "Música y sonido en cada culto.",
      item3Title: "Acomodación",
      item3Desc: "Recibimos y ubicamos a los visitantes.",
      item4Title: "Escuela bíblica",
      item4Desc: "Enseñanza para crecer en la Palabra.",
      item5Title: "Aseo",
      item5Desc: "Cuidado y limpieza de los espacios.",
      calloutText: "¿Quieres servir?",
      calloutBtn: "Escribir al encargado",
    },
    ayuda: {
      eyebrow: "Ayuda y donaciones",
      title: "Pide oración o apoyo",
      description: "Oración, visita, víveres o donación.",
      example1Title: "Ejemplo de solicitud",
      example1Desc: "Una familia pidió oración esta semana.",
      example2Title: "Ayuda alimentaria",
      example2Desc: "Coordinamos la entrega con el encargado.",
      formAria: "Formulario de ayuda",
      typeLabel: "Tipo de ayuda",
      typeDefault: "Seleccionar tipo (opcional)",
      phoneLabel: "Teléfono",
      phonePlaceholder: "Tu teléfono (opcional)",
      emailLabel: "Correo",
      emailPlaceholder: "Tu correo (opcional)",
      messagePlaceholder: "Escribe la necesidad o forma de ayudar",
      formNote: "Se guarda para revisión y se abre WhatsApp para coordinar.",
      privacyNote:
        "Tu información será usada únicamente para coordinar ayuda, oración o contacto pastoral. No publicamos tu teléfono ni correo sin autorización.",
      submitBtn: "Enviar solicitud por WhatsApp",
      saving: "Guardando solicitud...",
      submitted: "Se abrió WhatsApp para coordinar. Si se pudo guardar, quedará pendiente de revisión.",
      submittedWhatsappOnly: "Se abrió WhatsApp para coordinar tu solicitud.",
      saveError: "No se pudo guardar la solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
      offlineError: "Necesitas conexión a internet para enviar tu solicitud. Inténtalo de nuevo cuando tengas señal.",
      configError: "Falta configurar Supabase para guardar solicitudes.",
      rateLimit: "Espera un momento antes de enviar otra solicitud.",
      invalidEmail: "Revisa el correo electrónico o deja el campo vacío.",
      messageLengthError: "El mensaje debe tener entre 10 y 500 caracteres.",
      loadingRequests: "Cargando solicitudes aprobadas...",
      loadError: "No se pudieron cargar las solicitudes aprobadas.",
      coordinateBtn: "Coordinar ayuda",
      anonymousName: "Solicitud de ayuda",
      noContact: "Sin contacto adicional",
      quickSupport: "Pedir apoyo",
      quickDonate: "Quiero donar",
    },
    helpTypes: {
      oracion: "Oración",
      viveres: "Víveres",
      visita: "Visita a enfermo",
      otra: "Otra ayuda",
    },
    redes: {
      title: "Síguenos",
      description: "Fotos y anuncios de la iglesia.",
    },
    fab: {
      whatsappAria: "Escribir por WhatsApp",
      scrollTopAria: "Volver arriba",
    },
    contacto: {
      eyebrow: "Contacto",
      title: "Hablemos",
      detailsAria: "Datos de contacto",
      socialText: "Instagram, Facebook y YouTube como Shekinah Versalles",
      contactLabel: "Teléfono o correo",
      contactPlaceholder: "Cómo contactarte",
      messagePlaceholder: "¿Cómo podemos ayudarte?",
      formAria: "Formulario de contacto",
      submitBtn: "Enviar por WhatsApp",
    },
    form: {
      name: "Nombre",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
    },
    footer: {
      home: "Inicio",
    },
  },
  en: {
    meta: {
      description:
        "Website of Iglesia Bautista Shekinah: service times, location, ministries, help requests, donations and social media.",
    },
    header: {
      brandAria: "Go to homepage",
      navAria: "Main navigation",
    },
    nav: {
      somos: "About Us",
      horarios: "Schedule",
      ubicacion: "Location",
      ministerios: "Ministries",
      ayuda: "Help",
      redes: "Social",
      eventos: "Events",
    },
    menu: {
      title: "Connect",
      connect: "Connect",
      discover: "Discover",
      contact: "Contact",
      openAria: "Open menu",
      closeAria: "Close menu",
      scheduleDesc: "Find the day and time to gather.",
      eventsDesc: "See activities and announcements.",
      ministriesDesc: "Find where to serve.",
      helpDesc: "Request prayer or support.",
      aboutDesc: "Get to know our church.",
      locationDesc: "Open directions to church.",
      socialDesc: "Follow our social media.",
      messages: "Messages",
      messagesDesc: "Sermons and resources to be announced.",
      contactDesc: "Write to us for visits or more information.",
      whatsappDesc: "Open a direct chat with coordination.",
    },
    theme: {
      toDark: "Dark",
      toLight: "Light",
      ariaToDark: "Switch to dark mode",
      ariaToLight: "Switch to light mode",
    },
    lang: {
      toEnglish: "EN",
      toSpanish: "ES",
      ariaToEnglish: "Switch to English",
      ariaToSpanish: "Switch to Spanish",
    },
    quickStrip: {
      aria: "Quick links",
      visitTitle: "Visit Us",
      visitDesc: "Service times",
      locationTitle: "Get directions",
      locationDesc: "Open in Waze",
      prayerTitle: "Request prayer",
      prayerDesc: "Prayer and support",
      socialTitle: "Social",
      socialDesc: "Instagram, Facebook and YouTube",
    },
    mobileCta: {
      aria: "Main actions",
      schedule: "Schedule",
      directions: "Directions",
      whatsapp: "WhatsApp",
    },
    common: {
      sunday: "Sunday",
      tuesday: "Tuesday",
      thursday: "Thursday",
      saturday: "Saturday",
      sundayTimes: "8:30 a.m. and 10:00 a.m.",
      coordination: "Coordination",
    },
    heroPanel: {
      aria: "Meeting summary",
      welcome: "Welcome home",
    },
    hero: {
      eyebrow: "Bible, worship and service",
      description: "Know Christ, grow in faith and walk as family.",
      ctaPrimary: "See times",
      ctaSecondary: "Get directions",
      ctaWhatsapp: "Message on WhatsApp",
    },
    anniversary: {
      aria: "Church anniversary",
      years: "years",
      text: "19 years serving Christ together as family.",
    },
    schedule: {
      tuesdayActivity: "Exegetical study",
      thursdayActivity: "Bible study",
      saturdayActivity: "Youth service",
      sunday1Activity: "First devotional service",
      sunday2Activity: "Second devotional service",
    },
    somos: {
      eyebrow: "About Shekinah",
      title: "A church to know Christ",
      item1Title: "Word",
      item1Desc: "The Bible guides us.",
      item2Title: "Worship",
      item2Desc: "We exalt God.",
      item3Title: "Service",
      item3Desc: "We serve with love.",
    },
    scripture: {
      aria: "Bible verse",
      verseRef: "Isaiah 60:1",
      verseText:
        '"Arise, shine; for your light has come, and the glory of the Lord has risen upon you."',
    },
    galeria: {
      eyebrow: "Church life",
      title: "Moments we share",
      description: "Services, service, family and gratitude to God.",
      viewerAria: "Photo viewer",
      closeAria: "Close photo",
      closeBtn: "Close",
      item1Tag: "Congregation",
      item1Title: "We gather as family",
      item2Tag: "Children",
      item2Title: "Raising new generations",
      item3Tag: "Gratitude",
      item3Title: "Celebrating what God has done",
      item4Tag: "Fellowship",
      item4Title: "Serving in unity",
      item5Tag: "Word",
      item5Title: "The Bible at the center",
      item6Tag: "Teaching",
      item6Title: "We learn the Word together",
      item7Tag: "Family, moments",
      item7Title: "Remembering church moments",
    },
    reuniones: {
      eyebrow: "Services",
      title: "Service times",
      description: "Sundays and weekdays.",
    },
    ubicacion: {
      eyebrow: "How to get there",
      title: "Find us in San Juan Opico",
      addressLabel: "Address",
      mapsBtn: "Google Maps",
      wazeBtn: "Waze",
      whatsappBtn: "WhatsApp",
      mapsHint: "Open route",
      wazeHint: "Navigate",
      whatsappHint: "Ask for reference",
    },
    eventos: {
      eyebrow: "Events",
      title: "Upcoming activities",
      item1Tag: "Coming soon",
      item1Title: "Events to be announced",
      item1Desc: "Vigils, special services and family activities.",
      item2Tag: "Outreach",
      item2Title: "Help & donations",
      item2Desc: "Support for prayer, groceries and visits.",
      item3Title: "Recent announcements",
      item3Desc: "Updates, photos and moments on Facebook and Instagram.",
    },
    ministerios: {
      eyebrow: "Service",
      title: "Serve with us",
      item1Title: "Deacons and officers",
      item1Desc: "Order and spiritual support in the church.",
      item2Title: "Worship team",
      item2Desc: "Music and sound for every service.",
      item3Title: "Hospitality",
      item3Desc: "We welcome and guide our visitors.",
      item4Title: "Bible school",
      item4Desc: "Teaching to grow in the Word.",
      item5Title: "Facilities care",
      item5Desc: "Cleaning and caring for the space.",
      calloutText: "Want to serve?",
      calloutBtn: "Message the coordinator",
    },
    ayuda: {
      eyebrow: "Help & donations",
      title: "Request prayer or support",
      description: "Prayer, visit, groceries or donation.",
      example1Title: "Example request",
      example1Desc: "A family asked for prayer this week.",
      example2Title: "Food assistance",
      example2Desc: "Delivery is coordinated with our team.",
      formAria: "Help form",
      typeLabel: "Type of help",
      typeDefault: "Select a type (optional)",
      phoneLabel: "Phone",
      phonePlaceholder: "Your phone (optional)",
      emailLabel: "Email",
      emailPlaceholder: "Your email (optional)",
      messagePlaceholder: "Describe the need or how you can help",
      formNote: "It is saved for review and WhatsApp opens to coordinate.",
      privacyNote:
        "Your information will only be used to coordinate help, prayer, or pastoral contact. We do not publish your phone or email without authorization.",
      submitBtn: "Send request via WhatsApp",
      saving: "Saving request...",
      submitted: "WhatsApp opened to coordinate. If it was saved, it will stay pending review.",
      submittedWhatsappOnly: "WhatsApp opened to coordinate your request.",
      saveError: "The request could not be saved. Please try again or message us on WhatsApp.",
      offlineError: "You need an internet connection to send your request. Please try again once you are back online.",
      configError: "Supabase must be configured before requests can be saved.",
      rateLimit: "Please wait a moment before sending another request.",
      invalidEmail: "Please check the email address or leave the field empty.",
      messageLengthError: "The message must be between 10 and 500 characters.",
      loadingRequests: "Loading approved requests...",
      loadError: "Approved requests could not be loaded.",
      coordinateBtn: "Coordinate help",
      anonymousName: "Help request",
      noContact: "No additional contact",
      quickSupport: "Request support",
      quickDonate: "I want to donate",
    },
    helpTypes: {
      oracion: "Prayer",
      viveres: "Groceries",
      visita: "Visit to the sick",
      otra: "Other help",
    },
    redes: {
      title: "Follow us",
      description: "Photos and church updates.",
    },
    fab: {
      whatsappAria: "Message on WhatsApp",
      scrollTopAria: "Back to top",
    },
    contacto: {
      eyebrow: "Contact",
      title: "Let's talk",
      detailsAria: "Contact details",
      socialText: "Instagram and Facebook as Shekinah Versalles",
      contactLabel: "Phone or email",
      contactPlaceholder: "How to reach you",
      messagePlaceholder: "How can we help?",
      formAria: "Contact form",
      submitBtn: "Send via WhatsApp",
    },
    form: {
      name: "Name",
      message: "Message",
      namePlaceholder: "Your name",
    },
    footer: {
      home: "Home",
    },
  },
};

function getTranslation(key, lang) {
  return key.split(".").reduce((value, part) => (value ? value[part] : undefined), translations[lang]);
}

const meetingSchedule = [
  {
    day: 0,
    start: 8 * 60 + 30,
    end: 9 * 60 + 40,
    dayKey: "common.sunday",
    titleKey: "schedule.sunday1Activity",
    time: "8:30 a.m. - 9:40 a.m.",
  },
  {
    day: 0,
    start: 10 * 60,
    end: 11 * 60 + 30,
    dayKey: "common.sunday",
    titleKey: "schedule.sunday2Activity",
    time: "10:00 a.m. - 11:30 a.m.",
  },
  {
    day: 2,
    start: 19 * 60,
    end: 20 * 60 + 30,
    dayKey: "common.tuesday",
    titleKey: "schedule.tuesdayActivity",
    time: "7:00 p.m. - 8:30 p.m.",
  },
  {
    day: 4,
    start: 19 * 60,
    end: 20 * 60 + 30,
    dayKey: "common.thursday",
    titleKey: "schedule.thursdayActivity",
    time: "7:00 p.m. - 8:30 p.m.",
  },
  {
    day: 6,
    start: 16 * 60 + 30,
    end: 18 * 60,
    dayKey: "common.saturday",
    titleKey: "schedule.saturdayActivity",
    time: "4:30 p.m. - 6:00 p.m.",
  },
];

function getElSalvadorTimeParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/El_Salvador",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value || "Sun";
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    day: dayMap[weekday] ?? 0,
    minutes: hour * 60 + minute,
  };
}

function getUpcomingMeetings(limit = 3) {
  const now = getElSalvadorTimeParts();

  return meetingSchedule
    .map((meeting) => {
      const dayDistance = (meeting.day - now.day + 7) % 7;
      const isToday = dayDistance === 0;
      const hasNotEndedToday = isToday && meeting.end > now.minutes;
      const daysUntil = isToday && !hasNotEndedToday ? 7 : dayDistance;
      const isHappeningNow = isToday && now.minutes >= meeting.start && now.minutes < meeting.end;

      return {
        ...meeting,
        daysUntil,
        isToday,
        isHappeningNow,
        sortValue: daysUntil * 24 * 60 + meeting.start,
      };
    })
    .sort((a, b) => a.sortValue - b.sortValue)
    .slice(0, limit);
}

function getNextServiceLabel(meeting) {
  if (meeting.isHappeningNow) {
    return currentLang === "en" ? "Happening now" : "En este momento";
  }

  if (meeting.isToday) {
    return currentLang === "en" ? "Today we gather" : "Hoy nos reunimos";
  }

  return currentLang === "en" ? "Next gathering" : "Próxima reunión";
}

function updateNextServicePanel() {
  if (!nextServiceLabel || !nextServiceDay || !nextServiceTime) {
    return;
  }

  const [nextMeeting, secondMeeting, thirdMeeting] = getUpcomingMeetings(3);

  if (!nextMeeting) {
    return;
  }

  nextServiceLabel.textContent = getNextServiceLabel(nextMeeting);
  nextServiceDay.textContent = getTranslation(nextMeeting.dayKey, currentLang);
  nextServiceTime.textContent = `${nextMeeting.time} | ${getTranslation(nextMeeting.titleKey, currentLang)}`;

  if (secondMeeting && nextServiceRowOneDay && nextServiceRowOneTitle) {
    nextServiceRowOneDay.textContent = getTranslation(secondMeeting.dayKey, currentLang);
    nextServiceRowOneTitle.textContent = getTranslation(secondMeeting.titleKey, currentLang);
  }

  if (thirdMeeting && nextServiceRowTwoDay && nextServiceRowTwoTitle) {
    nextServiceRowTwoDay.textContent = getTranslation(thirdMeeting.dayKey, currentLang);
    nextServiceRowTwoTitle.textContent = getTranslation(thirdMeeting.titleKey, currentLang);
  }
}

function getHelpTypeLabel(type) {
  const typeMap = {
    Oracion: "helpTypes.oracion",
    Viveres: "helpTypes.viveres",
    Visita: "helpTypes.visita",
    "Otra ayuda": "helpTypes.otra",
  };

  return getTranslation(typeMap[type], currentLang) || type || getTranslation("ayuda.typeDefault", currentLang);
}

function setHelpStatus(key, type = "info") {
  if (!helpStatus) {
    return;
  }

  currentHelpStatus = key ? { key, type } : null;
  helpStatus.textContent = key ? getTranslation(key, currentLang) : "";
  helpStatus.dataset.status = type;
}

function refreshHelpStatusTranslation() {
  if (currentHelpStatus) {
    setHelpStatus(currentHelpStatus.key, currentHelpStatus.type);
  }
}

function createHelpBoardMessage(key) {
  const card = document.createElement("article");
  card.className = "help-card";

  const tag = document.createElement("span");
  tag.textContent = getTranslation("ayuda.eyebrow", currentLang);

  const title = document.createElement("h3");
  title.textContent = getTranslation(key, currentLang);

  card.append(tag, title);
  return card;
}

function restoreDefaultHelpCards() {
  helpBoard.replaceChildren(...defaultHelpCards.map((card) => card.cloneNode(true)));
  applyTranslations(currentLang);
}

function createPublicHelpCard(request) {
  const card = document.createElement("article");
  card.className = "help-card";

  const tag = document.createElement("span");
  tag.textContent = getHelpTypeLabel(request.help_type);

  const title = document.createElement("h3");
  title.textContent = request.display_name || getTranslation("ayuda.anonymousName", currentLang);

  const text = document.createElement("p");
  text.textContent = request.public_message || "";

  const link = document.createElement("a");
  link.className = "button dark";
  link.href = buildWhatsappUrl(
    `Hola, quiero ayudar o consultar sobre esta solicitud: ${request.help_type} - ${request.public_message}`
  );
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = getTranslation("ayuda.coordinateBtn", currentLang);

  card.append(tag, title, text, link);
  return card;
}

function renderPublicHelpRequests(requests) {
  latestPublicHelpRequests = requests;

  if (!requests.length) {
    restoreDefaultHelpCards();
    return;
  }

  helpBoard.replaceChildren(...requests.map(createPublicHelpCard));
}

async function loadPublicHelpRequests() {
  if (!supabaseClient || isOffline()) {
    restoreDefaultHelpCards();
    return;
  }

  helpBoard.replaceChildren(createHelpBoardMessage("ayuda.loadingRequests"));

  const { data, error } = await supabaseClient
    .from("public_help_requests")
    .select("id, display_name, help_type, public_message, status, published_at")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("No se pudieron cargar las solicitudes de ayuda:", error);
    helpBoard.replaceChildren(createHelpBoardMessage("ayuda.loadError"));
    return;
  }

  renderPublicHelpRequests(data || []);
}

function syncThemeButton(lang) {
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.textContent = getTranslation(isDark ? "theme.toLight" : "theme.toDark", lang);
  themeToggle.setAttribute("aria-label", getTranslation(isDark ? "theme.ariaToLight" : "theme.ariaToDark", lang));
}

function syncLangButton(lang) {
  const isSpanish = lang === "es";
  langToggle.textContent = getTranslation(isSpanish ? "lang.toEnglish" : "lang.toSpanish", lang);
  langToggle.setAttribute("aria-label", getTranslation(isSpanish ? "lang.ariaToEnglish" : "lang.ariaToSpanish", lang));
}

function syncMenuButton(lang) {
  const isOpen = mainMenu.classList.contains("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", getTranslation(isOpen ? "menu.closeAria" : "menu.openAria", lang));
}

function applyTranslations(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = getTranslation(el.getAttribute("data-i18n"), lang);
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const value = getTranslation(el.getAttribute("data-i18n-html"), lang);
    if (value !== undefined) {
      el.innerHTML = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const value = getTranslation(el.getAttribute("data-i18n-placeholder"), lang);
    if (value !== undefined) {
      el.setAttribute("placeholder", value);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const value = getTranslation(el.getAttribute("data-i18n-aria-label"), lang);
    if (value !== undefined) {
      el.setAttribute("aria-label", value);
    }
  });

  const metaDescription = document.querySelector('meta[name="description"]');
  const description = getTranslation("meta.description", lang);
  if (metaDescription && description) {
    metaDescription.setAttribute("content", description);
  }

  syncThemeButton(lang);
  syncLangButton(lang);
  syncMenuButton(lang);
  updateNextServicePanel();
}

let currentLang = localStorage.getItem("shekinah-lang") === "en" ? "en" : "es";
applyTranslations(currentLang);
setInterval(updateNextServicePanel, 60 * 1000);

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "es" ? "en" : "es";
  localStorage.setItem("shekinah-lang", currentLang);
  applyTranslations(currentLang);
  refreshHelpStatusTranslation();
  if (latestPublicHelpRequests.length) {
    renderPublicHelpRequests(latestPublicHelpRequests);
  }
});

/* --- Modo oscuro / claro --- */

const savedTheme = localStorage.getItem("shekinah-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

syncThemeButton(currentLang);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("shekinah-theme", isDark ? "dark" : "light");
  syncThemeButton(currentLang);
});

function setMenuOpen(isOpen, returnFocus = false) {
  mainMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  syncMenuButton(currentLang);

  if (isOpen) {
    (menuClose || mainMenu.querySelector("summary, a, button"))?.focus();
    return;
  }

  if (returnFocus) {
    menuButton.focus();
  }
}

function showProgressiveSection(hash) {
  const target = document.querySelector(hash);

  if (!target) {
    return document.querySelector("#inicio");
  }

  if (!target.matches("main > section, .quick-strip")) {
    return null;
  }

  return target;
}

function navigateToProgressiveSection(hash) {
  const target = showProgressiveSection(hash);

  if (!target) {
    return;
  }

  if (history.pushState) {
    history.pushState(null, "", hash);
  }

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function getMenuFocusableElements() {
  return Array.from(
    mainMenu.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')
  ).filter((element) => element.offsetParent !== null);
}

menuButton.addEventListener("click", () => {
  setMenuOpen(!mainMenu.classList.contains("is-open"));
});

menuClose.addEventListener("click", () => {
  setMenuOpen(false, true);
});

mainMenu.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (!link) {
    return;
  }

  const hash = link.getAttribute("href");

  if (hash && hash.startsWith("#") && hash.length > 1) {
    event.preventDefault();
    setMenuOpen(false);
    navigateToProgressiveSection(hash);
    return;
  }

  setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (galleryLightbox?.classList.contains("is-open")) {
    if (event.key === "Escape") {
      closeGallery();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showGalleryImage(currentGalleryIndex - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showGalleryImage(currentGalleryIndex + 1);
      return;
    }
  }

  if (!mainMenu.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    setMenuOpen(false, true);
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = getMenuFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");

    if (!hash || hash === "#" || link.closest("#main-menu")) {
      return;
    }

    event.preventDefault();
    navigateToProgressiveSection(hash);
  });
});

if (window.location.hash) {
  showProgressiveSection(window.location.hash);
}

function getGalleryItems() {
  return galleryTriggers
    .map((trigger) => {
      const image = trigger.querySelector("img");
      const title = trigger.querySelector(".photo-card-caption strong")?.textContent?.trim();

      if (!image) {
        return null;
      }

      return {
        src: image.currentSrc || image.getAttribute("src"),
        alt: image.getAttribute("alt") || title || "Foto de Iglesia Bautista Shekinah",
        caption: title || image.getAttribute("alt") || "",
      };
    })
    .filter(Boolean);
}

function showGalleryImage(index) {
  const items = getGalleryItems();

  if (!items.length || !galleryImage || !galleryCaption) {
    return;
  }

  currentGalleryIndex = (index + items.length) % items.length;
  const item = items[currentGalleryIndex];

  galleryImage.src = item.src;
  galleryImage.alt = item.alt;
  galleryCaption.textContent = item.caption;
}

function openGallery(index) {
  if (!galleryLightbox) {
    return;
  }

  lastGalleryFocus = document.activeElement;
  showGalleryImage(index);
  galleryLightbox.classList.add("is-open");
  galleryLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  galleryClose?.focus();
}

function closeGallery() {
  if (!galleryLightbox) {
    return;
  }

  galleryLightbox.classList.remove("is-open");
  galleryLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");

  if (galleryImage) {
    galleryImage.src = "";
  }

  if (lastGalleryFocus && typeof lastGalleryFocus.focus === "function") {
    lastGalleryFocus.focus();
  }
}

galleryTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => openGallery(index));
});

galleryClose?.addEventListener("click", closeGallery);
galleryPrev?.addEventListener("click", () => showGalleryImage(currentGalleryIndex - 1));
galleryNext?.addEventListener("click", () => showGalleryImage(currentGalleryIndex + 1));

galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) {
    closeGallery();
  }
});

function updateScrollTopButton() {
  if (!scrollTopButton) {
    return;
  }

  const shouldShow = window.scrollY > 420;
  scrollTopButton.hidden = !shouldShow;
  scrollTopButton.classList.toggle("is-visible", shouldShow);
}

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateScrollTopButton, { passive: true });
updateScrollTopButton();

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("nombre") || "Visitante";
  const contact = formData.get("contacto") || "Sin contacto";
  const message = formData.get("mensaje") || "Quiero mas informacion.";
  const whatsappMessage = `Hola, soy ${name}. Mi contacto es ${contact}. ${message}`;

  window.open(
    `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(whatsappMessage)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

helpShortcutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.helpType || "General";
    const message = button.dataset.helpMessage || "";
    const typeField = helpForm.querySelector('[name="tipo-ayuda"]');
    const messageField = helpForm.querySelector('[name="mensaje-ayuda"]');

    if (typeField) {
      typeField.value = type;
    }

    if (messageField && !messageField.value.trim()) {
      messageField.value = message;
    }

    helpShortcutButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    helpForm.scrollIntoView({ behavior: "smooth", block: "center" });
    messageField?.focus({ preventScroll: true });
  });
});

function openWhatsappMessage(message) {
  const url = buildWhatsappUrl(message);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

helpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(helpForm);
  const name = String(formData.get("nombre-ayuda") || "").trim();
  const phone = String(formData.get("telefono-ayuda") || "").trim();
  const type = String(formData.get("tipo-ayuda") || "General").trim();
  const message = String(formData.get("mensaje-ayuda") || "").trim();
  const contact = phone || getTranslation("ayuda.noContact", currentLang);
  const whatsappMessage = `Hola, soy ${name}. Mi contacto es ${contact}. Solicito ayuda de tipo ${type}: ${message}`;
  const submitButton = helpForm.querySelector('button[type="submit"]');

  if (!name) {
    setHelpStatus("ayuda.messageLengthError", "error");
    return;
  }

  if (message.length < HELP_MESSAGE_MIN_LENGTH || message.length > HELP_MESSAGE_MAX_LENGTH) {
    setHelpStatus("ayuda.messageLengthError", "error");
    return;
  }

  const lastSubmit = Number(localStorage.getItem(LAST_HELP_SUBMIT_KEY) || 0);
  if (Date.now() - lastSubmit < HELP_SUBMIT_COOLDOWN_MS) {
    setHelpStatus("ayuda.rateLimit", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = getTranslation("ayuda.saving", currentLang);
  setHelpStatus(null);

  // Abrir WhatsApp en el mismo gesto del usuario para evitar bloqueo de popups.
  openWhatsappMessage(whatsappMessage);

  let saved = false;

  if (supabaseClient && !isOffline()) {
    try {
      const { error } = await supabaseClient.from("help_requests").insert([
        {
          name,
          phone: phone || null,
          email: null,
          help_type: type || "General",
          message_private: message,
        },
      ]);

      if (error) {
        throw error;
      }

      saved = true;
    } catch (error) {
      console.error("No se pudo guardar la solicitud de ayuda:", error);
    }
  }

  localStorage.setItem(LAST_HELP_SUBMIT_KEY, String(Date.now()));
  setHelpStatus(saved ? "ayuda.submitted" : "ayuda.submittedWhatsappOnly", saved ? "success" : "info");
  helpForm.reset();
  submitButton.disabled = false;
  submitButton.textContent = getTranslation("ayuda.submitBtn", currentLang);
});

loadPublicHelpRequests();

/* --- PWA: registro del service worker --- */

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.error("No se pudo registrar el service worker:", error);
    });
  });
}
