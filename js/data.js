/* =========================================================================
   OPPORTUNITIES — data layer
   -------------------------------------------------------------------------
   • SITE: contact + social settings. Fill these in before going live.
   • DISTRICTS: every district / municipality of Moldova, grouped by zone,
     with an approximate centre point (lat, lon) used for distance filtering.
   • OPPORTUNITIES: the 15 activities from "Local Opportunities.pdf"
     (source: "pdf") plus a few clearly-labelled demonstration listings
     (source: "demo") that show how online / international entries look.
     Dates, organisers and contacts that the PDF marks as "to be confirmed"
     are kept as null so the UI shows "To be confirmed" — never invented.
   ========================================================================= */

window.SITE = {
  name: "OPPORTUNITIES",
  author: "Evelina",
  country: "Moldova",
  // Leave empty until there is a real address — the UI then points people to the contact form.
  email: "",
  phone: "",
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
    youtube: "#"
  }
};

/* Zones keep the long district list easy to scan. */
window.ZONES = [
  { id: "mun",     ro: "Municipii",               en: "Municipalities" },
  { id: "north",   ro: "Nord",                    en: "North" },
  { id: "centre",  ro: "Centru",                  en: "Centre" },
  { id: "south",   ro: "Sud",                     en: "South" },
  { id: "gag",     ro: "UTA Găgăuzia",            en: "ATU Gagauzia" },
  { id: "left",    ro: "Stânga Nistrului",        en: "Left Bank of the Dniester" }
];

/* id, display name, zone, [lat, lon] of the district centre, extra localities */
window.DISTRICTS = [
  // Municipalities
  { id: "chisinau",     name: "Chișinău",        zone: "mun",    c: [47.010, 28.863], loc: ["Chișinău", "Durlești", "Codru", "Vadul lui Vodă", "Sîngera"] },
  { id: "balti",        name: "Bălți",           zone: "mun",    c: [47.762, 27.929], loc: ["Bălți", "Elizaveta", "Sadovoe"] },
  { id: "bender",       name: "Bender (Tighina)",zone: "mun",    c: [46.831, 29.477], loc: ["Bender"] },

  // North
  { id: "briceni",      name: "Briceni",         zone: "north",  c: [48.362, 27.085], loc: ["Briceni", "Lipcani"] },
  { id: "donduseni",    name: "Dondușeni",       zone: "north",  c: [48.224, 27.591], loc: ["Dondușeni"] },
  { id: "drochia",      name: "Drochia",         zone: "north",  c: [48.035, 27.813], loc: ["Drochia"] },
  { id: "edinet",       name: "Edineț",          zone: "north",  c: [48.168, 27.305], loc: ["Edineț", "Cupcini"] },
  { id: "falesti",      name: "Fălești",         zone: "north",  c: [47.573, 27.711], loc: ["Fălești"] },
  { id: "floresti",     name: "Florești",        zone: "north",  c: [47.891, 28.301], loc: ["Florești", "Ghindești", "Mărculești"] },
  { id: "glodeni",      name: "Glodeni",         zone: "north",  c: [47.771, 27.514], loc: ["Glodeni"] },
  { id: "ocnita",       name: "Ocnița",          zone: "north",  c: [48.411, 27.481], loc: ["Ocnița", "Otaci", "Frunză"] },
  { id: "riscani",      name: "Rîșcani",         zone: "north",  c: [47.957, 27.553], loc: ["Rîșcani", "Costești"] },
  { id: "singerei",     name: "Sîngerei",        zone: "north",  c: [47.638, 28.142], loc: ["Sîngerei", "Biruința"] },
  { id: "soroca",       name: "Soroca",          zone: "north",  c: [48.157, 28.297], loc: ["Soroca"] },

  // Centre
  { id: "anenii-noi",   name: "Anenii Noi",      zone: "centre", c: [46.879, 29.231], loc: ["Anenii Noi", "Bulboaca"] },
  { id: "calarasi",     name: "Călărași",        zone: "centre", c: [47.254, 28.309], loc: ["Călărași"] },
  { id: "criuleni",     name: "Criuleni",        zone: "centre", c: [47.213, 29.159], loc: ["Criuleni"] },
  { id: "dubasari",     name: "Dubăsari",        zone: "centre", c: [47.270, 29.120], loc: ["Cocieri", "Ustia", "Molovata Nouă"] },
  { id: "hincesti",     name: "Hîncești",        zone: "centre", c: [46.828, 28.591], loc: ["Hîncești"] },
  { id: "ialoveni",     name: "Ialoveni",        zone: "centre", c: [46.943, 28.782], loc: ["Ialoveni"] },
  { id: "nisporeni",    name: "Nisporeni",       zone: "centre", c: [47.082, 28.178], loc: ["Nisporeni"] },
  { id: "orhei",        name: "Orhei",           zone: "centre", c: [47.384, 28.824], loc: ["Orhei", "Biești"] },
  { id: "rezina",       name: "Rezina",          zone: "centre", c: [47.749, 28.962], loc: ["Rezina"] },
  { id: "straseni",     name: "Strășeni",        zone: "centre", c: [47.142, 28.610], loc: ["Strășeni", "Bucovăț"] },
  { id: "soldanesti",   name: "Șoldănești",      zone: "centre", c: [47.816, 28.797], loc: ["Șoldănești"] },
  { id: "telenesti",    name: "Telenești",       zone: "centre", c: [47.503, 28.366], loc: ["Telenești"] },
  { id: "ungheni",      name: "Ungheni",         zone: "centre", c: [47.211, 27.800], loc: ["Ungheni", "Cornești"] },

  // South
  { id: "basarabeasca", name: "Basarabeasca",    zone: "south",  c: [46.333, 28.963], loc: ["Basarabeasca"] },
  { id: "cahul",        name: "Cahul",           zone: "south",  c: [45.904, 28.194], loc: ["Cahul"] },
  { id: "cantemir",     name: "Cantemir",        zone: "south",  c: [46.278, 28.201], loc: ["Cantemir"] },
  { id: "causeni",      name: "Căușeni",         zone: "south",  c: [46.637, 29.411], loc: ["Căușeni", "Căinari"] },
  { id: "cimislia",     name: "Cimișlia",        zone: "south",  c: [46.520, 28.784], loc: ["Cimișlia"] },
  { id: "leova",        name: "Leova",           zone: "south",  c: [46.479, 28.255], loc: ["Leova", "Iargara"] },
  { id: "stefan-voda",  name: "Ștefan Vodă",     zone: "south",  c: [46.513, 29.663], loc: ["Ștefan Vodă"] },
  { id: "taraclia",     name: "Taraclia",        zone: "south",  c: [45.900, 28.669], loc: ["Taraclia"] },

  // ATU Gagauzia
  { id: "gagauzia",     name: "Găgăuzia",        zone: "gag",    c: [46.297, 28.656], loc: ["Comrat", "Ceadîr-Lunga", "Vulcănești"] },

  // Left Bank of the Dniester
  { id: "stinga",       name: "Stânga Nistrului",zone: "left",   c: [46.840, 29.630], loc: ["Tiraspol", "Rîbnița", "Dubăsari (oraș)", "Grigoriopol", "Slobozia", "Camenca"] }
];

window.CATEGORIES = [
  { id: "erasmus",      color: "blue",   icon: "globe",  ro: "Erasmus+ și schimburi internaționale", en: "Erasmus+ & international exchanges", short: { ro: "Erasmus+", en: "Erasmus+" } },
  { id: "volunteering", color: "green",  icon: "heart",  ro: "Voluntariat",                          en: "Volunteering",                       short: { ro: "Voluntariat", en: "Volunteering" } },
  { id: "workshops",    color: "yellow", icon: "bulb",   ro: "Ateliere și training-uri",             en: "Workshops & training",               short: { ro: "Ateliere", en: "Workshops" } },
  { id: "scholarships", color: "blue",   icon: "cap",    ro: "Burse și programe educaționale",       en: "Scholarships & education",           short: { ro: "Burse", en: "Scholarships" } },
  { id: "competitions", color: "red",    icon: "trophy", ro: "Concursuri și provocări",              en: "Competitions & challenges",          short: { ro: "Concursuri", en: "Competitions" } },
  { id: "conferences",  color: "green",  icon: "mic",    ro: "Conferințe și forumuri de tineret",    en: "Youth conferences & forums",         short: { ro: "Forumuri", en: "Forums" } },
  { id: "careers",      color: "red",    icon: "case",   ro: "Stagii și carieră",                    en: "Internships & careers",              short: { ro: "Carieră", en: "Careers" } },
  { id: "local",        color: "yellow", icon: "star",   ro: "Evenimente și activități locale",      en: "Local events & activities",          short: { ro: "Local", en: "Local" } }
];

/* -------------------------------------------------------------------------
   Opportunity shape
   id, source ("pdf" | "demo"), cat, format ("local" | "online" | "international"),
   district (id from DISTRICTS, or null for online), locality, venue {ro,en},
   title/desc/full {ro,en}, learn {ro:[], en:[]},
   month "YYYY-MM" | null, date "YYYY-MM-DD" | null, time "HH:MM" | null,
   deadline "YYYY-MM-DD" | null, ages [min,max], cost "free" | "paid" | null,
   organizer string | null, contact string | null, link url | null,
   covers {accommodation, transport, meals} each true | false | null,
   featured, isNew
   ------------------------------------------------------------------------- */

const AGES = [13, 19];
const TBC_COVERS = { accommodation: null, transport: null, meals: null };

window.OPPORTUNITIES = [
  {
    id: "youth-creative-workshop-ustia",
    source: "pdf", cat: "workshops", format: "local",
    district: "dubasari", locality: "Ustia",
    venue: { ro: "Centrul de Tineret, Ustia", en: "Youth Centre, Ustia" },
    title: { ro: "Atelier creativ pentru tineri", en: "Youth Creative Workshop" },
    desc: {
      ro: "Ateliere creative, lucru în echipă, jocuri de comunicare și dezvoltare personală.",
      en: "Creative workshops, teamwork, communication games and personal development."
    },
    full: {
      ro: "O zi de creativitate la Centrul de Tineret din Ustia, raionul Dubăsari. Participanții lucrează în ateliere creative, învață să colaboreze în echipă, joacă jocuri de comunicare și descoperă exerciții de dezvoltare personală. Participarea este gratuită.",
      en: "A creative day at the Youth Centre in Ustia, Dubăsari district. Participants join creative workshops, learn to collaborate as a team, play communication games and try personal-development exercises. Participation is free."
    },
    learn: {
      ro: ["Cum să-ți exprimi ideile creativ", "Lucru în echipă", "Comunicare și încredere în sine", "Dezvoltare personală"],
      en: ["How to express your ideas creatively", "Teamwork", "Communication and self-confidence", "Personal development"]
    },
    month: "2026-11", date: null, time: null, deadline: null,
    ages: AGES, cost: "free", organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: true, isNew: false
  },
  {
    id: "clean-community-molovata",
    source: "pdf", cat: "volunteering", format: "local",
    district: "dubasari", locality: "Molovata Nouă",
    venue: { ro: "Molovata Nouă", en: "Molovata Nouă" },
    title: { ro: "Acțiune ecologică – Comunitate curată", en: "Environmental Action – Clean Community" },
    desc: {
      ro: "Curățenie în comunitate, educație ecologică și reciclare.",
      en: "Community clean-up, environmental education and recycling."
    },
    full: {
      ro: "Tinerii din Molovata Nouă și din satele vecine se adună pentru a face comunitatea mai curată. Acțiunea combină curățenia propriu-zisă cu educația ecologică și învățarea regulilor de reciclare.",
      en: "Young people from Molovata Nouă and nearby villages come together to make their community cleaner. The action combines a real clean-up with environmental education and learning how recycling works."
    },
    learn: {
      ro: ["De ce contează reciclarea", "Cum se organizează o acțiune de voluntariat", "Responsabilitate față de comunitate"],
      en: ["Why recycling matters", "How a volunteering action is organised", "Responsibility towards your community"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "youth-leadership-criuleni",
    source: "pdf", cat: "workshops", format: "local",
    district: "criuleni", locality: "Criuleni",
    venue: { ro: "Centrul de Tineret Criuleni", en: "Criuleni Youth Centre" },
    title: { ro: "Atelier de leadership pentru tineri", en: "Youth Leadership Workshop" },
    desc: {
      ro: "Leadership, vorbit în public, lucru în echipă și dezvoltare de proiecte.",
      en: "Leadership, public speaking, teamwork and project development."
    },
    full: {
      ro: "Un atelier la Centrul de Tineret Criuleni pentru adolescenții care vor să devină lideri în școala și comunitatea lor. Se lucrează pe leadership, vorbit în public, lucru în echipă și pe pașii de bază ai dezvoltării unui proiect.",
      en: "A workshop at Criuleni Youth Centre for teenagers who want to lead in their school and community. It covers leadership, public speaking, teamwork and the basic steps of developing a project."
    },
    learn: {
      ro: ["Ce înseamnă să fii lider", "Vorbit în public", "Lucru în echipă", "Cum transformi o idee în proiect"],
      en: ["What it means to be a leader", "Public speaking", "Teamwork", "How to turn an idea into a project"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "discover-your-career-orhei",
    source: "pdf", cat: "careers", format: "local",
    district: "orhei", locality: "Orhei",
    venue: { ro: "Centrul de Tineret Orhei", en: "Orhei Youth Centre" },
    title: { ro: "Descoperă-ți cariera", en: "Discover Your Career" },
    desc: {
      ro: "Orientare în carieră, întâlniri cu profesioniști și descoperirea oportunităților educaționale.",
      en: "Career guidance, meeting professionals and discovering educational opportunities."
    },
    full: {
      ro: "La Centrul de Tineret Orhei, adolescenții primesc orientare în carieră, întâlnesc profesioniști din diferite domenii și descoperă ce opțiuni educaționale au după școală.",
      en: "At Orhei Youth Centre, teenagers get career guidance, meet professionals from different fields and discover what educational options they have after school."
    },
    learn: {
      ro: ["Ce meserii ți se potrivesc", "Întrebări de pus profesioniștilor", "Ce poți studia după școală"],
      en: ["Which careers might suit you", "Questions to ask professionals", "What you can study after school"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "photography-creativity-orhei",
    source: "pdf", cat: "workshops", format: "local",
    district: "orhei", locality: "Orhei",
    venue: { ro: "Orhei", en: "Orhei" },
    title: { ro: "Atelier de fotografie și creativitate", en: "Photography and Creativity Workshop" },
    desc: {
      ro: "Fotografie, storytelling, exprimare creativă și competențe digitale.",
      en: "Photography, storytelling, creative expression and digital skills."
    },
    full: {
      ro: "Un atelier în Orhei pentru cei care vor să spună povești prin imagini. Participanții exersează fotografia, storytelling-ul, exprimarea creativă și competențe digitale utile.",
      en: "A workshop in Orhei for anyone who wants to tell stories through images. Participants practise photography, storytelling, creative expression and useful digital skills."
    },
    learn: {
      ro: ["Bazele fotografiei", "Cum spui o poveste prin imagini", "Instrumente digitale pentru creatori"],
      en: ["Photography basics", "How to tell a story with images", "Digital tools for creators"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "project-writing-ialoveni",
    source: "pdf", cat: "workshops", format: "local",
    district: "ialoveni", locality: "Ialoveni",
    venue: { ro: "Ialoveni", en: "Ialoveni" },
    title: { ro: "Training de scriere a proiectelor pentru tineri", en: "Youth Project Writing Training" },
    desc: {
      ro: "Cum să dezvolți proiecte comunitare, să scrii aplicații și să obții finanțare.",
      en: "Learning how to develop community projects, write applications and obtain funding."
    },
    full: {
      ro: "Un training în Ialoveni care te învață cum să transformi o problemă din comunitatea ta într-un proiect: cum îl planifici, cum scrii aplicația și cum cauți finanțare.",
      en: "A training in Ialoveni that teaches you how to turn a problem in your community into a project: how to plan it, how to write the application and how to look for funding."
    },
    learn: {
      ro: ["Cum identifici o problemă din comunitate", "Structura unei aplicații de proiect", "Unde și cum cauți finanțare"],
      en: ["How to identify a community need", "How a project application is structured", "Where and how to look for funding"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "digital-skills-anenii-noi",
    source: "pdf", cat: "workshops", format: "local",
    district: "anenii-noi", locality: "Anenii Noi",
    venue: { ro: "Anenii Noi", en: "Anenii Noi" },
    title: { ro: "Competențe digitale pentru adolescenți", en: "Digital Skills for Teenagers" },
    desc: {
      ro: "Alfabetizare digitală, Canva, comunicare online și utilizarea responsabilă a internetului.",
      en: "Digital literacy, Canva, online communication and responsible internet use."
    },
    full: {
      ro: "În Anenii Noi, adolescenții învață să folosească tehnologia cu încredere: alfabetizare digitală, design în Canva, comunicare online și utilizarea responsabilă și sigură a internetului.",
      en: "In Anenii Noi, teenagers learn to use technology with confidence: digital literacy, designing in Canva, online communication and safe, responsible internet use."
    },
    learn: {
      ro: ["Design simplu în Canva", "Comunicare online eficientă", "Siguranța pe internet"],
      en: ["Simple design in Canva", "Effective online communication", "Staying safe online"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "volunteer-day-causeni",
    source: "pdf", cat: "volunteering", format: "local",
    district: "causeni", locality: "Căușeni",
    venue: { ro: "Centrul de Tineret Căușeni", en: "Căușeni Youth Centre" },
    title: { ro: "Ziua Tânărului Voluntar", en: "Youth Volunteer Day" },
    desc: {
      ro: "Voluntariat, implicare comunitară și inițiative sociale.",
      en: "Volunteering, community engagement and social initiatives."
    },
    full: {
      ro: "O zi dedicată voluntariatului la Centrul de Tineret Căușeni: tinerii descoperă cum se pot implica în comunitate și participă la inițiative sociale.",
      en: "A day dedicated to volunteering at Căușeni Youth Centre: young people discover how they can get involved in their community and take part in social initiatives."
    },
    learn: {
      ro: ["Ce înseamnă voluntariatul", "Cum găsești o cauză care contează pentru tine", "Inițiative sociale în comunitate"],
      en: ["What volunteering means", "How to find a cause you care about", "Social initiatives in your community"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "erasmus-info-ungheni",
    source: "pdf", cat: "erasmus", format: "local",
    district: "ungheni", locality: "Ungheni",
    venue: { ro: "Centrul de Tineret Ungheni", en: "Ungheni Youth Centre" },
    title: { ro: "Sesiune de informare Erasmus+", en: "Erasmus+ Information Session" },
    desc: {
      ro: "Descoperă Erasmus+, schimburile internaționale, voluntariatul european și mobilitatea tinerilor.",
      en: "Discovering Erasmus+, international exchanges, European volunteering and youth mobility."
    },
    full: {
      ro: "La Centrul de Tineret Ungheni afli ce este Erasmus+ și cum poți ajunge într-un schimb internațional, ce înseamnă voluntariatul european și ce oportunități de mobilitate există pentru tinerii din Moldova.",
      en: "At Ungheni Youth Centre you find out what Erasmus+ is and how you can join an international exchange, what European volunteering involves and what mobility opportunities exist for young people from Moldova."
    },
    learn: {
      ro: ["Ce este Erasmus+", "Tipuri de schimburi pentru tineri", "Voluntariatul european", "Primii pași spre o aplicație"],
      en: ["What Erasmus+ is", "Types of youth exchanges", "European volunteering", "First steps towards an application"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: true, isNew: false
  },
  {
    id: "debate-club-ungheni",
    source: "pdf", cat: "competitions", format: "local",
    district: "ungheni", locality: "Ungheni",
    venue: { ro: "Ungheni", en: "Ungheni" },
    title: { ro: "Club de dezbateri și vorbit în public", en: "Debate and Public Speaking Club" },
    desc: {
      ro: "Dezbateri, gândire critică, comunicare și argumentare.",
      en: "Debates, critical thinking, communication and argumentation."
    },
    full: {
      ro: "Un club în Ungheni unde adolescenții exersează dezbaterile, gândirea critică, comunicarea și argumentarea — abilități utile la școală, la interviuri și în viață.",
      en: "A club in Ungheni where teenagers practise debating, critical thinking, communication and argumentation — skills that help at school, in interviews and in life."
    },
    learn: {
      ro: ["Cum construiești un argument", "Gândire critică", "Vorbit în public fără emoții"],
      en: ["How to build an argument", "Critical thinking", "Speaking in public with confidence"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "entrepreneurship-cahul",
    source: "pdf", cat: "careers", format: "local",
    district: "cahul", locality: "Cahul",
    venue: { ro: "Cahul", en: "Cahul" },
    title: { ro: "Atelier de antreprenoriat pentru tineri", en: "Youth Entrepreneurship Workshop" },
    desc: {
      ro: "Idei de afaceri, antreprenoriat, educație financiară și inovație.",
      en: "Business ideas, entrepreneurship, financial literacy and innovation."
    },
    full: {
      ro: "Un atelier în Cahul pentru adolescenții cu idei: cum se naște o idee de afacere, ce înseamnă antreprenoriatul, noțiuni de educație financiară și gândire inovatoare.",
      en: "A workshop in Cahul for teenagers with ideas: how a business idea is born, what entrepreneurship means, financial-literacy basics and innovative thinking."
    },
    learn: {
      ro: ["Cum testezi o idee de afacere", "Educație financiară de bază", "Gândire inovatoare"],
      en: ["How to test a business idea", "Basic financial literacy", "Innovative thinking"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: false
  },
  {
    id: "international-fair-cahul",
    source: "pdf", cat: "scholarships", format: "local",
    district: "cahul", locality: "Cahul",
    venue: { ro: "Cahul", en: "Cahul" },
    title: { ro: "Târgul oportunităților internaționale", en: "International Opportunities Fair" },
    desc: {
      ro: "Informații despre burse, programe internaționale, oportunități educaționale și voluntariat.",
      en: "Information about scholarships, international programmes, educational opportunities and volunteering."
    },
    full: {
      ro: "Un târg în Cahul care adună într-un singur loc informații despre burse, programe internaționale, oportunități educaționale și voluntariat — ideal dacă nu știi de unde să începi.",
      en: "A fair in Cahul that brings together information about scholarships, international programmes, educational opportunities and volunteering — ideal if you don't know where to start."
    },
    learn: {
      ro: ["Ce burse există pentru tineri", "Cum alegi un program internațional", "Cum pregătești o aplicație"],
      en: ["Which scholarships exist for young people", "How to choose an international programme", "How to prepare an application"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: true, isNew: false
  },
  {
    id: "cultural-heritage-soroca",
    source: "pdf", cat: "local", format: "local",
    district: "soroca", locality: "Soroca",
    venue: { ro: "Soroca", en: "Soroca" },
    title: { ro: "Ziua patrimoniului cultural și a creativității", en: "Cultural Heritage and Creativity Day" },
    desc: {
      ro: "Meșteșuguri tradiționale, istorie locală, expoziții culturale și ateliere creative.",
      en: "Traditional crafts, local history, cultural exhibitions and creative workshops."
    },
    full: {
      ro: "O zi în Soroca dedicată moștenirii culturale: meșteșuguri tradiționale, povești din istoria locală, expoziții culturale și ateliere creative.",
      en: "A day in Soroca dedicated to cultural heritage: traditional crafts, stories from local history, cultural exhibitions and creative workshops."
    },
    learn: {
      ro: ["Meșteșuguri tradiționale", "Istoria locului tău", "Cum păstrezi tradițiile vii"],
      en: ["Traditional crafts", "The history of your place", "How to keep traditions alive"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: true
  },
  {
    id: "innovation-forum-hincesti",
    source: "pdf", cat: "conferences", format: "local",
    district: "hincesti", locality: "Hîncești",
    venue: { ro: "Hîncești", en: "Hîncești" },
    title: { ro: "Forumul Tinerilor Inovatori", en: "Youth Innovation Forum" },
    desc: {
      ro: "Inovație, lucru în echipă, antreprenoriat social și dezvoltare comunitară.",
      en: "Innovation, teamwork, social entrepreneurship and community development."
    },
    full: {
      ro: "Un forum în Hîncești pentru tinerii care vor să schimbe ceva: inovație, lucru în echipă, antreprenoriat social și idei pentru dezvoltarea comunității.",
      en: "A forum in Hîncești for young people who want to change something: innovation, teamwork, social entrepreneurship and ideas for community development."
    },
    learn: {
      ro: ["Ce este antreprenoriatul social", "Lucru în echipă pe idei reale", "Cum contribui la dezvoltarea comunității"],
      en: ["What social entrepreneurship is", "Teamwork on real ideas", "How to contribute to community development"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: true
  },
  {
    id: "youth-exchange-info-balti",
    source: "pdf", cat: "erasmus", format: "local",
    district: "balti", locality: "Bălți",
    venue: { ro: "Bălți", en: "Bălți" },
    title: { ro: "Atelier de informare despre schimburile internaționale de tineret", en: "International Youth Exchange Information Workshop" },
    desc: {
      ro: "Descoperă schimburile internaționale, întâlnește foști participanți și învață cum să aplici la proiecte Erasmus+.",
      en: "Discovering international exchanges, meeting former participants and learning how to apply for Erasmus+ projects."
    },
    full: {
      ro: "Un atelier în Bălți despre schimburile internaționale de tineret. Întâlnești foști participanți care îți povestesc experiența lor și înveți pas cu pas cum să aplici la proiecte Erasmus+.",
      en: "A workshop in Bălți about international youth exchanges. You meet former participants who share their experience and learn step by step how to apply for Erasmus+ projects."
    },
    learn: {
      ro: ["Cum arată un schimb de tineret", "Experiențe reale ale foștilor participanți", "Cum aplici la Erasmus+"],
      en: ["What a youth exchange looks like", "Real stories from former participants", "How to apply for Erasmus+"]
    },
    month: null, date: null, time: null, deadline: null,
    ages: AGES, cost: null, organizer: null, contact: null, link: null,
    covers: TBC_COVERS, featured: false, isNew: true
  },

  /* ---------------- Demonstration listings (clearly labelled) ---------------- */
  {
    id: "demo-online-debate-challenge",
    source: "demo", cat: "competitions", format: "online",
    district: null, locality: null,
    venue: { ro: "Online", en: "Online" },
    title: { ro: "Provocare online de dezbateri (exemplu)", en: "Online Debate Challenge (example)" },
    desc: {
      ro: "Exemplu de listare: o competiție online la care poți participa din orice sat, doar cu telefonul.",
      en: "Example listing: an online competition you can join from any village, with just a phone."
    },
    full: {
      ro: "Aceasta este o listare demonstrativă care arată cum vor apărea concursurile online pe platformă. Nu este un eveniment real. Ideea: echipe de adolescenți din toată Moldova se întâlnesc online și dezbat teme actuale.",
      en: "This is a demonstration listing showing how online competitions will appear on the platform. It is not a real event. The idea: teams of teenagers from all over Moldova meet online and debate current topics."
    },
    learn: {
      ro: ["Argumentare", "Lucru în echipă la distanță", "Comunicare online"],
      en: ["Argumentation", "Remote teamwork", "Online communication"]
    },
    month: "2026-12", date: "2026-12-12", time: "15:00", deadline: "2026-12-05",
    ages: [14, 19], cost: "free", organizer: "Organizator exemplu / Example organiser", contact: null, link: null,
    covers: { accommodation: false, transport: false, meals: false }, featured: false, isNew: true
  },
  {
    id: "demo-erasmus-youth-exchange",
    source: "demo", cat: "erasmus", format: "international",
    district: null, locality: null,
    venue: { ro: "În străinătate", en: "Abroad" },
    title: { ro: "Schimb de tineret Erasmus+ (exemplu)", en: "Erasmus+ Youth Exchange (example)" },
    desc: {
      ro: "Exemplu de listare: cum arată un schimb internațional — o săptămână cu tineri din mai multe țări.",
      en: "Example listing: what an international exchange looks like — a week with young people from several countries."
    },
    full: {
      ro: "Aceasta este o listare demonstrativă, nu un proiect real. Ea arată ce informații vei găsi la un schimb Erasmus+: durata, cine poate participa și ce costuri sunt acoperite (în multe schimburi Erasmus+ cazarea, masa și o parte din transport sunt acoperite — verifică mereu la organizator).",
      en: "This is a demonstration listing, not a real project. It shows the information you will find for an Erasmus+ exchange: duration, who can take part and which costs are covered (in many Erasmus+ exchanges accommodation, meals and part of travel are covered — always check with the organiser)."
    },
    learn: {
      ro: ["Comunicare interculturală", "Limbi străine în practică", "Prietenii internaționale"],
      en: ["Intercultural communication", "Foreign languages in practice", "International friendships"]
    },
    month: "2027-03", date: "2027-03-15", time: null, deadline: "2027-01-31",
    ages: [16, 19], cost: "free", organizer: "Organizator exemplu / Example organiser", contact: null, link: null,
    covers: { accommodation: true, transport: true, meals: true }, featured: false, isNew: true
  },
  {
    id: "demo-scholarship-webinar",
    source: "demo", cat: "scholarships", format: "online",
    district: null, locality: null,
    venue: { ro: "Online", en: "Online" },
    title: { ro: "Webinar: cum aplici la o bursă (exemplu)", en: "Webinar: how to apply for a scholarship (example)" },
    desc: {
      ro: "Exemplu de listare: un webinar gratuit despre scrisoarea de motivație și dosarul de aplicare.",
      en: "Example listing: a free webinar about motivation letters and application files."
    },
    full: {
      ro: "Aceasta este o listare demonstrativă, nu un eveniment real. Arată cum vor fi prezentate sesiunile online despre burse: ce documente îți trebuie, cum scrii o scrisoare de motivație și cum îți planifici termenele.",
      en: "This is a demonstration listing, not a real event. It shows how online scholarship sessions will be presented: which documents you need, how to write a motivation letter and how to plan your deadlines."
    },
    learn: {
      ro: ["Scrisoarea de motivație", "Documentele necesare", "Planificarea termenelor"],
      en: ["The motivation letter", "Required documents", "Planning your deadlines"]
    },
    month: "2027-01", date: "2027-01-20", time: "18:00", deadline: "2027-01-18",
    ages: [15, 19], cost: "free", organizer: "Organizator exemplu / Example organiser", contact: null, link: null,
    covers: { accommodation: false, transport: false, meals: false }, featured: false, isNew: false
  }
];

/* Photos extracted from "Local Opportunities.pdf". Captions only repeat what is
   visible in each image — they are shown as inspiration, not as listings. */
window.GALLERY = [
  { src: "assets/img/youth-team.jpg",          ro: "Tineri care fac lucrurile să se întâmple",   en: "Young people making things happen" },
  { src: "assets/img/comorile-plaiului.jpg",   ro: "Comorile Plaiului · Biești, Orhei",          en: "Comorile Plaiului · Biești, Orhei" },
  { src: "assets/img/primavara-teatrala.jpg",  ro: "Primăvara Teatrală · Cahul",                 en: "Primăvara Teatrală theatre festival · Cahul" },
  { src: "assets/img/hodina.jpg",              ro: "Hodina · satul Pohrebea",                    en: "Hodina · Pohrebea village" },
  { src: "assets/img/folk-choir.jpg",          ro: "Festival folcloric",                         en: "Folk festival" },
  { src: "assets/img/festivalul-lupilor.jpg",  ro: "Festivalul Lupilor · Orheiul Vechi",         en: "Festivalul Lupilor · Orheiul Vechi" },
  { src: "assets/img/mural-restoration.jpg",   ro: "Înainte și după: un monument readus la viață",en: "Before and after: a monument brought back to life" },
  { src: "assets/img/riviera-nistrului.jpg",   ro: "Riviera Nistrului Festival",                 en: "Riviera Nistrului Festival" },
  { src: "assets/img/malanca-parade.jpg",      ro: "Alai cu tradiții de iarnă",                  en: "Winter traditions parade" },
  { src: "assets/img/pumpkin-festival.jpg",    ro: "Festival de toamnă",                         en: "Autumn festival" },
  { src: "assets/img/colinde-group.jpg",       ro: "Colindători în costume tradiționale",        en: "Carol singers in traditional costume" },
  { src: "assets/img/harvest-display.jpg",     ro: "Expoziție de toamnă",                        en: "Autumn harvest display" },
  { src: "assets/img/act2-castel-mimi.jpg",    ro: "ACT II · Castel Mimi",                       en: "ACT II · Castel Mimi" },
  { src: "assets/img/concert-cahul.jpg",       ro: "Concert în aer liber · Cahul",               en: "Open-air concert · Cahul" }
];
