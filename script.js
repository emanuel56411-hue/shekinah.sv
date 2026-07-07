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
const SUPABASE_URL = "https://yjhnqxubicaglqfroiqk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Ab-n3U4ens-djPBRbrIyhQ_geFdri1b";
const HELP_SUBMIT_COOLDOWN_MS = 60 * 1000;
const LAST_HELP_SUBMIT_KEY = "shekinah-last-help-submit";
const HELP_MESSAGE_MIN_LENGTH = 10;
const HELP_MESSAGE_MAX_LENGTH = 500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
const supabaseClient =
  isSupabaseConfigured && window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
let latestPublicHelpRequests = [];
let currentHelpStatus = null;

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
        "Sitio web de Iglesia Bautista Shekinah: horarios, ubicacion, ministerios, ayuda, donaciones y redes sociales.",
    },
    header: {
      brandAria: "Ir al inicio",
      navAria: "Navegacion principal",
    },
    nav: {
      somos: "Somos",
      horarios: "Horarios",
      ubicacion: "Ubicacion",
      ministerios: "Ministerios",
      ayuda: "Ayuda",
      redes: "Redes",
      eventos: "Eventos",
    },
    menu: {
      title: "Conectate",
      connect: "Conectate",
      discover: "Descubre",
      contact: "Contacto",
      openAria: "Abrir menu",
      closeAria: "Cerrar menu",
      scheduleDesc: "Encuentra el dia y hora para congregarte.",
      eventsDesc: "Conoce proximas actividades y anuncios.",
      ministriesDesc: "Descubre areas donde puedes servir.",
      helpDesc: "Pide oracion, apoyo o coordina donaciones.",
      aboutDesc: "Conoce quienes somos y como vivimos la fe.",
      locationDesc: "Abre la ruta para llegar a San Juan Opico.",
      socialDesc: "Sigue anuncios, fotos y momentos de la iglesia.",
      messages: "Mensajes",
      messagesDesc: "Predicaciones y recursos por anunciar.",
      contactDesc: "Escribenos para visitas o mas informacion.",
      whatsappDesc: "Abre un chat directo con coordinacion.",
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
      ariaToEnglish: "Cambiar a ingles",
      ariaToSpanish: "Cambiar a espanol",
    },
    quickStrip: {
      aria: "Accesos rapidos",
      visitTitle: "Visitanos",
      visitDesc: "Domingo 8:30 a.m. y 10:00 a.m.",
      locationTitle: "Como llegar",
      prayerTitle: "Pedir oracion",
      prayerDesc: "Comparte tu necesidad con respeto.",
      serveTitle: "Quiero servir",
      serveDesc: "Conoce las areas de servicio.",
    },
    common: {
      sunday: "Domingo",
      tuesday: "Martes",
      thursday: "Jueves",
      saturday: "Sabado",
      sundayTimes: "8:30 a.m. y 10:00 a.m.",
      coordination: "Coordinacion",
    },
    heroPanel: {
      aria: "Resumen de reuniones",
      welcome: "Bienvenido a casa",
    },
    hero: {
      eyebrow: "Biblia, adoracion y servicio",
      description:
        "Una comunidad cristiana en San Juan Opico donde puedes acercarte a Dios, aprender su Palabra y caminar acompanado por una familia de fe.",
      ctaPrimary: "Visitanos este domingo",
      ctaSecondary: "Como llegar",
      ctaPrayer: "Pedir oracion",
    },
    schedule: {
      tuesdayActivity: "Estudio exegetico",
      thursdayActivity: "Estudio biblico",
      saturdayActivity: "Culto de jovenes",
      sunday1Activity: "Primer culto devocional",
      sunday2Activity: "Segundo culto devocional",
    },
    somos: {
      eyebrow: "Somos Shekinah",
      title: "Una iglesia para conocer a Cristo, crecer y servir",
      description:
        "Creemos que la iglesia debe ser un lugar cercano, claro y lleno de esperanza: una familia que abre la Biblia, adora a Dios y acompana a las personas en cada etapa de la vida.",
      item1Title: "Palabra",
      item1Desc: "Estudiamos la Biblia para vivir con direccion y verdad.",
      item2Title: "Adoracion",
      item2Desc: "Nos reunimos para exaltar a Dios con gratitud y reverencia.",
      item3Title: "Comunidad",
      item3Desc: "Nadie tiene que caminar solo; aqui buscamos acompanarnos.",
      item4Title: "Servicio",
      item4Desc: "Servimos con orden, amor y responsabilidad en cada ministerio.",
    },
    scripture: {
      eyebrow: "Palabra para tu vida",
      title: "Aqui tambien hay un lugar para ti",
      description:
        "Si vienes cansado, con preguntas o buscando empezar de nuevo, no tienes que acercarte perfecto. Puedes venir como estas, escuchar la Palabra y caminar acompanado por una familia de fe.",
      cta: "Quiero congregarme",
      verse1Ref: "Mateo 18:20",
      verse1Text: "Cuando nos reunimos en el nombre de Cristo, recordamos que El esta presente entre su pueblo.",
      verse2Ref: "2 Timoteo 3:16-17",
      verse2Text: "La Escritura nos ensena, corrige y prepara para vivir una fe firme y util para servir.",
      verse3Ref: "Salmos 150:6",
      verse3Text: "Todo lo que respira puede alabar al Senor; tu voz tambien tiene lugar delante de Dios.",
    },
    reuniones: {
      eyebrow: "Reuniones",
      title: "Horarios claros para acompanarnos",
      description: "Cada reunion esta organizada para que cualquier persona sepa cuando llegar y que actividad encontrara.",
    },
    ubicacion: {
      eyebrow: "Como llegar",
      title: "Estamos en San Juan Opico",
      description:
        'Usa <strong>QJRR+HH2, San Juan Opico</strong> para abrir la ruta en tu telefono. Puedes elegir Google Maps, Waze o escribirnos por WhatsApp.',
      mapsBtn: "Abrir Google Maps",
      wazeBtn: "Como llegar en Waze",
      whatsappBtn: "Preguntar por WhatsApp",
      mapsHint: "Ver ruta y referencia",
      wazeHint: "Iniciar navegacion",
      whatsappHint: "Pedir referencia",
    },
    eventos: {
      eyebrow: "Eventos",
      title: "Vida de iglesia y proximos anuncios",
      item1Tag: "Proximamente",
      item1Title: "Eventos por anunciar",
      item1Desc: "En este espacio se publicaran vigilias, cultos especiales y actividades familiares.",
      item2Tag: "Accion social",
      item2Title: "Ayuda y donaciones",
      item2Desc: "Coordinamos apoyo para oracion, viveres, visitas y necesidades especiales.",
      item3Title: "Anuncios recientes",
      item3Desc: "Sigue Facebook e Instagram para ver avisos, fotos y momentos de la congregacion.",
    },
    ministerios: {
      eyebrow: "Servicio",
      title: "Ministerios donde puedes ser parte",
      item1Title: "Diaconado y oficiales",
      item1Desc: "Apoyo espiritual, orden y servicio dentro de la iglesia.",
      item2Title: "Alabanza",
      item2Desc: "Servicio musical y tecnico para acompanar cada culto.",
      item3Title: "Acomodacion",
      item3Desc: "Recibir, orientar y ubicar a quienes nos visitan.",
      item4Title: "Escuela biblica",
      item4Desc: "Ensenanza organizada para crecer en la Palabra de Dios.",
      item5Title: "Aseo",
      item5Desc: "Cuidado, limpieza y preparacion de los espacios de la iglesia.",
      calloutText: "Quieres servir en un ministerio?",
      calloutBtn: "Escribir al encargado",
    },
    ayuda: {
      eyebrow: "Ayuda y donaciones",
      title: "Un espacio para pedir apoyo y coordinar ayuda",
      description:
        "Si necesitas oracion, viveres, una visita o acompanamiento, puedes escribirnos. Al enviar el formulario se abrira WhatsApp para coordinar la ayuda con respeto y orden.",
      example1Title: "Ejemplo de solicitud",
      example1Desc: "Una familia solicita oracion y acompanamiento durante la semana.",
      example2Title: "Ayuda alimentaria",
      example2Desc: "Se puede coordinar entrega con el encargado de donaciones.",
      formAria: "Formulario de ayuda",
      typeLabel: "Tipo de ayuda",
      typeDefault: "Seleccionar tipo (opcional)",
      phoneLabel: "Telefono",
      phonePlaceholder: "Tu telefono (opcional)",
      emailLabel: "Correo",
      emailPlaceholder: "Tu correo (opcional)",
      messagePlaceholder: "Escribe la necesidad o forma de ayudar",
      formNote: "La solicitud se guarda para revision y tambien se abre WhatsApp para coordinar con respeto y orden.",
      privacyNote:
        "Tu información será usada únicamente para coordinar ayuda, oración o contacto pastoral. No publicamos tu teléfono ni correo sin autorización.",
      submitBtn: "Enviar solicitud por WhatsApp",
      saving: "Guardando solicitud...",
      submitted: "Solicitud guardada. Quedara pendiente de revision antes de publicarse.",
      saveError: "No se pudo guardar la solicitud. Intentalo de nuevo o escribenos por WhatsApp.",
      offlineError: "Necesitas conexion a internet para enviar tu solicitud. Intentalo de nuevo cuando tengas senal.",
      configError: "Falta configurar Supabase para guardar solicitudes.",
      rateLimit: "Espera un momento antes de enviar otra solicitud.",
      invalidEmail: "Revisa el correo electronico o deja el campo vacio.",
      messageLengthError: "El mensaje debe tener entre 10 y 500 caracteres.",
      loadingRequests: "Cargando solicitudes aprobadas...",
      loadError: "No se pudieron cargar las solicitudes aprobadas.",
      coordinateBtn: "Coordinar ayuda",
      anonymousName: "Solicitud de ayuda",
      noContact: "Sin contacto adicional",
      quickPrayer: "Pedir oracion",
      quickFood: "Solicitar viveres",
      quickVisit: "Pedir visita",
      quickDonate: "Quiero donar",
    },
    helpTypes: {
      oracion: "Oracion",
      viveres: "Viveres",
      visita: "Visita a enfermo",
      otra: "Otra ayuda",
    },
    redes: {
      title: "Conectate con Shekinah",
      description: "Siguenos para ver anuncios, fotos de actividades y mensajes para compartir.",
    },
    contacto: {
      eyebrow: "Contacto",
      title: "Queremos conocerte",
      detailsAria: "Datos de contacto",
      socialText: "Instagram y Facebook como Shekinah Versalles",
      contactLabel: "Telefono o correo",
      contactPlaceholder: "Como contactarte",
      messagePlaceholder: "Cuentanos como podemos ayudarte",
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
      eventsDesc: "See upcoming activities and announcements.",
      ministriesDesc: "Discover areas where you can serve.",
      helpDesc: "Ask for prayer, support, or coordinate donations.",
      aboutDesc: "Learn who we are and how we live our faith.",
      locationDesc: "Open directions to San Juan Opico.",
      socialDesc: "Follow announcements, photos, and church moments.",
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
      visitDesc: "Sunday 8:30 a.m. and 10:00 a.m.",
      locationTitle: "Get directions",
      prayerTitle: "Request prayer",
      prayerDesc: "Share your need respectfully.",
      serveTitle: "I want to serve",
      serveDesc: "See the areas of service.",
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
      description:
        "A Christian community in San Juan Opico where you can draw near to God, learn His Word and walk alongside a family of faith.",
      ctaPrimary: "Visit us this Sunday",
      ctaSecondary: "Get directions",
      ctaPrayer: "Request prayer",
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
      title: "A church to know Christ, grow and serve",
      description:
        "We believe the church should be a warm, clear and hope-filled place: a family that opens the Bible, worships God and walks with people through every stage of life.",
      item1Title: "Word",
      item1Desc: "We study the Bible to live with direction and truth.",
      item2Title: "Worship",
      item2Desc: "We gather to exalt God with gratitude and reverence.",
      item3Title: "Community",
      item3Desc: "No one has to walk alone; here we walk together.",
      item4Title: "Service",
      item4Desc: "We serve with order, love and responsibility in every ministry.",
    },
    scripture: {
      eyebrow: "A word for your life",
      title: "There's a place for you here too",
      description:
        "If you come tired, with questions, or looking for a fresh start, you don't have to arrive perfect. Come as you are, listen to the Word, and walk alongside a family of faith.",
      cta: "I want to join",
      verse1Ref: "Matthew 18:20",
      verse1Text: "When we gather in the name of Christ, we remember He is present among His people.",
      verse2Ref: "2 Timothy 3:16-17",
      verse2Text: "Scripture teaches, corrects and equips us to live a firm faith that is useful for service.",
      verse3Ref: "Psalm 150:6",
      verse3Text: "Everything that has breath can praise the Lord; your voice also has a place before God.",
    },
    reuniones: {
      eyebrow: "Services",
      title: "Clear schedules to walk alongside you",
      description: "Every service is organized so anyone knows when to arrive and what activity to expect.",
    },
    ubicacion: {
      eyebrow: "How to get there",
      title: "We are in San Juan Opico",
      description:
        'Use <strong>QJRR+HH2, San Juan Opico</strong> to open directions on your phone. You can choose Google Maps, Waze or message us on WhatsApp.',
      mapsBtn: "Open Google Maps",
      wazeBtn: "Get directions in Waze",
      whatsappBtn: "Ask via WhatsApp",
      mapsHint: "View route and reference",
      wazeHint: "Start navigation",
      whatsappHint: "Ask for a reference",
    },
    eventos: {
      eyebrow: "Events",
      title: "Church life and upcoming announcements",
      item1Tag: "Coming soon",
      item1Title: "Events to be announced",
      item1Desc: "Vigils, special services and family activities will be posted in this space.",
      item2Tag: "Outreach",
      item2Title: "Help & donations",
      item2Desc: "We coordinate support for prayer, groceries, visits and special needs.",
      item3Title: "Recent announcements",
      item3Desc: "Follow Facebook and Instagram to see updates, photos and moments from the congregation.",
    },
    ministerios: {
      eyebrow: "Service",
      title: "Ministries where you can get involved",
      item1Title: "Deacons and officers",
      item1Desc: "Spiritual support, order and service within the church.",
      item2Title: "Worship team",
      item2Desc: "Musical and technical service to accompany every service.",
      item3Title: "Hospitality",
      item3Desc: "Welcoming, guiding and seating those who visit us.",
      item4Title: "Bible school",
      item4Desc: "Organized teaching to grow in the Word of God.",
      item5Title: "Facilities care",
      item5Desc: "Cleaning and preparing the church spaces.",
      calloutText: "Want to serve in a ministry?",
      calloutBtn: "Message the coordinator",
    },
    ayuda: {
      eyebrow: "Help & donations",
      title: "A space to ask for support and coordinate help",
      description:
        "If you need prayer, groceries, a visit or companionship, you can write to us. Submitting the form will open WhatsApp to coordinate the help with respect and order.",
      example1Title: "Example request",
      example1Desc: "A family is requesting prayer and support during the week.",
      example2Title: "Food assistance",
      example2Desc: "Delivery can be coordinated with the donations coordinator.",
      formAria: "Help form",
      typeLabel: "Type of help",
      typeDefault: "Select a type (optional)",
      phoneLabel: "Phone",
      phonePlaceholder: "Your phone (optional)",
      emailLabel: "Email",
      emailPlaceholder: "Your email (optional)",
      messagePlaceholder: "Describe the need or how you can help",
      formNote: "The request is saved for review and WhatsApp also opens so help can be coordinated respectfully.",
      privacyNote:
        "Your information will only be used to coordinate help, prayer, or pastoral contact. We do not publish your phone or email without authorization.",
      submitBtn: "Send request via WhatsApp",
      saving: "Saving request...",
      submitted: "Request saved. It will stay pending review before being published.",
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
      quickPrayer: "Ask for prayer",
      quickFood: "Request groceries",
      quickVisit: "Request a visit",
      quickDonate: "I want to donate",
    },
    helpTypes: {
      oracion: "Prayer",
      viveres: "Groceries",
      visita: "Visit to the sick",
      otra: "Other help",
    },
    redes: {
      title: "Connect with Shekinah",
      description: "Follow us to see announcements, photos of activities and messages to share.",
    },
    contacto: {
      eyebrow: "Contact",
      title: "We want to meet you",
      detailsAria: "Contact details",
      socialText: "Instagram and Facebook as Shekinah Versalles",
      contactLabel: "Phone or email",
      contactPlaceholder: "How to reach you",
      messagePlaceholder: "Tell us how we can help",
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

  return currentLang === "en" ? "Next gathering" : "Proxima reunion";
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

contactForm.addEventListener("submit", (event) => {
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

helpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isOffline()) {
    setHelpStatus("ayuda.offlineError", "error");
    return;
  }

  if (!supabaseClient) {
    setHelpStatus("ayuda.configError", "error");
    return;
  }

  const lastSubmit = Number(localStorage.getItem(LAST_HELP_SUBMIT_KEY) || 0);
  if (Date.now() - lastSubmit < HELP_SUBMIT_COOLDOWN_MS) {
    setHelpStatus("ayuda.rateLimit", "error");
    return;
  }

  const formData = new FormData(helpForm);
  const name = String(formData.get("nombre-ayuda") || "").trim();
  const phone = String(formData.get("telefono-ayuda") || "").trim();
  const email = String(formData.get("correo-ayuda") || "").trim();
  const type = String(formData.get("tipo-ayuda") || "General").trim();
  const message = String(formData.get("mensaje-ayuda") || "").trim();
  const contact = [phone, email].filter(Boolean).join(" / ") || getTranslation("ayuda.noContact", currentLang);
  const whatsappMessage = `Hola, soy ${name}. Mi contacto es ${contact}. Solicito ayuda de tipo ${type}: ${message}`;
  const submitButton = helpForm.querySelector('button[type="submit"]');

  if (email && !EMAIL_PATTERN.test(email)) {
    setHelpStatus("ayuda.invalidEmail", "error");
    return;
  }

  if (message.length < HELP_MESSAGE_MIN_LENGTH || message.length > HELP_MESSAGE_MAX_LENGTH) {
    setHelpStatus("ayuda.messageLengthError", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = getTranslation("ayuda.saving", currentLang);
  setHelpStatus(null);

  try {
    const { error } = await supabaseClient.from("help_requests").insert([
      {
        name,
        phone: phone || null,
        email: email || null,
        help_type: type || "General",
        message_private: message,
      },
    ]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("No se pudo guardar la solicitud de ayuda:", error);
    setHelpStatus(isOffline() ? "ayuda.offlineError" : "ayuda.saveError", "error");
    return;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = getTranslation("ayuda.submitBtn", currentLang);
  }

  localStorage.setItem(LAST_HELP_SUBMIT_KEY, String(Date.now()));
  setHelpStatus("ayuda.submitted", "success");
  window.open(buildWhatsappUrl(whatsappMessage), "_blank", "noopener,noreferrer");
  helpForm.reset();
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
