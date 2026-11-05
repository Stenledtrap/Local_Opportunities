/* Outlast — step diagrams and icons, drawn as inline SVG.
   Colours come from CSS classes (d-*) so diagrams follow light and dark mode.
   Every diagram is 320 × 200. Labels are localised through L(en, pl). */
(function () {
  const OUT = (window.OUT = window.OUT || {});

  /* ------------------------------------------------------------------ primitives */
  const f = (n) => Math.round(n * 10) / 10;
  const bg = () => `<rect class="d-bg" width="320" height="200" rx="14"/>`;
  const ground = (y = 168, cls = "d-ground") => `<path class="${cls} o" d="M-4 ${y} H324 V204 H-4Z"/>`;
  const line = (d, cls = "d-ln") => `<path class="${cls}" d="${d}"/>`;
  const shape = (d, cls) => `<path class="${cls} o" d="${d}"/>`;
  const circ = (x, y, r, cls) => `<circle class="${cls} o" cx="${x}" cy="${y}" r="${r}"/>`;
  const rect = (x, y, w, h, cls, r = 4) => `<rect class="${cls} o" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  const text = (x, y, s, opts = {}) => `<text class="d-label${opts.cls ? " " + opts.cls : ""}" x="${x}" y="${y}" text-anchor="${opts.a || "middle"}"${opts.size ? ` style="font-size:${opts.size}px"` : ""}>${s}</text>`;
  const limb = (x1, y1, x2, y2, cls, w = 9) =>
    `<path class="d-limb-o" style="stroke-width:${w + 4}" d="M${x1} ${y1} L${x2} ${y2}"/><path class="${cls}" style="stroke-width:${w}" d="M${x1} ${y1} L${x2} ${y2}"/>`;
  const curveLimb = (d, cls, w = 9) => `<path class="d-limb-o" style="stroke-width:${w + 4}" d="${d}"/><path class="${cls}" style="stroke-width:${w}" d="${d}"/>`;

  function arrow(x1, y1, cx, cy, x2, y2, cls = "d-arrow") {
    const ang = Math.atan2(y2 - cy, x2 - cx), s = 9;
    const p1 = [x2 - s * Math.cos(ang - 0.5), y2 - s * Math.sin(ang - 0.5)];
    const p2 = [x2 - s * Math.cos(ang + 0.5), y2 - s * Math.sin(ang + 0.5)];
    return `<path class="${cls}" d="M${x1} ${y1} Q${cx} ${cy} ${f(x2 - 3 * Math.cos(ang))} ${f(y2 - 3 * Math.sin(ang))}"/>` +
      `<path class="${cls}-head" d="M${x2} ${y2} L${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])}Z"/>`;
  }
  const badge = (x, y, s, cls = "d-badge") => `<g><rect class="${cls} o" x="${x - (s.length * 4 + 10)}" y="${y - 13}" width="${s.length * 8 + 20}" height="24" rx="12"/>${text(x, y + 4, s, { cls: cls + "-t" })}</g>`;
  const cross = (x, y, s = 14) => `<path class="d-no" d="M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}"/>`;
  const tick = (x, y, s = 12) => `<path class="d-yes" d="M${x - s} ${y} L${x - s / 3} ${y + s * 0.7} L${x + s} ${y - s * 0.7}"/>`;

  /* scenery */
  const tree = (x, y, h = 110, cls = "d-leaf") =>
    rect(x - 6, y - h * 0.45, 12, h * 0.45, "d-wood", 3) +
    shape(`M${x} ${y - h} C${x + h * 0.42} ${y - h * 0.95} ${x + h * 0.42} ${y - h * 0.42} ${x} ${y - h * 0.42} C${x - h * 0.42} ${y - h * 0.42} ${x - h * 0.42} ${y - h * 0.95} ${x} ${y - h}Z`, cls);
  const pine = (x, y, h = 100) =>
    rect(x - 5, y - h * 0.2, 10, h * 0.2, "d-wood", 2) +
    shape(`M${x} ${y - h} L${x + h * 0.28} ${y - h * 0.5} L${x + h * 0.14} ${y - h * 0.5} L${x + h * 0.36} ${y - h * 0.18} L${x - h * 0.36} ${y - h * 0.18} L${x - h * 0.14} ${y - h * 0.5} L${x - h * 0.28} ${y - h * 0.5}Z`, "d-leaf2");
  const trunk = (x, y, h, w = 22) => rect(x - w / 2, y - h, w, h, "d-wood", 4) + line(`M${x - 3} ${y - h + 14} v${h * 0.3} M${x + 4} ${y - h * 0.55} v${h * 0.25}`, "d-ln-thin");
  const rock = (x, y, w = 50, h = 26) => shape(`M${x - w / 2} ${y} Q${x - w / 2 + 4} ${y - h} ${x} ${y - h} Q${x + w / 2 - 2} ${y - h + 2} ${x + w / 2} ${y}Z`, "d-rock");
  const cloud = (x, y, s = 1, cls = "d-cloud") => shape(`M${x - 34 * s} ${y} a${16 * s} ${16 * s} 0 0 1 ${12 * s} ${-22 * s} a${20 * s} ${20 * s} 0 0 1 ${36 * s} ${-6 * s} a${15 * s} ${15 * s} 0 0 1 ${22 * s} ${16 * s} a${12 * s} ${12 * s} 0 0 1 ${-4 * s} ${12 * s}Z`, cls);
  const sun = (x, y, r = 16) => circ(x, y, r, "d-sun") + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return line(`M${f(x + c * (r + 5))} ${f(y + s * (r + 5))} L${f(x + c * (r + 12))} ${f(y + s * (r + 12))}`, "d-ln-sun"); }).join("");
  const rain = (x, y, n = 5) => Array.from({ length: n }, (_, i) => line(`M${x + i * 14} ${y + (i % 2) * 8} l-5 12`, "d-rain")).join("");
  const wind = (x, y) => line(`M${x} ${y} h40 q10 0 10 -8 q0 -8 -8 -6 M${x + 8} ${y + 14} h46 q8 0 8 7`, "d-wind");

  /* people */
  function person(x, y, o = {}) {
    // y = feet; standing figure ~ 96 tall
    const shirt = o.shirt || "d-shirt", pants = o.pants || "s-pants", skin = "s-skin";
    const armL = o.armL || [x - 26, y - 40], armR = o.armR || [x + 26, y - 40];
    return limb(x - 7, y - 40, x - 9, y - 2, pants, 10) + limb(x + 7, y - 40, x + 9, y - 2, pants, 10) +
      limb(x - 13, y - 70, armL[0], armL[1], o.sleeve || "s-shirt", 9) + limb(x + 13, y - 70, armR[0], armR[1], o.sleeve || "s-shirt", 9) +
      rect(x - 17, y - 78, 34, 42, shirt, 10) +
      circ(x, y - 90, 13, "d-skin") + (o.hat ? shape(`M${x - 14} ${y - 92} Q${x} ${y - 112} ${x + 14} ${y - 92}Z`, o.hat) : "");
  }
  function lying(x, y, o = {}) {
    // lying on back, head on the left at x; y = ground line
    return limb(x + 64, y - 10, x + 104, y - 8, "s-pants", 10) + limb(x + 64, y - 18, x + 104 + (o.raise || 0) * 0.2, y - 18 - (o.raise || 0), "s-pants", 10) +
      rect(x + 14, y - 30, 54, 26, o.shirt || "d-shirt", 10) + circ(x, y - 18, 13, "d-skin") +
      (o.blanket ? shape(`M${x + 8} ${y - 34} Q${x + 60} ${y - 46} ${x + 112} ${y - 26} L${x + 116} ${y - 2} L${x + 8} ${y - 2}Z`, o.blanket) : "");
  }
  function sitting(x, y, o = {}) {
    return limb(x - 4, y - 14, x + 30, y - 12, "s-pants", 10) + limb(x + 30, y - 12, x + 34, y + 4, "s-pants", 10) +
      limb(x - 8, y - 46, o.arm ? o.arm[0] : x + 18, o.arm ? o.arm[1] : y - 26, "s-shirt", 9) +
      rect(x - 18, y - 56, 30, 44, o.shirt || "d-shirt", 10) + circ(x - 4, y - 68, 13, "d-skin") + (o.hat ? shape(`M${x - 18} ${y - 70} Q${x - 4} ${y - 90} ${x + 10} ${y - 70}Z`, o.hat) : "");
  }
  const hand = (x, y, r = 0) => `<g transform="rotate(${r} ${x} ${y})">${rect(x - 15, y - 9, 30, 18, "d-skin", 8)}${line(`M${x - 6} ${y - 9} v-5 M${x + 2} ${y - 9} v-6 M${x + 10} ${y - 8} v-4`, "d-ln-thin")}</g>`;

  /* objects */
  const pot = (x, y, w = 90, h = 54, o = {}) => {
    let s = "";
    s += shape(`M${x - w / 2} ${y - h} h${w} v${h - 10} q0 10 -10 10 h${-w + 20} q-10 0 -10 -10Z`, "d-metal");
    if (o.water !== false) s += `<path class="d-water" d="M${x - w / 2 + 3} ${y - h + 12} h${w - 6} v${h - 22} q0 7 -7 7 h${-w + 20} q-7 0 -7 -7Z"/>`;
    s += line(`M${x - w / 2 - 10} ${y - h + 4} h10 M${x + w / 2} ${y - h + 4} h10`, "d-ln-thick");
    if (o.lid) s += shape(`M${x - w / 2 - 4} ${y - h} h${w + 8} v-6 q-${(w + 8) / 2} -10 -${w + 8} 0Z`, "d-metal2") + rect(x - 6, y - h - 15, 12, 6, "d-metal2", 2);
    if (o.boil) s += [[-24, 0], [-6, -8], [14, -2], [26, -10]].map(([dx, dy]) => circ(x + dx, y - h + 8 + dy, 5, "d-bubble")).join("") +
      [[-20], [0], [20]].map(([dx]) => line(`M${x + dx} ${y - h - 14} q-6 -10 0 -18 q6 -8 0 -16`, "d-steam")).join("");
    return s;
  };
  const flame = (x, y, s = 1) => shape(`M${x} ${y - 46 * s} C${x + 22 * s} ${y - 22 * s} ${x + 22 * s} ${y} ${x} ${y} C${x - 22 * s} ${y} ${x - 24 * s} ${y - 20 * s} ${x - 6 * s} ${y - 32 * s} C${x - 6 * s} ${y - 24 * s} ${x - 2 * s} ${y - 22 * s} ${x} ${y - 46 * s}Z`, "d-fire") +
    `<path class="d-fire2" d="M${x} ${y - 24 * s} C${x + 10 * s} ${y - 12 * s} ${x + 9 * s} ${y} ${x} ${y} C${x - 9 * s} ${y} ${x - 10 * s} ${y - 10 * s} ${x} ${y - 24 * s}Z"/>`;
  const logs = (x, y, w = 70) => `<g>${rect(x - w / 2, y - 10, w, 12, "d-wood", 6)}${rect(x - w / 2 + 10, y - 18, w - 20, 11, "d-wood2", 6)}</g>`;
  const stoneRing = (x, y, w = 110) => Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (0.05 + i * 0.15); return rock(f(x - Math.cos(a) * w / 2), y + f(Math.sin(a) * 6), 22, 14); }).join("");
  const bottle = (x, y, h = 70, fill = 0.7, cls = "d-water") => {
    const w = 30, top = y - h;
    return shape(`M${x - w / 2} ${y} v${-h + 22} q0 -8 8 -12 v-8 h${w - 16} v8 q8 4 8 12 v${h - 22}Z`, "d-glass") +
      `<path class="${cls}" d="M${x - w / 2 + 3} ${y - 3} v${-(h - 26) * fill} h${w - 6} v${(h - 26) * fill}Z"/>` + rect(x - 9, top - 6, 18, 9, "d-cap", 2);
  };
  const jar = (x, y, w = 60, h = 70, cls = "d-water", lvl = 0.75) =>
    shape(`M${x - w / 2} ${y - h} h${w} v${h - 8} q0 8 -8 8 h${-w + 16} q-8 0 -8 -8Z`, "d-glass") +
    `<path class="${cls}" d="M${x - w / 2 + 3} ${y - 3 - (h - 6) * lvl} h${w - 6} v${(h - 6) * lvl - 5} q0 5 -5 5 h${-w + 16} q-5 0 -5 -5Z"/>`;
  const clock = (x, y, r, label) => circ(x, y, r, "d-white") + line(`M${x} ${y} V${y - r + 8} M${x} ${y} L${x + r * 0.5} ${y + 4}`, "d-ln-thick") + (label ? badge(x, y + r + 18, label) : "");
  const phone = (x, y, s = "112") => rect(x - 20, y - 36, 40, 72, "d-ink", 8) + rect(x - 15, y - 28, 30, 50, "d-screen", 3) + text(x, y + 2, s, { cls: "d-screen-t", size: 13 });
  const whistleShape = (x, y) => shape(`M${x - 30} ${y - 12} h40 a14 14 0 1 1 0 26 h-40 a4 4 0 0 1 -4 -4 v-18 a4 4 0 0 1 4 -4Z`, "d-red") + circ(x + 12, y + 1, 5, "d-white");
  const soundWaves = (x, y) => line(`M${x} ${y - 14} q10 14 0 28 M${x + 12} ${y - 22} q16 22 0 44 M${x + 24} ${y - 30} q22 30 0 60`, "d-wave");
  const tarpCover = (cx, top, w, h, cls = "d-tarp") => shape(`M${cx} ${top} L${cx + w / 2} ${top + h} L${cx - w / 2} ${top + h}Z`, cls);
  const stake = (x, y, ang = 45) => `<g transform="rotate(${ang} ${x} ${y})">${rect(x - 3, y - 4, 6, 26, "d-metal2", 2)}</g>`;
  const leafPile = (x, y, w, h, cls = "d-leafpile") => shape(`M${x - w / 2} ${y} Q${x - w / 2 + 10} ${y - h * 0.9} ${x - w * 0.15} ${y - h} Q${x + w * 0.15} ${y - h * 1.08} ${x + w * 0.32} ${y - h * 0.8} Q${x + w / 2} ${y - h * 0.45} ${x + w / 2} ${y}Z`, cls) +
    Array.from({ length: Math.round(w / 22) }, (_, i) => `<path class="d-ln-thin" d="M${f(x - w / 2 + 14 + i * 20)} ${f(y - 10 - (i % 3) * h * 0.18)} q6 -6 12 0"/>`).join("");

  /* rope: drawn as outline + fill; 'over' adds a halo so crossings read clearly */
  const rope = (d, cls = "d-rope", over = false) => (over ? `<path class="d-rope-halo" d="${d}"/>` : "") + `<path class="d-rope-o" d="${d}"/><path class="${cls}" d="${d}"/>`;
  const endCap = (x, y) => circ(x, y, 4.5, "d-rope-end");
  const post = (x) => rect(x - 18, -10, 36, 220, "d-wood", 6) + line(`M${x - 6} 20 v30 M${x + 5} 110 v26`, "d-ln-thin");

  /* ------------------------------------------------------------------ diagrams */
  const D = {};

  /* water */
  D["cloth-filter"] = (L) => bg() + ground(176, "d-table") + jar(78, 176, 64, 84, "d-water-dirty", 0.8) +
    jar(232, 176, 70, 84, "d-water", 0.35) + shape("M196 92 Q232 128 268 92 L262 86 Q232 112 202 86Z", "d-cloth") +
    shape(`M96 92 Q130 46 182 70 L176 80 Q132 64 110 98Z`, "d-glass") + `<path class="d-water-dirty" d="M178 74 q10 6 30 18 l-4 6 q-14 -8 -28 -16Z"/>` +
    line("M232 104 v18", "d-drip") + text(78, 196, L("cloudy", "mętna"), { size: 11 }) + text(232, 196, L("clearer", "czystsza"), { size: 11 });

  D["pot-boil"] = (L) => bg() + ground(176, "d-table") + logs(160, 176, 100) + flame(140, 160, 0.7) + flame(178, 160, 0.8) + pot(160, 132, 110, 62, { boil: true }) +
    badge(250, 40, L("rolling boil", "silne wrzenie"));

  D["boil-timer"] = (L) => bg() + ground(176, "d-table") + logs(110, 176, 90) + flame(110, 160, 0.8) + pot(110, 132, 100, 58, { boil: true }) +
    clock(240, 64, 30, L("1 min", "1 min")) + `<path class="d-mountain o" d="M196 168 L232 120 L250 140 L262 128 L292 168Z"/>` + text(246, 186, L("above 2000 m: 3 min", "pow. 2000 m: 3 min"), { size: 11 });

  D["pot-cool"] = (L) => bg() + ground(176, "d-table") + pot(130, 176, 120, 66, { lid: true }) + line("M238 70 q-8 14 0 28 q8 14 0 28", "d-cool") +
    line("M262 64 q-8 14 0 28 q8 14 0 28", "d-cool") + badge(250, 156, L("covered", "przykryte"));

  D["bottle-fill"] = (L) => bg() + ground(176, "d-table") + pot(96, 176, 96, 56, {}) + bottle(232, 176, 104, 0.8) +
    shape("M136 106 Q170 64 214 70 L212 80 Q176 78 146 112Z", "d-metal") + `<path class="d-water" d="M214 74 q8 4 10 26 h-6 q-2 -18 -6 -22Z"/>` + tick(286, 70);

  D["water-methods"] = (L) => bg() +
    rect(26, 46, 74, 110, "d-card", 10) + bottle(63, 132, 70, 0.5) + rect(52, 80, 22, 18, "d-filter", 4) + text(63, 178, L("filter", "filtr"), { size: 12 }) +
    rect(124, 46, 74, 110, "d-card", 10) + circ(146, 100, 11, "d-white") + circ(172, 112, 11, "d-white") + line("M139 100 h14 M165 112 h14", "d-ln-thin") + text(161, 178, L("tablets", "tabletki"), { size: 12 }) +
    rect(222, 46, 74, 110, "d-card", 10) + pot(259, 136, 52, 34, { boil: true }) + flame(259, 150, 0.35) + text(259, 178, L("boil", "gotowanie"), { size: 12 });

  D["squeeze-filter"] = (L) => bg() + ground(182, "d-table") +
    shape("M40 40 h90 q8 0 8 8 v52 q0 22 -30 26 h-46 q-30 -4 -30 -26 v-52 q0 -8 8 -8Z", "d-bag") + `<path class="d-water-dirty" d="M38 76 h96 v26 q-4 18 -28 20 h-42 q-24 -2 -26 -20Z"/>` +
    rect(70, 124, 34, 34, "d-filter", 6) + hand(86, 92) + line("M87 160 v10", "d-drip") +
    bottle(220, 182, 92, 0.55) + arrow(110, 150, 160, 176, 196, 150) + text(84, 30, L("dirty", "brudna"), { size: 12 }) + text(220, 70, L("clean", "czysta"), { size: 12 });

  D["tablet-timer"] = (L) => bg() + ground(182, "d-table") + bottle(90, 182, 110, 0.75) + circ(140, 48, 11, "d-white") + line("M133 48 h14", "d-ln-thin") +
    arrow(132, 60, 112, 70, 100, 92) + clock(236, 82, 34, L("30 min – 4 h", "30 min – 4 h"));

  D["bleach-drops"] = (L) => bg() + ground(182, "d-table") + jar(120, 182, 90, 96, "d-water", 0.7) +
    shape("M198 30 h40 v12 h-8 v24 q12 6 12 18 v56 h-48 v-56 q0 -12 12 -18 v-24 h-8Z", "d-white") + text(218, 110, "6%", { size: 13 }) +
    shape("M170 58 q-6 8 0 12 q6 -4 0 -12Z", "d-water") + shape("M150 70 q-6 8 0 12 q6 -4 0 -12Z", "d-water") +
    badge(120, 46, L("2 drops / 1 L", "2 krople / 1 l")) + text(240, 196, L("wait 30 min", "czekaj 30 min"), { size: 11 });

  /* fire */
  D["fire-site"] = (L) => bg() + ground(150) + tree(40, 150, 120) + tree(290, 150, 100) + stoneRing(160, 154, 120) +
    `<ellipse class="d-cleared" cx="160" cy="166" rx="110" ry="18"/>` + line("M52 184 H268", "d-measure") + line("M52 178 v12 M268 178 v12", "d-measure") + badge(160, 186, "3 m") + cross(40, 58, 10);

  D["fire-materials"] = (L) => bg() + ground(170) +
    shape("M40 160 q10 -24 26 -16 q8 -18 22 -6 q14 -6 14 22Z", "d-tinder") + text(70, 192, L("tinder", "podpałka"), { size: 12 }) +
    Array.from({ length: 6 }, (_, i) => line(`M${132 + i * 7} 164 l${10 - i * 2} -44`, "d-twig")).join("") + text(160, 192, L("kindling", "rozpałka"), { size: 12 }) +
    rect(220, 146, 76, 14, "d-wood", 7) + rect(226, 132, 70, 14, "d-wood2", 7) + rect(230, 118, 60, 14, "d-wood", 7) + text(258, 192, L("fuel", "opał"), { size: 12 });

  D["teepee"] = (L) => bg() + ground(170) + shape("M138 168 q10 -24 24 -16 q10 -12 22 16Z", "d-tinder") +
    [[-46, -8], [-34, -14], [-18, -18], [18, -18], [34, -14], [46, -8]].map(([dx]) => line(`M${160 + dx} 168 L${160 + dx * 0.08} 62`, "d-twig")).join("") +
    arrow(270, 130, 240, 150, 200, 156) + text(278, 116, L("gap", "szczelina"), { size: 12 }) + wind(30, 50);

  D["light-fire"] = (L) => bg() + ground(170) +
    [[-40], [-26], [-12], [12], [26], [40]].map(([dx]) => line(`M${150 + dx} 168 L${150 + dx * 0.08} 76`, "d-twig")).join("") +
    flame(150, 166, 0.5) + rect(196, 132, 28, 40, "d-red", 6) + rect(200, 124, 20, 10, "d-metal2", 2) + hand(214, 156) + wind(236, 70) + arrow(290, 96, 250, 110, 214, 112);

  D["fire-fuel"] = (L) => bg() + ground(170) + logs(160, 170, 110) + flame(160, 156, 1.1) +
    rect(230, 70, 70, 14, "d-wood", 7) + arrow(244, 92, 214, 104, 196, 128) + text(80, 50, L("small → large", "małe → duże"), { size: 13 });

  D["fire-out"] = (L) => bg() + ground(170) + `<ellipse class="d-ash o" cx="120" cy="164" rx="60" ry="10"/>` +
    shape("M190 54 h50 l-6 34 h-38Z", "d-metal") + line("M184 86 q-30 20 -50 60", "d-pour") + line("M200 58 v-14 q20 -10 40 0 v14", "d-ln-thick") +
    line("M80 150 l26 -50", "d-twig") + hand(270, 150) + text(270, 186, L("no heat?", "zero ciepła?"), { size: 12 }) +
    text(64, 40, L("drown · stir · feel", "zalej · zamieszaj · dotknij"), { a: "start", size: 13 });

  /* shelter */
  D["site-select"] = (L) => bg() + ground(160) + tree(70, 160, 130) + tree(250, 160, 124) +
    line("M70 64 l-30 -20 M70 64 l24 -26", "d-deadbranch") + cross(70, 30, 9) +
    `<path class="d-water-pool" d="M120 172 q40 10 80 0 q-40 16 -80 0Z"/>` + tick(160, 120, 14) + badge(160, 86, "3–4 m");

  D["ridgeline"] = (L) => bg() + ground(170) + trunk(50, 170, 170) + trunk(270, 170, 170) + rope("M62 84 L258 84") +
    endCap(256, 92) + rope("M60 84 q-6 6 -2 12", "d-rope") + text(160, 72, L("chest height", "wys. klatki piersiowej"), { size: 12 }) +
    badge(60, 120, L("bowline", "ratowniczy")) + badge(262, 120, L("taut-line", "namiotowy"));

  D["tarp-drape"] = (L) => bg() + ground(170) + trunk(40, 170, 170) + trunk(280, 170, 170) + rope("M52 70 L268 70") +
    shape("M90 70 L230 70 L250 150 L70 150Z", "d-tarp") + line("M90 70 L230 70", "d-ln-thick") + arrow(160, 30, 162, 44, 160, 62);

  D["tarp-stake"] = (L) => bg() + ground(160) + tarpCover(160, 54, 220, 104) + line("M160 54 V160", "d-ln-thin") +
    rope("M50 158 L36 172") + stake(30, 176, 45) + rope("M270 158 L284 172") + stake(290, 176, -45) + text(66, 196, "45°", { size: 13 });

  D["tarp-done"] = (L) => bg() + ground(160) + trunk(30, 160, 160) + trunk(290, 160, 160) + rope("M42 60 L278 60") +
    shape("M70 60 L250 60 L282 160 L38 160Z", "d-tarp") + rain(110, 14, 7) + line("M60 120 q-10 20 -18 40 M260 120 q10 20 18 40", "d-water-run") + tick(160, 120, 14);

  D["ground-insulation"] = (L) => bg() + ground(170) + tarpCover(160, 34, 290, 136) +
    rect(46, 148, 228, 16, "d-mat", 8) + lying(76, 152, { shirt: "d-shirt" }) +
    badge(160, 186, "10–15 cm");

  D["ridgepole"] = (L) => bg() + ground(170) + rect(30, 120, 260, 16, "d-wood", 8) + person(290, 170, {}) +
    line("M30 150 H290", "d-measure") + text(160, 166, L("your height + an arm", "twój wzrost + ręka"), { size: 12 });

  D["ridgepole-prop"] = (L) => bg() + ground(170) + trunk(76, 170, 64, 50) + line("M40 110 L290 168", "d-wood-line") +
    line("M150 117 v53", "d-measure") + text(160, 150, L("hip height", "wys. bioder"), { a: "start", size: 12 });

  D["ribs"] = (L) => bg() + ground(170) + trunk(70, 170, 60, 46) + line("M40 108 L290 168", "d-wood-line") +
    Array.from({ length: 9 }, (_, i) => { const x = 100 + i * 20, y = 114 + (i * 20) * 0.24; return line(`M${x} ${y} L${x + 18} 170`, "d-twig") + line(`M${x} ${y} L${x - 22} 170`, "d-twig"); }).join("");

  D["debris-pile"] = (L) => bg() + ground(170) + leafPile(170, 170, 270, 104) + line("M300 66 v104", "d-measure") + text(296, 60, "60–90 cm", { a: "end", size: 12 });

  D["debris-inside"] = (L) => bg() + ground(170) + leafPile(170, 170, 270, 104, "d-leafpile d-cut") +
    shape("M70 170 Q90 120 170 118 Q250 124 280 170Z", "d-leafin") + lying(96, 158, { shirt: "d-shirt" });

  D["debris-door"] = (L) => bg() + ground(170) + leafPile(170, 170, 270, 104) + `<path class="d-door o" d="M48 170 q8 -40 30 -40 q22 0 26 40Z"/>` +
    leafPile(70, 172, 70, 36) + arrow(20, 120, 40, 140, 58, 150);

  /* first aid */
  D["call-112"] = (L) => bg() + phone(110, 100) + soundWaves(140, 100) + badge(236, 70, L("what", "co")) + badge(236, 104, L("where", "gdzie")) + badge(236, 138, L("how many", "ile osób"));

  D["pressure"] = (L) => bg() + rect(30, 120, 260, 42, "d-skin", 20) + rect(126, 112, 72, 40, "d-gauze", 6) + `<path class="d-blood" d="M136 156 q8 10 18 0 q-8 -6 -18 0Z"/>` +
    hand(150, 98, -8) + hand(170, 82, 8) + arrow(160, 18, 162, 34, 160, 56) + arrow(184, 18, 186, 34, 184, 56);

  D["add-dressing"] = (L) => bg() + rect(30, 120, 260, 42, "d-skin", 20) + rect(122, 112, 80, 40, "d-gauze", 6) + `<path class="d-blood" d="M140 118 q20 14 40 0 v10 h-40Z"/>` +
    rect(116, 98, 92, 22, "d-gauze", 6) + arrow(250, 50, 230, 70, 214, 100) + text(250, 40, "+", { size: 22 }) + cross(80, 70, 10);

  D["tourniquet"] = (L) => bg() + rect(14, 96, 292, 50, "d-skin", 24) + `<path class="d-blood" d="M232 120 q10 -10 20 0 q-10 8 -20 0Z"/>` +
    rect(158, 90, 26, 62, "d-tq", 4) + rect(162, 70, 18, 30, "d-ink", 4) + line("M184 160 H232", "d-measure") + text(208, 180, "5–7 cm", { size: 12 }) +
    clock(80, 50, 18, "") + text(108, 56, L("note time", "zapisz godzinę"), { a: "start", size: 12 });

  D["keep-warm"] = (L) => bg() + ground(168) + rect(40, 150, 240, 14, "d-mat", 7) + lying(70, 154, { blanket: "d-foil" }) + sitting(268, 168, {});

  D["umbles"] = (L) => bg() + ground(172) + person(110, 172, { shirt: "d-shirt", armL: [86, 128], armR: [136, 128] }) +
    line("M74 78 l-8 -6 M70 92 l-10 0 M146 78 l8 -6 M150 92 l10 0", "d-shiver") +
    ["stumbles", "mumbles", "fumbles", "grumbles"].map((w, i) => text(196, 60 + i * 28, L(w, ["potyka się", "mamrocze", "niezgrabne ręce", "rozdrażniony"][i]), { a: "start", size: 13 })).join("");

  D["out-of-wind"] = (L) => bg() + ground(170) + rock(200, 170, 140, 90) + sitting(240, 170, {}) + wind(20, 70) + wind(30, 120) + cross(110, 40, 10);

  D["dry-layers"] = (L) => bg() + shape("M40 70 l30 -20 h40 l30 20 l-12 22 l-18 -10 v78 h-60 v-78 l-18 10Z", "d-wet") + rain(56, 30, 4) +
    arrow(160, 110, 180, 96, 200, 110) +
    shape("M200 70 l30 -20 h40 l30 20 l-12 22 l-18 -10 v78 h-60 v-78 l-18 10Z", "d-shirt2") + tick(250, 30, 10);

  D["warm-core"] = (L) => bg() + ground(176) + lying(60, 172, { blanket: "d-sleeping" }) +
    circ(110, 136, 9, "d-heat") + circ(132, 148, 9, "d-heat") + circ(88, 154, 9, "d-heat") +
    text(220, 52, L("chest · neck · armpits · groin", "klatka · szyja · pachy · pachwiny"), { size: 12 }) + cross(250, 128, 9) + text(268, 132, L("rub", "rozcierać"), { a: "start", size: 11 });

  D["warm-drink"] = (L) => bg() + ground(176, "d-table") + sitting(110, 176, { arm: [150, 116] }) + rect(144, 104, 28, 32, "d-mug", 6) +
    line("M150 96 q-6 -10 0 -18 M164 96 q-6 -10 0 -18", "d-steam") + rect(210, 140, 54, 30, "d-wrapper", 6) + text(237, 160, L("sugar", "cukier"), { size: 11 });

  D["check-ankle"] = (L) => bg() + ground(176) + shape("M60 70 h48 v70 q0 10 10 12 l96 16 q10 2 10 12 v4 h-164Z", "d-skin") +
    circ(100, 132, 10, "d-red-soft") + hand(150, 110, -20) + badge(230, 60, L("4 steps?", "4 kroki?"));

  D["ice-wrap"] = (L) => bg() + ground(176) + shape("M40 90 h48 v52 q0 10 10 12 l130 14 v8 h-188Z", "d-skin") +
    rect(76, 108, 56, 40, "d-ice", 10) + clock(250, 76, 28, "15–20 min");

  D["ankle-wrap"] = (L) => bg() + ground(176) + shape("M60 40 h56 v100 q0 10 10 12 l130 14 v10 h-196Z", "d-skin") +
    [0, 1, 2, 3].map((i) => line(`M${66 + i * 18} ${170 - i * 6} C ${110 + i * 10} ${140 - i * 8} ${150} ${150} ${190 + i * 8} ${168 - i * 2}`, "d-bandage")).join("") +
    line("M66 140 C 90 110 110 110 116 96 M60 120 C 90 96 110 100 116 76", "d-bandage") + text(220, 60, "∞", { size: 40 });

  D["elevate"] = (L) => bg() + ground(172) + rect(178, 104, 60, 66, "d-pack", 10) + lying(70, 168, { raise: 52 }) +
    line("M96 136 H300", "d-measure") + text(300, 128, L("heart level", "poziom serca"), { a: "end", size: 11 }) + arrow(270, 110, 272, 96, 268, 78);

  D["walk-poles"] = (L) => bg() + ground(176) + person(150, 176, { armL: [110, 146], armR: [190, 146] }) + line("M110 140 L94 176 M190 140 L212 176", "d-pole") +
    rect(136, 162, 14, 16, "d-boot", 4) + rect(152, 162, 18, 16, "d-boot", 4) + line("M148 150 h22", "d-bandage");

  /* knots */
  // bowline: standing part from the top; small loop ('rabbit hole'); end works around it
  const bowLoop = "M160 0 L160 68 C160 84 182 86 182 100 C182 116 160 120 146 110 C134 100 140 82 162 76";
  D["bowline-1"] = (L) => bg() + rope(bowLoop) + rope("M162 76 C188 70 214 108 212 140 C210 176 160 196 128 176 C106 162 110 134 120 122", "d-rope", true) + endCap(120, 122) +
    arrow(110, 150, 118, 116, 150, 98) + text(200, 30, L("standing part", "część długa"), { a: "start", size: 11 }) + text(96, 140, L("end", "koniec"), { a: "end", size: 11 });
  D["bowline-2"] = (L) => bg() + rope("M124 150 C120 132 140 116 158 98") + rope(bowLoop, "d-rope", true) +
    rope("M162 76 C188 70 214 108 212 140 C210 176 160 196 128 176 C112 166 116 156 124 150", "d-rope", true) +
    rope("M158 98 C166 84 178 70 186 56", "d-rope", true) + endCap(186, 56) + arrow(200, 60, 194, 30, 150, 38);
  D["bowline-3"] = (L) => bg() + rope("M124 150 C120 132 140 116 158 98") + rope("M158 98 C166 84 182 64 178 44 C176 34 152 30 140 40") +
    rope(bowLoop, "d-rope", true) + rope("M162 76 C188 70 214 108 212 140 C210 176 160 196 128 176 C112 166 116 156 124 150", "d-rope", true) +
    endCap(140, 40) + arrow(126, 46, 118, 70, 144, 90);
  D["bowline-4"] = (L) => bg() + rope("M124 150 C120 132 140 116 158 98") + rope("M158 98 C166 84 182 64 178 44 C176 34 152 30 140 40") +
    rope(bowLoop, "d-rope", true) + rope("M140 40 C132 60 146 84 150 104 C152 116 148 128 142 136", "d-rope", true) +
    rope("M162 76 C188 70 214 108 212 140 C210 176 160 196 128 176 C112 166 116 156 124 150", "d-rope", true) + endCap(142, 136) +
    arrow(178, 30, 178, 14, 178, 2) + arrow(160, 186, 160, 194, 160, 199) + text(196, 20, L("pull", "ciągnij"), { a: "start", size: 11 });

  // clove hitch on a vertical post
  D["clove-1"] = (L) => bg() + post(160) + rope("M0 120 L150 120") + rope("M150 120 L184 112", "d-rope", true) + rope("M136 98 C120 92 112 84 110 74") + endCap(110, 74) +
    line("M184 112 q16 -4 12 -10", "d-hidden") + arrow(100, 64, 140, 40, 186, 54) + text(30, 110, L("standing part", "część długa"), { a: "start", size: 11 });
  D["clove-2"] = (L) => bg() + post(160) + rope("M0 120 L150 120") + rope("M150 120 L184 112", "d-rope", true) + rope("M136 98 L186 62", "d-rope", true) + endCap(186, 62) + arrow(200, 54, 210, 40, 200, 30);
  D["clove-3"] = (L) => bg() + post(160) + rope("M0 120 L150 120") + rope("M150 120 L184 112", "d-rope", true) + rope("M136 98 L182 66", "d-rope", true) +
    rope("M140 54 L184 46", "d-rope", true) + rope("M140 54 C126 56 118 62 116 70") + endCap(116, 70) + arrow(110, 80, 120, 92, 140, 84);
  D["clove-4"] = (L) => bg() + post(160) + rope("M0 120 L150 120") + rope("M140 80 C120 80 80 82 40 80") + rope("M150 120 L184 112", "d-rope", true) +
    rope("M136 98 L182 66", "d-rope", true) + rope("M140 56 L184 48", "d-rope", true) + endCap(40, 80) + arrow(20, 140, 10, 140, 2, 140) + arrow(60, 66, 50, 66, 30, 66);

  // taut-line hitch: tree on the left, line runs right
  const tautBase = trunk(40, 200, 200, 40) + rope("M60 80 L310 80") + rope("M60 80 C40 80 40 120 60 120 L120 120");
  D["taut-1"] = (L) => bg() + tautBase + rope("M120 120 L176 120") + endCap(176, 120) + arrow(190, 120, 196, 104, 186, 92) + text(250, 70, L("standing part", "część długa"), { size: 11 });
  D["taut-2"] = (L) => bg() + tautBase + rope("M120 120 L176 120 C190 120 190 74 176 74") + rope("M176 74 L160 92 L150 80", "d-rope", true) +
    rope("M150 80 L138 96 L126 84", "d-rope", true) + endCap(126, 84) + badge(150, 150, L("2 inside", "2 do środka"));
  D["taut-3"] = (L) => bg() + tautBase + rope("M120 120 L176 120 C190 120 190 74 176 74") + rope("M176 74 L160 92 L150 80", "d-rope", true) +
    rope("M150 80 L138 96 L126 84", "d-rope", true) + rope("M126 84 C150 58 200 58 214 72 L226 88", "d-rope", true) + endCap(226, 88) + badge(230, 150, L("1 outside", "1 na zewnątrz"));
  D["taut-4"] = (L) => bg() + trunk(40, 200, 200, 40) + rope("M60 80 L310 80") + rope("M60 80 C40 80 40 120 60 120 L140 120 C154 120 156 90 146 84") +
    rope("M146 84 L140 92 L134 82 L128 92 L122 82", "d-rope", true) + rope("M150 80 L160 90 L166 80", "d-rope", true) + endCap(168, 90) +
    arrow(200, 140, 230, 140, 270, 140) + text(236, 160, L("slide to tighten", "przesuń, by napiąć"), { size: 11 });

  // reef knot: two ends, coloured differently so you can follow them
  D["reef-1"] = (L) => bg() + rope("M20 120 C90 120 140 80 170 100", "d-rope2") + rope("M300 120 C230 120 190 80 150 100", "d-rope", true) +
    rope("M170 100 C186 110 186 70 166 64", "d-rope2", true) + endCap(166, 64) + endCap(150, 100) + text(160, 180, L("right over left", "prawy na lewy"), { size: 13 });
  D["reef-2"] = (L) => bg() + rope("M20 140 C80 140 120 120 160 120 C200 120 240 140 300 140", "d-rope") + rope("M120 120 C100 90 112 64 140 60", "d-rope2") +
    rope("M200 120 C220 90 208 64 180 60", "d-rope", true) + rope("M140 60 C160 56 176 70 172 84", "d-rope2", true) + endCap(172, 84) + endCap(180, 60) + text(160, 180, L("left over right", "lewy na prawy"), { size: 13 });
  D["reef-3"] = (L) => bg() + rope("M14 110 C90 110 120 92 150 92 C176 92 176 128 150 128 C122 128 90 116 14 118", "d-rope2") +
    rope("M306 110 C230 110 200 92 170 92 C144 92 144 128 170 128 C198 128 230 116 306 118", "d-rope", true) +
    arrow(60, 160, 40, 160, 14, 160) + arrow(260, 160, 280, 160, 306, 160);
  D["reef-4"] = (L) => bg() + rope("M20 100 C90 100 110 82 140 82 C160 82 160 118 140 118 C112 118 90 104 20 106", "d-rope2") +
    rope("M300 100 C230 100 210 82 180 82 C160 82 160 118 180 118 C208 118 230 104 300 106", "d-rope", true) + tick(160, 40, 14) +
    text(160, 156, L("flat, ends side by side", "płasko, końce obok siebie"), { size: 12 });

  /* lost & signal */
  D["stop-sign"] = (L) => bg() + ground(176) + `<path class="d-stop o" d="M126 26 h68 l34 34 v68 l-34 34 h-68 l-34 -34 v-68Z"/>` + text(160, 106, "STOP", { cls: "d-stop-t", size: 34 }) + rect(154, 162, 12, 14, "d-metal2", 2);
  D["think"] = (L) => bg() + ground(176) + sitting(110, 176, { arm: [104, 112] }) + cloud(232, 92, 1.4, "d-thought") + text(232, 80, "?", { size: 30 }) +
    circ(170, 112, 5, "d-thought") + circ(184, 102, 7, "d-thought");
  D["observe"] = (L) => bg() + `<path class="d-mountain o" d="M0 150 L70 70 L120 120 L180 50 L250 120 L320 80 V200 H0Z"/>` + ground(170) + sun(270, 40) +
    line("M30 150 L120 90 L180 120 L300 60", "d-powerline") + person(80, 176, { armR: [120, 92] }) + rect(232, 136, 30, 26, "d-white", 4) + line("M232 148 h30 M247 136 v26", "d-ln-thin");
  D["plan-stay"] = (L) => bg() + ground(170) + pine(56, 170, 120) + pine(270, 170, 110) + tarpCover(160, 92, 120, 76) + sitting(176, 170, {}) +
    badge(160, 50, L("stay & be found", "zostań i daj się znaleźć"));
  D.whistle = (L) => bg() + whistleShape(110, 100) + soundWaves(160, 100) + text(250, 112, "× 3", { size: 30 });
  D.mirror = (L) => bg() + `<path class="d-sky" d="M0 0 H320 V140 H0Z"/>` + ground(140) +
    `<path class="d-plane o" d="M220 40 l50 6 l8 -12 l6 2 l-4 14 l18 2 v4 l-18 2 l4 14 l-6 2 l-8 -12 l-50 6Z"/>` +
    rect(60, 110, 34, 28, "d-mirror", 4) + line("M94 120 L222 54", "d-beam") + hand(56, 150, 10) + line("M110 104 l-6 -16 M118 104 l6 -16", "d-ln-thick");
  D["ground-sos"] = (L) => bg() + `<path class="d-grass" d="M0 0 H320 V200 H0Z"/>` + line("M40 60 L100 150 M100 60 L40 150", "d-signal") + line("M140 60 L170 150 L200 60", "d-signal") +
    text(70, 186, L("medical", "medyczna"), { size: 12 }) + text(170, 186, L("help", "pomoc"), { size: 12 }) + text(264, 118, "SOS", { cls: "d-signal-t", size: 34 }) + line("M232 40 h60", "d-measure") + text(262, 34, "≥ 3 m", { size: 11 });
  D["three-fires"] = (L) => bg() + ground(170) + logs(90, 170, 50) + flame(90, 158, 0.6) + logs(230, 170, 50) + flame(230, 158, 0.6) + logs(160, 128, 50) + flame(160, 116, 0.6) +
    line("M150 66 q-10 -20 6 -36 q12 -12 2 -26", "d-smoke") + line("M220 108 q-10 -20 6 -36", "d-smoke") + line("M80 108 q-10 -20 6 -36", "d-smoke");

  OUT.diagram = function (key, lang, alt) {
    const fn = D[key];
    if (!fn) return "";
    const L = (en, pl) => (lang === "pl" ? pl : en);
    return `<svg class="dg" viewBox="0 0 320 200" role="img" aria-label="${(alt || "").replace(/"/g, "&quot;")}" focusable="false">${fn(L)}</svg>`;
  };
  OUT.diagramKeys = Object.keys(D);

  /* ------------------------------------------------------------------ icons (24 × 24 line icons) */
  const IC = {
    drop: '<path d="M12 3c3.5 4.4 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.6 6-11Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
    flame: '<path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8Z"/><path d="M8 20h8"/>',
    tent: '<path d="M3 20 12 5l9 15Z"/><path d="M12 5v15M9.5 20 12 14l2.5 6"/>',
    cross: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
    knot: '<path d="M4 16c4 0 5-8 9-8a3.5 3.5 0 0 1 0 7c-4 0-4-7-9-7"/><path d="M13 15c3 0 4 1 7 1M13 8c3 0 4-1 7-1"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
    boot: '<path d="M7 3h5v8l6 3a3 3 0 0 1 2 3v2H4V8Z"/><path d="M4 17h16M12 7H9M12 10H8"/>',
    home: '<path d="M4 11 12 4l8 7v9H4Z"/><path d="M10 20v-6h4v6"/>',
    tree: '<path d="M12 3 6 12h3l-4 6h14l-4-6h3Z"/><path d="M12 18v3"/>',
    rain: '<path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.5-1.5A4 4 0 0 1 17 15Z"/><path d="m9 18-1 2M13 18l-1 2M17 18l-1 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    bolt: '<path d="M13 2 5 13h6l-1 9 8-11h-6Z"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0Z"/><path d="M12 17v4"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5Z"/><path d="M5 11h14"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    chevL: '<path d="m15 6-6 6 6 6"/>',
    chevD: '<path d="m6 9 6 6 6-6"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7Z"/>',
    warn: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4ZM20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>',
    map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v14M15 6v14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4Z"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
    steps: '<path d="M4 20h5v-5h5v-5h5V5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
  };
  OUT.icon = (name, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[name] || ""}</svg>`;
})();
