/* Outlast — mini-games: step order, swipe-sort, spot-the-site, boil timer, knot tracing, quizzes.
   Every game teaches the skill on its guide page and also lives in the Practice hub. */
(function () {
  "use strict";
  const OUT = (window.OUT = window.OUT || {});
  const T = (en, pl) => ({ en, pl });

  /* ------------------------------------------------------------------ data: quizzes (2 per guide) */
  const Q = (q, opts, a, why) => ({ q, opts, a, why });
  OUT.quizzes = {
    "boil-water": [
      Q(T("How long should water keep a rolling boil at sea level?", "Jak długo woda ma silnie wrzeć na poziomie morza?"), [T("10 seconds", "10 sekund"), T("1 minute", "1 minutę"), T("10 minutes", "10 minut")], 1,
        T("One full minute of rolling boil is enough below about 2,000 m.", "Pełna minuta silnego wrzenia wystarczy poniżej ok. 2000 m.")),
      Q(T("Which problem does boiling NOT fix?", "Czego gotowanie NIE usuwa?"), [T("Bacteria", "Bakterii"), T("Viruses", "Wirusów"), T("Fuel or chemicals", "Paliwa lub chemikaliów")], 2,
        T("Boiling kills germs but leaves chemicals behind. Find another source.", "Gotowanie zabija zarazki, ale chemikalia zostają. Znajdź inne źródło."))
    ],
    "treat-water": [
      Q(T("What do most hiking filters NOT remove?", "Czego większość filtrów turystycznych NIE usuwa?"), [T("Parasites", "Pasożytów"), T("Viruses", "Wirusów"), T("Bacteria", "Bakterii")], 1,
        T("Viruses are too small for most filters. Add tablets or boil near villages and farms.", "Wirusy są za małe dla większości filtrów. W pobliżu wsi i gospodarstw dodaj tabletki lub gotuj.")),
      Q(T("Bleach dose for 1 litre of clear water?", "Ile wybielacza na 1 litr czystej wody?"), [T("2 drops", "2 krople"), T("1 teaspoon", "1 łyżeczka"), T("Half a cup", "Pół szklanki")], 0,
        T("2 drops of plain ~6% bleach per litre, then wait 30 minutes.", "2 krople zwykłego ~6% wybielacza na litr, potem 30 minut czekania."))
    ],
    "build-fire": [
      Q(T("Which side do you light the fire from?", "Od której strony zapalasz ognisko?"), [T("The side the wind comes from", "Od strony, z której wieje wiatr"), T("The side the wind blows to", "Od strony zawietrznej"), T("The top", "Od góry")], 0,
        T("The wind then pushes the flame into the kindling.", "Wtedy wiatr wpycha płomień w rozpałkę.")),
      Q(T("How do you know a fire is fully out?", "Jak sprawdzić, że ogień całkiem zgasł?"), [T("No flames visible", "Nie widać płomieni"), T("Ashes are cool to the touch", "Popiół jest zimny w dotyku"), T("It stopped smoking", "Przestał dymić")], 1,
        T("Drown, stir, feel. If you feel any heat, it isn't out.", "Zalej, zamieszaj, dotknij. Jeśli czujesz ciepło, ogień nie zgasł."))
    ],
    "tarp-shelter": [
      Q(T("What should you check above your tarp spot?", "Co sprawdzić nad miejscem pod plandekę?"), [T("Dead branches", "Suche gałęzie"), T("Bird nests", "Ptasie gniazda"), T("Nothing", "Nic")], 0,
        T("Dead branches can fall in wind. Move if you see any.", "Suche gałęzie mogą spaść przy wietrze. Przenieś się, jeśli je widzisz.")),
      Q(T("What steals more body heat at night?", "Co w nocy odbiera więcej ciepła?"), [T("Cold air", "Zimne powietrze"), T("Cold ground", "Zimna ziemia")], 1,
        T("The ground pulls heat through contact. Always insulate underneath.", "Ziemia odbiera ciepło przez kontakt. Zawsze izoluj się od spodu."))
    ],
    "debris-hut": [
      Q(T("How thick should the leaf layer be?", "Jak gruba ma być warstwa liści?"), [T("A hand's width", "Na szerokość dłoni"), T("About an arm's length", "Mniej więcej na długość ręki")], 1,
        T("60–90 cm. A thin layer gives almost no warmth.", "60–90 cm. Cienka warstwa prawie nie grzeje.")),
      Q(T("When should you start building?", "Kiedy zacząć budować?"), [T("At sunset", "O zachodzie słońca"), T("2–3 hours before dark", "2–3 godziny przed zmrokiem")], 1,
        T("A debris hut takes hours. Building in the dark is slow and risky.", "Szałas zajmuje godziny. Budowa po ciemku jest wolna i ryzykowna."))
    ],
    "bleeding": [
      Q(T("Blood soaks through the cloth. What now?", "Krew przesiąka przez materiał. Co teraz?"), [T("Remove it and check", "Zdejmij i sprawdź"), T("Add more on top and keep pressing", "Dołóż kolejną warstwę i uciskaj dalej")], 1,
        T("Lifting the pad restarts the bleeding. Add layers and keep pressure.", "Podniesienie opatrunku wznawia krwawienie. Dokładaj warstwy i uciskaj.")),
      Q(T("Where does a tourniquet go?", "Gdzie zakłada się opaskę uciskową?"), [T("On the nearest joint", "Na najbliższym stawie"), T("5–7 cm above the wound", "5–7 cm powyżej rany")], 1,
        T("Above the wound, never on a joint, and note the time.", "Powyżej rany, nigdy na stawie, i zanotuj godzinę."))
    ],
    "hypothermia": [
      Q(T("A cold friend stops shivering and gets confused. This is…", "Zmarznięty kolega przestaje drżeć i jest zdezorientowany. To…"), [T("Getting better", "Poprawa"), T("Severe: call 112", "Stan ciężki: dzwoń 112")], 1,
        T("Shivering that stops while still cold is a danger sign.", "Ustanie drżenia przy wciąż niskiej temperaturze to sygnał alarmowy.")),
      Q(T("Where do warm packs work best?", "Gdzie najlepiej działają ogrzewacze?"), [T("Hands and feet", "Dłonie i stopy"), T("Chest, neck, armpits, groin", "Klatka, szyja, pachy, pachwiny")], 1,
        T("Warm the core. Rubbing limbs can make things worse.", "Ogrzewaj tułów. Rozcieranie kończyn może zaszkodzić."))
    ],
    "sprain": [
      Q(T("They can't take four steps on it. Treat it as…", "Nie może zrobić czterech kroków. Traktuj to jako…"), [T("A sprain", "Skręcenie"), T("A possible break", "Możliwe złamanie")], 1,
        T("Splint it and call for help.", "Unieruchom i wezwij pomoc.")),
      Q(T("How long to cool the ankle each time?", "Jak długo chłodzić kostkę za każdym razem?"), [T("15–20 minutes", "15–20 minut"), T("1 hour", "1 godzinę")], 0,
        T("Wrapped in cloth, never ice straight on skin.", "Owinięte w materiał, nigdy lód bezpośrednio na skórę."))
    ],
    "knot-bowline": [
      Q(T("What's the bowline best for?", "Do czego najlepiej nadaje się bulin?"), [T("A loop that won't slip", "Pętla, która się nie zaciska"), T("Joining two ropes", "Łączenie dwóch lin")], 0,
        T("A fixed loop that stays the same size and unties easily.", "Stała pętla, która nie zmienia rozmiaru i łatwo się rozwiązuje.")),
      Q(T("How long should the tail be?", "Jak długi ma być koniec?"), [T("Just a few mm", "Kilka milimetrów"), T("At least 10 rope widths", "Co najmniej 10 średnic liny")], 1,
        T("A short tail can work loose.", "Krótki koniec może się wysunąć."))
    ],
    "knot-clove": [
      Q(T("A clove hitch fastens a rope to…", "Wyblinka mocuje linę do…"), [T("A pole or tree", "Słupka lub drzewa"), T("Another rope", "Innej liny")], 0,
        T("Fast to tie and adjust around a post.", "Szybko się ją wiąże i reguluje na słupku.")),
      Q(T("How do you make it safer for a heavy load?", "Jak zabezpieczyć ją przy dużym obciążeniu?"), [T("Add two half hitches", "Dodaj dwa półsztyki"), T("Pull harder", "Mocniej dociągnij")], 0,
        T("A clove can slip if the pull comes and goes.", "Wyblinka może się przesuwać przy zmiennym obciążeniu."))
    ],
    "knot-taut-line": [
      Q(T("What's special about the taut-line hitch?", "Co wyróżnia węzeł namiotowy?"), [T("It slides to adjust, then grips", "Przesuwa się do regulacji, potem trzyma"), T("It never comes undone", "Nigdy się nie rozwiązuje")], 0,
        T("Perfect for tensioning guy lines and ridgelines.", "Idealny do napinania odciągów i linki grzbietowej.")),
      Q(T("How many turns go inside the loop?", "Ile zwojów idzie do środka pętli?"), [T("One", "Jeden"), T("Two", "Dwa"), T("Four", "Cztery")], 1,
        T("Two inside, then one outside.", "Dwa do środka, potem jeden na zewnątrz."))
    ],
    "knot-reef": [
      Q(T("Should a reef knot hold a person's weight?", "Czy węzeł płaski może utrzymać człowieka?"), [T("Yes", "Tak"), T("Never", "Nigdy")], 1,
        T("It can spill under load. It's for bandages and bundles.", "Może się rozsunąć pod obciążeniem. Służy do bandaży i pakunków.")),
      Q(T("The rule for a reef knot is…", "Zasada węzła płaskiego to…"), [T("Right over left, left over right", "Prawy na lewy, lewy na prawy"), T("Right over left, right over left", "Prawy na lewy, prawy na lewy")], 0,
        T("Repeating the same side makes a granny knot that slips.", "Powtórzenie tej samej strony daje babski węzeł, który się ślizga."))
    ],
    "lost-stop": [
      Q(T("What does the S in S.T.O.P. stand for?", "Co oznacza S w S.T.O.P.?"), [T("Search", "Szukaj"), T("Stop", "Stój"), T("Signal", "Sygnalizuj")], 1,
        T("Stop moving. Every step in the wrong direction makes the search area bigger.", "Przestań iść. Każdy krok w złą stronę powiększa obszar poszukiwań.")),
      Q(T("Someone knows your route. Best plan if unsure of the way?", "Ktoś zna twoją trasę. Najlepszy plan, gdy nie znasz drogi?"), [T("Keep walking to find a road", "Idź dalej, by znaleźć drogę"), T("Stay put and be findable", "Zostań i daj się znaleźć")], 1,
        T("Searchers start on your planned route.", "Ratownicy zaczynają od planowanej trasy."))
    ],
    "signal-help": [
      Q(T("The international distress signal on a whistle is…", "Międzynarodowy sygnał alarmowy gwizdkiem to…"), [T("1 long blast", "1 długi sygnał"), T("3 blasts", "3 sygnały"), T("5 short blasts", "5 krótkich")], 1,
        T("Three of anything means help.", "Trzy powtórzenia czegokolwiek oznaczają wezwanie pomocy.")),
      Q(T("A big X on the ground tells aircraft…", "Duży X na ziemi mówi lotnikom…"), [T("Need medical help", "Potrzebna pomoc medyczna"), T("All fine", "Wszystko w porządku")], 0,
        T("V means need help, X means need medical help.", "V oznacza potrzebę pomocy, X — pomocy medycznej."))
    ]
  };

  /* ------------------------------------------------------------------ data: swipe-sort decks */
  const C = (t, side, why) => ({ t, side, why }); // side 0 = left bin, 1 = right bin
  OUT.sortDecks = {
    "safe-water": {
      title: T("Safe to drink?", "Czy można pić?"),
      bins: [T("Not yet", "Jeszcze nie"), T("Safe", "Bezpieczna")],
      cards: [
        C(T("Clear mountain stream, untreated", "Czysty górski strumień, nieuzdatniony"), 0, T("Clear doesn't mean clean. Treat all natural water.", "Czysta nie znaczy bezpieczna. Uzdatniaj każdą naturalną wodę.")),
        C(T("Stream water boiled hard for 1 minute", "Woda ze strumienia gotowana 1 minutę"), 1, T("A full minute of rolling boil makes it safe.", "Pełna minuta silnego wrzenia czyni ją bezpieczną.")),
        C(T("Lake water with tablets, waited 5 minutes", "Woda z jeziora z tabletkami, 5 minut czekania"), 0, T("Most tablets need 30 minutes or more.", "Większość tabletek potrzebuje 30 minut lub więcej.")),
        C(T("Filtered water from a river below a village", "Filtrowana woda z rzeki poniżej wsi"), 0, T("Filters miss viruses. Add tablets or boil.", "Filtry nie zatrzymują wirusów. Dodaj tabletki lub gotuj.")),
        C(T("Rainwater caught in a clean tarp, then boiled", "Deszczówka z czystej plandeki, przegotowana"), 1, T("Clean collection plus boiling: good.", "Czyste zbieranie i gotowanie: dobrze.")),
        C(T("Boiled water that smells of fuel", "Przegotowana woda pachnąca paliwem"), 0, T("Boiling doesn't remove chemicals.", "Gotowanie nie usuwa chemikaliów."))
      ]
    },
    "hypo-signs": {
      title: T("Mild or severe hypothermia?", "Łagodna czy ciężka hipotermia?"),
      bins: [T("Mild: warm them", "Łagodna: ogrzej"), T("Severe: call 112", "Ciężka: dzwoń 112")],
      cards: [
        C(T("Strong shivering, still talking normally", "Silne drżenie, mówi normalnie"), 0, T("Shivering is the body fighting back. Warm and fuel them.", "Drżenie to obrona organizmu. Ogrzej i nakarm.")),
        C(T("Shivering has stopped but they're still cold", "Drżenie ustało, ale nadal jest zimny"), 1, T("A danger sign. Call 112, handle gently.", "Sygnał alarmowy. Dzwoń 112, przenoś delikatnie.")),
        C(T("Confused and very sleepy", "Zdezorientowany i bardzo senny"), 1, T("Confusion means it's serious.", "Dezorientacja oznacza stan poważny.")),
        C(T("Clumsy fingers, can't do up a zip", "Niezgrabne palce, nie zapnie zamka"), 0, T("Early 'umbles'. Act now: shelter, dry layers, food.", "Wczesne objawy. Działaj teraz: schronienie, suche warstwy, jedzenie.")),
        C(T("Unconscious", "Nieprzytomny"), 1, T("Call 112 immediately.", "Natychmiast dzwoń 112."))
      ]
    },
    "sprain-break": {
      title: T("Sprain or possible break?", "Skręcenie czy możliwe złamanie?"),
      bins: [T("Sprain", "Skręcenie"), T("Possible break", "Możliwe złamanie")],
      cards: [
        C(T("Can walk with pain, swelling on the side", "Może iść z bólem, obrzęk z boku"), 0, T("Sounds like a sprain: cool, wrap, raise.", "Wygląda na skręcenie: chłodź, owiń, unieś.")),
        C(T("Can't take four steps", "Nie może zrobić czterech kroków"), 1, T("Treat as a break: splint and get help.", "Traktuj jak złamanie: unieruchom i wezwij pomoc.")),
        C(T("Bone looks out of shape", "Kość wygląda na zniekształconą"), 1, T("Don't straighten it. Splint as it lies.", "Nie prostuj. Unieruchom w zastanej pozycji.")),
        C(T("Foot is numb and pale", "Stopa jest drętwa i blada"), 1, T("Blood flow may be affected. Urgent help.", "Krążenie może być zaburzone. Pilna pomoc."))
      ]
    },
    "signals": {
      title: T("Does it call for help?", "Czy to wezwanie pomocy?"),
      bins: [T("No", "Nie"), T("Yes", "Tak")],
      cards: [
        C(T("Three whistle blasts, repeated", "Trzy sygnały gwizdkiem, powtarzane"), 1, T("Three of anything = distress.", "Trzy powtórzenia = wezwanie pomocy.")),
        C(T("A big V made of rocks", "Duże V z kamieni"), 1, T("V means 'need help'.", "V oznacza „potrzebna pomoc”.")),
        C(T("One single torch flash", "Pojedynczy błysk latarką"), 0, T("Use groups of three.", "Używaj grup po trzy.")),
        C(T("Three fires in a triangle", "Trzy ogniska w trójkącie"), 1, T("A recognised distress signal.", "Uznany sygnał alarmowy.")),
        C(T("Shouting once now and then", "Krzyk od czasu do czasu"), 0, T("A whistle carries further and saves energy.", "Gwizdek niesie się dalej i oszczędza siły."))
      ]
    }
  };

  /* ------------------------------------------------------------------ data: spot the site (shelter) */
  OUT.spotGame = {
    title: T("Pick the safest spot for the night", "Wybierz najbezpieczniejsze miejsce na noc"),
    spots: [
      { x: 64, y: 150, ok: false, label: T("Under the big dead branch", "Pod dużą suchą gałęzią"), why: T("Dead branches fall in wind.", "Suche gałęzie spadają przy wietrze.") },
      { x: 150, y: 176, ok: false, label: T("In the dip by the stream", "W zagłębieniu przy strumieniu"), why: T("Cold air and rainwater collect in low spots.", "W zagłębieniach zbiera się zimne powietrze i deszczówka.") },
      { x: 236, y: 92, ok: false, label: T("On the open ridge", "Na otwartej grani"), why: T("Exposed to wind and lightning.", "Wystawione na wiatr i pioruny.") },
      { x: 268, y: 160, ok: true, label: T("Flat, slightly raised, healthy trees", "Płasko, lekko wyżej, zdrowe drzewa"), why: T("Dry, sheltered and nothing overhead to fall.", "Sucho, osłonięte i nic nie spadnie z góry.") }
    ]
  };

  /* ------------------------------------------------------------------ data: knot tracing
     Each knot is a chain of segments. z: 0 = passes under, 1 = normal, 2 = passes over.
     The player drags the rope end along the dotted path. */
  OUT.knotTraces = {
    "knot-bowline": {
      title: T("Tie a bowline", "Zawiąż bulin"),
      start: "M160 0 V70",
      anchor: "",
      segs: [
        { d: "M160 70 C160 92 196 96 196 116 C196 140 160 146 146 132 C134 120 142 96 170 86", z: 1, t: T("Make the rabbit hole", "Zrób norę królika") },
        { d: "M170 86 C200 92 232 140 220 180 C206 222 130 222 112 190 C102 170 110 156 122 150", z: 2, t: T("Leave a big loop", "Zostaw dużą pętlę") },
        { d: "M122 150 C130 146 140 140 152 130", z: 0, t: T("Up through the hole", "Do góry przez norę") },
        { d: "M152 130 C162 120 168 108 174 96 C182 84 186 70 178 56", z: 2, t: T("Up through the hole", "Do góry przez norę") },
        { d: "M178 56 C172 46 150 44 142 54", z: 0, t: T("Round the back of the tree", "Dookoła drzewa, z tyłu") },
        { d: "M142 54 C136 66 146 82 154 104", z: 2, t: T("Back down the hole", "Z powrotem do nory") },
        { d: "M154 104 C156 116 152 130 144 142", z: 0, t: T("Back down the hole", "Z powrotem do nory") }
      ]
    },
    "knot-taut-line": {
      title: T("Tie a taut-line hitch", "Zawiąż węzeł namiotowy"),
      start: "M316 80 L60 80",
      anchor: "tree",
      segs: [
        { d: "M60 80 C34 80 34 120 60 120 L200 120", z: 1, t: T("Round the tree and back", "Dookoła drzewa i z powrotem") },
        { d: "M200 120 C208 110 196 76 184 62", z: 2, t: T("First turn inside the loop", "Pierwszy zwój do środka") },
        { d: "M184 62 C178 56 170 66 170 96", z: 0, t: T("First turn inside the loop", "Pierwszy zwój do środka") },
        { d: "M170 96 C170 98 160 74 150 62", z: 2, t: T("Second turn inside", "Drugi zwój do środka") },
        { d: "M150 62 C144 56 138 68 140 96", z: 0, t: T("Second turn inside", "Drugi zwój do środka") },
        { d: "M140 96 C150 110 214 112 226 98 C234 88 236 72 230 62", z: 2, t: T("Over the turns, one turn outside", "Nad zwojami, jeden zwój na zewnątrz") },
        { d: "M230 62 C224 56 216 66 220 94", z: 0, t: T("Tuck under to finish", "Wsuń pod spód, by zakończyć") },
        { d: "M220 94 C222 104 236 106 250 104", z: 1, t: T("Tuck under to finish", "Wsuń pod spód, by zakończyć") }
      ]
    }
  };

  /* games attached to each guide (after the quiz) */
  OUT.guideGames = {
    "boil-water": [{ type: "boil" }, { type: "sort", deck: "safe-water" }],
    "treat-water": [{ type: "sort", deck: "safe-water" }, { type: "order" }],
    "build-fire": [{ type: "order" }],
    "tarp-shelter": [{ type: "spot" }, { type: "order" }],
    "debris-hut": [{ type: "spot" }, { type: "order" }],
    "bleeding": [{ type: "order" }],
    "hypothermia": [{ type: "sort", deck: "hypo-signs" }],
    "sprain": [{ type: "sort", deck: "sprain-break" }],
    "knot-bowline": [{ type: "trace", knot: "knot-bowline" }],
    "knot-clove": [{ type: "order" }],
    "knot-taut-line": [{ type: "trace", knot: "knot-taut-line" }],
    "knot-reef": [{ type: "order" }],
    "lost-stop": [{ type: "order" }],
    "signal-help": [{ type: "sort", deck: "signals" }]
  };

  /* ------------------------------------------------------------------ helpers */
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* not supported */ } };
  function shake(el) { if (reduced()) return; el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }
  const W = {
    en: { order: "Put the steps in order", orderHint: "Tap the steps from first to last.", orderDone: "Spot on. That's the right order.", mistakes: "{n} mistakes", again: "Play again",
      quiz: "Quick check", correct: "Correct", wrong: "Not quite", next: "Next", score: "{s} of {n} right", sortHint: "Drag the card left or right, or use the buttons.",
      sortDone: "Deck done: {s} of {n} right", spotHint: "Tap a spot on the map.", boil: "Boil it safely", boilHint: "Hold the button to keep the heat on. Keep a rolling boil for the full time.",
      hold: "Hold to heat", valley: "Valley", mountain: "Above 2000 m", boilOk: "Safe to drink once it cools.", boilLost: "The boil stopped. The timer starts again.",
      trace: "Tie it yourself", traceHint: "Drag the rope end along the dotted path.", traceDone: "Knot tied. Now try it with a real rope.", rolling: "Rolling boil", heating: "Heating…", cool: "Off the heat" },
    pl: { order: "Ułóż kroki w kolejności", orderHint: "Stukaj w kroki od pierwszego do ostatniego.", orderDone: "Świetnie. To właściwa kolejność.", mistakes: "Pomyłki: {n}", again: "Zagraj ponownie",
      quiz: "Szybki test", correct: "Dobrze", wrong: "Nie do końca", next: "Dalej", score: "{s} z {n} poprawnie", sortHint: "Przeciągnij kartę w lewo lub w prawo albo użyj przycisków.",
      sortDone: "Koniec talii: {s} z {n} poprawnie", spotHint: "Stuknij miejsce na mapie.", boil: "Zagotuj bezpiecznie", boilHint: "Przytrzymaj przycisk, by grzać. Utrzymaj silne wrzenie przez cały czas.",
      hold: "Przytrzymaj, by grzać", valley: "Dolina", mountain: "Powyżej 2000 m", boilOk: "Po ostygnięciu można pić.", boilLost: "Wrzenie ustało. Odliczanie zaczyna się od nowa.",
      trace: "Zawiąż sam", traceHint: "Przeciągnij koniec liny wzdłuż kropkowanej ścieżki.", traceDone: "Węzeł zawiązany. Teraz spróbuj prawdziwą liną.", rolling: "Silne wrzenie", heating: "Podgrzewanie…", cool: "Bez ognia" }
  };
  const w = (lang, k, v) => { let s = (W[lang] || W.en)[k] || W.en[k]; if (v) s = s.replace(/\{(\w+)\}/g, (_, x) => v[x]); return s; };
  const L = (o, lang) => (o && typeof o === "object" ? o[lang] || o.en : o);
  const record = (id) => { try { const k = "outlast.played"; const a = JSON.parse(localStorage.getItem(k) || "[]"); if (!a.includes(id)) { a.push(id); localStorage.setItem(k, JSON.stringify(a)); } } catch (e) { /* storage unavailable */ } };

  /* ------------------------------------------------------------------ ORDER */
  function order(root, ctx) {
    const g = OUT.guides.find((x) => x.id === ctx.guide);
    const items = g.steps.map((s, i) => ({ i, t: L(s.t, ctx.lang) }));
    // merge duplicate titles (e.g. knot steps sharing a label) so the order is unambiguous
    const uniq = items.filter((x, k) => items.findIndex((y) => y.t === x.t) === k).map((x, k) => ({ i: k, t: x.t }));
    let next = 0, miss = 0;
    const draw = () => {
      root.innerHTML = `<div class="game__head"><h3>${esc(w(ctx.lang, "order"))}</h3><p>${esc(w(ctx.lang, "orderHint"))}</p></div>
        <ol class="seq">${uniq.map((x, k) => `<li class="${k < next ? "is-done" : ""}">${k < next ? esc(x.t) : ""}</li>`).join("")}</ol>
        <div class="pool">${shuffle(uniq).filter((x) => x.i >= next).map((x) => `<button type="button" class="pool__item" data-i="${x.i}">${esc(x.t)}</button>`).join("")}</div>`;
      root.querySelectorAll(".pool__item").forEach((b) => b.addEventListener("click", () => {
        if (Number(b.dataset.i) === next) { next++; buzz(8); if (next === uniq.length) done(); else draw(); }
        else { miss++; shake(b); buzz([20, 40, 20]); }
      }));
    };
    const done = () => {
      record("order:" + ctx.guide);
      root.innerHTML = `<div class="game__win"><strong>${esc(w(ctx.lang, "orderDone"))}</strong><span>${esc(w(ctx.lang, "mistakes", { n: miss }))}</span>
        <ol class="seq seq--done">${uniq.map((x) => `<li class="is-done">${esc(x.t)}</li>`).join("")}</ol>
        <button type="button" class="btn btn--line" data-again>${esc(w(ctx.lang, "again"))}</button></div>`;
      root.querySelector("[data-again]").addEventListener("click", () => { next = 0; miss = 0; draw(); });
    };
    draw();
  }

  /* ------------------------------------------------------------------ QUIZ */
  function quiz(root, ctx) {
    const qs = OUT.quizzes[ctx.guide] || [];
    let i = 0, score = 0;
    const draw = () => {
      if (i >= qs.length) {
        record("quiz:" + ctx.guide);
        root.innerHTML = `<div class="game__win"><strong>${esc(w(ctx.lang, "score", { s: score, n: qs.length }))}</strong><button type="button" class="btn btn--line" data-again>${esc(w(ctx.lang, "again"))}</button></div>`;
        root.querySelector("[data-again]").addEventListener("click", () => { i = 0; score = 0; draw(); });
        return;
      }
      const q = qs[i];
      root.innerHTML = `<div class="game__head"><h3>${esc(w(ctx.lang, "quiz"))} <small>${i + 1}/${qs.length}</small></h3><p class="quiz__q">${esc(L(q.q, ctx.lang))}</p></div>
        <div class="quiz__opts">${q.opts.map((o, k) => `<button type="button" class="quiz__opt" data-k="${k}">${esc(L(o, ctx.lang))}</button>`).join("")}</div>
        <div class="quiz__fb" aria-live="polite"></div>`;
      root.querySelectorAll(".quiz__opt").forEach((b) => b.addEventListener("click", () => {
        const k = Number(b.dataset.k), ok = k === q.a;
        if (ok) score++;
        root.querySelectorAll(".quiz__opt").forEach((x) => { x.disabled = true; const kk = Number(x.dataset.k); if (kk === q.a) x.classList.add("is-right"); else if (kk === k) x.classList.add("is-wrong"); });
        buzz(ok ? 10 : [20, 40, 20]);
        root.querySelector(".quiz__fb").innerHTML = `<p><strong>${esc(w(ctx.lang, ok ? "correct" : "wrong"))}.</strong> ${esc(L(q.why, ctx.lang))}</p><button type="button" class="btn btn--leaf" data-next>${esc(w(ctx.lang, "next"))}</button>`;
        root.querySelector("[data-next]").addEventListener("click", () => { i++; draw(); });
        root.querySelector("[data-next]").focus();
      }));
    };
    draw();
  }

  /* ------------------------------------------------------------------ SORT (swipeable cards) */
  function sort(root, ctx) {
    const deck = OUT.sortDecks[ctx.deck];
    let cards = shuffle(deck.cards), i = 0, score = 0;
    const draw = () => {
      if (i >= cards.length) {
        record("sort:" + ctx.deck);
        root.innerHTML = `<div class="game__win"><strong>${esc(w(ctx.lang, "sortDone", { s: score, n: cards.length }))}</strong><button type="button" class="btn btn--line" data-again>${esc(w(ctx.lang, "again"))}</button></div>`;
        root.querySelector("[data-again]").addEventListener("click", () => { cards = shuffle(deck.cards); i = 0; score = 0; draw(); });
        return;
      }
      const c = cards[i];
      root.innerHTML = `<div class="game__head"><h3>${esc(L(deck.title, ctx.lang))} <small>${i + 1}/${cards.length}</small></h3><p>${esc(w(ctx.lang, "sortHint"))}</p></div>
        <div class="sortboard">
          <div class="bin bin--l">${esc(L(deck.bins[0], ctx.lang))}</div>
          <div class="cardstack"><div class="scard" tabindex="0">${esc(L(c.t, ctx.lang))}</div></div>
          <div class="bin bin--r">${esc(L(deck.bins[1], ctx.lang))}</div>
        </div>
        <div class="sort__btns"><button type="button" class="btn btn--line" data-side="0">← ${esc(L(deck.bins[0], ctx.lang))}</button><button type="button" class="btn btn--line" data-side="1">${esc(L(deck.bins[1], ctx.lang))} →</button></div>
        <div class="quiz__fb" aria-live="polite"></div>`;
      const card = root.querySelector(".scard");
      let answered = false;
      const answer = (side) => {
        if (answered) return; answered = true;
        const ok = side === c.side; if (ok) score++;
        buzz(ok ? 10 : [20, 40, 20]);
        fly(card, side === 0 ? -1 : 1);
        root.querySelectorAll("[data-side]").forEach((b) => (b.disabled = true));
        root.querySelector(`.bin--${side ? "r" : "l"}`).classList.add(ok ? "is-right" : "is-wrong");
        root.querySelector(".quiz__fb").innerHTML = `<p><strong>${esc(w(ctx.lang, ok ? "correct" : "wrong"))}.</strong> ${esc(L(c.why, ctx.lang))}</p><button type="button" class="btn btn--leaf" data-next>${esc(w(ctx.lang, "next"))}</button>`;
        root.querySelector("[data-next]").addEventListener("click", () => { i++; draw(); });
      };
      root.querySelectorAll("[data-side]").forEach((b) => b.addEventListener("click", () => answer(Number(b.dataset.side))));
      card.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") answer(0); if (e.key === "ArrowRight") answer(1); });
      dragCard(card, (dir) => answer(dir < 0 ? 0 : 1));
    };
    draw();
  }

  // 1:1 drag with velocity-based commit; springs back if the flick is too weak
  function dragCard(card, commit) {
    let startX = 0, x = 0, id = null, hist = [];
    const set = (v) => { card.style.transform = `translateX(${v}px) rotate(${v / 18}deg)`; };
    card.addEventListener("pointerdown", (e) => {
      id = e.pointerId; card.setPointerCapture(id); startX = e.clientX - x; hist = [{ x: e.clientX, t: e.timeStamp }];
      card.style.transition = "none"; card.classList.add("is-drag");
    });
    card.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id) return;
      x = e.clientX - startX; set(x);
      hist.push({ x: e.clientX, t: e.timeStamp }); if (hist.length > 5) hist.shift();
    });
    const end = (e) => {
      if (e.pointerId !== id) return; id = null; card.classList.remove("is-drag");
      const a = hist[0], b = hist[hist.length - 1];
      const v = b && a && b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0; // px/s
      const projected = x + (v / 1000) * 0.998 / (1 - 0.998); // momentum projection
      if (Math.abs(projected) > 120) { commit(projected); return; }
      card.style.transition = "transform 360ms cubic-bezier(0.32, 0.72, 0, 1)"; x = 0; set(0);
    };
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }
  function fly(card, dir) {
    card.style.transition = reduced() ? "opacity 150ms" : "transform 380ms cubic-bezier(0.32, 0.72, 0, 1), opacity 380ms";
    if (!reduced()) card.style.transform = `translateX(${dir * 140}%) rotate(${dir * 12}deg)`;
    card.style.opacity = "0";
  }

  /* ------------------------------------------------------------------ SPOT */
  function spot(root, ctx) {
    const g = OUT.spotGame;
    root.innerHTML = `<div class="game__head"><h3>${esc(L(g.title, ctx.lang))}</h3><p>${esc(w(ctx.lang, "spotHint"))}</p></div>
      <div class="spotmap"><svg class="dg" viewBox="0 0 320 210" role="img" aria-label="${esc(L(g.title, ctx.lang))}">
        <rect class="d-bg" width="320" height="210" rx="12"/>
        <path class="d-mountain o" d="M160 210 L240 70 L320 150 V210Z"/>
        <path class="d-ground o" d="M0 168 Q80 150 130 170 Q150 196 172 172 Q230 150 320 160 V210 H0Z"/>
        <path class="d-water-run" d="M110 190 Q150 200 190 186"/>
        <rect class="d-wood o" x="30" y="70" width="14" height="90" rx="3"/><path class="d-deadbranch" d="M40 80 L100 66 M70 72 l14 -16"/>
        <path class="d-leaf2 o" d="M290 60 l22 44 h-14 l18 34 h-52 l18 -34 h-14Z"/><rect class="d-wood o" x="286" y="138" width="8" height="24" rx="2"/>
        <path class="d-leaf2 o" d="M250 74 l20 40 h-12 l16 30 h-48 l16 -30 h-12Z"/><rect class="d-wood o" x="246" y="144" width="8" height="18" rx="2"/>
        <path class="d-wind" d="M200 50 h40 q10 0 10 -8 M206 64 h46"/>
        ${g.spots.map((s, k) => `<g class="spot" data-k="${k}" tabindex="0" role="button" aria-label="${esc(L(s.label, ctx.lang))}"><circle cx="${s.x}" cy="${s.y}" r="17"/><text x="${s.x}" y="${s.y + 5}" text-anchor="middle">${"ABCD"[k]}</text></g>`).join("")}
      </svg></div>
      <div class="quiz__fb" aria-live="polite"></div>`;
    const pick = (k) => {
      const s = g.spots[k];
      root.querySelectorAll(".spot").forEach((el) => el.classList.toggle("is-picked", Number(el.dataset.k) === k));
      root.querySelector(`.spot[data-k="${k}"]`).classList.add(s.ok ? "is-right" : "is-wrong");
      buzz(s.ok ? 10 : [20, 40, 20]);
      root.querySelector(".quiz__fb").innerHTML = `<p><strong>${"ABCD"[k]} · ${esc(L(s.label, ctx.lang))}.</strong> ${esc(w(ctx.lang, s.ok ? "correct" : "wrong"))}: ${esc(L(s.why, ctx.lang))}</p>`;
      if (s.ok) record("spot");
    };
    root.querySelectorAll(".spot").forEach((el) => {
      el.addEventListener("click", () => pick(Number(el.dataset.k)));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(Number(el.dataset.k)); } });
    });
  }

  /* ------------------------------------------------------------------ BOIL */
  function boil(root, ctx) {
    let need = 60, temp = 20, held = false, boiled = 0, raf = 0, last = 0, done = false;
    const SPEED = 6; // one real second = six "pot" seconds
    root.innerHTML = `<div class="game__head"><h3>${esc(w(ctx.lang, "boil"))}</h3><p>${esc(w(ctx.lang, "boilHint"))}</p></div>
      <div class="seg" role="radiogroup">
        <button type="button" role="radio" aria-checked="true" data-alt="60">${esc(w(ctx.lang, "valley"))} · 1 min</button>
        <button type="button" role="radio" aria-checked="false" data-alt="180">${esc(w(ctx.lang, "mountain"))} · 3 min</button>
      </div>
      <div class="boil">
        <svg class="dg" viewBox="0 0 320 190" aria-hidden="true">
          <rect class="d-bg" width="320" height="190" rx="12"/>
          <g class="boil__fire"><path class="d-fire o" d="M140 176 C162 154 160 140 150 130 C172 140 186 158 172 176Z"/><path class="d-fire o" d="M176 176 C196 156 192 144 184 134 C204 146 214 162 202 176Z"/><path class="d-fire o" d="M110 176 C126 160 124 148 118 140 C136 150 144 164 134 176Z"/></g>
          <rect class="d-wood o" x="96" y="172" width="128" height="12" rx="6"/>
          <path class="d-metal o" d="M100 70 h120 v54 q0 12 -12 12 h-96 q-12 0 -12 -12Z"/>
          <path class="d-water" d="M104 84 h112 v38 q0 8 -8 8 h-96 q-8 0 -8 -8Z"/>
          <g class="boil__bubbles"></g>
          <rect class="d-white o" x="208" y="28" width="98" height="34" rx="8"/><text class="boil__clock d-label" x="257" y="50" text-anchor="middle" style="font-size:14px">0:00</text>
          <rect class="d-white o" x="14" y="28" width="62" height="34" rx="8"/><text class="boil__temp d-label" x="45" y="51" text-anchor="middle" style="font-size:16px">20°</text>
        </svg>
        <div class="boil__bar"><i></i></div>
        <p class="boil__state" aria-live="polite">${esc(w(ctx.lang, "cool"))}</p>
        <button type="button" class="btn btn--leaf btn--big boil__hold">${esc(w(ctx.lang, "hold"))}</button>
      </div>`;
    const $ = (s) => root.querySelector(s);
    const bubbles = $(".boil__bubbles");
    root.querySelectorAll("[data-alt]").forEach((b) => b.addEventListener("click", () => {
      need = Number(b.dataset.alt); boiled = 0; done = false;
      root.querySelectorAll("[data-alt]").forEach((x) => x.setAttribute("aria-checked", x === b));
      draw();
    }));
    const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
    function draw() {
      $(".boil__temp").textContent = Math.round(temp) + "°";
      $(".boil__clock").textContent = fmt(boiled) + " / " + fmt(need);
      $(".boil__bar i").style.width = Math.min(100, (boiled / need) * 100) + "%";
      $(".boil__fire").style.opacity = held ? 1 : 0.15;
      const n = temp >= 100 ? 9 : temp > 80 ? 4 : temp > 60 ? 1 : 0;
      bubbles.innerHTML = Array.from({ length: n }, (_, k) => `<circle class="d-bubble" cx="${110 + ((k * 37 + Math.round(temp * 3)) % 100)}" cy="${88 + ((k * 13 + Math.round(boiled * 7)) % 34)}" r="${temp >= 100 ? 4 + (k % 3) : 2.5}"/>`).join("");
      $(".boil__state").textContent = done ? w(ctx.lang, "boilOk") : temp >= 100 ? w(ctx.lang, "rolling") : held ? w(ctx.lang, "heating") : w(ctx.lang, "cool");
    }
    function tick(t) {
      const dt = Math.min(0.1, (t - (last || t)) / 1000); last = t;
      if (held) temp = Math.min(100, temp + dt * 32); else temp = Math.max(20, temp - dt * 22);
      if (!done) {
        if (temp >= 100 && held) boiled += dt * SPEED;
        else if (boiled > 0 && temp < 100) { boiled = 0; $(".boil__state").textContent = w(ctx.lang, "boilLost"); buzz([30, 30, 30]); draw(); raf = requestAnimationFrame(tick); return; }
        if (boiled >= need) { done = true; boiled = need; record("boil"); buzz([10, 60, 10]); }
      }
      draw();
      if (held || temp > 20) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
    }
    const hold = $(".boil__hold");
    const on = (e) => { e.preventDefault(); if (done) { done = false; boiled = 0; } held = true; hold.classList.add("is-held"); if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
    const off = () => { held = false; hold.classList.remove("is-held"); };
    hold.addEventListener("pointerdown", on);
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => hold.addEventListener(ev, off));
    hold.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && !held) on(e); });
    hold.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") off(); });
    draw();
  }

  /* ------------------------------------------------------------------ TRACE (knots) */
  function trace(root, ctx) {
    const k = OUT.knotTraces[ctx.knot];
    const NS = "http://www.w3.org/2000/svg";
    root.innerHTML = `<div class="game__head"><h3>${esc(w(ctx.lang, "trace"))}: ${esc(L(k.title, ctx.lang))}</h3><p>${esc(w(ctx.lang, "traceHint"))}</p></div>
      <p class="trace__step" aria-live="polite"></p>
      <div class="trace"><svg class="dg trace__svg" viewBox="0 0 320 230" aria-label="${esc(L(k.title, ctx.lang))}">
        <rect class="d-bg" width="320" height="230" rx="12"/>
        ${k.anchor === "tree" ? '<rect class="d-wood o" x="20" y="-4" width="40" height="240" rx="6"/>' : ""}
        <g class="trace__guide"></g><g class="trace__z0"></g>
        <g class="trace__start"><path class="d-rope-o" d="${k.start}"/><path class="d-rope" d="${k.start}"/></g>
        <g class="trace__z1"></g><g class="trace__z2"></g>
        <circle class="trace__handle" r="13"/>
      </svg></div>
      <div class="boil__bar"><i></i></div>
      <button type="button" class="btn btn--line" data-again>${esc(w(ctx.lang, "again"))}</button>`;
    const svg = root.querySelector(".trace__svg");
    // sample every segment into points
    const probe = document.createElementNS(NS, "path");
    svg.appendChild(probe); probe.style.visibility = "hidden";
    const segs = k.segs.map((s) => {
      probe.setAttribute("d", s.d);
      const len = probe.getTotalLength(), n = Math.max(6, Math.round(len / 4));
      const pts = Array.from({ length: n + 1 }, (_, i) => { const p = probe.getPointAtLength((len * i) / n); return [p.x, p.y]; });
      return Object.assign({}, s, { pts });
    });
    probe.remove();
    const all = []; segs.forEach((s, si) => s.pts.forEach((p, pi) => { if (si && pi === 0) return; all.push({ p, si }); }));
    root.querySelector(".trace__guide").innerHTML = `<path class="trace__dots" d="${segs.map((s) => s.d).join(" ")}"/>`;
    let prog = 0, drag = false, done = false;
    const handle = root.querySelector(".trace__handle");
    const poly = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");
    function draw() {
      const layers = { 0: "", 1: "", 2: "" };
      let idx = 0;
      segs.forEach((s, si) => {
        const start = idx, end = idx + s.pts.length - 1; idx = end;
        if (prog <= start) return;
        const upto = Math.min(prog, end) - start;
        const pts = s.pts.slice(0, upto + 1);
        if (pts.length < 2) return;
        const d = poly(pts);
        layers[s.z] += (s.z ? `<path class="d-rope-halo" d="${d}"/>` : "") + `<path class="d-rope-o" d="${d}"/><path class="d-rope" d="${d}"/>`;
      });
      root.querySelector(".trace__z0").innerHTML = layers[0];
      root.querySelector(".trace__z1").innerHTML = layers[1];
      root.querySelector(".trace__z2").innerHTML = layers[2];
      const cur = all[Math.min(prog, all.length - 1)];
      handle.setAttribute("cx", cur.p[0]); handle.setAttribute("cy", cur.p[1]);
      handle.classList.toggle("is-done", done);
      const seg = segs[Math.min(cur.si + (prog > 0 && !done ? 0 : 0), segs.length - 1)];
      root.querySelector(".trace__step").textContent = done ? w(ctx.lang, "traceDone") : L(seg.t, ctx.lang);
      root.querySelector(".boil__bar i").style.width = (prog / (all.length - 1)) * 100 + "%";
    }
    const toSvg = (e) => { const r = svg.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 320, ((e.clientY - r.top) / r.height) * 230]; };
    svg.addEventListener("pointerdown", (e) => {
      const [x, y] = toSvg(e), cur = all[prog].p;
      if (Math.hypot(x - cur[0], y - cur[1]) < 30) { drag = true; svg.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    svg.addEventListener("pointermove", (e) => {
      if (!drag || done) return;
      const [x, y] = toSvg(e);
      // advance to the nearest point a little way ahead along the path
      let best = prog, bd = Infinity;
      for (let i = prog; i < Math.min(all.length, prog + 14); i++) { const d = Math.hypot(x - all[i].p[0], y - all[i].p[1]); if (d < bd) { bd = d; best = i; } }
      if (bd < 26 && best > prog) {
        const before = all[prog].si; prog = best;
        if (all[prog].si !== before) buzz(6);
        if (prog >= all.length - 1) { done = true; drag = false; record("trace:" + ctx.knot); buzz([10, 60, 10]); }
        draw();
      }
    });
    const up = () => { drag = false; };
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    root.querySelector("[data-again]").addEventListener("click", () => { prog = 0; done = false; draw(); });
    draw();
  }

  const ENGINES = { order, quiz, sort, spot, boil, trace };
  OUT.mountGame = function (root, spec, lang, guideId) {
    const fn = ENGINES[spec.type];
    if (!fn) return;
    root.classList.add("game", "game--" + spec.type);
    fn(root, Object.assign({ lang, guide: guideId }, spec));
  };
  OUT.gameTitle = function (spec, lang, guideId) {
    if (spec.type === "sort") return L(OUT.sortDecks[spec.deck].title, lang);
    if (spec.type === "trace") return w(lang, "trace") + ": " + L(OUT.knotTraces[spec.knot].title, lang);
    if (spec.type === "spot") return L(OUT.spotGame.title, lang);
    if (spec.type === "boil") return w(lang, "boil");
    if (spec.type === "quiz") return w(lang, "quiz");
    return w(lang, "order");
  };
})();
