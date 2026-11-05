/* Outlast — app shell: routing, menu, search, pages. Plain JS, no dependencies. */
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

  /* ------------------------------------------------------------------ small components */
  const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([href, label], i) =>
    (i ? icon("chevR") : "") + (href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`)).join("")}</nav>`;
  const levelText = (n) => t("level" + n);
  const practised = () => store.get("practised", []);
  const isPractised = (id) => practised().includes(id);

  function guideRow(g) {
    const c = cat(g.cat);
    return `<li><a class="row" href="#/g/${g.id}">
      <span class="row__icon">${icon(c.icon)}</span>
      <span class="row__text"><strong>${esc(L(g.title))}</strong><span>${esc(L(c.name))} · ${esc(t("minutes", { n: g.mins }))} · ${esc(levelText(g.level))}</span></span>
      <span class="row__meta">${isPractised(g.id) ? `<span class="row__done" title="${esc(t("practisedDone"))}">${icon("check")}</span>` : ""}${icon("chevR")}</span>
    </a></li>`;
  }
  const simpleRow = (href, ic, title, sub, meta = "") => `<li><a class="row" href="${href}">
      <span class="row__icon">${icon(ic)}</span>
      <span class="row__text"><strong>${esc(title)}</strong>${sub ? `<span>${esc(sub)}</span>` : ""}</span>
      <span class="row__meta">${meta}${icon("chevR")}</span></a></li>`;

  function linkFor(ref) {
    const [type, id] = ref.split(":");
    if (type === "guide") { const g = guide(id); return g && ["#/g/" + id, L(g.title)]; }
    if (type === "checklist") { const c = checklist(id); return c && ["#/c/" + id, L(c.title)]; }
    if (type === "scenario") { const s = scenario(id); return s && ["#/s/" + id, L(s.title)]; }
    if (type === "scenarios") return ["#/scenarios", t("allScenarios")];
    return null;
  }

  /* ------------------------------------------------------------------ views */
  const V = {};

  V.home = () => {
    const popular = O.guides.filter((g) => g.popular);
    return `
    <section class="contours hero">
      <div class="col">
        <h1>${esc(t("heroTitle"))}</h1>
        <p>${esc(t("heroLead"))}</p>
        <div class="hero__actions">
          <a class="btn btn--light" href="#/g/boil-water">${icon("drop")}${esc(t("quickPurify"))}</a>
          <a class="btn btn--ghost-light" href="#/scenarios">${icon("target")}${esc(t("scenarioTitle"))}</a>
        </div>
      </div>
    </section>
    <div class="col page">
      <section>
        <h2>${esc(t("startHere"))}</h2>
        <div class="paths" style="margin-top:14px">
          ${O.startPaths.map((p) => `<div class="path">
            <h3>${icon(p.icon)}${esc(L(p.t))}</h3><p>${esc(L(p.b))}</p>
            <ol>${p.links.map(linkFor).filter(Boolean).map(([h, l]) => `<li><a href="${h}"><span>${esc(l)}</span></a></li>`).join("")}</ol>
          </div>`).join("")}
        </div>
      </section>
      <section class="section">
        <div class="sec-row"><h2>${esc(t("mostUsed"))}</h2><a href="#/guides">${esc(t("allGuides"))}</a></div>
        <ul class="rows">${popular.map(guideRow).join("")}</ul>
      </section>
      <section class="section">
        <div class="callout">
          <div><h2>${esc(t("scenarioTitle"))}</h2><p>${esc(t("scenarioLead"))}</p></div>
          <a class="btn btn--leaf" href="#/scenarios">${esc(t("openScenarios"))}${icon("arrowR")}</a>
        </div>
      </section>
      <section class="section">
        <h2>${esc(t("byCategory"))}</h2>
        <div class="tiles" style="margin-top:14px">
          ${O.categories.map((c) => `<a class="tile" href="#/guides/${c.id}">${icon(c.icon)}<strong>${esc(L(c.name))}</strong><span>${esc(L(c.blurb))}</span></a>`).join("")}
          <a class="tile" href="#/checklists">${icon("list")}<strong>${esc(t("checklists"))}</strong><span>${O.checklists.map((c) => esc(L(c.title))).join(" · ")}</span></a>
        </div>
      </section>
      <section class="section">
        <h2>${esc(t("whyTitle"))}</h2>
        <p class="lead" style="margin-top:10px">${esc(t("whyText"))}</p>
      </section>
    </div>`;
  };

  V.guides = (p, catId) => {
    const c = catId ? cat(catId) : null;
    if (catId && !c) return V.notFound();
    const list = c ? O.guides.filter((g) => g.cat === c.id) : O.guides;
    const body = c
      ? `<ul class="rows">${list.map(guideRow).join("")}</ul>`
      : O.categories.map((k) => `<section class="section"><div class="sec-row"><h2>${icon(k.icon)} ${esc(L(k.name))}</h2></div><ul class="rows">${O.guides.filter((g) => g.cat === k.id).map(guideRow).join("")}</ul></section>`).join("");
    return `<div class="col page">
      <header class="page-head">
        ${crumbs([["#/", t("home")], c ? ["#/guides", t("guides")] : [null, t("guides")]].concat(c ? [[null, L(c.name)]] : []))}
        <h1>${esc(c ? L(c.name) : t("guides"))}</h1>
        ${c ? `<p class="lead">${esc(L(c.blurb))}</p>` : ""}
      </header>
      ${body}
    </div>`;
  };

  V.guide = (p, id) => {
    const g = guide(id);
    if (!g) return V.notFound();
    const c = cat(g.cat);
    const sibs = O.guides.filter((x) => x.cat === g.cat);
    const i = sibs.indexOf(g), prev = sibs[i - 1], next = sibs[i + 1];
    const done = isPractised(g.id);
    return `<article class="col page">
      <header class="page-head">
        ${crumbs([["#/", t("home")], ["#/guides", t("guides")], ["#/guides/" + c.id, L(c.name)]])}
        <h1>${esc(L(g.title))}</h1>
        <p class="lead" style="margin-top:8px">${esc(L(g.summary))}</p>
        <div class="meta"><span>${icon("clock")}${esc(t("minutes", { n: g.mins }))}</span><span>${icon("steps")}${esc(levelText(g.level))}</span><span>${icon(c.icon)}${esc(L(c.name))}</span></div>
        <p class="draft">${icon("info")}<span>${esc(t("draft"))}</span></p>
      </header>
      <section class="box box--need"><h2>${icon("list")}${esc(t("youNeed"))}</h2><ul>${L(g.need).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
      <section class="box box--warn" role="note"><h2>${icon("warn")}${esc(t("safetyFirst"))}</h2><ul>${L(g.warn).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
      <section class="section"><h2 class="sr-only">${esc(t("steps"))}</h2>
        <ol class="steps">${g.steps.map((s, n) => `<li class="step" id="step-${n + 1}">
          <figure class="step__fig">${O.diagram(s.d, lang, L(s.t))}</figure>
          <div><div class="step__num">${esc(t("step", { n: n + 1 }))}</div><h3>${esc(L(s.t))}</h3><p>${esc(L(s.b))}</p></div>
        </li>`).join("")}</ol>
      </section>
      <div class="practise ${done ? "is-done" : ""}">
        <button class="toggle" type="button" data-practise="${g.id}" aria-pressed="${done}">${icon("check")}<span>${esc(done ? t("practisedDone") : t("practised"))}</span></button>
        <a class="muted" href="#/skills">${esc(t("skills"))}</a>
      </div>
      ${g.related && g.related.length ? `<section class="section"><h2>${esc(t("related"))}</h2><div class="chips" style="margin-top:10px">${g.related.map(guide).filter(Boolean).map((r) => `<a class="chip" href="#/g/${r.id}">${icon(cat(r.cat).icon)}${esc(L(r.title))}</a>`).join("")}</div></section>` : ""}
      <section class="section sources"><h2 style="font-size:1.15rem">${esc(t("sources"))}</h2><ul>${g.sources.map((s) => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)}</li>`).join("")}</ul></section>
      <nav class="pager">
        ${prev ? `<a href="#/g/${prev.id}"><small>${esc(t("prev"))}</small><strong>${esc(L(prev.title))}</strong></a>` : "<span></span>"}
        ${next ? `<a href="#/g/${next.id}"><small>${esc(t("next"))}</small><strong>${esc(L(next.title))}</strong></a>` : ""}
      </nav>
    </article>`;
  };

  V.checklists = () => `<div class="col page">
    <header class="page-head">${crumbs([["#/", t("home")], [null, t("checklists")]])}<h1>${esc(t("checklists"))}</h1></header>
    <ul class="rows">${O.checklists.map((c) => {
      const all = c.groups.flatMap((g) => g.items).length, done = (store.get("cl." + c.id, [])).length;
      return simpleRow("#/c/" + c.id, c.icon, L(c.title), L(c.summary), done ? `<span>${done}/${all}</span>` : "");
    }).join("")}</ul>
  </div>`;

  V.checklist = (p, id) => {
    const c = checklist(id);
    if (!c) return V.notFound();
    const ticked = store.get("cl." + c.id, []);
    let n = 0;
    return `<div class="col page">
      <header class="page-head">
        ${crumbs([["#/", t("home")], ["#/checklists", t("checklists")]])}
        <h1>${esc(L(c.title))}</h1><p class="lead" style="margin-top:8px">${esc(L(c.summary))}</p>
      </header>
      <div class="cl-tools">
        <div class="progress"><small id="cl-count"></small><div class="bar"><i id="cl-bar"></i></div></div>
        <button class="btn btn--line btn--sm" type="button" id="cl-print">${icon("print")}${esc(t("printList"))}</button>
        <button class="btn btn--line btn--sm" type="button" id="cl-reset">${esc(t("resetList"))}</button>
      </div>
      ${c.groups.map((g) => `<section class="clgroup"><h2>${esc(L(g.name))}</h2><ul class="clitems">${g.items.map((it) => {
        const k = c.id + "-" + (n++);
        return `<li><label><input type="checkbox" data-k="${k}" ${ticked.includes(k) ? "checked" : ""}><span>${esc(L(it))}</span></label></li>`;
      }).join("")}</ul></section>`).join("")}
      <p class="muted no-print" style="margin-top:14px;font-size:0.9rem">${esc(t("checklistNote"))}</p>
    </div>`;
  };

  V.scenarios = () => `<div class="col page">
    <header class="page-head">${crumbs([["#/", t("home")], [null, t("scenarios")]])}<h1>${esc(t("scenarioTitle"))}</h1><p class="lead" style="margin-top:8px">${esc(t("scenarioLead"))}</p></header>
    <ul class="rows">${O.scenarios.map((s) => simpleRow("#/s/" + s.id, s.icon, L(s.title), L(s.situation))).join("")}</ul>
  </div>`;

  V.scenario = (p, id) => {
    const s = scenario(id);
    if (!s) return V.notFound();
    const pack = checklist(s.pack);
    const i = O.scenarios.indexOf(s), next = O.scenarios[i + 1], prev = O.scenarios[i - 1];
    return `<article class="col page">
      <header class="page-head">${crumbs([["#/", t("home")], ["#/scenarios", t("scenarios")]])}<h1>${esc(L(s.title))}</h1></header>
      <section><p class="eyebrow">${esc(t("situation"))}</p><div class="situation">${esc(L(s.situation))}</div>
        <p class="fact">${icon("info")}<span>${esc(L(s.fact))}</span></p></section>
      <section class="section"><h2>${esc(t("priorities"))}</h2>
        <ol class="prio" style="margin-top:18px">${s.priority.map((x) => `<li><h3>${esc(L(x.t))}</h3><p>${esc(L(x.b))}</p>
          ${x.g && x.g.length ? `<div class="chips">${x.g.map(guide).filter(Boolean).map((g) => `<a class="chip" href="#/g/${g.id}">${icon(cat(g.cat).icon)}${esc(L(g.title))}</a>`).join("")}</div>` : ""}
        </li>`).join("")}</ol>
      </section>
      <section class="section"><h2>${esc(t("avoid"))}</h2><ul class="avoid" style="margin-top:10px">${L(s.avoid).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
      ${pack ? `<section class="section"><h2>${esc(t("packList"))}</h2><ul class="rows" style="margin-top:10px">${simpleRow("#/c/" + pack.id, pack.icon, L(pack.title), L(pack.summary))}</ul></section>` : ""}
      <nav class="pager">
        ${prev ? `<a href="#/s/${prev.id}"><small>${esc(t("prev"))}</small><strong>${esc(L(prev.title))}</strong></a>` : "<span></span>"}
        ${next ? `<a href="#/s/${next.id}"><small>${esc(t("next"))}</small><strong>${esc(L(next.title))}</strong></a>` : ""}
      </nav>
    </article>`;
  };

  V.skills = () => {
    const done = practised().filter((id) => guide(id));
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/", t("home")], [null, t("skills")]])}<h1>${esc(t("skills"))}</h1><p class="lead" style="margin-top:8px">${esc(t("skillsLead"))}</p></header>
      <div class="progress" style="margin-bottom:10px"><small>${esc(t("skillsDone", { done: done.length, total: O.guides.length }))}</small><div class="bar"><i style="width:${Math.round(done.length / O.guides.length * 100)}%"></i></div></div>
      ${O.categories.map((c) => `<section class="section"><h2 style="font-size:1.3rem">${icon(c.icon)} ${esc(L(c.name))}</h2>
        ${O.guides.filter((g) => g.cat === c.id).map((g) => { const on = done.includes(g.id); return `<div class="skill-row"><a href="#/g/${g.id}">${esc(L(g.title))}</a>
          <button class="toggle" type="button" data-practise="${g.id}" aria-pressed="${on}">${icon("check")}<span>${esc(on ? t("practisedDone") : t("notPractised"))}</span></button></div>`; }).join("")}
      </section>`).join("")}
    </div>`;
  };

  /* --- forum (stored in this browser for now) */
  const forum = () => store.get("forum", []);
  const saveForum = (x) => store.set("forum", x);
  const when = (iso) => { try { return new Date(iso).toLocaleString(lang === "pl" ? "pl-PL" : "en-GB", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return iso; } };

  V.forum = (p, catId) => {
    const c = catId ? fcat(catId) : null;
    if (catId && !c) return V.notFound();
    const threads = forum().filter((th) => !c || th.cat === c.id).sort((a, b) => (b.last || b.at).localeCompare(a.last || a.at));
    return `<div class="col page">
      <header class="page-head">
        ${crumbs([["#/", t("home")]].concat(c ? [["#/forum", t("forum")], [null, L(c.name)]] : [[null, t("forum")]]))}
        <h1>${esc(c ? L(c.name) : t("forum"))}</h1><p class="lead" style="margin-top:8px">${esc(t("forumLead"))}</p>
      </header>
      <p class="notice">${icon("info")}<span>${esc(t("forumDemo"))}</span></p>
      <div class="sec-row"><a href="#/rules">${icon("shield")} ${esc(t("rules"))}</a><a class="btn btn--leaf btn--sm" href="#/forum-new${c ? "?cat=" + c.id : ""}">${icon("plus")}${esc(t("newPost"))}</a></div>
      ${c ? "" : `<ul class="rows" style="margin-bottom:26px">${O.forumCats.map((k) => simpleRow("#/forum/" + k.id, k.icon, L(k.name), t("threads", { n: forum().filter((x) => x.cat === k.id).length }))).join("")}</ul>`}
      ${c || threads.length ? `<ul class="rows">${threads.length ? threads.map((th) => `<li><a class="row thread-row" href="#/t/${th.id}">
        <span class="row__icon">${icon("chat")}</span>
        <span class="row__text"><strong>${esc(th.reported ? t("reported") : th.title)}</strong><span>${esc(th.user)} · ${esc(when(th.at))} · ${esc(t("replies", { n: (th.replies || []).length }))}</span></span>
        <span class="row__meta">${icon("chevR")}</span></a></li>`).join("") : `<li class="muted" style="padding:16px 4px">${esc(t("noThreads"))}</li>`}</ul>` : ""}
    </div>`;
  };

  const postHtml = (x, tid, isReply) => {
    const id = isReply ? x.id : "op";
    if (x.reported && !x._show) return `<div class="post"><div class="hidden-post">${icon("flag")}<span>${esc(t("reported"))}</span><button class="linkbtn" type="button" data-show="${tid}:${id}">${esc(t("showAnyway"))}</button></div></div>`;
    return `<div class="post">
      <div class="post__head">${icon("user")}<strong>${esc(x.user)}</strong><span>${esc(when(x.at))}</span><span class="badge">${icon("warn")}${esc(t("unverified"))}</span></div>
      <div class="post__body">${esc(x.body)}</div>
      <div class="post__foot"><button class="linkbtn" type="button" data-report="${tid}:${id}">${icon("flag")}${esc(t("report"))}</button></div>
    </div>`;
  };

  V.thread = (p, id) => {
    const th = forum().find((x) => x.id === id);
    if (!th) return V.notFound();
    const c = fcat(th.cat);
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/", t("home")], ["#/forum", t("forum")], ["#/forum/" + c.id, L(c.name)]])}<h1>${esc(th.reported && !th._show ? t("reported") : th.title)}</h1></header>
      ${postHtml(th, th.id, false)}
      ${(th.replies || []).map((r) => postHtml(r, th.id, true)).join("")}
      <form class="form" id="reply-form" novalidate>
        <h2 style="font-size:1.3rem">${esc(t("writeReply"))}</h2>
        <div class="field"><label for="r-user">${esc(t("username"))}</label><input id="r-user" name="user" maxlength="32" autocomplete="nickname" value="${esc(store.get("username", ""))}"><span class="err" id="r-user-err"></span></div>
        <div class="field"><label for="r-body">${esc(t("message"))}</label><textarea id="r-body" name="body" maxlength="4000"></textarea><span class="err" id="r-body-err"></span></div>
        <div><button class="btn btn--leaf" type="submit">${esc(t("reply"))}</button></div>
      </form>
    </div>`;
  };

  V.forumNew = (p) => {
    const sel = p.get("cat") || "";
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/", t("home")], ["#/forum", t("forum")], [null, t("newPost")]])}<h1>${esc(t("newPost"))}</h1></header>
      <p class="notice">${icon("info")}<span>${esc(t("forumDemo"))}</span></p>
      <form class="form" id="post-form" novalidate>
        <div class="field"><label for="f-user">${esc(t("username"))}</label><input id="f-user" name="user" maxlength="32" autocomplete="nickname" value="${esc(store.get("username", ""))}"><span class="err" id="f-user-err"></span></div>
        <div class="field"><label for="f-cat">${esc(t("category"))}</label><select id="f-cat" name="cat">${O.forumCats.map((c) => `<option value="${c.id}" ${c.id === sel ? "selected" : ""}>${esc(L(c.name))}</option>`).join("")}</select></div>
        <div class="field"><label for="f-title">${esc(t("title"))}</label><input id="f-title" name="title" maxlength="120"><span class="err" id="f-title-err"></span></div>
        <div class="field"><label for="f-body">${esc(t("message"))}</label><textarea id="f-body" name="body" maxlength="4000"></textarea><span class="err" id="f-body-err"></span></div>
        <label class="check"><input type="checkbox" id="f-rules"><span>${esc(t("rulesAgree"))} · <a href="#/rules">${esc(t("rules"))}</a></span></label><span class="err" id="f-rules-err"></span>
        <div><button class="btn btn--leaf" type="submit">${esc(t("post"))}</button></div>
      </form>
    </div>`;
  };

  const infoPage = (titleKey, paras, crumb) => `<div class="col page">
    <header class="page-head">${crumbs([["#/", t("home")], [null, crumb]])}<h1>${esc(t(titleKey))}</h1></header>
    ${paras.map((x, i) => `<p class="${i ? "" : "lead"}">${esc(x)}</p>`).join("")}
  </div>`;
  V.about = () => infoPage("aboutTitle", t("aboutBody"), t("about"));
  V.safety = () => infoPage("safetyTitle", t("safetyBody"), t("safety"));
  V.rules = () => `<div class="col page">
    <header class="page-head">${crumbs([["#/", t("home")], ["#/forum", t("forum")], [null, t("rules")]])}<h1>${esc(t("rules"))}</h1></header>
    <ol class="avoid">${L(O.forumRules).map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
    <p style="margin-top:18px"><a class="btn btn--leaf" href="#/forum">${esc(t("forum"))}${icon("arrowR")}</a></p>
  </div>`;

  V.search = (p) => {
    const q = p.get("q") || "";
    const res = search(q);
    return `<div class="col page">
      <header class="page-head">${crumbs([["#/", t("home")], [null, t("searchLabel")]])}<h1>${esc(t("searchResults", { q }))}</h1></header>
      ${res.length ? `<ul class="rows">${res.map((r) => simpleRow(r.href, r.icon, r.title, r.type)).join("")}</ul>` : `<p class="muted">${esc(t("noResults"))}</p>`}
    </div>`;
  };

  V.notFound = () => `<div class="col page"><h1>${esc(t("notFound"))}</h1><p style="margin-top:12px"><a href="#/">${esc(t("goHome"))}</a></p></div>`;

  /* ------------------------------------------------------------------ search */
  function search(q) {
    const words = norm(q).split(/\s+/).filter((w) => w.length > 1);
    if (!words.length) return [];
    const items = [];
    O.guides.forEach((g) => items.push({ href: "#/g/" + g.id, icon: cat(g.cat).icon, title: L(g.title), type: t("typeGuide"), title2: norm(g.title.en + " " + g.title.pl), hay: norm([g.title.en, g.title.pl, g.summary.en, g.summary.pl, g.keys, cat(g.cat).name.en, cat(g.cat).name.pl].join(" ")) }));
    O.checklists.forEach((c) => items.push({ href: "#/c/" + c.id, icon: "list", title: L(c.title), type: t("typeChecklist"), title2: norm(c.title.en + " " + c.title.pl), hay: norm([c.title.en, c.title.pl, c.summary.en, c.summary.pl].concat(c.groups.flatMap((g) => g.items.flatMap((i) => [i.en, i.pl]))).join(" ")) }));
    O.scenarios.forEach((s) => items.push({ href: "#/s/" + s.id, icon: s.icon, title: L(s.title), type: t("typeScenario"), title2: norm(s.title.en + " " + s.title.pl), hay: norm([s.title.en, s.title.pl, s.situation.en, s.situation.pl].join(" ")) }));
    return items.map((it) => {
      let score = 0;
      for (const w of words) {
        if (it.title2.includes(w)) score += 3;
        else if (it.hay.includes(w)) score += 1;
        else return null;
      }
      return Object.assign(it, { score });
    }).filter(Boolean).sort((a, b) => b.score - a.score);
  }

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

  /* ------------------------------------------------------------------ drawer */
  function drawerHtml() {
    const cur = location.hash || "#/";
    const a = (href, ic, label) => `<a class="dlink" href="${href}" ${cur === href ? 'aria-current="page"' : ""}>${ic ? icon(ic) : ""}<span>${esc(label)}</span></a>`;
    const open = store.get("drawerOpen", []);
    const group = (key, ic, label, inner) => `<details data-group="${key}" ${open.includes(key) ? "open" : ""}><summary>${icon(ic)}<span>${esc(label)}</span>${icon("chevD", "chev")}</summary><div class="sub">${inner}</div></details>`;
    return `
      ${a("#/", "home", t("home"))}
      ${group("guides", "book", t("guides"), O.categories.map((c) => `<span class="subhead">${esc(L(c.name))}</span>` + O.guides.filter((g) => g.cat === c.id).map((g) => a("#/g/" + g.id, "", L(g.title))).join("")).join("") + a("#/guides", "", t("allGuides")))}
      ${group("checklists", "list", t("checklists"), O.checklists.map((c) => a("#/c/" + c.id, "", L(c.title))).join(""))}
      ${group("scenarios", "target", t("scenarios"), O.scenarios.map((s) => a("#/s/" + s.id, "", L(s.title))).join("") + a("#/scenarios", "", t("allScenarios")))}
      ${group("forum", "chat", t("forum"), a("#/forum", "", t("forum")) + O.forumCats.map((c) => a("#/forum/" + c.id, "", L(c.name))).join("") + a("#/rules", "", t("rules")))}
      <hr>
      ${a("#/skills", "check", t("skills"))}
      ${group("info", "info", t("info"), a("#/about", "", t("about")) + a("#/safety", "", t("safety")) + a("#/rules", "", t("rules")))}`;
  }
  let lastFocus = null;
  function openDrawer() {
    const d = $("#drawer");
    $("#drawer-nav").innerHTML = drawerHtml();
    $$("#drawer-nav details").forEach((el) => el.addEventListener("toggle", () => store.set("drawerOpen", $$("#drawer-nav details[open]").map((x) => x.dataset.group))));
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish(); else setTimeout(finish, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ------------------------------------------------------------------ bindings per page */
  function bindPage(view) {
    $$("[data-practise]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.practise, list = practised(), i = list.indexOf(id);
      if (i >= 0) list.splice(i, 1); else list.push(id);
      store.set("practised", list);
      render(true);
    }));
    if (view === "checklist") {
      const id = parseHash().arg, key = "cl." + id;
      const upd = () => {
        const boxes = $$(".clitems input"), done = boxes.filter((b) => b.checked);
        $("#cl-count").textContent = t("items", { done: done.length, total: boxes.length });
        $("#cl-bar").style.width = Math.round(done.length / boxes.length * 100) + "%";
        store.set(key, done.map((b) => b.dataset.k));
      };
      $$(".clitems input").forEach((b) => b.addEventListener("change", upd));
      $("#cl-print").addEventListener("click", () => window.print());
      $("#cl-reset").addEventListener("click", () => { $$(".clitems input").forEach((b) => (b.checked = false)); upd(); });
      upd();
    }
    if (view === "forumNew") {
      $("#post-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = { user: $("#f-user"), title: $("#f-title"), body: $("#f-body") };
        let ok = true;
        Object.entries(f).forEach(([k, el]) => { const bad = !el.value.trim(); $("#f-" + k + "-err").textContent = bad ? t("required") : ""; el.setAttribute("aria-invalid", bad); if (bad) ok = false; });
        const rules = $("#f-rules").checked; $("#f-rules-err").textContent = rules ? "" : t("required"); if (!rules) ok = false;
        if (!ok) { const bad = $("[aria-invalid=true]"); if (bad) bad.focus(); return; }
        const now = new Date().toISOString();
        const th = { id: Date.now().toString(36), cat: $("#f-cat").value, user: f.user.value.trim(), title: f.title.value.trim(), body: f.body.value.trim(), at: now, last: now, replies: [] };
        store.set("username", th.user);
        const all = forum(); all.push(th); saveForum(all);
        location.hash = "#/t/" + th.id;
      });
    }
    if (view === "thread") {
      const tid = parseHash().arg;
      $$("[data-report]").forEach((b) => b.addEventListener("click", () => {
        const [, pid] = b.dataset.report.split(":"); const all = forum(); const th = all.find((x) => x.id === tid);
        const target = pid === "op" ? th : th.replies.find((r) => r.id === pid); target.reported = true; saveForum(all); render(true);
      }));
      $$("[data-show]").forEach((b) => b.addEventListener("click", () => {
        const [, pid] = b.dataset.show.split(":"); b.closest(".post").outerHTML = postHtml(Object.assign({}, pid === "op" ? forum().find((x) => x.id === tid) : forum().find((x) => x.id === tid).replies.find((r) => r.id === pid), { _show: true }), tid, pid !== "op");
      }));
      $("#reply-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const u = $("#r-user"), bd = $("#r-body"); let ok = true;
        [[u, "r-user"], [bd, "r-body"]].forEach(([el, k]) => { const bad = !el.value.trim(); $("#" + k + "-err").textContent = bad ? t("required") : ""; el.setAttribute("aria-invalid", bad); if (bad) ok = false; });
        if (!ok) return;
        const all = forum(), th = all.find((x) => x.id === tid), now = new Date().toISOString();
        th.replies = th.replies || []; th.replies.push({ id: Date.now().toString(36), user: u.value.trim(), body: bd.value.trim(), at: now }); th.last = now;
        store.set("username", u.value.trim()); saveForum(all); render(true);
      });
    }
  }

  /* ------------------------------------------------------------------ router */
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    return { name: parts[0] || "", arg: parts[1] ? decodeURIComponent(parts[1]) : null, params: new URLSearchParams(qs || "") };
  }
  const ROUTES = { "": "home", guides: "guides", g: "guide", checklists: "checklists", c: "checklist", scenarios: "scenarios", s: "scenario", skills: "skills",
    forum: "forum", t: "thread", "forum-new": "forumNew", about: "about", safety: "safety", rules: "rules", search: "search" };

  function render(keepScroll) {
    const { name, arg, params } = parseHash();
    const view = ROUTES[name] || "notFound";
    const y = window.scrollY;
    $("#app").innerHTML = V[view](params, arg);
    bindPage(view);
    const h1 = $("#app h1");
    document.title = view === "home" ? "Outlast" : (h1 ? h1.textContent + " · Outlast" : "Outlast");
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
    $("#drawer").addEventListener("click", (e) => { const a = e.target.closest("a[href^='#']"); if (a && a.getAttribute("href") === location.hash) closeDrawer(); });
    $$(".lang button").forEach((b) => b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); applyLang(); render(true); }));
    bindHeaderSearch();
    window.addEventListener("hashchange", () => render(false));
    applyLang();
    render(false);
    // offline support: cache the whole site after the first visit (needs http/https)
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) { /* not available here */ }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
