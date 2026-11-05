/* OPPORTUNITIES — single-page app (no build step, works from any static host). */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ utils */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const OPPS = window.OPPORTUNITIES;
  const DISTRICTS = window.DISTRICTS;
  const CATS = window.CATEGORIES;
  const byId = (id) => OPPS.find((o) => o.id === id);
  const district = (id) => DISTRICTS.find((d) => d.id === id);
  const cat = (id) => CATS.find((c) => c.id === id);

  /* ------------------------------------------------------------------ i18n */
  let lang = store.get("opp.lang", "ro");
  if (!window.I18N[lang]) lang = "ro";
  function t(key, vars) {
    let s = window.I18N[lang][key];
    if (s == null) s = window.I18N.ro[key];
    if (s == null) return key;
    if (vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ""));
    return s;
  }
  const L = (o) => (o && typeof o === "object" ? (o[lang] != null ? o[lang] : o.ro) : o);

  /* ------------------------------------------------------------------ icons */
  const P = {
    search: '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
    hourglass: '<path d="M6 2.5h12M6 21.5h12M7.5 2.5v3.2a4 4 0 0 0 1.4 3L12 12l3.1-3.3a4 4 0 0 0 1.4-3V2.5M7.5 21.5v-3.2a4 4 0 0 1 1.4-3L12 12l3.1 3.3a4 4 0 0 1 1.4 3v3.2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6L2 7"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5a14.5 14.5 0 0 1 0 19M12 2.5a14.5 14.5 0 0 0 0 19"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5A6 6 0 1 0 6 8c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5M22 10v6"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.1.6 2 2 2 3.8M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
    case: '<rect x="2" y="7" width="20" height="14" rx="3"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9Z"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    nav: '<path d="M3 11 21 3l-8 18-2-8-8-2Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 16v-4.5M12 8h.01"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2.5"/><path d="M8 21h8M12 17v4"/>',
    bed: '<path d="M2 4v16M2 8h17a3 3 0 0 1 3 3v9M2 16h20M6 8v8"/>',
    bus: '<path d="M8 6v6M16 6v6M2 12h20M4 18V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v11"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    meal: '<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3Zm0 0v7"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/>',
    instagram: '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
    tiktok: '<path d="M9 12a4 4 0 1 0 4 4V3c.5 2.6 2.4 4.6 5 5"/>',
    youtube: '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3Z"/>',
    filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>'
  };
  const icon = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${P[n] || ""}</svg>`;

  /* ------------------------------------------------------------------ geo */
  function km(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function nearestDistrict(lat, lon) {
    let best = null, bd = Infinity;
    DISTRICTS.forEach((d) => { const k = km([lat, lon], d.c); if (k < bd) { bd = k; best = d; } });
    return best;
  }

  /* ------------------------------------------------------------------ formatting */
  function fmtDate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    const mon = t("months")[m - 1];
    return lang === "ro" ? `${d} ${mon} ${y}` : `${d} ${mon} ${y}`;
  }
  function fmtWhen(o) {
    if (o.date) return fmtDate(o.date) + (o.time ? `, ${o.time}` : "");
    if (o.month) {
      const [y, m] = o.month.split("-").map(Number);
      const mon = t("months")[m - 1];
      return `${lang === "ro" ? mon : mon} ${y} · ${t("events.monthOnly")}`;
    }
    return t("card.tbc");
  }
  const fmtDeadline = (o) => fmtDate(o.deadline) || t("card.tbc");
  const fmtCost = (o) => (o.cost === "free" ? t("card.free") : o.cost === "paid" ? t("card.paid") : t("card.tbc"));
  function fmtPlace(o) {
    if (o.format !== "local") return t("format." + o.format);
    return L(o.venue);
  }
  function fmtRegion(o) {
    if (!o.district) return t("format." + o.format);
    const d = district(o.district);
    const z = window.ZONES.find((z) => z.id === d.zone);
    return `${d.name} · ${L(z)}`;
  }

  /* ------------------------------------------------------------------ components */
  function badgeRow(o) {
    const c = cat(o.cat);
    let b = `<span class="chip chip--${c.color}">${icon(c.icon)}${esc(L(c.short))}</span>`;
    if (o.format !== "local") b += `<span class="chip chip--ink">${icon(o.format === "online" ? "monitor" : "globe")}${esc(t("format." + o.format))}</span>`;
    if (o.isNew) b += `<span class="chip chip--new">${esc(t("card.new"))}</span>`;
    if (o.source === "demo") b += `<span class="chip chip--demo">${icon("info")}${esc(t("card.example"))}</span>`;
    return b;
  }

  function actionFor(o, big) {
    if (o.link) return `<a class="btn ${big ? "btn--primary btn--lg" : "btn--soft"}" href="${esc(o.link)}" target="_blank" rel="noopener">${esc(big ? t("detail.apply") : t("card.apply"))}${icon("arrowR")}</a>`;
    const subj = encodeURIComponent(L(o.title));
    return `<a class="btn ${big ? "btn--primary btn--lg" : "btn--soft"}" href="#/contact?about=${encodeURIComponent(o.id)}&s=${subj}">${esc(big ? t("detail.ask") : t("card.ask"))}${icon(big ? "send" : "mail")}</a>`;
  }

  function card(o, opts = {}) {
    const c = cat(o.cat);
    const dist = opts.dist != null ? `<span class="card__dist">${icon("nav")}${esc(t("card.km", { n: Math.round(opts.dist) }))}</span>` : "";
    return `
    <article class="card card--${c.color} reveal" data-id="${esc(o.id)}">
      <div class="card__art" aria-hidden="true">
        <span class="card__icon">${icon(c.icon)}</span>
        ${dist}
      </div>
      <div class="card__body">
        <div class="card__chips">${badgeRow(o)}</div>
        <h3 class="card__title"><a href="#/o/${esc(o.id)}" class="card__link">${esc(L(o.title))}</a></h3>
        <p class="card__desc">${esc(L(o.desc))}</p>
        <dl class="facts">
          <div><dt>${icon("pin")}<span>${esc(t("card.location"))}</span></dt><dd>${esc(fmtPlace(o))}</dd></div>
          <div><dt>${icon("globe")}<span>${esc(t("card.region"))}</span></dt><dd>${esc(fmtRegion(o))}</dd></div>
          <div><dt>${icon("calendar")}<span>${esc(t("card.when"))}</span></dt><dd class="${o.date || o.month ? "" : "tbc"}">${esc(fmtWhen(o))}</dd></div>
          <div><dt>${icon("hourglass")}<span>${esc(t("card.deadline"))}</span></dt><dd class="${o.deadline ? "" : "tbc"}">${esc(fmtDeadline(o))}</dd></div>
          <div><dt>${icon("users")}<span>${esc(t("card.ages"))}</span></dt><dd>${esc(t("card.agesv", { a: o.ages[0], b: o.ages[1] }))}</dd></div>
          <div><dt>${icon("tag")}<span>${esc(t("card.cost"))}</span></dt><dd class="${o.cost ? (o.cost === "free" ? "free" : "") : "tbc"}">${esc(fmtCost(o))}</dd></div>
          <div><dt>${icon("building")}<span>${esc(t("card.organizer"))}</span></dt><dd class="${o.organizer ? "" : "tbc"}">${esc(o.organizer || t("card.tbc"))}</dd></div>
          <div><dt>${icon("mail")}<span>${esc(t("card.contact"))}</span></dt><dd class="${o.contact ? "" : "tbc"}">${esc(o.contact || t("card.tbc"))}</dd></div>
        </dl>
        <div class="card__actions">
          <a class="btn btn--primary" href="#/o/${esc(o.id)}">${esc(t("card.view"))}${icon("arrowR")}</a>
          ${actionFor(o, false)}
        </div>
      </div>
    </article>`;
  }

  function miniCard(o) {
    const c = cat(o.cat);
    return `<a class="mini mini--${c.color} reveal" href="#/o/${esc(o.id)}">
      <span class="mini__icon">${icon(c.icon)}</span>
      <span class="mini__text">
        <strong>${esc(L(o.title))}</strong>
        <span>${icon("pin")}${esc(o.district ? district(o.district).name : t("format." + o.format))} · ${esc(fmtWhen(o))}</span>
      </span>
      ${o.source === "demo" ? `<span class="chip chip--demo chip--xs">${esc(t("card.example"))}</span>` : ""}
      ${icon("chevR", "mini__chev")}
    </a>`;
  }

  function sectionHead(title, sub, link) {
    return `<div class="sec-head reveal">
      <div><h2 class="h2">${esc(title)}</h2>${sub ? `<p class="muted">${esc(sub)}</p>` : ""}</div>
      ${link ? `<a class="link-arrow" href="${link}">${esc(t("see.all"))}${icon("arrowR")}</a>` : ""}
    </div>`;
  }

  function districtOptions(selected, withAll, allLabel) {
    let h = withAll ? `<option value="">${esc(allLabel)}</option>` : `<option value="" disabled ${selected ? "" : "selected"}>${esc(t("regions.pick"))}</option>`;
    window.ZONES.forEach((z) => {
      h += `<optgroup label="${esc(L(z))}">`;
      DISTRICTS.filter((d) => d.zone === z.id).forEach((d) => {
        h += `<option value="${d.id}" ${d.id === selected ? "selected" : ""}>${esc(d.name)}</option>`;
      });
      h += `</optgroup>`;
    });
    return h;
  }

  /* ------------------------------------------------------------------ views */
  const views = {};

  views.home = function () {
    const featured = OPPS.filter((o) => o.featured);
    const fresh = OPPS.filter((o) => o.isNew).slice(0, 4);
    const upcoming = OPPS.filter((o) => o.date || o.month).sort((a, b) => (a.date || a.month + "-99").localeCompare(b.date || b.month + "-99")).slice(0, 4);
    const counted = (id) => OPPS.filter((o) => o.cat === id).length;
    const g = window.GALLERY;

    return `
    <section class="hero">
            <div class="wrap hero__grid">
        <div class="hero__copy">
          <p class="eyebrow">${icon("sparkle")}${esc(t("hero.eyebrow"))}</p>
          <h1 class="display">${esc(t("hero.title"))}</h1>
          <p class="lead">${esc(t("hero.subtitle"))}</p>
          <div class="hero__ctas">
            <a class="btn btn--primary btn--lg" href="#/explore">${esc(t("hero.cta.explore"))}${icon("arrowR")}</a>
            <a class="btn btn--glass btn--lg" href="#/regions?near=1">${icon("nav")}${esc(t("hero.cta.near"))}</a>
          </div>
          <form class="hero__search" role="search" data-hero-search>
            ${icon("search")}
            <input type="search" name="q" placeholder="${esc(t("hero.search"))}" aria-label="${esc(t("f.search"))}">
            <button class="btn btn--dark" type="submit" aria-label="${esc(t("f.search"))}">${icon("arrowR")}</button>
          </form>
        </div>
        <div class="hero__art" aria-hidden="true">
          <figure class="ph ph--1"><img src="${g[0].src}" alt="" loading="eager" decoding="async"></figure>
          <figure class="ph ph--2"><img src="${g[1].src}" alt="" decoding="async"></figure>
          <figure class="ph ph--3"><img src="${g[4].src}" alt="" decoding="async"></figure>
          <div class="float float--a"><strong>${OPPS.filter((o) => o.source === "pdf").length}</strong><span>${esc(t("hero.stat.activities"))}</span></div>
          <div class="float float--b"><strong>${DISTRICTS.length}</strong><span>${esc(t("hero.stat.districts"))}</span></div>
          <div class="float float--c"><strong>13–19</strong><span>${esc(t("hero.stat.ages"))}</span></div>
        </div>
      </div>
    </section>

    <section class="section" id="mission">
      <div class="wrap">
        <div class="mission reveal">
          <p class="eyebrow eyebrow--dark">${esc(t("mission.eyebrow"))}</p>
          <h2 class="h1">${esc(t("mission.title"))}</h2>
          <p class="lead lead--dark">${esc(t("mission.lead"))}</p>
        </div>
        <div class="pillars">
          ${[["p1", "search", "violet"], ["p2", "pin", "lavender"], ["p3", "globe", "lilac"], ["p4", "check", "plum"]].map(([k, ic, col]) => `
          <div class="pillar pillar--${col} reveal"><span class="pillar__icon">${icon(ic)}</span><h3>${esc(t("mission." + k + ".t"))}</h3><p>${esc(t("mission." + k + ".d"))}</p></div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="wrap">
        ${sectionHead(t("home.featured"), t("home.featured.sub"), "#/explore")}
        <div class="grid">${featured.map((o) => card(o)).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        ${sectionHead(t("home.categories"), t("home.categories.sub"))}
        <div class="cats">
          ${CATS.map((c) => `<a class="cat cat--${c.color} reveal" href="#/explore?cat=${c.id}">
            <span class="cat__icon">${icon(c.icon)}</span>
            <span class="cat__name">${esc(L(c))}</span>
            <span class="cat__count">${counted(c.id)}</span>
          </a>`).join("")}
        </div>
      </div>
    </section>

    <section class="statement" aria-label="${esc(t("home.statement"))}">
      <div class="wrap"><p class="statement__text reveal">${esc(t("home.statement"))
        .split(". ").map((s, i, a) => `<span class="st st--${i}">${esc(s)}${i < a.length - 1 ? "." : ""}</span>`).join(" ")}</p></div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <div>
          ${sectionHead(t("home.new"), t("home.new.sub"), "#/explore")}
          <div class="list">${fresh.map(miniCard).join("")}</div>
        </div>
        <div>
          ${sectionHead(t("home.upcoming"), t("home.upcoming.sub"), "#/events")}
          <div class="list">${upcoming.map(miniCard).join("")}</div>
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="wrap">
        ${sectionHead(t("home.gallery"), t("home.gallery.sub"))}
      </div>
      <div class="gallery" tabindex="0" aria-label="${esc(t("home.gallery"))}">
        ${g.map((p, i) => `<figure class="gallery__item ${i % 3 === 0 ? "is-tall" : ""}"><img src="${p.src}" alt="${esc(L(p))}" loading="lazy" decoding="async"><figcaption>${esc(L(p))}</figcaption></figure>`).join("")}
      </div>
      <div class="wrap"><p class="note">${icon("info")}${esc(t("home.gallery.note"))}</p></div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="cta-band reveal">
          <div>
            <h2 class="h2">${esc(t("home.orgs.t"))}</h2>
            <p>${esc(t("home.orgs.d"))}</p>
          </div>
          <a class="btn btn--dark btn--lg" href="#/share">${icon("plus")}${esc(t("share.btn"))}</a>
        </div>
        <p class="closing reveal">${esc(t("home.final"))}</p>
      </div>
    </section>`;
  };

  /* ---------- explore */
  const filters = { q: "", cat: "", district: "", format: "", cost: "" };

  function applyFilters(list, f) {
    const q = norm(f.q).trim();
    return list.filter((o) => {
      if (f.cat && o.cat !== f.cat) return false;
      if (f.format && o.format !== f.format) return false;
      if (f.cost === "free" && o.cost !== "free") return false;
      if (f.district && o.district !== f.district && o.format === "local") return false;
      if (q) {
        const hay = norm([o.title.ro, o.title.en, o.desc.ro, o.desc.en, o.locality, o.venue.ro, o.district && district(o.district).name, cat(o.cat).ro, cat(o.cat).en, o.format].join(" "));
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }

  views.explore = function (params) {
    Object.keys(filters).forEach((k) => (filters[k] = params.get(k) || ""));
    return `
    <section class="page-head">
      <div class="wrap">
        <h1 class="h1">${esc(t("explore.title"))}</h1>
        <p class="lead lead--dark">${esc(t("explore.sub"))}</p>
      </div>
    </section>
    <div class="toolbar">
      <div class="wrap">
        <label class="search">
          ${icon("search")}
          <input type="search" id="f-q" value="${esc(filters.q)}" placeholder="${esc(t("f.search"))}" aria-label="${esc(t("f.search"))}" autocomplete="off">
        </label>
        <div class="chips-scroll" role="group" aria-label="${esc(t("f.category"))}">
          <button class="pill ${filters.cat ? "" : "is-on"}" data-cat="">${esc(t("f.all"))}</button>
          ${CATS.map((c) => `<button class="pill pill--${c.color} ${filters.cat === c.id ? "is-on" : ""}" data-cat="${c.id}" aria-pressed="${filters.cat === c.id}">${icon(c.icon)}${esc(L(c.short))}</button>`).join("")}
        </div>
        <div class="selects">
          <label class="select"><span class="sr-only">${esc(t("f.region"))}</span>${icon("pin")}<select id="f-district">${districtOptions(filters.district, true, t("f.allRegions"))}</select></label>
          <label class="select"><span class="sr-only">${esc(t("f.format"))}</span>${icon("globe")}<select id="f-format">
            <option value="">${esc(t("f.format.all"))}</option>
            ${["local", "online", "international"].map((f) => `<option value="${f}" ${filters.format === f ? "selected" : ""}>${esc(t("format." + f))}</option>`).join("")}
          </select></label>
          <label class="select"><span class="sr-only">${esc(t("f.cost"))}</span>${icon("tag")}<select id="f-cost">
            <option value="">${esc(t("f.cost.all"))}</option>
            <option value="free" ${filters.cost === "free" ? "selected" : ""}>${esc(t("f.cost.free"))}</option>
          </select></label>
          <button class="btn btn--ghost btn--sm" id="f-reset">${icon("x")}${esc(t("f.reset"))}</button>
        </div>
      </div>
    </div>
    <section class="section section--tight">
      <div class="wrap">
        <p class="count" id="f-count" aria-live="polite"></p>
        <div class="grid" id="results"></div>
      </div>
    </section>`;
  };

  function renderResults() {
    const list = applyFilters(OPPS, filters);
    // local first, then online, then international; demo listings last within each
    const order = { local: 0, online: 1, international: 2 };
    list.sort((a, b) => (a.source === "demo") - (b.source === "demo") || order[a.format] - order[b.format]);
    $("#f-count").textContent = list.length === 1 ? t("f.result") : t("f.results", { n: list.length });
    $("#results").innerHTML = list.length ? list.map((o) => card(o)).join("") : emptyState(t("f.none.t"), t("f.none.d"));
    $$(".pill[data-cat]").forEach((b) => { const on = b.dataset.cat === filters.cat; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
    history.replaceState(null, "", "#/explore" + (qs ? "?" + qs : ""));
    observeReveals();
  }

  function emptyState(title, text) {
    return `<div class="empty"><span class="empty__icon">${icon("search")}</span><h3>${esc(title)}</h3><p>${esc(text)}</p>
      <div class="empty__actions"><a class="btn btn--soft" href="#/explore?format=online">${icon("monitor")}${esc(t("format.online"))}</a><a class="btn btn--soft" href="#/share">${icon("plus")}${esc(t("share.btn"))}</a></div></div>`;
  }

  function bindExplore() {
    const q = $("#f-q");
    q.addEventListener("input", () => { filters.q = q.value; renderResults(); });
    $$(".pill[data-cat]").forEach((b) => b.addEventListener("click", () => { filters.cat = b.dataset.cat; renderResults(); }));
    $("#f-district").addEventListener("change", (e) => { filters.district = e.target.value; renderResults(); });
    $("#f-format").addEventListener("change", (e) => { filters.format = e.target.value; renderResults(); });
    $("#f-cost").addEventListener("change", (e) => { filters.cost = e.target.value; renderResults(); });
    $("#f-reset").addEventListener("click", () => {
      Object.keys(filters).forEach((k) => (filters[k] = ""));
      q.value = ""; $("#f-district").value = ""; $("#f-format").value = ""; $("#f-cost").value = "";
      renderResults();
    });
    renderResults();
  }

  /* ---------- regions */
  const region = store.get("opp.region", { district: "", locality: "", dist: "50" });

  views.regions = function () {
    const d = region.district ? district(region.district) : null;
    return `
    <section class="page-head page-head--lavender">
      <div class="wrap">
        <h1 class="h1">${esc(t("regions.title"))}</h1>
        <p class="lead lead--dark">${esc(t("regions.sub"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="wrap">
        <div class="finder reveal">
          <label class="field">
            <span class="field__label">${esc(t("regions.step1"))}</span>
            <span class="select select--lg">${icon("pin")}<select id="r-district">${districtOptions(region.district, false)}</select></span>
          </label>
          <label class="field">
            <span class="field__label">${esc(t("regions.step2"))}</span>
            <span class="select select--lg">${icon("building")}<select id="r-locality" ${d ? "" : "disabled"}>
              <option value="">${esc(t("regions.locality.any"))}</option>
              ${d ? d.loc.map((l) => `<option ${l === region.locality ? "selected" : ""}>${esc(l)}</option>`).join("") : ""}
            </select></span>
          </label>
          <div class="field">
            <span class="field__label" id="r-dist-label">${esc(t("regions.step3"))}</span>
            <div class="seg" role="radiogroup" aria-labelledby="r-dist-label">
              ${["10", "25", "50", "100", "any"].map((v) => `<button role="radio" class="seg__btn ${region.dist === v ? "is-on" : ""}" aria-checked="${region.dist === v}" data-dist="${v}">${v === "any" ? esc(t("regions.distance.any")) : v + " km"}</button>`).join("")}
            </div>
          </div>
          <div class="finder__geo">
            <button class="btn btn--glass-dark" id="r-geo">${icon("nav")}${esc(t("regions.useLocation"))}</button>
            <span class="muted" id="r-geo-status" aria-live="polite"></span>
          </div>
        </div>
        <div id="r-results"></div>
      </div>
    </section>
    <section class="section section--tint">
      <div class="wrap">
        ${sectionHead(t("regions.browse"))}
        <div class="zones">
          ${window.ZONES.map((z) => `
          <div class="zone reveal">
            <h3 class="zone__title">${esc(L(z))}</h3>
            <div class="zone__list">
              ${DISTRICTS.filter((x) => x.zone === z.id).map((x) => {
                const n = OPPS.filter((o) => o.district === x.id).length;
                return `<button class="dchip ${n ? "has" : ""} ${x.id === region.district ? "is-on" : ""}" data-pick="${x.id}"><span>${esc(x.name)}</span><small>${n ? (n === 1 ? t("regions.count1") : t("regions.countN", { n })) : t("regions.count0")}</small></button>`;
              }).join("")}
            </div>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
  };

  function renderRegionResults() {
    store.set("opp.region", region);
    const box = $("#r-results");
    const anywhere = OPPS.filter((o) => o.format !== "local");
    const anyHtml = `
      <div class="area area--world reveal">
        <div class="area__head"><span class="area__icon">${icon("globe")}</span><div><h3 class="h3">${esc(t("regions.anywhere"))}</h3><p class="muted">${esc(t("regions.anywhere.sub"))}</p></div></div>
        <div class="grid">${anywhere.map((o) => card(o)).join("")}</div>
      </div>`;
    if (!region.district) {
      box.innerHTML = `<div class="hint reveal">${icon("pin")}<p>${esc(t("regions.choose"))}</p></div>` + anyHtml;
      observeReveals();
      return;
    }
    const d = district(region.district);
    const local = OPPS.filter((o) => o.district === d.id);
    const max = region.dist === "any" ? Infinity : Number(region.dist);
    const near = OPPS.filter((o) => o.format === "local" && o.district && o.district !== d.id)
      .map((o) => ({ o, k: km(d.c, district(o.district).c) }))
      .filter((x) => x.k <= max)
      .sort((a, b) => a.k - b.k);
    const place = region.locality || d.name;

    box.innerHTML = `
      <h2 class="h2 area-title reveal">${icon("sparkle")}${esc(t("regions.inYourArea"))} <span class="muted">· ${esc(place)}</span></h2>
      <div class="area area--home reveal">
        <div class="area__head"><span class="area__icon">${icon("pin")}</span><h3 class="h3">${esc(t("regions.inDistrict", { d: d.name }))}</h3></div>
        ${local.length ? `<div class="grid">${local.map((o) => card(o)).join("")}</div>` : `<div class="hint">${icon("plus")}<p>${esc(t("regions.empty"))} <a href="#/share">${esc(t("share.btn"))}</a></p></div>`}
      </div>
      <div class="area area--near reveal">
        <div class="area__head"><span class="area__icon">${icon("nav")}</span><h3 class="h3">${esc(region.dist === "any" ? t("regions.nearbyAny") : t("regions.nearby", { n: region.dist }))}</h3></div>
        ${near.length ? `<div class="grid">${near.map((x) => card(x.o, { dist: x.k })).join("")}</div>` : `<div class="hint">${icon("info")}<p>${esc(t("f.none.d"))}</p></div>`}
      </div>
      ${anyHtml}`;
    observeReveals();
  }

  function setRegionDistrict(id, keepLocality) {
    region.district = id;
    if (!keepLocality) region.locality = "";
    const d = district(id);
    const sel = $("#r-district"); if (sel) sel.value = id;
    const ls = $("#r-locality");
    if (ls) {
      ls.disabled = !d;
      ls.innerHTML = `<option value="">${esc(t("regions.locality.any"))}</option>` + (d ? d.loc.map((l) => `<option ${l === region.locality ? "selected" : ""}>${esc(l)}</option>`).join("") : "");
    }
    $$(".dchip").forEach((b) => b.classList.toggle("is-on", b.dataset.pick === id));
    renderRegionResults();
  }

  function locate() {
    const status = $("#r-geo-status");
    if (!("geolocation" in navigator)) { status.textContent = t("regions.locError"); return; }
    status.textContent = t("regions.locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = nearestDistrict(pos.coords.latitude, pos.coords.longitude);
        status.textContent = t("regions.locFound", { d: d.name });
        setRegionDistrict(d.id);
        $("#r-results").scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
      },
      () => { status.textContent = t("regions.locError"); $("#r-district").focus(); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }

  function bindRegions(params) {
    $("#r-district").addEventListener("change", (e) => setRegionDistrict(e.target.value));
    $("#r-locality").addEventListener("change", (e) => { region.locality = e.target.value; renderRegionResults(); });
    $$(".seg__btn").forEach((b) => b.addEventListener("click", () => {
      region.dist = b.dataset.dist;
      $$(".seg__btn").forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", on); });
      renderRegionResults();
    }));
    $$(".dchip").forEach((b) => b.addEventListener("click", () => {
      setRegionDistrict(b.dataset.pick);
      $("#r-district").scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "center" });
    }));
    $("#r-geo").addEventListener("click", locate);
    renderRegionResults();
    if (params.get("near") === "1") { history.replaceState(null, "", "#/regions"); locate(); }
  }

  /* ---------- events calendar */
  const now = new Date();
  const cal = { y: now.getFullYear(), m: now.getMonth() };

  views.events = function () {
    const tbc = OPPS.filter((o) => !o.date && !o.month);
    return `
    <section class="page-head page-head--lilac">
      <div class="wrap">
        <h1 class="h1">${esc(t("events.title"))}</h1>
        <p class="lead lead--dark">${esc(t("events.sub"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="wrap cal-wrap">
        <div class="cal reveal">
          <div class="cal__head">
            <button class="icon-btn" id="c-prev" aria-label="${esc(t("events.prev"))}">${icon("chevL")}</button>
            <h2 class="h3" id="c-title" aria-live="polite"></h2>
            <button class="icon-btn" id="c-next" aria-label="${esc(t("events.next"))}">${icon("chevR")}</button>
          </div>
          <div class="cal__dow">${t("days").map((d) => `<span>${d}</span>`).join("")}</div>
          <div class="cal__grid" id="c-grid"></div>
        </div>
        <div class="cal-side">
          <h3 class="h3">${esc(t("events.inMonth"))}</h3>
          <div class="list" id="c-list"></div>
        </div>
      </div>
    </section>
    <section class="section section--tint">
      <div class="wrap">
        ${sectionHead(t("events.tbc"), t("events.tbc.sub"))}
        <div class="list list--cols">${tbc.map(miniCard).join("")}</div>
      </div>
    </section>`;
  };

  function renderCal() {
    const { y, m } = cal;
    const months = t("months");
    $("#c-title").textContent = `${months[m][0].toUpperCase() + months[m].slice(1)} ${y}`;
    const first = new Date(y, m, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    const key = `${y}-${String(m + 1).padStart(2, "0")}`;
    const dated = OPPS.filter((o) => o.date && o.date.startsWith(key));
    const monthOnly = OPPS.filter((o) => !o.date && o.month === key);
    let h = "";
    for (let i = 0; i < offset; i++) h += `<span class="cal__cell is-empty"></span>`;
    for (let d = 1; d <= days; d++) {
      const iso = `${key}-${String(d).padStart(2, "0")}`;
      const evs = dated.filter((o) => o.date === iso);
      const isToday = y === now.getFullYear() && m === now.getMonth() && d === now.getDate();
      h += `<div class="cal__cell ${evs.length ? "has" : ""} ${isToday ? "is-today" : ""}">
        <span class="cal__num">${d}</span>
        ${evs.map((o) => `<a class="cal__ev cal__ev--${cat(o.cat).color}" href="#/o/${o.id}" title="${esc(L(o.title))}">${esc(L(o.title))}</a>`).join("")}
      </div>`;
    }
    $("#c-grid").innerHTML = h;
    const list = dated.concat(monthOnly);
    $("#c-list").innerHTML = list.length ? list.map(miniCard).join("") : `<div class="hint">${icon("calendar")}<p>${esc(t("events.none"))}</p></div>`;
    observeReveals();
  }

  function bindEvents() {
    $("#c-prev").addEventListener("click", () => { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y--; } renderCal(); });
    $("#c-next").addEventListener("click", () => { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++; } renderCal(); });
    renderCal();
  }

  /* ---------- detail */
  views.detail = function (params, id) {
    const o = byId(id);
    if (!o) return `<section class="section"><div class="wrap">${emptyState(t("detail.notFound"), "")}</div></section>`;
    const c = cat(o.cat);
    const cover = (k, ic) => {
      const v = o.covers[k];
      const cls = v === true ? "yes" : v === false ? "no" : "tbc";
      const label = v === true ? t("detail.yes") : v === false ? t("detail.no") : t("detail.tbc");
      return `<div class="cover cover--${cls}"><span class="cover__icon">${icon(ic)}</span><span><strong>${esc(t("detail." + k))}</strong><small>${esc(label)}</small></span></div>`;
    };
    const related = OPPS.filter((x) => x.id !== o.id && (x.cat === o.cat || x.district === o.district)).slice(0, 3);
    return `
    <section class="detail-hero detail-hero--${c.color}">
      <div class="wrap">
        <a class="back" href="#/explore" data-back>${icon("arrowL")}${esc(t("detail.back"))}</a>
        <div class="card__chips">${badgeRow(o)}</div>
        <h1 class="h1">${esc(L(o.title))}</h1>
        <p class="lead lead--dark">${esc(L(o.desc))}</p>
        <div class="detail-hero__meta">
          <span>${icon("pin")}${esc(fmtPlace(o))}${o.district ? ", " + esc(district(o.district).name) : ""}</span>
          <span>${icon("calendar")}${esc(fmtWhen(o))}</span>
          <span>${icon("users")}${esc(t("card.agesv", { a: o.ages[0], b: o.ages[1] }))}</span>
        </div>
      </div>
    </section>
    <section class="section section--tight">
      <div class="wrap detail">
        <div class="detail__main">
          ${o.source === "demo" ? `<div class="notice notice--demo">${icon("info")}<p>${esc(t("detail.demoNote"))}</p></div>` : ""}
          ${(!o.date || !o.contact) && o.source !== "demo" ? `<div class="notice">${icon("info")}<p>${esc(t("detail.tbcNote"))}</p></div>` : ""}
          <div class="block reveal"><h2 class="h3">${esc(t("detail.about"))}</h2><p>${esc(L(o.full))}</p></div>
          <div class="block reveal"><h2 class="h3">${esc(t("detail.learn"))}</h2>
            <ul class="ticks">${L(o.learn).map((x) => `<li>${icon("check")}<span>${esc(x)}</span></li>`).join("")}</ul></div>
          <div class="block reveal"><h2 class="h3">${esc(t("detail.who"))}</h2>
            <p>${esc(t("detail.who.text", { a: o.ages[0], b: o.ages[1] }))} ${esc(t("detail.who.everywhere"))}</p></div>
          <div class="block reveal"><h2 class="h3">${esc(t("detail.covered"))}</h2>
            <div class="covers">${cover("accommodation", "bed")}${cover("transport", "bus")}${cover("meals", "meal")}</div></div>
        </div>
        <aside class="detail__side">
          <div class="side-card">
            <dl class="facts facts--side">
              <div><dt>${icon("pin")}<span>${esc(t("detail.venue"))}</span></dt><dd>${esc(fmtPlace(o))}</dd></div>
              <div><dt>${icon("globe")}<span>${esc(t("card.region"))}</span></dt><dd>${esc(fmtRegion(o))}</dd></div>
              <div><dt>${icon("calendar")}<span>${esc(t("card.when"))}</span></dt><dd class="${o.date ? "" : "tbc"}">${esc(fmtWhen(o))}</dd></div>
              <div><dt>${icon("hourglass")}<span>${esc(t("card.deadline"))}</span></dt><dd class="${o.deadline ? "" : "tbc"}">${esc(fmtDeadline(o))}</dd></div>
              <div><dt>${icon("tag")}<span>${esc(t("card.cost"))}</span></dt><dd class="${o.cost ? (o.cost === "free" ? "free" : "") : "tbc"}">${esc(fmtCost(o))}</dd></div>
              <div><dt>${icon("building")}<span>${esc(t("card.organizer"))}</span></dt><dd class="${o.organizer ? "" : "tbc"}">${esc(o.organizer || t("card.tbc"))}</dd></div>
              <div><dt>${icon("user")}<span>${esc(t("detail.contactPerson"))}</span></dt><dd class="${o.contact ? "" : "tbc"}">${esc(o.contact || t("card.tbc"))}</dd></div>
            </dl>
            ${actionFor(o, true)}
            ${(window.OPP_GEO || {})[o.id] ? `<a class="btn btn--soft btn--block" href="#/map?id=${esc(o.id)}">${icon("pin")}${esc(t("map.seeOnMap"))}</a>` : ""}
            <button class="btn btn--ghost btn--block" id="d-share">${icon("share")}${esc(t("detail.share"))}</button>
          </div>
        </aside>
      </div>
    </section>
    ${related.length ? `<section class="section section--tint"><div class="wrap">${sectionHead(t("detail.related"), "", "#/explore")}<div class="grid">${related.map((x) => card(x)).join("")}</div></div></section>` : ""}`;
  };

  function bindDetail() {
    const back = $("[data-back]");
    if (back && history.length > 1 && lastRoute) back.addEventListener("click", (e) => { e.preventDefault(); history.back(); });
    const sh = $("#d-share");
    if (sh) sh.addEventListener("click", async () => {
      const url = location.href;
      try {
        if (navigator.share) await navigator.share({ title: document.title, url });
        else { await navigator.clipboard.writeText(url); toast(t("detail.copied")); }
      } catch (e) { /* user cancelled */ }
    });
  }

  /* ---------- about */
  views.about = function () {
    return `
    <section class="page-head page-head--plum">
      <div class="wrap narrow">
        <h1 class="h1">${esc(t("about.title"))}</h1>
        <p class="lead lead--dark">${esc(t("about.lead"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="wrap about">
        <div class="prose reveal">
          <p>${esc(t("about.p1"))}</p>
          <p>${esc(t("about.p2"))}</p>
          <p>${esc(t("about.p3"))}</p>
        </div>
        <figure class="about__photo reveal"><img src="assets/img/youth-team.jpg" alt="${esc(L(window.GALLERY[0]))}" loading="lazy"></figure>
      </div>
    </section>
    <section class="section section--tint">
      <div class="wrap">
        ${sectionHead(t("about.values"))}
        <div class="pillars">
          ${[["v1", "heart", "plum"], ["v2", "check", "violet"], ["v3", "star", "lilac"], ["v4", "users", "lavender"]].map(([k, ic, col]) => `
          <div class="pillar pillar--${col} reveal"><span class="pillar__icon">${icon(ic)}</span><h3>${esc(t("about." + k + ".t"))}</h3><p>${esc(t("about." + k + ".d"))}</p></div>`).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap narrow">
        ${sectionHead(t("about.audience"))}
        <ul class="ticks ticks--lg reveal">${["a1", "a2", "a3", "a4"].map((k) => `<li>${icon("check")}<span>${esc(t("about." + k))}</span></li>`).join("")}</ul>
        <p class="closing reveal">${esc(t("home.final"))}</p>
      </div>
    </section>`;
  };

  /* ---------- forms */
  function field(name, label, type = "text", opts = {}) {
    const req = opts.required ? "required" : "";
    const input = type === "textarea"
      ? `<textarea id="${name}" name="${name}" rows="${opts.rows || 5}" ${req}>${esc(opts.value || "")}</textarea>`
      : type === "select"
        ? `<span class="select select--lg"><select id="${name}" name="${name}" ${req}>${opts.options}</select></span>`
        : `<input id="${name}" name="${name}" type="${type}" value="${esc(opts.value || "")}" ${req} ${opts.attrs || ""}>`;
    return `<div class="field ${opts.wide ? "field--wide" : ""}"><label class="field__label" for="${name}">${esc(label)}${opts.required ? ' <span aria-hidden="true">*</span>' : ""}</label>${input}<span class="field__err" id="${name}-err" aria-live="polite"></span></div>`;
  }

  function validateField(el) {
    let msg = "";
    if (el.type === "checkbox") { if (el.required && !el.checked) msg = t("v.consent"); }
    else if (el.required && !el.value.trim()) msg = t("v.required");
    else if (el.type === "email" && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = t("v.email");
    const err = $("#" + el.id + "-err");
    if (err) err.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) el.setAttribute("aria-describedby", el.id + "-err"); else el.removeAttribute("aria-describedby");
    return !msg;
  }

  function bindForm(form, key, okMsg) {
    $$("input,textarea,select", form).forEach((el) => {
      el.addEventListener("blur", () => { if (el.dataset.touched || el.value) { el.dataset.touched = 1; validateField(el); } });
      el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validateField(el); });
      el.addEventListener("change", () => { if (el.type === "checkbox") validateField(el); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const els = $$("input,textarea,select", form);
      const ok = els.map(validateField).every(Boolean);
      if (!ok) { const bad = els.find((x) => x.getAttribute("aria-invalid") === "true"); if (bad) bad.focus(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      data.at = new Date().toISOString();
      const all = store.get(key, []); all.push(data); store.set(key, all);
      form.outerHTML = `<div class="success reveal in" role="status"><span class="success__icon">${icon("check")}</span><p>${esc(okMsg)}</p><a class="btn btn--soft" href="#/explore">${esc(t("hero.cta.explore"))}${icon("arrowR")}</a></div>`;
    });
  }

  function socialLinks(cls = "") {
    const s = window.SITE.social;
    return `<div class="social ${cls}">${["instagram", "facebook", "tiktok", "youtube"].map((k) => `<a href="${esc(s[k])}" aria-label="${k[0].toUpperCase() + k.slice(1)}" ${s[k] !== "#" ? 'target="_blank" rel="noopener"' : ""}>${icon(k)}</a>`).join("")}</div>`;
  }

  views.contact = function (params) {
    const about = params.get("about");
    const o = about ? byId(about) : null;
    const subject = o ? L(o.title) : params.get("s") || "";
    return `
    <section class="page-head">
      <div class="wrap">
        <h1 class="h1">${esc(t("contact.title"))}</h1>
        <p class="lead lead--dark">${esc(t("contact.sub"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="wrap form-layout">
        <form class="form reveal" novalidate id="contact-form">
          <div class="form__grid">
            ${field("c-name", t("contact.name"), "text", { required: true, attrs: 'autocomplete="name"' })}
            ${field("c-email", t("contact.email"), "email", { required: true, attrs: 'autocomplete="email"' })}
            ${field("c-subject", t("contact.subject"), "text", { wide: true, value: subject })}
            ${field("c-message", t("contact.message"), "textarea", { required: true, wide: true })}
          </div>
          <button class="btn btn--primary btn--lg" type="submit">${icon("send")}${esc(t("contact.send"))}</button>
          <p class="note">${icon("info")}${esc(t("contact.demoNote"))}</p>
        </form>
        <aside class="side-card side-card--soft reveal">
          <h2 class="h3">${esc(t("contact.side.t"))}</h2>
          ${window.SITE.email ? `<p><a href="mailto:${esc(window.SITE.email)}">${icon("mail")}${esc(window.SITE.email)}</a></p>` : ""}
          <p>${esc(t("contact.side.org"))}</p>
          <a class="btn btn--dark" href="#/share">${icon("plus")}${esc(t("share.btn"))}</a>
          <h3 class="h4">${esc(t("contact.side.follow"))}</h3>
          ${socialLinks("social--dark")}
        </aside>
      </div>
    </section>`;
  };

  views.share = function () {
    const catOpts = CATS.map((c) => `<option value="${c.id}">${esc(L(c))}</option>`).join("");
    const distOpts = `<option value="">—</option><option value="online">${esc(t("shareForm.online"))}</option>` + districtOptions("", true, "").replace('<option value=""></option>', "");
    return `
    <section class="page-head page-head--violet">
      <div class="wrap">
        <h1 class="h1">${esc(t("shareForm.title"))}</h1>
        <p class="lead lead--dark">${esc(t("shareForm.sub"))}</p>
      </div>
    </section>
    <section class="section section--tight">
      <div class="wrap narrow">
        <form class="form reveal" novalidate id="share-form">
          <div class="form__grid">
            ${field("s-org", t("shareForm.org"), "text", { required: true, attrs: 'autocomplete="organization"' })}
            ${field("s-person", t("shareForm.person"), "text", { required: true, attrs: 'autocomplete="name"' })}
            ${field("s-email", t("shareForm.email"), "email", { required: true, attrs: 'autocomplete="email"' })}
            ${field("s-phone", t("shareForm.phone"), "tel", { attrs: 'autocomplete="tel"' })}
            ${field("s-title", t("shareForm.title2"), "text", { required: true, wide: true })}
            ${field("s-desc", t("shareForm.desc"), "textarea", { required: true, wide: true, rows: 4 })}
            ${field("s-cat", t("shareForm.cat"), "select", { required: true, options: `<option value="">—</option>` + catOpts })}
            ${field("s-district", t("shareForm.district"), "select", { required: true, options: distOpts })}
            ${field("s-locality", t("shareForm.locality"), "text")}
            ${field("s-cost", t("shareForm.cost"), "select", { options: `<option value="free">${esc(t("card.free"))}</option><option value="paid">${esc(t("card.paid"))}</option><option value="">${esc(t("card.tbc"))}</option>` })}
            ${field("s-date", t("shareForm.date"), "date")}
            ${field("s-deadline", t("shareForm.deadline"), "date")}
            ${field("s-link", t("shareForm.link"), "url", { wide: true, attrs: 'placeholder="https://"' })}
          </div>
          <div class="field field--check">
            <label><input type="checkbox" id="s-consent" name="consent" required><span>${esc(t("shareForm.consent"))}</span></label>
            <span class="field__err" id="s-consent-err" aria-live="polite"></span>
          </div>
          <button class="btn btn--primary btn--lg" type="submit">${icon("send")}${esc(t("shareForm.send"))}</button>
          <p class="note">${icon("info")}${esc(t("contact.demoNote"))}</p>
        </form>
      </div>
    </section>`;
  };

  /* ------------------------------------------------------------------ interactive map */
  const MD_BOUNDS = [[45.35, 26.45], [48.6, 30.3]];
  const mapState = { q: "", center: null, centerLabel: "", radius: "all", tab: "date", date: "all", cats: [], free: false, selected: null, pinMode: false, draft: null, panelTab: "details" };
  let LM = null;          // Leaflet map instance
  const wide = () => window.matchMedia("(min-width: 900px)").matches;
  const fitOpts = () => ({ paddingTopLeft: [20, 20], paddingBottomRight: [wide() ? 400 : 20, 20] });
  let markerLayer = null, radiusLayer = null, draftMarker = null;
  const markers = {};

  const isoMonth = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const communityPins = () => store.get("opp.pins", []);
  const interests = () => store.get("opp.interest", []);

  function mapItems() {
    const geo = window.OPP_GEO || {};
    const seen = {};
    const items = OPPS.filter((o) => o.format === "local" && geo[o.id]).map((o) => {
      // spread opportunities that share a locality so every pin can be tapped
      const k = geo[o.id].join(",");
      const n = (seen[k] = (seen[k] || 0) + 1) - 1;
      // pins sharing a locality fan out sideways on screen, so each stays tappable at any zoom
      return { o, at: geo[o.id], shift: n ? (n % 2 ? 1 : -1) * Math.ceil(n / 2) * 30 : 0 };
    });
    communityPins().forEach((p) => items.push({ o: p, at: p.at, shift: 0 }));
    return items;
  }

  function inMoldova(lat, lon) {
    const ring = (window.MOLDOVA_OUTLINE || [])[0];
    if (!ring) return true;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [yi, xi] = ring[i], [yj, xj] = ring[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  function matchDate(o) {
    const f = mapState.date;
    if (f === "all") return true;
    const key = o.date ? o.date.slice(0, 7) : o.month;
    if (f === "tbc") return !key;
    if (!key) return false;
    const now = new Date();
    if (f === "month") return key === isoMonth(now);
    const end = new Date(now.getFullYear(), now.getMonth() + 3, 1);
    return key >= isoMonth(now) && key < isoMonth(end);
  }

  function filteredMapItems() {
    const q = norm(mapState.q).trim();
    return mapItems().filter(({ o, at }) => {
      if (mapState.cats.length && !mapState.cats.includes(o.cat)) return false;
      if (mapState.free && o.cost !== "free") return false;
      if (!matchDate(o)) return false;
      if (mapState.center && mapState.radius !== "all" && km(mapState.center, at) > Number(mapState.radius)) return false;
      if (q) {
        const hay = norm([L(o.title), o.title.ro, o.title.en, L(o.desc), o.locality, o.district && district(o.district) ? district(o.district).name : ""].join(" "));
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }

  function placeLabel(o) {
    if (o.source === "community") return [o.locality, o.district && district(o.district) ? district(o.district).name : ""].filter(Boolean).join(", ");
    return `${L(o.venue)}${o.district ? ", " + district(o.district).name : ""}`;
  }

  views.map = function (params) {
    const sel = params.get("id");
    if (sel) mapState.selected = sel;
    const localityNames = Array.from(new Set(DISTRICTS.flatMap((d) => [d.name].concat(d.loc)))).sort((a, b) => a.localeCompare(b, "ro"));
    const offMap = OPPS.filter((o) => o.format !== "local").length;
    const tabs = [["date", "calendar", t("map.tab.date")], ["type", "filter", t("map.tab.type")], ["more", "tag", t("map.tab.more")]];
    return `
    <div class="mapx">
      <aside class="mx-panel" aria-label="${esc(t("map.filters"))}">
        <div class="mx-head">
          <h1 class="h3">${icon("pin")}${esc(t("map.title"))}</h1>
          <p class="muted">${esc(t("map.sub"))}</p>
        </div>

        <section class="mx-box">
          <div class="mx-box__head"><h2>${esc(t("map.location"))}</h2><button type="button" class="mx-link" id="mx-reset">${esc(t("map.resetAll"))}</button></div>
          <form class="mx-loc" id="mx-loc-form">
            <label class="sr-only" for="mx-loc">${esc(t("map.locPh"))}</label>
            ${icon("search")}
            <input id="mx-loc" list="mx-places" placeholder="${esc(t("map.locPh"))}" value="${esc(mapState.centerLabel)}" autocomplete="off">
            <button class="mx-set" type="submit">${esc(t("map.set"))}</button>
          </form>
          <datalist id="mx-places">${localityNames.map((n) => `<option value="${esc(n)}">`).join("")}</datalist>
          <button type="button" class="mx-link mx-link--icon" id="mx-geo">${icon("nav")}${esc(t("regions.useLocation"))}</button>
          <p class="mx-status" id="mx-status" aria-live="polite"></p>
          <p class="mx-label" id="mx-radius-label">${esc(t("map.radius"))}</p>
          <div class="mx-seg" role="radiogroup" aria-labelledby="mx-radius-label">
            ${["10", "25", "50", "100", "all"].map((v) => `<button type="button" role="radio" data-radius="${v}" class="${mapState.radius === v ? "is-on" : ""}" aria-checked="${mapState.radius === v}">${v === "all" ? esc(t("map.all")) : v + " km"}</button>`).join("")}
          </div>
        </section>

        <section class="mx-box">
          <div class="mx-box__head"><h2>${esc(t("map.filters"))}</h2><span class="mx-hint">${esc(t("map.combine"))}</span></div>
          <div class="mx-tabs" role="tablist">
            ${tabs.map(([k, ic, lab]) => `<button type="button" role="tab" id="mx-tab-${k}" aria-controls="mx-pane-${k}" aria-selected="${mapState.tab === k}" class="${mapState.tab === k ? "is-on" : ""}" data-tab="${k}">${icon(ic)}${esc(lab)}</button>`).join("")}
          </div>
          <div class="mx-pane" role="tabpanel" id="mx-pane-date" aria-labelledby="mx-tab-date" ${mapState.tab === "date" ? "" : "hidden"}>
            <div class="mx-grid2">
              ${[["all", t("map.date.all")], ["month", t("map.date.month")], ["next3", t("map.date.next3")], ["tbc", t("card.tbc")]].map(([v, lab]) => `<button type="button" class="mx-opt ${mapState.date === v ? "is-on" : ""}" data-date="${v}" aria-pressed="${mapState.date === v}">${esc(lab)}</button>`).join("")}
            </div>
          </div>
          <div class="mx-pane" role="tabpanel" id="mx-pane-type" aria-labelledby="mx-tab-type" ${mapState.tab === "type" ? "" : "hidden"}>
            <div class="mx-cats">
              ${CATS.map((c) => `<button type="button" class="mx-cat ${mapState.cats.includes(c.id) ? "is-on" : ""}" data-cat="${c.id}" aria-pressed="${mapState.cats.includes(c.id)}">${icon(c.icon)}${esc(L(c.short))}</button>`).join("")}
            </div>
          </div>
          <div class="mx-pane" role="tabpanel" id="mx-pane-more" aria-labelledby="mx-tab-more" ${mapState.tab === "more" ? "" : "hidden"}>
            <label class="mx-check"><input type="checkbox" id="mx-free" ${mapState.free ? "checked" : ""}><span>${esc(t("f.cost.free"))}</span></label>
            <label class="sr-only" for="mx-q">${esc(t("f.search"))}</label>
            <div class="mx-loc mx-loc--plain">${icon("search")}<input id="mx-q" type="search" value="${esc(mapState.q)}" placeholder="${esc(t("f.search"))}" autocomplete="off"></div>
          </div>
        </section>

        <p class="mx-count" id="mx-count" aria-live="polite"></p>
        <div class="mx-list" id="mx-list"></div>
        <a class="mx-offmap" href="#/explore?format=online">${icon("monitor")}${esc(t("map.offmap", { n: offMap }))}${icon("chevR")}</a>

        <div class="mx-foot">
          <button type="button" class="btn btn--primary btn--block" id="mx-pin">${icon("plus")}${esc(t("map.pinBtn"))}</button>
        </div>
      </aside>

      <div class="mx-mapwrap">
        <div id="mx-map" class="mx-map" role="region" aria-label="${esc(t("map.title"))}"></div>
        <div class="mx-banner" id="mx-banner" hidden>${icon("pin")}<span>${esc(t("map.pinHint"))}</span><button type="button" class="btn btn--sm btn--ghost" id="mx-pin-cancel">${esc(t("map.cancel"))}</button></div>
        <aside class="mx-detail" id="mx-detail" hidden aria-live="polite"></aside>
      </div>
    </div>`;
  };

  function pinIcon(o, active, shift = 0) {
    const c = cat(o.cat) || CATS[0];
    const cls = `mpin mpin--${c.color}${active ? " is-active" : ""}${o.source === "community" ? " is-community" : ""}`;
    return window.L.divIcon({ className: "mpin-wrap", html: `<span class="${cls}"><span class="mpin__in">${icon(c.icon)}</span></span>`, iconSize: [38, 46], iconAnchor: [19 - shift, 44] });
  }

  function renderMapResults(fit) {
    const list = filteredMapItems();
    $("#mx-count").textContent = list.length === 1 ? t("map.found1") : t("map.foundN", { n: list.length });
    $("#mx-list").innerHTML = list.length ? list.map(({ o }) => {
      const c = cat(o.cat) || CATS[0];
      return `<button type="button" class="mx-row ${mapState.selected === o.id ? "is-on" : ""}" data-id="${esc(o.id)}">
        <span class="mx-row__icon mx-row__icon--${c.color}">${icon(c.icon)}</span>
        <span class="mx-row__text"><strong>${esc(L(o.title))}</strong><span>${icon("calendar")}${esc(fmtWhen(o))}</span><span>${icon("pin")}${esc(placeLabel(o))}</span></span>
      </button>`;
    }).join("") : `<div class="hint">${icon("info")}<p>${esc(t("f.none.d"))}</p></div>`;
    $$(".mx-row").forEach((b) => b.addEventListener("click", () => selectItem(b.dataset.id, true)));

    if (!LM) return;
    markerLayer.clearLayers();
    Object.keys(markers).forEach((k) => delete markers[k]);
    list.forEach(({ o, at, shift }) => {
      const m = window.L.marker(at, { icon: pinIcon(o, mapState.selected === o.id, shift), title: L(o.title), riseOnHover: true, keyboard: true });
      m.on("click", () => selectItem(o.id, false));
      m.addTo(markerLayer);
      markers[o.id] = m;
    });
    if (radiusLayer) { radiusLayer.remove(); radiusLayer = null; }
    if (mapState.center) {
      const style = { className: "mx-radius", weight: 1.5, fillOpacity: 0.07, interactive: false };
      radiusLayer = window.L.layerGroup([
        mapState.radius !== "all" ? window.L.circle(mapState.center, Object.assign({ radius: Number(mapState.radius) * 1000 }, style)) : null,
        window.L.circleMarker(mapState.center, { className: "mx-center", radius: 7, weight: 3, fillOpacity: 1, interactive: false })
      ].filter(Boolean)).addTo(LM);
      if (fit) {
        if (mapState.radius !== "all") LM.flyToBounds(radiusLayer.getLayers()[0].getBounds(), Object.assign(fitOpts(), { duration: reduceMotion() ? 0 : 0.6 }));
        else LM.flyTo(mapState.center, 9, { duration: reduceMotion() ? 0 : 0.6 });
      }
    }
  }

  function findItem(id) {
    return mapItems().find((x) => x.o.id === id);
  }

  function selectItem(id, fly) {
    const it = findItem(id);
    if (!it) return;
    mapState.selected = id;
    mapState.panelTab = "details";
    history.replaceState(null, "", "#/map?id=" + encodeURIComponent(id));
    Object.keys(markers).forEach((k) => { const x = findItem(k); markers[k].setIcon(pinIcon(x.o, k === id, x.shift)); });
    $$(".mx-row").forEach((r) => r.classList.toggle("is-on", r.dataset.id === id));
    if (LM) {
      if (fly) {
        // centre the pin in the part of the map the details panel leaves free
        const z = Math.max(LM.getZoom(), 10);
        const off = wide() ? 200 : 0, offY = wide() ? 0 : -LM.getSize().y * 0.22;
        const target = LM.unproject(LM.project(it.at, z).add([off, -offY]), z);
        LM.flyTo(target, z, { duration: reduceMotion() ? 0 : 0.6 });
      } else if (wide()) {
        const pt = LM.latLngToContainerPoint(it.at), limit = LM.getSize().x - 420;
        if (pt.x > limit) LM.panBy([pt.x - limit + 60, 0], { duration: reduceMotion() ? 0 : 0.4 });
      }
    }
    renderDetail();
  }

  function closeDetail() {
    mapState.selected = null;
    history.replaceState(null, "", "#/map");
    const d = $("#mx-detail"); if (d) d.hidden = true;
    Object.keys(markers).forEach((k) => { const x = findItem(k); markers[k].setIcon(pinIcon(x.o, false, x.shift)); });
    $$(".mx-row").forEach((r) => r.classList.remove("is-on"));
  }

  function detailRow(ic, label, value, tbc) {
    return `<div class="mx-drow"><span class="mx-drow__icon">${icon(ic)}</span><div>${label ? `<small>${esc(label)}</small>` : ""}<p class="${tbc ? "tbc" : ""}">${value}</p></div></div>`;
  }

  function renderDetail() {
    const box = $("#mx-detail");
    const it = findItem(mapState.selected);
    if (!box || !it) return;
    const o = it.o;
    const c = cat(o.cat) || CATS[0];
    const isCommunity = o.source === "community";
    const liked = interests().includes(o.id);
    const link = location.href.split("#")[0] + (isCommunity ? "#/map?id=" + encodeURIComponent(o.id) : "#/o/" + encodeURIComponent(o.id));
    const time = o.time || (o.date ? null : null);
    box.hidden = false;
    box.innerHTML = `
      <div class="mx-dhead">
        <span class="mx-dhead__icon mx-row__icon--${c.color}">${icon(c.icon)}</span>
        <div class="mx-dhead__text"><h2>${esc(L(o.title))}</h2><small>${esc(L(c.short))}${o.district && district(o.district) ? " · " + esc(district(o.district).name) : ""}</small></div>
        <button type="button" class="icon-btn icon-btn--sm" id="mx-close" aria-label="${esc(t("nav.close"))}">${icon("x")}</button>
      </div>
      <div class="mx-dtabs" role="tablist">
        <button type="button" role="tab" data-ptab="details" aria-selected="${mapState.panelTab === "details"}" class="${mapState.panelTab === "details" ? "is-on" : ""}">${esc(t("map.details"))}</button>
        <button type="button" role="tab" data-ptab="share" aria-selected="${mapState.panelTab === "share"}" class="${mapState.panelTab === "share" ? "is-on" : ""}">${esc(t("detail.share"))}</button>
      </div>
      <div class="mx-dbody" ${mapState.panelTab === "details" ? "" : "hidden"}>
        ${isCommunity ? `<div class="notice notice--demo">${icon("info")}<p>${esc(t("map.communityNote"))}</p></div>` : ""}
        ${o.source === "demo" ? `<div class="notice notice--demo">${icon("info")}<p>${esc(t("detail.demoNote"))}</p></div>` : ""}
        <p class="mx-desc">${esc(L(o.full || o.desc))}</p>
        ${detailRow("calendar", "", esc(fmtWhen(o)), !o.date && !o.month)}
        ${detailRow("clock", "", esc(time || t("card.tbc")), !time)}
        ${detailRow("pin", "", esc(placeLabel(o)), false)}
        ${detailRow("building", t("map.hosted"), esc(o.organizer || t("card.tbc")), !o.organizer)}
        ${detailRow("tag", t("map.entry"), esc(fmtCost(o) + " · " + t("card.agesv", { a: o.ages[0], b: o.ages[1] })), !o.cost)}
        ${detailRow("mail", t("card.contact"), esc(o.contact || t("card.tbc")), !o.contact)}
        ${isCommunity ? "" : detailRow("arrowR", t("map.more"), `<a href="#/o/${esc(o.id)}">${esc(t("map.fullPage"))}</a>`, false)}
        <div class="mx-engage">
          <small>${esc(t("map.engagement"))}</small>
          <div class="mx-engage__row">
            <button type="button" class="mx-chipbtn ${liked ? "is-on" : ""}" id="mx-like" aria-pressed="${liked}">${icon("heart")}${esc(liked ? t("map.interested") : t("map.interest"))}</button>
            ${isCommunity ? `<button type="button" class="mx-chipbtn" id="mx-delete">${icon("x")}${esc(t("map.deletePin"))}</button>` : ""}
          </div>
          <p class="mx-small">${esc(t("map.interestNote"))}</p>
        </div>
      </div>
      <div class="mx-dbody" ${mapState.panelTab === "share" ? "" : "hidden"}>
        <p class="mx-desc">${esc(t("map.shareText"))}</p>
        <label class="sr-only" for="mx-share-url">URL</label>
        <input class="mx-url" id="mx-share-url" readonly value="${esc(link)}">
        <button type="button" class="btn btn--primary btn--block" id="mx-copy">${icon("share")}${esc(t("map.copy"))}</button>
      </div>`;
    $("#mx-close").addEventListener("click", closeDetail);
    $$("[data-ptab]", box).forEach((b) => b.addEventListener("click", () => { mapState.panelTab = b.dataset.ptab; renderDetail(); }));
    const like = $("#mx-like");
    if (like) like.addEventListener("click", () => {
      const all = interests(); const i = all.indexOf(o.id);
      if (i >= 0) all.splice(i, 1); else all.push(o.id);
      store.set("opp.interest", all); renderDetail();
    });
    const del = $("#mx-delete");
    if (del) del.addEventListener("click", () => {
      store.set("opp.pins", communityPins().filter((p) => p.id !== o.id));
      closeDetail(); renderMapResults(); toast(t("map.deleted"));
    });
    const copy = $("#mx-copy");
    if (copy) copy.addEventListener("click", () => {
      const inp = $("#mx-share-url");
      const done = () => toast(t("detail.copied"));
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value).then(done, () => { inp.select(); });
      else inp.select();
    });
  }

  /* --- pinning an event */
  function startPinMode() {
    mapState.pinMode = true;
    $("#mx-banner").hidden = false;
    $(".mx-mapwrap").classList.add("is-pinning");
    closeDetail();
    if (window.matchMedia("(max-width: 899px)").matches) $(".mx-mapwrap").scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  }
  function stopPinMode() {
    mapState.pinMode = false;
    const b = $("#mx-banner"); if (b) b.hidden = true;
    const w = $(".mx-mapwrap"); if (w) w.classList.remove("is-pinning");
    if (draftMarker) { draftMarker.remove(); draftMarker = null; }
    const d = $("#mx-detail"); if (d && !mapState.selected) d.hidden = true;
  }

  function placeDraft(latlng) {
    if (!inMoldova(latlng.lat, latlng.lng)) { toast(t("map.outside")); return; }
    if (draftMarker) draftMarker.setLatLng(latlng);
    else {
      draftMarker = window.L.marker(latlng, { draggable: true, icon: window.L.divIcon({ className: "mpin-wrap", html: `<span class="mpin mpin--draft"><span class="mpin__in">${icon("plus")}</span></span>`, iconSize: [38, 46], iconAnchor: [19, 44] }) }).addTo(LM);
      draftMarker.on("dragend", () => { const p = draftMarker.getLatLng(); if (!inMoldova(p.lat, p.lng)) toast(t("map.outside")); updateDraftPlace(); });
    }
    $("#mx-banner").hidden = true;
    renderPinForm();
  }

  function updateDraftPlace() {
    const p = draftMarker.getLatLng();
    const d = nearestDistrict(p.lat, p.lng);
    const out = $("#p-district-label");
    if (out) out.textContent = d.name;
    const hid = $("#p-district"); if (hid) hid.value = d.id;
  }

  function renderPinForm() {
    const box = $("#mx-detail");
    const p = draftMarker.getLatLng();
    const d = nearestDistrict(p.lat, p.lng);
    box.hidden = false;
    box.innerHTML = `
      <div class="mx-dhead">
        <span class="mx-dhead__icon mx-row__icon--violet">${icon("plus")}</span>
        <div class="mx-dhead__text"><h2>${esc(t("map.pinTitle"))}</h2><small>${icon("pin")}<span id="p-district-label">${esc(d.name)}</span> · ${esc(t("map.dragHint"))}</small></div>
        <button type="button" class="icon-btn icon-btn--sm" id="p-cancel" aria-label="${esc(t("map.cancel"))}">${icon("x")}</button>
      </div>
      <form class="mx-form" id="pin-form" novalidate>
        <input type="hidden" id="p-district" name="district" value="${d.id}">
        ${field("p-title", t("shareForm.title2"), "text", { required: true })}
        ${field("p-cat", t("shareForm.cat"), "select", { required: true, options: `<option value="">—</option>` + CATS.map((c) => `<option value="${c.id}">${esc(L(c))}</option>`).join("") })}
        ${field("p-locality", t("shareForm.locality"), "text", { attrs: `placeholder="${esc(d.loc[0])}"` })}
        <div class="mx-form__two">
          ${field("p-date", t("shareForm.date"), "date")}
          ${field("p-time", t("map.time"), "time")}
        </div>
        ${field("p-org", t("shareForm.org"), "text", { required: true })}
        ${field("p-contact", t("map.contactField"), "text", { required: true })}
        ${field("p-cost", t("shareForm.cost"), "select", { options: `<option value="free">${esc(t("card.free"))}</option><option value="paid">${esc(t("card.paid"))}</option><option value="">${esc(t("card.tbc"))}</option>` })}
        ${field("p-desc", t("shareForm.desc"), "textarea", { required: true, rows: 3 })}
        <div class="field field--check">
          <label><input type="checkbox" id="p-consent" name="consent" required><span>${esc(t("shareForm.consent"))}</span></label>
          <span class="field__err" id="p-consent-err" aria-live="polite"></span>
        </div>
        <button class="btn btn--primary btn--block" type="submit">${icon("pin")}${esc(t("map.savePin"))}</button>
        <p class="note">${icon("info")}${esc(t("map.pinNote"))}</p>
      </form>`;
    $("#p-cancel").addEventListener("click", stopPinMode);
    const form = $("#pin-form");
    $$("input,textarea,select", form).forEach((el) => {
      el.addEventListener("blur", () => { if (el.value) validateField(el); });
      el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validateField(el); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const els = $$("input:not([type=hidden]),textarea,select", form);
      if (!els.map(validateField).every(Boolean)) { const bad = els.find((x) => x.getAttribute("aria-invalid") === "true"); if (bad) bad.focus(); return; }
      const ll = draftMarker.getLatLng();
      if (!inMoldova(ll.lat, ll.lng)) { toast(t("map.outside")); return; }
      const title = $("#p-title").value.trim(), desc = $("#p-desc").value.trim();
      const date = $("#p-date").value || null;
      const pin = {
        id: "pin-" + Date.now().toString(36), source: "community", cat: $("#p-cat").value, format: "local",
        district: $("#p-district").value, locality: $("#p-locality").value.trim() || null,
        venue: { ro: $("#p-locality").value.trim() || "", en: $("#p-locality").value.trim() || "" },
        title: { ro: title, en: title }, desc: { ro: desc, en: desc }, full: { ro: desc, en: desc },
        learn: { ro: [], en: [] }, month: date ? date.slice(0, 7) : null, date, time: $("#p-time").value || null, deadline: null,
        ages: [13, 19], cost: $("#p-cost").value || null, organizer: $("#p-org").value.trim(), contact: $("#p-contact").value.trim(), link: null,
        covers: { accommodation: null, transport: null, meals: null }, at: [ll.lat, ll.lng], createdAt: new Date().toISOString()
      };
      const all = communityPins(); all.push(pin); store.set("opp.pins", all);
      stopPinMode();
      renderMapResults();
      selectItem(pin.id, true);
      toast(t("map.saved"));
    });
    $("#p-title").focus({ preventScroll: true });
  }

  function locateOnMap() {
    const status = $("#mx-status");
    if (!("geolocation" in navigator)) { status.textContent = t("regions.locError"); return; }
    status.textContent = t("regions.locating");
    navigator.geolocation.getCurrentPosition((pos) => {
      const d = nearestDistrict(pos.coords.latitude, pos.coords.longitude);
      mapState.center = [pos.coords.latitude, pos.coords.longitude];
      mapState.centerLabel = d.name;
      if (mapState.radius === "all") setRadius("50");
      $("#mx-loc").value = d.name;
      status.textContent = t("regions.locFound", { d: d.name });
      renderMapResults(true);
    }, () => { status.textContent = t("regions.locError"); $("#mx-loc").focus(); }, { timeout: 10000, maximumAge: 600000 });
  }

  function setRadius(v) {
    mapState.radius = v;
    $$("[data-radius]").forEach((x) => { const on = x.dataset.radius === v; x.classList.toggle("is-on", on); x.setAttribute("aria-checked", on); });
  }

  function bindMap() {
    if (!window.L || !window.L.map) {
      $("#mx-map").innerHTML = `<div class="hint">${icon("info")}<p>${esc(t("map.noLib"))}</p></div>`;
      renderMapResults();
      return;
    }
    const LF = window.L;
    LM = LF.map("mx-map", { zoomControl: false, minZoom: 7, maxZoom: 16, maxBounds: [[44.2, 23.8], [49.8, 33.8]], maxBoundsViscosity: 0.8, zoomSnap: 0.5, attributionControl: true });
    LF.control.zoom({ position: "bottomleft", zoomInTitle: "+", zoomOutTitle: "−" }).addTo(LM);
    LM.fitBounds(MD_BOUNDS, fitOpts());
    LM.attributionControl.setPrefix(false);
    const theme = document.documentElement.dataset.theme;
    const dark = theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    LF.tileLayer("https://{s}.basemaps.cartocdn.com/" + (dark ? "dark_all" : "light_all") + "/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd", maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
    }).addTo(LM);
    // Dim everything outside Moldova and draw its border, so the region reads clearly (also without map tiles).
    const outline = window.MOLDOVA_OUTLINE || [];
    if (outline.length) {
      LF.polygon([[[-85, -180], [-85, 180], [85, 180], [85, -180]]].concat(outline), { className: "mx-mask", stroke: false, fillOpacity: 0.6, interactive: false }).addTo(LM);
      LF.polygon(outline, { className: "mx-border", weight: 2, fill: false, interactive: false }).addTo(LM);
    }
    // Town labels: main towns always, every district centre when zoomed in.
    const major = ["chisinau", "balti", "cahul", "soroca", "orhei", "ungheni", "gagauzia", "stinga"];
    DISTRICTS.forEach((d) => {
      const name = d.id === "gagauzia" ? "Comrat" : d.id === "stinga" ? "Tiraspol" : d.id === "dubasari" ? "Cocieri" : d.name.replace(" (Tighina)", "");
      LF.marker(d.c, { interactive: false, keyboard: false, icon: LF.divIcon({ className: "town" + (major.includes(d.id) ? " town--major" : ""), html: `<span>${esc(name)}</span>`, iconSize: null }) }).addTo(LM);
    });
    const zoomClass = () => LM.getContainer().classList.toggle("is-far", LM.getZoom() < 8.5);
    LM.on("zoomend", zoomClass); zoomClass();

    markerLayer = LF.layerGroup().addTo(LM);
    LM.on("click", (e) => { if (mapState.pinMode) placeDraft(e.latlng); });

    // panel controls
    $("#mx-loc-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = norm($("#mx-loc").value).trim();
      const status = $("#mx-status");
      if (v.length < 2) { status.textContent = t("map.locShort"); return; }
      const d = DISTRICTS.find((x) => norm(x.name).startsWith(v)) || DISTRICTS.find((x) => x.loc.some((l) => norm(l).startsWith(v))) || DISTRICTS.find((x) => norm(x.name).includes(v) || x.loc.some((l) => norm(l).includes(v)));
      if (!d) { status.textContent = t("map.locNone"); return; }
      const geo = window.OPP_GEO || {};
      const exact = OPPS.find((o) => o.locality && norm(o.locality) === v && geo[o.id]);
      mapState.center = exact ? geo[exact.id] : d.c;
      mapState.centerLabel = $("#mx-loc").value.trim();
      if (mapState.radius === "all") setRadius("25");
      status.textContent = t("map.centered", { d: d.name });
      renderMapResults(true);
    });
    $("#mx-geo").addEventListener("click", locateOnMap);
    $$("[data-radius]").forEach((b) => b.addEventListener("click", () => { setRadius(b.dataset.radius); renderMapResults(!!mapState.center); }));
    $$("[data-tab]").forEach((b) => b.addEventListener("click", () => {
      mapState.tab = b.dataset.tab;
      $$("[data-tab]").forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-selected", on); });
      $$(".mx-pane").forEach((p) => (p.hidden = p.id !== "mx-pane-" + mapState.tab));
    }));
    $$("[data-date]").forEach((b) => b.addEventListener("click", () => {
      mapState.date = b.dataset.date;
      $$("[data-date]").forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on); });
      renderMapResults();
    }));
    $$("[data-cat]", $(".mx-panel")).forEach((b) => b.addEventListener("click", () => {
      const i = mapState.cats.indexOf(b.dataset.cat);
      if (i >= 0) mapState.cats.splice(i, 1); else mapState.cats.push(b.dataset.cat);
      b.classList.toggle("is-on", i < 0); b.setAttribute("aria-pressed", i < 0);
      renderMapResults();
    }));
    $("#mx-free").addEventListener("change", (e) => { mapState.free = e.target.checked; renderMapResults(); });
    $("#mx-q").addEventListener("input", (e) => { mapState.q = e.target.value; renderMapResults(); });
    $("#mx-reset").addEventListener("click", () => {
      Object.assign(mapState, { q: "", center: null, centerLabel: "", radius: "all", date: "all", cats: [], free: false });
      $("#mx-loc").value = ""; $("#mx-q").value = ""; $("#mx-free").checked = false; $("#mx-status").textContent = "";
      setRadius("all");
      $$("[data-date]").forEach((x) => { const on = x.dataset.date === "all"; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on); });
      $$(".mx-cat").forEach((x) => { x.classList.remove("is-on"); x.setAttribute("aria-pressed", false); });
      renderMapResults();
      LM.flyToBounds(MD_BOUNDS, Object.assign(fitOpts(), { duration: reduceMotion() ? 0 : 0.6 }));
    });
    $("#mx-pin").addEventListener("click", startPinMode);
    $("#mx-pin-cancel").addEventListener("click", stopPinMode);

    renderMapResults();
    if (mapState.selected && findItem(mapState.selected)) selectItem(mapState.selected, true);
    else mapState.selected = null;
    // Leaflet measures its box once; re-measure after layout settles.
    setTimeout(() => LM && LM.invalidateSize(), 60);
  }

  function destroyMap() {
    if (LM) { LM.remove(); LM = null; markerLayer = null; radiusLayer = null; draftMarker = null; }
    mapState.pinMode = false;
  }

  /* ------------------------------------------------------------------ flower decorations */
  // Evelina's flower drawing: one large flower beside each page title, small ones scattered at section edges.
  function seeded(seed) {
    let a = 0; for (let i = 0; i < seed.length; i++) a = (a * 31 + seed.charCodeAt(i)) | 0;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function flowerImg(cls, vars, src) {
    const style = Object.entries(vars).map(([k, v]) => `--${k}:${v}`).join(";");
    return `<img class="flw ${cls}" src="${src || "assets/img/flower-sm.webp"}" alt="" aria-hidden="true" decoding="async" style="${style}">`;
  }
  function decorate(routeName) {
    const main = $("#app");
    // large flower next to the page title
    const big = (host, cls) => { if (host && !$(".flw-big", host)) host.insertAdjacentHTML("beforeend", flowerImg("flw-big " + cls, {}, "assets/img/flower.webp")); };
    big($(".hero__grid", main), "flw-big--hero");
    $$(".page-head .wrap, .detail-hero .wrap", main).forEach((w) => { w.parentElement.classList.add("has-flower"); big(w, "flw-big--head"); });
    const mh = $(".mx-head", main); if (mh) { mh.classList.add("has-flower"); big(mh, "flw-big--map"); }
    // small flowers around the page, each with its own size, angle and direction
    const rnd = seeded("opp-" + routeName);
    const r = (a, b) => a + (b - a) * rnd();
    $$("#app > section", main).forEach((sec, i) => {
      if (sec.matches(".hero, .page-head, .detail-hero")) return;
      sec.classList.add("has-petals");
      const left = (i + Math.round(rnd())) % 2 === 0;
      const side = left ? "left" : "right", other = left ? "right" : "left";
      const corner = flowerImg(`flw-sm flw--${side}`, { s: Math.round(r(34, 52)) + "px", r: Math.round(r(-35, 35)) + "deg", fx: rnd() > 0.5 ? -1 : 1, y: Math.round(r(4, 16)) + "px", x: r(1, 5).toFixed(1) + "%" });
      const mid = flowerImg(`flw-sm flw--wide flw--${other}`, { s: Math.round(r(40, 70)) + "px", r: Math.round(r(-40, 40)) + "deg", fx: rnd() > 0.5 ? -1 : 1, y: Math.round(r(38, 72)) + "%", x: Math.round(r(10, 28)) + "px" });
      sec.insertAdjacentHTML("afterbegin", corner + mid);
    });
  }

  /* ------------------------------------------------------------------ router */
  const ROUTES = {
    "": ["home", "nav.home"],
    explore: ["explore", "nav.explore"],
    regions: ["regions", "nav.regions"],
    map: ["map", "nav.map"],
    events: ["events", "nav.events"],
    about: ["about", "nav.about"],
    contact: ["contact", "nav.contact"],
    share: ["share", "share.btn"],
    o: ["detail", null]
  };
  let lastRoute = null;

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    return { name: parts[0] || "", arg: parts[1] ? decodeURIComponent(parts[1]) : null, params: new URLSearchParams(qs || "") };
  }

  function render(opts = {}) {
    const { name, arg, params } = parseHash();
    const route = ROUTES[name] || ROUTES[""];
    const viewName = route[0];
    const main = $("#app");
    destroyMap();
    document.body.classList.toggle("on-map", viewName === "map");
    main.innerHTML = views[viewName](params, arg);

    // page title
    let title = route[1] ? t(route[1]) : "";
    if (viewName === "detail" && byId(arg)) title = L(byId(arg).title);
    document.title = (viewName === "home" ? "" : title + " · ") + "OPPORTUNITIES";

    // active nav
    $$("[data-nav]").forEach((a) => {
      const on = a.dataset.nav === (viewName === "detail" ? "explore" : name);
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });

    // bind view
    decorate(name || "home");
    if (viewName === "home") bindHome();
    if (viewName === "explore") bindExplore();
    if (viewName === "regions") bindRegions(params);
    if (viewName === "events") bindEvents();
    if (viewName === "map") bindMap();
    if (viewName === "detail") bindDetail();
    if (viewName === "contact") bindForm($("#contact-form"), "opp.messages", t("contact.sent"));
    if (viewName === "share") bindForm($("#share-form"), "opp.submissions", t("shareForm.sent"));

    if (!opts.keepScroll) window.scrollTo(0, 0);
    if (!opts.keepScroll && !reduceMotion()) {
      main.classList.remove("page-in"); void main.offsetWidth; main.classList.add("page-in");
    }
    if (!opts.keepScroll && lastRoute !== null) main.focus({ preventScroll: true });
    lastRoute = name;
    observeReveals();
    closeMenu();
  }

  function bindHome() {
    const f = $("[data-hero-search]");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = f.q.value.trim();
      location.hash = "#/explore" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  }

  /* ------------------------------------------------------------------ chrome: language, menu, header, reveal, toast */
  function applyStaticText() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    $$(".lang button").forEach((b) => { const on = b.dataset.lang === lang; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    $$("[data-social]").forEach((el) => (el.innerHTML = socialLinks()));
    $("#year").textContent = new Date().getFullYear();
  }

  function setLang(l) {
    if (l === lang || !window.I18N[l]) return;
    lang = l; store.set("opp.lang", l);
    applyStaticText();
    const y = window.scrollY;
    render({ keepScroll: true });
    window.scrollTo(0, y);
  }

  const menu = () => $("#menu");
  function openMenu() {
    const m = menu(); m.hidden = false;
    requestAnimationFrame(() => m.classList.add("is-open"));
    $("#menu-btn").setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    const first = $("#menu-close"); if (first) first.focus();
  }
  function closeMenu() {
    const m = menu(); if (!m || m.hidden) return;
    m.classList.remove("is-open");
    $("#menu-btn").setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    const done = () => { if (!m.classList.contains("is-open")) m.hidden = true; };
    if (reduceMotion()) done(); else setTimeout(done, 260);
  }

  let io;
  function observeReveals() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || reduceMotion()) { els.forEach((e) => e.classList.add("in")); return; }
    if (!io) io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    els.forEach((e) => io.observe(e));
  }

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("is-on"), 2200);
  }

  function init() {
    $$(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
    $("#menu-btn").addEventListener("click", () => (menu().hidden ? openMenu() : closeMenu()));
    $("#menu-scrim").addEventListener("click", closeMenu);
    $("#menu-close").addEventListener("click", () => { closeMenu(); $("#menu-btn").focus(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    const header = $(".header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    window.addEventListener("hashchange", () => render());
    applyStaticText();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
