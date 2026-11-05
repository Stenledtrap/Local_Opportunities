/* Outlast — app shell: routing, menu, search and every page. Plain JS, no dependencies. */
(function () {
  "use strict";
  const O = window.OUT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = O.icon;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("outlast." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("outlast." + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* extra interface text for this version */
  const X = {
    en: { needNow: "What do you need right now?", askFlint: "Ask Flint", askFlintSub: "Your field guide answers", scenarioSub: "Plan for what could go wrong",
      steps3: "{n} steps", start: "Start", practice: "Practice", practiceLead: "Short games that drill each skill until it sticks.", miniGames: "Mini-games",
      allSteps: "All steps", oneByOne: "Step by step", stepOf: "{n} / {t}", needTap: "Tap what you've packed", knots: "Knot workshop", tryIt: "Try it",
      playGame: "Play", sourcesShow: "Sources", hot: "Hot", newest: "New", top: "Top", all: "All", example: "Example", comments: "{n} comments", comments1: "1 comment", comment: "Comment",
      upvote: "Upvote", downvote: "Downvote", writePost: "Start a thread", feedEmpty: "No threads yet in this category.", shareYours: "What have you learned outside?",
      continue: "Continue", pathDone: "Done", draftShort: "Draft · checked against the sources below", skillsList: "Browse by skill", guidesN: "{n} guides", popular: "Most used",
      theme: "Theme", themeLight: "Light", themeDark: "Dark", themeAuto: "Auto", gamesN: "{n} games", heroTitle: "Learn it here. Use it out there.", heroLead: "Survival skills you can practise, in plain steps." },
    pl: { needNow: "Czego potrzebujesz teraz?", askFlint: "Zapytaj Flinta", askFlintSub: "Twój przewodnik odpowiada", scenarioSub: "Zaplanuj, co może pójść nie tak",
      steps3: "Kroki: {n}", start: "Start", practice: "Ćwiczenia", practiceLead: "Krótkie gry, które utrwalają każdą umiejętność.", miniGames: "Mini-gry",
      allSteps: "Wszystkie kroki", oneByOne: "Krok po kroku", stepOf: "{n} / {t}", needTap: "Zaznacz, co masz spakowane", knots: "Warsztat węzłów", tryIt: "Wypróbuj",
      playGame: "Graj", sourcesShow: "Źródła", hot: "Gorące", newest: "Nowe", top: "Najlepsze", all: "Wszystko", example: "Przykład", comments: "Komentarze: {n}", comments1: "1 komentarz", comment: "Skomentuj",
      upvote: "Głos w górę", downvote: "Głos w dół", writePost: "Załóż wątek", feedEmpty: "W tej kategorii nie ma jeszcze wątków.", shareYours: "Czego nauczyłeś się w terenie?",
      continue: "Dalej", pathDone: "Gotowe", draftShort: "Wersja robocza · sprawdzona ze źródłami poniżej", skillsList: "Umiejętności", guidesN: "Poradniki: {n}", popular: "Najczęściej czytane",
      theme: "Motyw", themeLight: "Jasny", themeDark: "Ciemny", themeAuto: "Auto", gamesN: "Gry: {n}", heroTitle: "Naucz się tu. Użyj w terenie.", heroLead: "Umiejętności przetrwania do przećwiczenia, krok po kroku." }
  };
  ["en", "pl"].forEach((l) => Object.assign(O.ui[l], X[l]));

  /* ------------------------------------------------------------------ language */
  let lang = store.get("lang", null) || ((navigator.language || "en").toLowerCase().startsWith("pl") ? "pl" : "en");
  const t = (k, vars) => {
    let s = (O.ui[lang] && O.ui[lang][k]) != null ? O.ui[lang][k] : O.ui.en[k];
    if (s == null) return k;
    if (vars && typeof s === "string") s = s.replace(/\{(\w+)\}/g, (_, x) => (vars[x] != null ? vars[x] : ""));
    return s;
  };
  const L = (o) => (o && typeof o === "object" && !Array.isArray(o) ? (o[lang] != null ? o[lang] : o.en) : o);

  const guide = (id) => O.guides.find((g) => g.id === id);
  const cat = (id) => O.categories.find((c) => c.id === id);
  const checklist = (id) => O.checklists.find((c) => c.id === id);
  const scenario = (id) => O.scenarios.find((s) => s.id === id);
  const fcat = (id) => O.forumCats.find((c) => c.id === id);
  const practised = () => store.get("practised", []);
  const isPractised = (id) => practised().includes(id);

  /* ------------------------------------------------------------------ small components */
  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([href, label], i) =>
    (i ? `<span aria-hidden="true">/</span>` : "") + (href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`)).join("")}</nav>`;
  const row = (href, ic, title, sub, meta = "") => `<li><a class="row" href="${href}">
      <span class="row__icon">${icon(ic)}</span>
      <span class="row__text"><strong>${esc(title)}</strong>${sub ? `<span>${esc(sub)}</span>` : ""}</span>
      <span class="row__meta">${meta}${icon("chevR")}</span></a></li>`;
  const guideRow = (g) => row("#/g/" + g.id, cat(g.cat).icon, L(g.title), `${t("minutes", { n: g.mins })} · ${t("level" + g.level)}`,
    isPractised(g.id) ? `<span class="done-tick" title="${esc(t("practisedDone"))}">${icon("check")}</span>` : "");

  function linkFor(ref) {
    const [type, id] = ref.split(":");
    if (type === "guide") { const g = guide(id); return g && { href: "#/g/" + id, label: L(g.title), icon: cat(g.cat).icon }; }
    if (type === "checklist") { const c = checklist(id); return c && { href: "#/c/" + id, label: L(c.title), icon: "list" }; }
    if (type === "scenario") { const s = scenario(id); return s && { href: "#/s/" + id, label: L(s.title), icon: s.icon }; }
    if (type === "scenarios") return { href: "#/scenarios", label: t("allScenarios"), icon: "target" };
    return null;
  }

  /* ------------------------------------------------------------------ views */
  const V = {};

  V.home = () => {
    const popular = O.guides.filter((g) => g.popular).slice(0, 5);
    const quick = [["water", "boil-water"], ["fire", "build-fire"], ["shelter", "tarp-shelter"], ["firstaid", "bleeding"], ["knots", "knot-bowline"], ["signal", "lost-stop"]];
    return `
    <section class="hero band">
      <div class="col">
        <h1 class="hero__title">${esc(t("heroTitle"))}</h1>
        <p class="hero__lead">${esc(t("heroLead"))}</p>
        <h2 class="hero__q">${esc(t("needNow"))}</h2>
        <div class="quick">
          ${quick.map(([c, g]) => `<a class="quick__btn" href="#/guides/${c}">${icon(cat(c).icon)}<span>${esc(L(cat(c).name))}</span></a>`).join("")}
        </div>
        <div class="hero__duo">
          <button type="button" class="duo duo--flint" data-open-chat="">${flintFace()}<span><strong>${esc(t("askFlint"))}</strong><small>${esc(t("askFlintSub"))}</small></span></button>
          <a class="duo" href="#/scenarios">${icon("target")}<span><strong>${esc(t("scenarioTitle"))}</strong><small>${esc(t("scenarioSub"))}</small></span></a>
        </div>
      </div>
    </section>
    <div class="col page">
      <section>
        <h2 class="sec-title">${esc(t("startHere"))}</h2>
        <div class="posters">
          ${O.startPaths.map((p, i) => `<a class="poster poster--${i + 1}" href="#/p/${p.id}">
            <span class="poster__icon">${icon(p.icon)}</span>
            <strong class="poster__title">${esc(L(p.t))}</strong>
            <span class="poster__sub">${esc(L(p.b))}</span>
            <span class="poster__go">${esc(t("steps3", { n: p.links.length }))}${icon("arrowR")}</span>
          </a>`).join("")}
        </div>
      </section>
      <section class="section">
        <div class="sec-row"><h2 class="sec-title">${esc(t("practice"))}</h2><a href="#/practice">${esc(t("miniGames"))}</a></div>
        <div class="games-strip">
          ${[["knot-bowline", 0], ["boil-water", 0], ["tarp-shelter", 0], ["hypothermia", 0]].map(([gid, n]) => { const sp = O.guideGames[gid][n]; return `<a class="gtile" href="#/play/${gid}/${n}">${gameArt(sp)}<span>${esc(O.gameTitle(sp, lang, gid))}</span></a>`; }).join("")}
        </div>
      </section>
      <section class="section">
        <h2 class="sec-title">${esc(t("popular"))}</h2>
        <ul class="rows">${popular.map(guideRow).join("")}</ul>
      </section>
      <section class="section">
        <h2 class="sec-title">${esc(t("skillsList"))}</h2>
        <ul class="rows">${O.categories.map((c) => row("#/guides/" + c.id, c.icon, L(c.name), L(c.blurb), `<span class="count">${O.guides.filter((g) => g.cat === c.id).length}</span>`)).join("")}
          ${row("#/checklists", "list", t("checklists"), O.checklists.map((c) => L(c.title)).join(" · "), `<span class="count">${O.checklists.length}</span>`)}</ul>
      </section>
    </div>`;
  };

  /* small illustrated cover for a game tile */
  function gameArt(sp) {
    const key = sp.type === "trace" ? "bowline-4" : sp.type === "boil" ? "pot-boil" : sp.type === "spot" ? "site-select" : sp.type === "sort" ? (sp.deck === "hypo-signs" ? "umbles" : sp.deck === "signals" ? "ground-sos" : sp.deck === "sprain-break" ? "check-ankle" : "water-methods") : "teepee";
    return `<span class="gtile__art">${O.diagram(key, lang, "")}</span>`;
  }

  function flintFace() {
    return `<svg class="flint" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" class="flint__bg"/><path class="flint__hat" d="M9 22 Q10 7 24 7 Q38 7 39 22Z"/><rect class="flint__band" x="8" y="19" width="32" height="6" rx="3"/><circle class="flint__skin" cx="24" cy="30" r="11"/><path class="flint__beard" d="M14 31 Q16 42 24 42 Q32 42 34 31 Q30 36 24 36 Q18 36 14 31Z"/><circle class="flint__eye" cx="20" cy="28" r="1.6"/><circle class="flint__eye" cx="28" cy="28" r="1.6"/></svg>`;
  }

  V.path = (p, id) => {
    const sp = O.startPaths.find((x) => x.id === id);
    if (!sp) return V.notFound();
    const seen = store.get("seen", []);
    const items = sp.links.map(linkFor).filter(Boolean);
    const i = O.startPaths.indexOf(sp);
    return `<div class="poster-head poster--${i + 1}"><div class="col">
        ${crumbs([["#/", t("home")], [null, t("startHere")]])}
        <h1 class="poster__title">${esc(L(sp.t))}</h1><p class="poster__sub">${esc(L(sp.b))}</p>
      </div></div>
      <div class="col page">
        <ol class="trail">${items.map((it, k) => { const done = seen.includes(it.href); return `<li class="${done ? "is-done" : ""}">
          <a href="${it.href}"><span class="trail__n">${done ? icon("check") : k + 1}</span><span class="trail__t">${icon(it.icon)}<strong>${esc(it.label)}</strong></span>${icon("chevR")}</a></li>`; }).join("")}</ol>
      </div>`;
  };

  V.guides = (p, catId) => {
    const c = catId ? cat(catId) : null;
    if (catId && !c) return V.notFound();
    const body = c
      ? `<ul class="rows">${O.guides.filter((g) => g.cat === c.id).map(guideRow).join("")}</ul>`
      : O.categories.map((k) => `<section class="section"><h2 class="sec-title sec-title--sm">${esc(L(k.name))}</h2><ul class="rows">${O.guides.filter((g) => g.cat === k.id).map(guideRow).join("")}</ul></section>`).join("");
    return `<div class="col page">
      <header class="page-head">
        ${crumbs([["#/", t("home")]].concat(c ? [["#/guides", t("guides")]] : []))}
        <h1>${c ? `<span class="h1-icon">${icon(c.icon)}</span>` : ""}${esc(c ? L(c.name) : t("guides"))}</h1>
      </header>
      ${body}
    </div>`;
  };

  /* --- guide: walkthrough + practice */
  V.guide = (p, id) => {
    const g = guide(id);
    if (!g) return V.notFound();
    const c = cat(g.cat);
    const done = isPractised(g.id);
    const packed = store.get("need." + g.id, []);
    const games = (O.guideGames[g.id] || []).concat([{ type: "quiz" }]);
    const sibs = O.guides.filter((x) => x.cat === g.cat), i = sibs.indexOf(g), next = sibs[i + 1];
    const mode = store.get("stepMode", "walk");
    return `<article>
      <header class="ghead band">
        <div class="col">
          ${crumbs([["#/guides/" + c.id, L(c.name)]])}
          <h1>${esc(L(g.title))}</h1>
          <div class="ghead__meta"><span>${icon("clock")}${esc(t("minutes", { n: g.mins }))}</span><span>${icon("steps")}${esc(t("level" + g.level))}</span><span>${icon("list")}${esc(t("steps3", { n: g.steps.length }))}</span></div>
        </div>
      </header>
      <div class="col page page--tight">
        <p class="lead">${esc(L(g.summary))}</p>
        <section class="need">
          <h2 class="mini-title">${esc(t("youNeed"))} <small>${esc(t("needTap"))}</small></h2>
          <div class="need__chips">${L(g.need).map((x, k) => `<button type="button" class="need__chip" aria-pressed="${packed.includes(k)}" data-need="${k}">${icon("check")}<span>${esc(x)}</span></button>`).join("")}</div>
        </section>
        <section class="alert" role="note"><h2 class="mini-title">${icon("warn")}${esc(t("safetyFirst"))}</h2><ul>${L(g.warn).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>

        <section class="walk" data-mode="${mode}">
          <div class="walk__bar">
            <div class="seg" role="radiogroup">
              <button type="button" role="radio" aria-checked="${mode === "walk"}" data-mode="walk">${esc(t("oneByOne"))}</button>
              <button type="button" role="radio" aria-checked="${mode === "all"}" data-mode="all">${esc(t("allSteps"))}</button>
            </div>
            <span class="walk__count" aria-live="polite"></span>
          </div>
          <div class="walk__viewport">
            <ol class="walk__track">${g.steps.map((s, n) => `<li class="wstep" id="step-${n + 1}" aria-roledescription="slide">
              <figure class="wstep__fig">${O.diagram(s.d, lang, L(s.t))}</figure>
              <div class="wstep__text"><span class="wstep__n">${n + 1}</span><h3>${esc(L(s.t))}</h3><p>${esc(L(s.b))}</p></div>
            </li>`).join("")}</ol>
          </div>
          <div class="walk__nav">
            <button type="button" class="btn btn--line" data-walk="-1" aria-label="${esc(t("prev"))}">${icon("chevL")}</button>
            <div class="walk__dots">${g.steps.map((s, n) => `<button type="button" data-dot="${n}" aria-label="${esc(t("step", { n: n + 1 }))}"></button>`).join("")}</div>
            <button type="button" class="btn btn--leaf" data-walk="1">${esc(t("next"))}${icon("chevR")}</button>
          </div>
        </section>

        <section class="section" id="practice">
          <h2 class="sec-title">${esc(t("practice"))}</h2>
          <div class="games">${games.map((sp, k) => `<div class="game-slot" data-game="${k}"></div>`).join("")}</div>
        </section>

        <div class="practise ${done ? "is-done" : ""}">
          <button class="toggle" type="button" data-practise="${g.id}" aria-pressed="${done}">${icon("check")}<span>${esc(done ? t("practisedDone") : t("practised"))}</span></button>
          ${next ? `<a class="next-link" href="#/g/${next.id}"><small>${esc(t("next"))}</small><strong>${esc(L(next.title))}</strong></a>` : ""}
        </div>
        <details class="sources"><summary>${esc(t("sourcesShow"))} · ${esc(t("draftShort"))}</summary><ul>${g.sources.map((s) => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)}</li>`).join("")}</ul></details>
      </div>
    </article>`;
  };

  function bindGuide(id) {
    const g = guide(id);
    // packing chips
    $$("[data-need]").forEach((b) => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on);
      store.set("need." + id, $$("[data-need]").filter((x) => x.getAttribute("aria-pressed") === "true").map((x) => Number(x.dataset.need)));
    }));
    // games
    const games = (O.guideGames[id] || []).concat([{ type: "quiz" }]);
    $$(".game-slot").forEach((el) => O.mountGame(el, games[Number(el.dataset.game)], lang, id));
    // walkthrough
    const walk = $(".walk"), track = $(".walk__track"), vp = $(".walk__viewport");
    let cur = 0;
    const n = g.steps.length;
    const setMode = (m) => {
      walk.dataset.mode = m; store.set("stepMode", m);
      $$("[data-mode]", walk).forEach((b) => b.setAttribute("aria-checked", b.dataset.mode === m));
      track.style.transform = ""; go(cur, false);
    };
    const go = (k, animate = true) => {
      cur = Math.max(0, Math.min(n - 1, k));
      if (walk.dataset.mode === "walk") {
        track.style.transition = animate && !reduced() ? "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)" : "none";
        track.style.transform = `translateX(${-cur * 100}%)`;
        $$(".wstep", track).forEach((li, i) => li.setAttribute("aria-hidden", i !== cur));
      } else $$(".wstep", track).forEach((li) => li.removeAttribute("aria-hidden"));
      $(".walk__count").textContent = walk.dataset.mode === "walk" ? t("stepOf", { n: cur + 1, t: n }) : "";
      $$("[data-dot]").forEach((d, i) => d.setAttribute("aria-current", i === cur ? "step" : "false"));
      const nextBtn = $('[data-walk="1"]');
      nextBtn.innerHTML = cur === n - 1 ? `${esc(t("practice"))}${icon("arrowR")}` : `${esc(t("next"))}${icon("chevR")}`;
      $('[data-walk="-1"]').disabled = cur === 0;
    };
    $$("[data-mode]", walk).forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    $$("[data-walk]").forEach((b) => b.addEventListener("click", () => {
      const d = Number(b.dataset.walk);
      if (d > 0 && cur === n - 1) { $("#practice").scrollIntoView({ behavior: reduced() ? "auto" : "smooth" }); return; }
      go(cur + d);
    }));
    $$("[data-dot]").forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.dot))));
    walk.addEventListener("keydown", (e) => { if (walk.dataset.mode !== "walk") return; if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1); });
    // swipe: 1:1 tracking, then snap using projected momentum, rubber-band at the ends
    let sx = 0, sy = 0, dx = 0, pid = null, axis = null, hist = [];
    vp.addEventListener("pointerdown", (e) => {
      if (walk.dataset.mode !== "walk" || e.pointerType === "mouse" && e.button !== 0) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; dx = 0; axis = null; hist = [{ x: e.clientX, t: e.timeStamp }];
    });
    vp.addEventListener("pointermove", (e) => {
      if (e.pointerId !== pid) return;
      const mx = e.clientX - sx, my = e.clientY - sy;
      if (!axis) { if (Math.abs(mx) < 10 && Math.abs(my) < 10) return; axis = Math.abs(mx) > Math.abs(my) ? "x" : "y"; if (axis === "x") vp.setPointerCapture(pid); }
      if (axis !== "x") return;
      dx = mx;
      const w = vp.clientWidth, atEdge = (cur === 0 && dx > 0) || (cur === n - 1 && dx < 0);
      const shown = atEdge ? (dx * w * 0.55) / (w + 0.55 * Math.abs(dx)) : dx;
      track.style.transition = "none";
      track.style.transform = `translateX(calc(${-cur * 100}% + ${shown}px))`;
      hist.push({ x: e.clientX, t: e.timeStamp }); if (hist.length > 5) hist.shift();
    });
    const end = (e) => {
      if (e.pointerId !== pid) return; pid = null;
      if (axis !== "x") return;
      const a = hist[0], b = hist[hist.length - 1];
      const v = b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
      const projected = dx + (v / 1000) * 0.998 / (1 - 0.998);
      const w = vp.clientWidth;
      go(cur + (projected < -w / 2 ? 1 : projected > w / 2 ? -1 : 0));
    };
    vp.addEventListener("pointerup", end); vp.addEventListener("pointercancel", end);
    go(0, false);
  }

  /* --- practice hub and single game page */
  V.practice = () => {
    const groups = O.categories.map((c) => ({ c, items: O.guides.filter((g) => g.cat === c.id).flatMap((g) => (O.guideGames[g.id] || []).map((sp, n) => ({ g, sp, n }))) })).filter((x) => x.items.length);
    const knots = groups.find((x) => x.c.id === "knots");
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/", t("home")]])}<h1>${esc(t("miniGames"))}</h1><p class="lead">${esc(t("practiceLead"))}</p></header>
      ${knots ? `<section><h2 class="sec-title sec-title--sm">${esc(t("knots"))}</h2><div class="games-strip">${knots.items.map((x) => `<a class="gtile" href="#/play/${x.g.id}/${x.n}">${gameArt(x.sp)}<span>${esc(O.gameTitle(x.sp, lang, x.g.id))}</span></a>`).join("")}</div></section>` : ""}
      ${groups.filter((x) => x.c.id !== "knots").map((x) => `<section class="section"><h2 class="sec-title sec-title--sm">${esc(L(x.c.name))}</h2>
        <ul class="rows">${x.items.map((it) => row(`#/play/${it.g.id}/${it.n}`, x.c.icon, O.gameTitle(it.sp, lang, it.g.id), L(it.g.title))).join("")}</ul></section>`).join("")}
    </div>`;
  };
  V.play = (p, id, n) => {
    const g = guide(id), sp = g && (n === "quiz" ? { type: "quiz" } : (O.guideGames[id] || [])[Number(n)]);
    if (!g || !sp) return V.notFound();
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/practice", t("miniGames")], ["#/g/" + id, L(g.title)]])}<h1>${esc(O.gameTitle(sp, lang, id))}</h1></header>
      <div class="game-slot game-slot--solo" id="solo"></div>
      <p style="margin-top:18px"><a class="btn btn--line" href="#/g/${id}">${icon("book")}${esc(L(g.title))}</a></p>
    </div>`;
  };

  V.checklists = () => `<div class="col page">
    <header class="page-head">${crumbs([["#/", t("home")]])}<h1>${esc(t("checklists"))}</h1></header>
    <ul class="rows">${O.checklists.map((c) => {
      const all = c.groups.flatMap((g) => g.items).length, done = store.get("cl." + c.id, []).length;
      return row("#/c/" + c.id, c.icon, L(c.title), `${done}/${all}`);
    }).join("")}</ul>
  </div>`;

  V.checklist = (p, id) => {
    const c = checklist(id);
    if (!c) return V.notFound();
    const ticked = store.get("cl." + c.id, []);
    let n = 0;
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/checklists", t("checklists")]])}<h1>${esc(L(c.title))}</h1></header>
      <div class="cl-tools">
        <div class="progress"><small id="cl-count"></small><div class="bar"><i id="cl-bar"></i></div></div>
        <button class="btn btn--line btn--sm" type="button" id="cl-print">${icon("print")}${esc(t("printList"))}</button>
        <button class="btn btn--line btn--sm" type="button" id="cl-reset">${esc(t("resetList"))}</button>
      </div>
      ${c.groups.map((g) => `<section class="clgroup"><h2 class="mini-title">${esc(L(g.name))}</h2><ul class="clitems">${g.items.map((it) => {
        const k = c.id + "-" + (n++);
        return `<li><label><input type="checkbox" data-k="${k}" ${ticked.includes(k) ? "checked" : ""}><span>${esc(L(it))}</span></label></li>`;
      }).join("")}</ul></section>`).join("")}
    </div>`;
  };

  V.scenarios = () => `<div class="col page">
    <header class="page-head">${crumbs([["#/", t("home")]])}<h1>${esc(t("scenarioTitle"))}</h1></header>
    <div class="scen-grid">${O.scenarios.map((s) => `<a class="scen" href="#/s/${s.id}"><span class="scen__icon">${icon(s.icon)}</span><strong>${esc(L(s.title))}</strong></a>`).join("")}</div>
  </div>`;

  V.scenario = (p, id) => {
    const s = scenario(id);
    if (!s) return V.notFound();
    const pack = checklist(s.pack);
    const i = O.scenarios.indexOf(s), next = O.scenarios[i + 1];
    return `<article>
      <header class="ghead band"><div class="col">${crumbs([["#/scenarios", t("scenarios")]])}<h1>${esc(L(s.title))}</h1></div></header>
      <div class="col page page--tight">
        <p class="situation">${esc(L(s.situation))}</p>
        <p class="fact">${icon("info")}<span>${esc(L(s.fact))}</span></p>
        <h2 class="sec-title">${esc(t("priorities"))}</h2>
        <ol class="prio">${s.priority.map((x, k) => `<li class="${k === 0 ? "is-open" : ""}">
          <button type="button" class="prio__head" aria-expanded="${k === 0}"><span class="prio__n">${k + 1}</span><span>${esc(L(x.t))}</span>${icon("chevD", "chev")}</button>
          <div class="prio__body"><p>${esc(L(x.b))}</p>${x.g && x.g.length ? `<div class="chips">${x.g.map(guide).filter(Boolean).map((g) => `<a class="chip" href="#/g/${g.id}">${icon(cat(g.cat).icon)}${esc(L(g.title))}</a>`).join("")}</div>` : ""}</div>
        </li>`).join("")}</ol>
        <h2 class="sec-title">${esc(t("avoid"))}</h2>
        <ul class="ticks">${L(s.avoid).map((x) => `<li>${icon("check")}<span>${esc(x)}</span></li>`).join("")}</ul>
        ${pack ? `<ul class="rows" style="margin-top:22px">${row("#/c/" + pack.id, pack.icon, t("packList") + ": " + L(pack.title), "")}</ul>` : ""}
        ${next ? `<a class="next-link" style="margin-top:22px" href="#/s/${next.id}"><small>${esc(t("next"))}</small><strong>${esc(L(next.title))}</strong></a>` : ""}
      </div>
    </article>`;
  };

  V.skills = () => {
    const done = practised().filter((id) => guide(id));
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/", t("home")]])}<h1>${esc(t("skills"))}</h1></header>
      <div class="progress"><small>${esc(t("skillsDone", { done: done.length, total: O.guides.length }))}</small><div class="bar"><i style="width:${Math.round((done.length / O.guides.length) * 100)}%"></i></div></div>
      ${O.categories.map((c) => `<section class="section"><h2 class="sec-title sec-title--sm">${esc(L(c.name))}</h2>
        ${O.guides.filter((g) => g.cat === c.id).map((g) => { const on = done.includes(g.id); return `<div class="skill-row"><a href="#/g/${g.id}">${esc(L(g.title))}</a>
          <button class="toggle" type="button" data-practise="${g.id}" aria-pressed="${on}">${icon("check")}<span>${esc(on ? t("practisedDone") : t("notPractised"))}</span></button></div>`; }).join("")}
      </section>`).join("")}
    </div>`;
  };

  /* --- forum: a feed you scroll, with votes and comments (stored in this browser) */
  const userPosts = () => store.get("forum2", []);
  const saveUserPosts = (x) => store.set("forum2", x);
  const votes = () => store.get("votes", {});
  const reportedSet = () => store.get("reported", []);
  const hoursAgo = (h) => new Date(Date.now() - h * 3600e3).toISOString();
  function allPosts() {
    const seed = (O.forumSeed || []).map((p) => Object.assign({}, p, { at: hoursAgo(p.hrs), comments: p.comments.map((c) => Object.assign({}, c, { at: hoursAgo(c.hrs) })) }));
    const extra = store.get("seedComments", {});
    seed.forEach((p) => { if (extra[p.id]) p.comments = p.comments.concat(extra[p.id]); });
    return seed.concat(userPosts());
  }
  const scoreOf = (x) => (x.score || 0) + (votes()[x.id] || 0);
  const ago = (iso) => {
    const m = Math.max(1, Math.round((Date.now() - new Date(iso)) / 60000));
    const pl = lang === "pl";
    if (m < 60) return pl ? `${m} min temu` : `${m}m ago`;
    const h = Math.round(m / 60); if (h < 24) return pl ? `${h} godz. temu` : `${h}h ago`;
    const d = Math.round(h / 24); return pl ? `${d} dni temu` : `${d}d ago`;
  };
  const voteBox = (x) => { const v = votes()[x.id] || 0; return `<div class="vote">
      <button type="button" data-vote="${x.id}" data-dir="1" aria-pressed="${v === 1}" aria-label="${esc(t("upvote"))}">${icon("chevD", "up")}</button>
      <span>${scoreOf(x)}</span>
      <button type="button" data-vote="${x.id}" data-dir="-1" aria-pressed="${v === -1}" aria-label="${esc(t("downvote"))}">${icon("chevD")}</button></div>`; };
  const nComments = (n) => (n === 1 ? t("comments1") : t("comments", { n }));
  const badge = (x) => (x.example ? `<span class="tag tag--ex">${esc(t("example"))}</span>` : `<span class="tag tag--warn">${esc(t("unverified"))}</span>`);

  V.forum = (p, catId) => {
    const c = catId ? fcat(catId) : null;
    if (catId && !c) return V.notFound();
    const sort = p.get("sort") || "hot";
    const rep = reportedSet();
    let posts = allPosts().filter((x) => !c || x.cat === c.id);
    const hot = (x) => scoreOf(x) / Math.pow((Date.now() - new Date(x.at)) / 3600e3 + 2, 1.4);
    posts.sort(sort === "new" ? (a, b) => b.at.localeCompare(a.at) : sort === "top" ? (a, b) => scoreOf(b) - scoreOf(a) : (a, b) => hot(b) - hot(a));
    const q = (k) => `#/forum${c ? "/" + c.id : ""}?sort=${k}`;
    return `<div class="col page">
      <header class="page-head forum-head">
        <div><h1>${esc(t("forum"))}</h1><a class="muted-link" href="#/rules">${icon("shield")}${esc(t("rules"))}</a></div>
        <a class="btn btn--leaf" href="#/forum-new${c ? "?cat=" + c.id : ""}">${icon("plus")}${esc(t("writePost"))}</a>
      </header>
      <a class="compose" href="#/forum-new${c ? "?cat=" + c.id : ""}">${icon("user")}<span>${esc(t("shareYours"))}</span></a>
      <nav class="tabs" aria-label="${esc(t("category"))}">
        <a href="#/forum?sort=${sort}" ${!c ? 'aria-current="page"' : ""}>${esc(t("all"))}</a>
        ${O.forumCats.map((k) => `<a href="#/forum/${k.id}?sort=${sort}" ${c && c.id === k.id ? 'aria-current="page"' : ""}>${esc(L(k.name))}</a>`).join("")}
      </nav>
      <div class="sortbar">${[["hot", t("hot")], ["new", t("newest")], ["top", t("top")]].map(([k, l]) => `<a href="${q(k)}" ${sort === k ? 'aria-current="true"' : ""}>${esc(l)}</a>`).join("")}</div>
      <p class="notice">${icon("info")}<span>${esc(t("forumDemo"))}</span></p>
      <div class="feed">${posts.length ? posts.map((x) => rep.includes(x.id) ? `<div class="post-card is-hidden">${icon("flag")}<span>${esc(t("reported"))}</span></div>` : `<article class="post-card">
        ${voteBox(x)}
        <a class="post-card__main" href="#/t/${x.id}">
          <span class="post-card__meta"><strong>${esc(L(fcat(x.cat).name))}</strong> · ${esc(x.user)} · ${esc(ago(x.at))} ${badge(x)}</span>
          <h2>${esc(x.title)}</h2>
          <p>${esc(x.body)}</p>
          <span class="post-card__foot">${icon("chat")}${esc(nComments((x.comments || []).length))}</span>
        </a>
      </article>`).join("") : `<p class="muted">${esc(t("feedEmpty"))}</p>`}</div>
    </div>`;
  };

  V.thread = (p, id) => {
    const x = allPosts().find((y) => y.id === id);
    if (!x) return V.notFound();
    const rep = reportedSet();
    const comment = (cm) => rep.includes(cm.id) ? `<div class="comment is-hidden">${icon("flag")}${esc(t("reported"))}</div>` : `<div class="comment">
        ${voteBox(cm)}
        <div class="comment__main"><span class="post-card__meta"><strong>${esc(cm.user)}</strong> · ${esc(ago(cm.at))} ${badge(cm)}</span>
        <p>${esc(cm.body)}</p><button class="linkbtn" type="button" data-report="${cm.id}">${icon("flag")}${esc(t("report"))}</button></div></div>`;
    return `<div class="col page">
      ${crumbs([["#/forum", t("forum")], ["#/forum/" + x.cat, L(fcat(x.cat).name)]])}
      ${rep.includes(x.id) ? `<div class="post-card is-hidden">${icon("flag")}${esc(t("reported"))}</div>` : `<article class="post-full">
        ${voteBox(x)}
        <div><span class="post-card__meta">${esc(x.user)} · ${esc(ago(x.at))} ${badge(x)}</span><h1>${esc(x.title)}</h1><p class="post-full__body">${esc(x.body)}</p>
        <button class="linkbtn" type="button" data-report="${x.id}">${icon("flag")}${esc(t("report"))}</button></div>
      </article>`}
      <form class="form reply" id="reply-form" novalidate>
        <div class="field"><label for="r-body">${esc(t("writeReply"))}</label><textarea id="r-body" maxlength="4000"></textarea><span class="err" id="r-body-err"></span></div>
        <div class="reply__row"><div class="field"><label for="r-user">${esc(t("username"))}</label><input id="r-user" maxlength="32" autocomplete="nickname" value="${esc(store.get("username", ""))}"><span class="err" id="r-user-err"></span></div>
        <button class="btn btn--leaf" type="submit">${esc(t("comment"))}</button></div>
      </form>
      <h2 class="sec-title sec-title--sm">${esc(nComments((x.comments || []).length))}</h2>
      <div class="comments">${(x.comments || []).map(comment).join("")}</div>
    </div>`;
  };

  V.forumNew = (p) => {
    const sel = p.get("cat") || "";
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/forum", t("forum")]])}<h1>${esc(t("writePost"))}</h1></header>
      <form class="form" id="post-form" novalidate>
        <div class="field"><label for="f-cat">${esc(t("category"))}</label><select id="f-cat">${O.forumCats.map((c) => `<option value="${c.id}" ${c.id === sel ? "selected" : ""}>${esc(L(c.name))}</option>`).join("")}</select></div>
        <div class="field"><label for="f-title">${esc(t("title"))}</label><input id="f-title" maxlength="120"><span class="err" id="f-title-err"></span></div>
        <div class="field"><label for="f-body">${esc(t("message"))}</label><textarea id="f-body" maxlength="4000"></textarea><span class="err" id="f-body-err"></span></div>
        <div class="field"><label for="f-user">${esc(t("username"))}</label><input id="f-user" maxlength="32" autocomplete="nickname" value="${esc(store.get("username", ""))}"><span class="err" id="f-user-err"></span></div>
        <label class="check"><input type="checkbox" id="f-rules"><span>${esc(t("rulesAgree"))} · <a href="#/rules">${esc(t("rules"))}</a></span></label><span class="err" id="f-rules-err"></span>
        <div><button class="btn btn--leaf" type="submit">${esc(t("post"))}</button></div>
      </form>
    </div>`;
  };

  const infoPage = (titleKey, paras) => `<div class="col page">
    <header class="page-head">${crumbs([["#/", t("home")]])}<h1>${esc(t(titleKey))}</h1></header>
    ${paras.map((x, i) => `<p class="${i ? "" : "lead"}">${esc(x)}</p>`).join("")}
  </div>`;
  V.about = () => infoPage("aboutTitle", t("aboutBody"));
  V.safety = () => infoPage("safetyTitle", t("safetyBody"));
  V.rules = () => `<div class="col page">
    <header class="page-head">${crumbs([["#/forum", t("forum")]])}<h1>${esc(t("rules"))}</h1></header>
    <ol class="rules">${L(O.forumRules).map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
  </div>`;

  V.search = (p) => {
    const q = p.get("q") || "";
    const res = search(q);
    return `<div class="col page">
      <header class="page-head"><h1>${esc(t("searchResults", { q }))}</h1></header>
      ${res.length ? `<ul class="rows">${res.map((r) => row(r.href, r.icon, r.title, r.type)).join("")}</ul>` : `<p class="muted">${esc(t("noResults"))}</p>`}
    </div>`;
  };
  V.notFound = () => `<div class="col page"><h1>${esc(t("notFound"))}</h1><p style="margin-top:12px"><a href="#/">${esc(t("goHome"))}</a></p></div>`;

  /* ------------------------------------------------------------------ search (also used by Flint offline) */
  function search(q) {
    const words = norm(q).split(/\s+/).filter((w) => w.length > 2);
    if (!words.length) return [];
    const items = [];
    O.guides.forEach((g) => items.push({ ref: { type: "guide", id: g.id }, href: "#/g/" + g.id, icon: cat(g.cat).icon, title: L(g.title), type: t("typeGuide"), title2: norm(g.title.en + " " + g.title.pl), hay: norm([g.title.en, g.title.pl, g.summary.en, g.summary.pl, g.keys, cat(g.cat).name.en, cat(g.cat).name.pl].join(" ")) }));
    O.checklists.forEach((c) => items.push({ ref: { type: "checklist", id: c.id }, href: "#/c/" + c.id, icon: "list", title: L(c.title), type: t("typeChecklist"), title2: norm(c.title.en + " " + c.title.pl), hay: norm([c.title.en, c.title.pl, c.summary.en, c.summary.pl].join(" ")) }));
    O.scenarios.forEach((s) => items.push({ ref: { type: "scenario", id: s.id }, href: "#/s/" + s.id, icon: s.icon, title: L(s.title), type: t("typeScenario"), title2: norm(s.title.en + " " + s.title.pl), hay: norm([s.title.en, s.title.pl, s.situation.en, s.situation.pl].join(" ")) }));
    return items.map((it) => {
      let score = 0, hits = 0;
      for (const w of words) {
        const stem = w.length > 5 ? w.slice(0, w.length - 2) : w;
        if (it.title2.includes(stem)) { score += 3; hits++; } else if (it.hay.includes(stem)) { score += 1; hits++; }
      }
      return hits ? Object.assign(it, { score: score + (hits === words.length ? 5 : 0) }) : null;
    }).filter(Boolean).sort((a, b) => b.score - a.score);
  }
  O.search = search;

  function bindHeaderSearch() {
    const input = $("#q"), list = $("#sres");
    let sel = -1;
    const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); sel = -1; };
    const draw = () => {
      const q = input.value.trim();
      if (q.length < 2) { close(); return; }
      const res = search(q).slice(0, 7);
      list.innerHTML = res.length
        ? res.map((r, i) => `<li role="option" id="sr-${i}"><a href="${r.href}" tabindex="-1">${icon(r.icon)}<span>${esc(r.title)}</span><small>${esc(r.type)}</small></a></li>`).join("")
        : `<li class="empty">${esc(t("noResults"))}</li>`;
      list.hidden = false; input.setAttribute("aria-expanded", "true"); sel = -1;
    };
    input.addEventListener("input", draw);
    input.addEventListener("focus", draw);
    input.addEventListener("keydown", (e) => {
      const links = $$("a", list);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!links.length) return;
        e.preventDefault();
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links.forEach((a, i) => a.setAttribute("aria-selected", i === sel));
        input.setAttribute("aria-activedescendant", "sr-" + sel);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (sel >= 0 && links[sel]) location.hash = links[sel].getAttribute("href");
        else if (input.value.trim()) location.hash = "#/search?q=" + encodeURIComponent(input.value.trim());
        input.blur(); close();
      } else if (e.key === "Escape") { close(); input.blur(); }
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".hsearch")) close(); });
    list.addEventListener("click", () => { close(); input.value = ""; });
  }

  /* ------------------------------------------------------------------ drawer (burger menu) */
  function drawerHtml() {
    const cur = location.hash || "#/";
    const a = (href, ic, label) => `<a class="dlink" href="${href}" ${cur === href ? 'aria-current="page"' : ""}>${ic ? icon(ic) : ""}<span>${esc(label)}</span></a>`;
    const open = store.get("drawerOpen", []);
    const group = (key, ic, label, inner) => `<details data-group="${key}" ${open.includes(key) ? "open" : ""}><summary>${icon(ic)}<span>${esc(label)}</span>${icon("chevD", "chev")}</summary><div class="sub">${inner}</div></details>`;
    return `
      ${a("#/", "home", t("home"))}
      ${group("guides", "book", t("guides"), O.categories.map((c) => `<span class="subhead">${esc(L(c.name))}</span>` + O.guides.filter((g) => g.cat === c.id).map((g) => a("#/g/" + g.id, "", L(g.title))).join("")).join(""))}
      ${a("#/practice", "target", t("miniGames"))}
      ${group("checklists", "list", t("checklists"), O.checklists.map((c) => a("#/c/" + c.id, "", L(c.title))).join(""))}
      ${group("scenarios", "compass", t("scenarios"), O.scenarios.map((s) => a("#/s/" + s.id, "", L(s.title))).join(""))}
      ${group("forum", "chat", t("forum"), a("#/forum", "", t("all")) + O.forumCats.map((c) => a("#/forum/" + c.id, "", L(c.name))).join("") + a("#/rules", "", t("rules")))}
      <button type="button" class="dlink dlink--btn" data-open-chat="">${icon("user")}<span>${esc(t("askFlint"))}</span></button>
      <hr>
      ${a("#/skills", "check", t("skills"))}
      ${group("info", "info", t("info"), a("#/about", "", t("about")) + a("#/safety", "", t("safety")))}
      <div class="theme-switch"><span class="theme-switch__label" id="theme-label">${esc(t("theme"))}</span>
        <div class="seg" role="radiogroup" aria-labelledby="theme-label">
          ${[["light", "sun", t("themeLight")], ["dark", "moon", t("themeDark")], ["auto", "", t("themeAuto")]].map(([k, ic, l]) => `<button type="button" role="radio" data-theme-set="${k}" aria-checked="${theme === k}">${ic ? icon(ic) : ""}${esc(l)}</button>`).join("")}
        </div></div>`;
  }
  /* light / dark / follow the device */
  let theme = store.get("theme", "auto");
  function applyTheme(k) {
    theme = k; store.set("theme", k);
    if (k === "light" || k === "dark") document.documentElement.dataset.theme = k;
    else document.documentElement.removeAttribute("data-theme");
    $$("[data-theme-set]").forEach((b) => b.setAttribute("aria-checked", b.dataset.themeSet === k));
  }
  let lastFocus = null;
  function openDrawer() {
    const d = $("#drawer");
    $("#drawer-nav").innerHTML = drawerHtml();
    $$("#drawer-nav details").forEach((el) => el.addEventListener("toggle", () => store.set("drawerOpen", $$("#drawer-nav details[open]").map((x) => x.dataset.group))));
    $$("[data-theme-set]").forEach((b) => b.addEventListener("click", () => applyTheme(b.dataset.themeSet)));
    lastFocus = document.activeElement;
    d.hidden = false;
    requestAnimationFrame(() => d.classList.add("is-open"));
    document.body.classList.add("drawer-open");
    $("#burger").setAttribute("aria-expanded", "true");
    $("#drawer-close").focus();
  }
  function closeDrawer() {
    const d = $("#drawer");
    if (d.hidden) return;
    d.classList.remove("is-open");
    document.body.classList.remove("drawer-open");
    $("#burger").setAttribute("aria-expanded", "false");
    const finish = () => { if (!d.classList.contains("is-open")) d.hidden = true; };
    if (reduced()) finish(); else setTimeout(finish, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ------------------------------------------------------------------ page bindings */
  function bindPage(view, arg, extra) {
    $$("[data-practise]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.practise, list = practised(), i = list.indexOf(id);
      if (i >= 0) list.splice(i, 1); else list.push(id);
      store.set("practised", list);
      const on = i < 0; b.setAttribute("aria-pressed", on); b.querySelector("span").textContent = on ? t("practisedDone") : (view === "skills" ? t("notPractised") : t("practised"));
      const box = b.closest(".practise"); if (box) box.classList.toggle("is-done", on);
    }));
    if (view === "guide") bindGuide(arg);
    if (view === "play") { const sp = extra === "quiz" ? { type: "quiz" } : (O.guideGames[arg] || [])[Number(extra)]; if (sp) O.mountGame($("#solo"), sp, lang, arg); }
    if (view === "scenario") $$(".prio__head").forEach((b) => b.addEventListener("click", () => { const li = b.parentElement, on = !li.classList.contains("is-open"); li.classList.toggle("is-open", on); b.setAttribute("aria-expanded", on); }));
    if (view === "checklist") {
      const key = "cl." + arg;
      const upd = () => {
        const boxes = $$(".clitems input"), done = boxes.filter((b) => b.checked);
        $("#cl-count").textContent = t("items", { done: done.length, total: boxes.length });
        $("#cl-bar").style.width = Math.round((done.length / boxes.length) * 100) + "%";
        store.set(key, done.map((b) => b.dataset.k));
      };
      $$(".clitems input").forEach((b) => b.addEventListener("change", upd));
      $("#cl-print").addEventListener("click", () => window.print());
      $("#cl-reset").addEventListener("click", () => { $$(".clitems input").forEach((b) => (b.checked = false)); upd(); });
      upd();
    }
    // votes and reports (forum)
    $$("[data-vote]").forEach((b) => b.addEventListener("click", () => {
      const v = votes(), id = b.dataset.vote, dir = Number(b.dataset.dir);
      v[id] = v[id] === dir ? 0 : dir; store.set("votes", v);
      const box = b.closest(".vote"); const item = allPosts().flatMap((p) => [p].concat(p.comments || [])).find((x) => x.id === id);
      box.querySelector("span").textContent = scoreOf(item);
      $$("button", box).forEach((x) => x.setAttribute("aria-pressed", v[id] === Number(x.dataset.dir)));
    }));
    $$("[data-report]").forEach((b) => b.addEventListener("click", () => { const r = reportedSet(); r.push(b.dataset.report); store.set("reported", r); render(true); }));
    if (view === "forumNew") {
      $("#post-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = { title: $("#f-title"), body: $("#f-body"), user: $("#f-user") };
        let ok = true;
        Object.entries(f).forEach(([k, el]) => { const bad = !el.value.trim(); $("#f-" + k + "-err").textContent = bad ? t("required") : ""; el.setAttribute("aria-invalid", bad); if (bad) ok = false; });
        const rules = $("#f-rules").checked; $("#f-rules-err").textContent = rules ? "" : t("required"); if (!rules) ok = false;
        if (!ok) { const bad = $("[aria-invalid=true]"); if (bad) bad.focus(); return; }
        const p = { id: "u" + Date.now().toString(36), cat: $("#f-cat").value, user: f.user.value.trim(), title: f.title.value.trim(), body: f.body.value.trim(), at: new Date().toISOString(), score: 1, comments: [] };
        store.set("username", p.user);
        const all = userPosts(); all.push(p); saveUserPosts(all);
        location.hash = "#/t/" + p.id;
      });
    }
    if (view === "thread") {
      $("#reply-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const u = $("#r-user"), bd = $("#r-body"); let ok = true;
        [[u, "r-user"], [bd, "r-body"]].forEach(([el, k]) => { const bad = !el.value.trim(); $("#" + k + "-err").textContent = bad ? t("required") : ""; el.setAttribute("aria-invalid", bad); if (bad) ok = false; });
        if (!ok) return;
        const cm = { id: "c" + Date.now().toString(36), user: u.value.trim(), body: bd.value.trim(), at: new Date().toISOString(), score: 1 };
        store.set("username", cm.user);
        const ups = userPosts(), mine = ups.find((x) => x.id === arg);
        if (mine) { mine.comments.push(cm); saveUserPosts(ups); }
        else { const ex = store.get("seedComments", {}); (ex[arg] = ex[arg] || []).push(cm); store.set("seedComments", ex); }
        render(true);
      });
    }
    // remember which items of a start path have been opened
    if (["guide", "checklist", "scenario"].includes(view)) { const seen = store.get("seen", []); if (!seen.includes(location.hash)) { seen.push(location.hash); store.set("seen", seen); } }
  }

  /* ------------------------------------------------------------------ router */
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    return { name: parts[0] || "", arg: parts[1] ? decodeURIComponent(parts[1]) : null, extra: parts[2] ? decodeURIComponent(parts[2]) : null, params: new URLSearchParams(qs || "") };
  }
  const ROUTES = { "": "home", p: "path", guides: "guides", g: "guide", practice: "practice", play: "play", checklists: "checklists", c: "checklist", scenarios: "scenarios", s: "scenario", skills: "skills",
    forum: "forum", t: "thread", "forum-new": "forumNew", about: "about", safety: "safety", rules: "rules", search: "search" };

  function render(keepScroll) {
    const { name, arg, extra, params } = parseHash();
    const view = ROUTES[name] || "notFound";
    const y = window.scrollY;
    $("#app").innerHTML = V[view](params, arg, extra);
    bindPage(view, arg, extra);
    const h1 = $("#app h1");
    document.title = view === "home" ? "Outlast" : (h1 ? h1.textContent + " · Outlast" : "Outlast");
    document.body.dataset.view = view;
    if (keepScroll) window.scrollTo(0, y);
    else { window.scrollTo(0, 0); if (name) $("#app").focus({ preventScroll: true }); }
    closeDrawer();
  }

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
    $$("[data-t-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.tAria)));
    $$("[data-t-ph]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.tPh)));
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  }

  function init() {
    $("#burger").addEventListener("click", openDrawer);
    $("#drawer-close").addEventListener("click", closeDrawer);
    $("#drawer-scrim").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
    $("#drawer").addEventListener("click", (e) => { if (e.target.closest("[data-open-chat]")) closeDrawer(); const a = e.target.closest("a[href^='#']"); if (a && a.getAttribute("href") === location.hash) closeDrawer(); });
    $$(".lang button").forEach((b) => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); applyLang(); O.chat && O.chat.setLang(lang); render(true); }));
    bindHeaderSearch();
    window.addEventListener("hashchange", () => render(false));
    applyLang();
    if (O.chat) O.chat.init(lang);
    render(false);
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !window.claude) {
      try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) { /* not available here */ }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
