/* Outlast — "Ask Flint": an original survival-guide character.
   Uses Claude through the page's `sample` capability when the site runs as a claude.ai artifact;
   everywhere else (local files, offline) Flint answers from Outlast's own guides. */
(function () {
  "use strict";
  const OUT = (window.OUT = window.OUT || {});
  const $ = (s, r = document) => r.querySelector(s);

  const S = {
    en: { open: "Ask Flint", title: "Flint", live: "Field guide · AI", offline: "Field guide · offline notes", placeholder: "Ask about water, fire, shelter, knots…",
      send: "Send", stop: "Stop", close: "Close chat", thinking: "Flint is thinking…", hello: "Flint here. Ask me anything about staying alive outdoors: water, fire, shelter, knots, getting found. If someone is hurt right now, call 112 first.",
      chips: ["How do I make stream water safe?", "I'm lost. What do I do first?", "Best knot for a tarp line?", "Someone is shivering and confused"],
      err: "Lost the signal on that one. Try again in a moment.", notAllowed: "AI answers are switched off here, so I'll answer from the field notes.", guide: "Guide", ai: "AI can make mistakes. Check the guides, and in an emergency call 112." },
    pl: { open: "Zapytaj Flinta", title: "Flint", live: "Przewodnik · AI", offline: "Przewodnik · notatki offline", placeholder: "Zapytaj o wodę, ogień, schronienie, węzły…",
      send: "Wyślij", stop: "Stop", close: "Zamknij czat", thinking: "Flint myśli…", hello: "Tu Flint. Pytaj o wszystko, co pomaga przetrwać w terenie: woda, ogień, schronienie, węzły, wzywanie pomocy. Jeśli ktoś jest teraz ranny, najpierw dzwoń pod 112.",
      chips: ["Jak uzdatnić wodę ze strumienia?", "Zgubiłem się. Co robić najpierw?", "Jaki węzeł na linkę od plandeki?", "Ktoś drży i jest zdezorientowany"],
      err: "Straciłem zasięg przy tej odpowiedzi. Spróbuj za chwilę.", notAllowed: "Odpowiedzi AI są tu wyłączone, więc odpowiem z notatek.", guide: "Poradnik", ai: "AI może się mylić. Sprawdzaj poradniki, a w nagłym wypadku dzwoń pod 112." }
  };

  let lang = "en", sample = null, sampleReady = null, turns = [], busy = null;
  const s = (k) => (S[lang] || S.en)[k];

  // Resolve the AI capability once; null when this page isn't running inside a Claude viewer.
  function getSample() {
    if (sampleReady) return sampleReady;
    sampleReady = (window.claude && typeof window.claude.use === "function")
      ? window.claude.use("sample").then((x) => (sample = x)).catch(() => null)
      : Promise.resolve(null);
    return sampleReady;
  }

  function rules() {
    const list = OUT.guides.map((g) => `${g.id}: ${g.title.en}`).join("\n");
    const scen = OUT.scenarios.map((x) => `${x.id}: ${x.title.en}`).join("\n");
    return `You are Flint, the field guide character on Outlast, a survival-skills website for hikers, scouts and teenagers.
Voice: an experienced expedition leader. Energetic, warm, direct. Short punchy sentences. Practical, never dramatic. Encourage people to practise skills safely. You are an original character: never claim to be, or imitate, any real person or TV presenter.
Rules:
- Safety first. If anything sounds like an emergency happening now (injury, someone missing, severe cold or heat, unconscious), start with: call 112 (EU emergency number).
- Give clear, checked, mainstream advice (Red Cross, national health services, park services). If unsure, say so. Never give advice on weapons, hunting animals, or anything illegal.
- Keep answers under 120 words. Use a short numbered list when giving steps.
- When an Outlast guide or scenario fits, link it exactly as [[guide:ID]] or [[scenario:ID]] using these IDs.
Guides:
${list}
Scenarios:
${scen}
- Answer in ${lang === "pl" ? "Polish" : "English"}.`;
  }

  /* offline answers from the site's own content */
  const OPENERS = {
    en: ["Right, here's what matters.", "Good question. Let's keep it simple.", "Listen up, this one's important.", "Here's how I'd do it."],
    pl: ["Dobra, oto co się liczy.", "Dobre pytanie. Prosto i konkretnie.", "Słuchaj, to ważne.", "Ja zrobiłbym to tak."]
  };
  const URGENT = /(bleed|blood|unconscious|not breathing|hurt|injur|emergency|help me|broken|krew|krwaw|nieprzytom|ranny|uraz|pomoc|złama|zlama|wypad)/i;
  function offlineAnswer(q) {
    const hits = (OUT.search ? OUT.search(q) : []);
    const g = hits.map((h) => h.ref).find((r) => r && r.type === "guide");
    const sc = hits.map((h) => h.ref).find((r) => r && r.type === "scenario");
    const op = OPENERS[lang][Math.floor(Math.random() * OPENERS[lang].length)];
    let out = URGENT.test(q) ? (lang === "pl" ? "Jeśli to dzieje się teraz: najpierw dzwoń pod 112.\n\n" : "If this is happening right now: call 112 first.\n\n") : "";
    if (g) {
      const gd = OUT.guides.find((x) => x.id === g.id);
      out += op + "\n" + gd.steps.slice(0, 4).map((st, i) => `${i + 1}. ${st.t[lang] || st.t.en}`).join("\n") + `\n\n[[guide:${gd.id}]]`;
      if (sc) out += ` [[scenario:${sc.id}]]`;
    } else if (sc) {
      out += op + `\n[[scenario:${sc.id}]]`;
    } else {
      out += lang === "pl" ? "Tego nie mam jeszcze w notatkach. Spróbuj zapytać o wodę, ogień, schronienie, pierwszą pomoc, węzły lub sygnalizację." : "That's not in my field notes yet. Try asking about water, fire, shelter, first aid, knots or signalling.";
    }
    return out;
  }

  /* render text with [[guide:id]] links, safely */
  function renderText(el, text) {
    el.textContent = "";
    const parts = String(text).split(/(\[\[(?:guide|scenario):[a-z0-9-]+\]\])/g);
    parts.forEach((p) => {
      const m = p.match(/^\[\[(guide|scenario):([a-z0-9-]+)\]\]$/);
      if (m) {
        const item = m[1] === "guide" ? OUT.guides.find((g) => g.id === m[2]) : OUT.scenarios.find((x) => x.id === m[2]);
        if (!item) return;
        const a = document.createElement("a");
        a.className = "chat__link";
        a.href = (m[1] === "guide" ? "#/g/" : "#/s/") + m[2];
        a.textContent = item.title[lang] || item.title.en;
        a.addEventListener("click", () => close());
        el.appendChild(a);
      } else if (p) el.appendChild(document.createTextNode(p.replace(/\*\*(.+?)\*\*/g, "$1")));
    });
  }

  function bubble(role, text) {
    const b = document.createElement("div");
    b.className = "msg msg--" + role;
    renderText(b, text);
    $("#chat-log").appendChild(b);
    $("#chat-log").scrollTop = $("#chat-log").scrollHeight;
    return b;
  }

  async function ask(q) {
    q = q.trim();
    if (!q || busy) return;
    $("#chat-q").value = "";
    $("#chat-chips").hidden = true;
    bubble("user", q);
    turns.push({ role: "user", content: q });
    const b = bubble("bot", s("thinking"));
    b.classList.add("is-thinking");
    await getSample();
    if (!sample) {
      setTimeout(() => { b.classList.remove("is-thinking"); const a = offlineAnswer(q); renderText(b, a); turns.push({ role: "assistant", content: a }); }, 350);
      return;
    }
    const ctl = new AbortController();
    busy = ctl; setBusy(true);
    try {
      const recent = turns.slice(-10);
      const input = [{ role: "user", content: rules() }].concat(recent[0] && recent[0].role === "assistant" ? recent.slice(1) : recent);
      const { text } = await sample(input, {
        cache: false, signal: ctl.signal, modelTier: "quick",
        onText: ({ text }) => { b.classList.remove("is-thinking"); renderText(b, text); $("#chat-log").scrollTop = $("#chat-log").scrollHeight; }
      });
      b.classList.remove("is-thinking"); renderText(b, text);
      turns.push({ role: "assistant", content: text });
    } catch (e) {
      b.classList.remove("is-thinking");
      if (e && e.code === "cancelled") { if (!e.text) b.remove(); }
      else if (e && (e.code === "not_granted" || e.code === "sampling_disabled" || e.code === "not_declared" || e.code === "capability_disabled")) {
        sample = null; setStatus();
        const a = s("notAllowed") + "\n\n" + offlineAnswer(q); renderText(b, a); turns.push({ role: "assistant", content: a });
      } else renderText(b, (e && e.text) || s("err"));
    } finally { busy = null; setBusy(false); }
  }

  function setBusy(on) { $("#chat-send").hidden = on; $("#chat-stop").hidden = !on; }
  function setStatus() { $("#chat-status").textContent = sample ? s("live") : s("offline"); }

  let lastFocus = null;
  function open() {
    const p = $("#chat");
    lastFocus = document.activeElement;
    p.hidden = false;
    requestAnimationFrame(() => p.classList.add("is-open"));
    $("#chat-fab").setAttribute("aria-expanded", "true");
    getSample().then(setStatus);
    setTimeout(() => $("#chat-q").focus(), 60);
  }
  function close() {
    const p = $("#chat");
    if (p.hidden) return;
    p.classList.remove("is-open");
    $("#chat-fab").setAttribute("aria-expanded", "false");
    setTimeout(() => { if (!p.classList.contains("is-open")) p.hidden = true; }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function paint() {
    $("#chat-fab-label").textContent = s("open");
    $("#chat-fab").setAttribute("aria-label", s("open"));
    $("#chat-title").textContent = s("title");
    $("#chat-close").setAttribute("aria-label", s("close"));
    $("#chat-q").setAttribute("placeholder", s("placeholder"));
    $("#chat-send").setAttribute("aria-label", s("send"));
    $("#chat-stop").textContent = s("stop");
    $("#chat-note").textContent = s("ai");
    setStatus();
    const chips = $("#chat-chips");
    chips.innerHTML = "";
    s("chips").forEach((c) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = c; b.addEventListener("click", () => ask(c)); chips.appendChild(b); });
    if (!turns.length) { $("#chat-log").innerHTML = ""; bubble("bot", s("hello")); }
  }

  OUT.chat = {
    init(l) {
      lang = l;
      $("#chat-fab").addEventListener("click", () => ($("#chat").hidden ? open() : close()));
      $("#chat-close").addEventListener("click", close);
      $("#chat-form").addEventListener("submit", (e) => { e.preventDefault(); ask($("#chat-q").value); });
      $("#chat-stop").addEventListener("click", () => busy && busy.abort());
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
      document.addEventListener("click", (e) => { const t = e.target.closest("[data-open-chat]"); if (t) { e.preventDefault(); open(); if (t.dataset.openChat) ask(t.dataset.openChat); } });
      paint();
      getSample().then(setStatus);
    },
    setLang(l) { lang = l; paint(); },
    open
  };
})();
