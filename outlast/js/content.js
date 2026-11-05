/* Outlast — checklists, scenarios, info pages, forum setup (English + Polish). */
(function () {
  const T = (en, pl) => ({ en, pl });
  const I = (en, pl, note) => ({ en, pl, note }); // checklist item
  const OUT = (window.OUT = window.OUT || {});

  /* ------------------------------------------------------------------ CHECKLISTS */
  OUT.checklists = [
    {
      id: "day-hike", icon: "boot",
      title: T("Day hike", "Wycieczka jednodniowa"),
      summary: T("Based on the widely used 'Ten Essentials'. Pack these even for a short walk; most rescues start with a short walk.",
                 "Na podstawie powszechnie stosowanej listy „Dziesięciu niezbędników”. Zabierz je nawet na krótki spacer — większość akcji ratunkowych zaczyna się od krótkiego spaceru."),
      groups: [
        { name: T("Navigation", "Nawigacja"), items: [
          I("Paper map of the area", "Papierowa mapa okolicy"),
          I("Compass", "Kompas"),
          I("Phone with offline map downloaded", "Telefon z pobraną mapą offline"),
          I("Power bank and cable", "Powerbank i kabel") ] },
        { name: T("Light, sun & warmth", "Światło, słońce i ciepło"), items: [
          I("Headlamp with spare batteries", "Czołówka z zapasowymi bateriami"),
          I("Sunglasses, sunscreen, hat", "Okulary przeciwsłoneczne, krem z filtrem, czapka"),
          I("Rain jacket", "Kurtka przeciwdeszczowa"),
          I("Warm layer (fleece or light down)", "Ciepła warstwa (polar lub lekki puch)") ] },
        { name: T("Safety", "Bezpieczeństwo"), items: [
          I("First-aid kit", "Apteczka"),
          I("Whistle", "Gwizdek"),
          I("Emergency foil blanket or bivy bag", "Folia NRC lub worek biwakowy"),
          I("Knife or multitool", "Nóż lub multitool"),
          I("Lighter and waterproof matches", "Zapalniczka i wodoodporne zapałki") ] },
        { name: T("Food & water", "Jedzenie i woda"), items: [
          I("Water: at least 1.5–2 L, more in heat", "Woda: co najmniej 1,5–2 l, więcej w upale"),
          I("Water treatment (filter or tablets)", "Uzdatnianie wody (filtr lub tabletki)"),
          I("Food for the day plus an extra snack", "Jedzenie na cały dzień plus dodatkowa przekąska") ] },
        { name: T("Before you go", "Przed wyjściem"), items: [
          I("Tell someone your route and return time", "Powiedz komuś o trasie i godzinie powrotu"),
          I("Check the weather forecast", "Sprawdź prognozę pogody"),
          I("Set a turnaround time", "Ustal godzinę zawrócenia") ] }
      ]
    },
    {
      id: "camping", icon: "tent",
      title: T("Camping overnight", "Biwak z noclegiem"),
      summary: T("Everything in the day hike list, plus what you need to sleep, cook and stay dry for a night or more.",
                 "Wszystko z listy na wycieczkę jednodniową oraz to, czego potrzebujesz do spania, gotowania i pozostania w suchości przez noc lub dłużej."),
      groups: [
        { name: T("Sleep", "Spanie"), items: [
          I("Tent with pegs and guy lines, or tarp and cord", "Namiot ze śledziami i odciągami albo plandeka i linka"),
          I("Sleeping bag rated for the coldest expected night", "Śpiwór dopasowany do najzimniejszej spodziewanej nocy"),
          I("Sleeping mat (insulation from the ground)", "Karimata (izolacja od ziemi)"),
          I("Dry clothes kept only for sleeping", "Suche ubranie tylko do spania") ] },
        { name: T("Kitchen", "Kuchnia"), items: [
          I("Stove and enough fuel", "Kuchenka i zapas paliwa"),
          I("Pot, spoon, mug", "Garnek, łyżka, kubek"),
          I("Food for every meal plus one extra day", "Jedzenie na każdy posiłek plus jeden dodatkowy dzień"),
          I("Water containers and treatment", "Pojemniki na wodę i uzdatnianie"),
          I("Bag to store food away from animals", "Worek do przechowywania jedzenia z dala od zwierząt") ] },
        { name: T("Camp", "Obozowisko"), items: [
          I("Headlamp and spare batteries", "Czołówka i zapasowe baterie"),
          I("Repair kit: tape, cord, needle and thread", "Zestaw naprawczy: taśma, linka, igła i nić"),
          I("Trowel and toilet paper, or toilet bags", "Saperka i papier toaletowy lub woreczki"),
          I("Rubbish bags; take everything home", "Worki na śmieci — zabierz wszystko ze sobą"),
          I("Hand sanitiser and basic toiletries", "Żel do dezynfekcji rąk i podstawowe kosmetyki") ] }
      ]
    },
    {
      id: "home-kit", icon: "home",
      title: T("Home emergency kit (3 days)", "Domowy zestaw awaryjny (3 dni)"),
      summary: T("For power cuts, floods or storms. Emergency services recommend being able to manage on your own for at least 72 hours.",
                 "Na wypadek przerw w dostawie prądu, powodzi lub burz. Służby ratunkowe zalecają, by móc poradzić sobie samodzielnie przez co najmniej 72 godziny."),
      groups: [
        { name: T("Water & food", "Woda i jedzenie"), items: [
          I("Water: about 4 L per person per day, for 3 days", "Woda: ok. 4 l na osobę dziennie, na 3 dni"),
          I("Food that needs no cooking or fridge, for 3 days", "Jedzenie niewymagające gotowania ani lodówki, na 3 dni"),
          I("Manual can opener", "Ręczny otwieracz do puszek"),
          I("Food and water for pets", "Jedzenie i woda dla zwierząt") ] },
        { name: T("Power & light", "Prąd i światło"), items: [
          I("Torch or headlamp for each person, spare batteries", "Latarka lub czołówka dla każdej osoby, zapasowe baterie"),
          I("Battery or wind-up radio", "Radio na baterie lub na korbkę"),
          I("Charged power bank", "Naładowany powerbank") ] },
        { name: T("Health", "Zdrowie"), items: [
          I("First-aid kit", "Apteczka"),
          I("At least 7 days of prescription medicines", "Leki na receptę na co najmniej 7 dni"),
          I("Hygiene items, wet wipes, rubbish bags", "Środki higieny, chusteczki nawilżane, worki na śmieci"),
          I("Dust masks", "Maseczki przeciwpyłowe") ] },
        { name: T("Documents & other", "Dokumenty i inne"), items: [
          I("Copies of ID and important documents in a waterproof bag", "Kopie dokumentów tożsamości i ważnych papierów w wodoszczelnej torbie"),
          I("Some cash in small notes", "Trochę gotówki w małych nominałach"),
          I("Written list of emergency and family phone numbers", "Spisana lista numerów alarmowych i rodzinnych"),
          I("Warm blankets", "Ciepłe koce"),
          I("Whistle", "Gwizdek") ] }
      ]
    }
  ];

  /* ------------------------------------------------------------------ SCENARIOS
     priority: the order to act in. Each step has a why and optional guide links.
     avoid: what prevents the situation. pack: checklist link. */
  OUT.scenarios = [
    {
      id: "lost-forest", icon: "tree", common: 1,
      title: T("Lost in a forest with no phone signal", "Zgubiony w lesie bez zasięgu"),
      situation: T("You left the trail to find a viewpoint and can't find it again. It's afternoon, about 4 hours of daylight left, and your phone shows no signal.",
                   "Zszedłeś ze szlaku, by znaleźć punkt widokowy, i nie możesz na niego wrócić. Jest popołudnie, zostały ok. 4 godziny światła, telefon nie ma zasięgu."),
      fact: T("Getting lost is one of the most common reasons for search and rescue callouts. Most lost people are found within 24 hours, faster if they stay put.",
              "Zgubienie się to jeden z najczęstszych powodów akcji poszukiwawczych. Większość zaginionych odnajduje się w ciągu 24 godzin — szybciej, jeśli zostają na miejscu."),
      priority: [
        { t: T("Stop and calm down", "Zatrzymaj się i uspokój"), b: T("Panic makes you walk fast in the wrong direction. Sit, drink, eat, breathe. Use S.T.O.P.", "Panika sprawia, że idziesz szybko w złą stronę. Usiądź, napij się, zjedz, oddychaj. Zastosuj S.T.O.P."), g: ["lost-stop"] },
        { t: T("Try to call 112", "Spróbuj zadzwonić pod 112"), b: T("112 can connect through another operator's network even when yours shows nothing. Try from higher, open ground nearby, but don't wander far.", "112 może połączyć się przez sieć innego operatora, nawet gdy twoja nic nie pokazuje. Spróbuj z wyższego, otwartego miejsca w pobliżu, ale nie oddalaj się."), g: ["signal-help"] },
        { t: T("Shelter before dark", "Schronienie przed zmrokiem"), b: T("If you're not sure of the way out, use the daylight to get out of wind and off cold ground. Being cold and wet is the main danger overnight, not hunger.", "Jeśli nie znasz drogi, wykorzystaj światło dzienne, by schronić się przed wiatrem i zimną ziemią. Największym zagrożeniem w nocy jest zimno i wilgoć, nie głód."), g: ["tarp-shelter", "debris-hut"] },
        { t: T("Be easy to find", "Bądź łatwy do znalezienia"), b: T("Stay in one place near an open area. Whistle three times every few minutes, put bright clothing where it can be seen.", "Zostań w jednym miejscu blisko otwartej przestrzeni. Co kilka minut gwizdnij trzy razy, rozłóż jaskrawe ubranie w widocznym miejscu."), g: ["signal-help"] },
        { t: T("Water, then food", "Woda, potem jedzenie"), b: T("Ration nothing for the first day; drink when thirsty. Treat any natural water. Food matters least; people manage weeks without it.", "Pierwszego dnia niczego nie racjonuj — pij, gdy chce ci się pić. Uzdatniaj każdą naturalną wodę. Jedzenie ma najmniejsze znaczenie — człowiek wytrzymuje bez niego tygodnie."), g: ["treat-water"] }
      ],
      avoid: T(["Leave your route and expected return time with someone", "Download an offline map before you go and carry a paper map", "Note junctions and landmarks as you walk; look back at the trail sometimes", "Turn back at your set turnaround time"],
               ["Zostaw komuś swoją trasę i przewidywaną godzinę powrotu", "Przed wyjściem pobierz mapę offline i weź mapę papierową", "Zapamiętuj rozwidlenia i punkty orientacyjne; co jakiś czas oglądaj się za siebie", "Zawracaj o ustalonej godzinie"]),
      pack: "day-hike"
    },
    {
      id: "injured", icon: "cross", common: 1,
      title: T("Someone in your group gets injured", "Ktoś z grupy odnosi obrażenia"),
      situation: T("On a rocky descent, a friend slips. Their ankle is badly twisted and there's a cut on their arm that is bleeding. You're 2 hours from the car.",
                   "Na kamienistym zejściu kolega się poślizgnął. Ma mocno skręconą kostkę i krwawiącą ranę na ręce. Do samochodu są 2 godziny."),
      fact: T("Slips and falls, mostly leading to leg and ankle injuries, are the most common cause of hiking rescues.",
              "Poślizgnięcia i upadki, najczęściej kończące się urazami nóg i kostek, to najczęstsza przyczyna akcji ratunkowych na szlakach."),
      priority: [
        { t: T("Make the scene safe", "Zadbaj o bezpieczeństwo miejsca"), b: T("Check for falling rocks, traffic or water before you step in. A second casualty makes everything worse.", "Zanim podejdziesz, sprawdź, czy nie grożą spadające kamienie, ruch drogowy lub woda. Drugi poszkodowany pogarsza wszystko."), g: [] },
        { t: T("Stop serious bleeding first", "Najpierw zatrzymaj silne krwawienie"), b: T("Heavy bleeding is the most urgent problem. Firm, direct pressure.", "Silne krwawienie jest najpilniejsze. Mocny, bezpośredni ucisk."), g: ["bleeding"] },
        { t: T("Call for help with exact location", "Wezwij pomoc z dokładnym położeniem"), b: T("Call 112 (or mountain rescue). Read your coordinates from the phone map. If there's no signal and you are three or more, two go for help together while one stays.", "Zadzwoń pod 112 (lub do ratownictwa górskiego). Odczytaj współrzędne z mapy w telefonie. Bez zasięgu, jeśli jest was trzech lub więcej — dwie osoby idą razem po pomoc, jedna zostaje."), g: ["signal-help"] },
        { t: T("Keep them warm and still", "Utrzymaj ciepło i spokój"), b: T("Insulate from the ground and cover them. An injured person who isn't moving gets cold fast, even in summer. Don't move them if you suspect a neck or back injury.", "Odizoluj od ziemi i przykryj. Ranny, który się nie rusza, szybko się wychładza, nawet latem. Nie przenoś go, jeśli podejrzewasz uraz szyi lub kręgosłupa."), g: ["hypothermia"] },
        { t: T("Treat the ankle", "Zajmij się kostką"), b: T("Cool, wrap and raise it. Decide with rescuers whether they can walk out supported.", "Schłódź, owiń i unieś. Ustal z ratownikami, czy poszkodowany może zejść z podparciem."), g: ["sprain"] }
      ],
      avoid: T(["Wear boots with good grip and ankle support on rough ground", "Use trekking poles on steep descents", "Slow down when tired; most falls happen late in the day, on the way down", "Carry a first-aid kit and know what's in it"],
               ["Na trudnym terenie noś buty z dobrą przyczepnością i usztywnieniem kostki", "Na stromych zejściach używaj kijków", "Zwolnij, gdy jesteś zmęczony — większość upadków zdarza się pod koniec dnia, na zejściu", "Noś apteczkę i wiedz, co w niej jest"]),
      pack: "day-hike"
    },
    {
      id: "cold-wet", icon: "rain", common: 1,
      title: T("Caught cold and wet", "Przemoczony i zmarznięty"),
      situation: T("It's 8°C on a ridge. Rain started an hour ago, the wind is strong, your jacket is soaked through and a friend is shivering hard and has gone quiet.",
                   "Na grani jest 8°C. Godzinę temu zaczął padać deszcz, mocno wieje, kurtka przemokła, a kolega mocno drży i ucichł."),
      fact: T("Hypothermia doesn't need freezing temperatures. Wind and wet clothing at 5–10°C are a classic combination.",
              "Hipotermia nie wymaga mrozu. Wiatr i mokre ubranie przy 5–10°C to klasyczne połączenie."),
      priority: [
        { t: T("Get out of the wind", "Uciekaj przed wiatrem"), b: T("Drop off the ridge, get behind rocks or into trees. Wind on wet clothing removes heat very fast.", "Zejdź z grani, schowaj się za skałami lub między drzewami. Wiatr na mokrym ubraniu bardzo szybko odbiera ciepło."), g: ["hypothermia"] },
        { t: T("Dry layers and a barrier", "Suche warstwy i osłona"), b: T("Put dry layers on under a windproof shell. Hat and gloves on. Use a foil blanket or put up a tarp if you have one.", "Załóż suche warstwy pod wiatroszczelną kurtkę. Czapka i rękawiczki. Użyj folii NRC lub rozstaw plandekę, jeśli masz."), g: ["tarp-shelter"] },
        { t: T("Eat and drink", "Jedz i pij"), b: T("Food is fuel for heat. Sweet snacks and a warm drink help someone who is alert.", "Jedzenie to paliwo do wytwarzania ciepła. Słodkie przekąski i ciepły napój pomagają osobie przytomnej."), g: [] },
        { t: T("Watch the quiet one", "Obserwuj tego, kto ucichł"), b: T("Going quiet, clumsiness and confusion are warning signs. If they get worse, call 112.", "Ucichnięcie, niezgrabność i dezorientacja to sygnały ostrzegawcze. Jeśli się pogarsza, dzwoń 112."), g: ["hypothermia", "signal-help"] }
      ],
      avoid: T(["Check the mountain forecast, especially wind and rain", "Carry a real waterproof jacket and a spare warm layer in a dry bag", "Avoid cotton; it stays wet and cold", "Turn back early when the weather changes"],
               ["Sprawdzaj prognozę górską, zwłaszcza wiatr i opady", "Noś prawdziwą kurtkę przeciwdeszczową i zapasową ciepłą warstwę w wodoszczelnym worku", "Unikaj bawełny — długo pozostaje mokra i zimna", "Zawracaj wcześnie, gdy pogoda się zmienia"]),
      pack: "day-hike"
    },
    {
      id: "heat", icon: "sun", common: 1,
      title: T("Heat exhaustion on a hot hike", "Wyczerpanie cieplne na upalnym szlaku"),
      situation: T("It's 32°C in the afternoon on an exposed trail. You've run out of water and you feel dizzy, sick and have a headache.",
                   "Po południu, na odsłoniętym szlaku jest 32°C. Skończyła ci się woda, kręci ci się w głowie, jest ci niedobrze i boli cię głowa."),
      fact: T("Heat exhaustion can turn into heatstroke, which is life-threatening. Confusion or hot, dry skin are the signs it has become an emergency.",
              "Wyczerpanie cieplne może przejść w udar cieplny, który zagraża życiu. Dezorientacja lub gorąca, sucha skóra oznaczają, że to już stan nagły."),
      priority: [
        { t: T("Stop in the shade", "Zatrzymaj się w cieniu"), b: T("Stop walking. Find shade or make some with a tarp or jacket. Lie down and raise your legs slightly.", "Przestań iść. Znajdź cień lub zrób go z plandeki albo kurtki. Połóż się i lekko unieś nogi."), g: [] },
        { t: T("Cool the body", "Schładzaj ciało"), b: T("Loosen clothing, wet skin and clothing and fan it. Cool water on the neck, armpits and groin helps most.", "Poluzuj ubranie, zwilż skórę i odzież i wachluj. Najbardziej pomaga zimna woda na szyi, pod pachami i w pachwinach."), g: [] },
        { t: T("Drink in small sips", "Pij małymi łykami"), b: T("Sip water, ideally with electrolytes or a pinch of salt and sugar. Treat stream water before drinking.", "Pij małymi łykami, najlepiej z elektrolitami lub szczyptą soli i cukru. Uzdatnij wodę ze strumienia przed piciem."), g: ["treat-water"] },
        { t: T("Know when it's an emergency", "Rozpoznaj stan nagły"), b: T("If they become confused, stop making sense, collapse, or don't improve within 30 minutes, call 112 and keep cooling them.", "Jeśli osoba staje się zdezorientowana, mówi bez sensu, traci przytomność lub nie poprawia się w ciągu 30 minut — dzwoń 112 i nadal ją schładzaj."), g: ["signal-help"] }
      ],
      avoid: T(["Start early and rest in the shade during the hottest hours", "Carry more water than you think; plan refill points", "Wear a hat and light, loose clothing", "Drink regularly before you feel thirsty"],
               ["Wychodź wcześnie i odpoczywaj w cieniu w najgorętszych godzinach", "Noś więcej wody, niż ci się wydaje; zaplanuj miejsca uzupełnienia", "Noś czapkę i lekkie, luźne ubranie", "Pij regularnie, zanim poczujesz pragnienie"]),
      pack: "day-hike"
    },
    {
      id: "storm", icon: "bolt", common: 1,
      title: T("Thunderstorm on open or high ground", "Burza na otwartym lub wysokim terenie"),
      situation: T("You're on an open ridge above the trees. The sky to the west turns dark and you hear thunder a few seconds after a flash.",
                   "Jesteś na otwartej grani powyżej granicy lasu. Niebo na zachodzie ciemnieje, a grzmot słychać kilka sekund po błysku."),
      fact: T("If you can hear thunder, you are close enough to be struck. There is no safe place outside in a thunderstorm, only less dangerous ones.",
              "Jeśli słyszysz grzmot, jesteś na tyle blisko, że piorun może cię trafić. Na zewnątrz nie ma bezpiecznego miejsca w czasie burzy — są tylko mniej niebezpieczne."),
      priority: [
        { t: T("Move down, now", "Schodź, natychmiast"), b: T("Get off peaks, ridges and open slopes. A building or a car with a metal roof is safe; tents and shelters are not.", "Zejdź ze szczytów, grani i otwartych zboczy. Budynek lub samochód z metalowym dachem są bezpieczne; namioty i wiaty — nie."), g: [] },
        { t: T("Avoid what lightning hits", "Unikaj tego, w co uderza piorun"), b: T("Stay away from lone tall trees, metal fences and cables, and water. In a forest, stay among lower trees.", "Trzymaj się z dala od samotnych wysokich drzew, metalowych ogrodzeń i lin oraz wody. W lesie trzymaj się niższych drzew."), g: [] },
        { t: T("Spread the group out", "Rozproś grupę"), b: T("Keep at least 15 m between people so one strike can't injure everyone, and others can help.", "Zachowajcie co najmniej 15 m odstępu, żeby jedno uderzenie nie zraniło wszystkich, a inni mogli pomóc."), g: [] },
        { t: T("Wait 30 minutes", "Odczekaj 30 minut"), b: T("Stay sheltered until 30 minutes after the last thunder. Storms often come back.", "Pozostań w schronieniu do 30 minut po ostatnim grzmocie. Burze często wracają."), g: [] }
      ],
      avoid: T(["Check the forecast for afternoon thunderstorms; in summer they often build after midday", "Plan to be off high ground by early afternoon", "Turn back as soon as you hear thunder or see clouds building fast"],
               ["Sprawdź prognozę popołudniowych burz — latem często tworzą się po południu", "Zaplanuj zejście z wysokiego terenu wczesnym popołudniem", "Zawróć, gdy tylko usłyszysz grzmot lub zobaczysz szybko rosnące chmury"]),
      pack: "day-hike"
    },
    {
      id: "dark", icon: "moon", common: 1,
      title: T("Darkness falls before you're back", "Zapada zmrok, a ty jeszcze nie wróciłeś"),
      situation: T("The hike took longer than planned. The sun has set, you're still an hour from the car, and the trail goes through forest.",
                   "Wycieczka trwała dłużej niż planowano. Słońce zaszło, do samochodu jeszcze godzina, a szlak prowadzi przez las."),
      fact: T("Running out of daylight is one of the most common reasons people need help, and a headlamp solves most of it.",
              "Brak światła dziennego to jeden z najczęstszych powodów wzywania pomocy, a czołówka rozwiązuje większość problemu."),
      priority: [
        { t: T("Stop and put on a layer", "Zatrzymaj się i ubierz cieplej"), b: T("It gets cold quickly after sunset. Put a warm layer on before you get cold.", "Po zachodzie słońca szybko robi się zimno. Załóż ciepłą warstwę, zanim zmarzniesz."), g: [] },
        { t: T("Light and decide", "Światło i decyzja"), b: T("With a headlamp on a clear, marked trail, carry on slowly. Without light, or on steep or unclear ground, stay where you are; falls in the dark cause serious injuries.", "Z czołówką na wyraźnym, oznaczonym szlaku idź dalej powoli. Bez światła lub w stromym, niejasnym terenie zostań na miejscu — upadki po ciemku powodują poważne urazy."), g: [] },
        { t: T("Let someone know", "Daj komuś znać"), b: T("Message the person who knows your plan so they don't raise an alarm too early, or too late.", "Napisz do osoby, która zna twój plan, żeby nie zaalarmowała za wcześnie ani za późno."), g: [] },
        { t: T("If you stay: shelter and signal", "Jeśli zostajesz: schronienie i sygnał"), b: T("Get off the cold ground, sit on your pack, use a foil blanket. Use the torch to signal in threes if you hear searchers.", "Odizoluj się od zimnej ziemi, usiądź na plecaku, użyj folii NRC. Gdy usłyszysz ratowników, sygnalizuj latarką po trzy błyski."), g: ["tarp-shelter", "signal-help"] }
      ],
      avoid: T(["Check sunset time and plan to finish an hour before it", "Always carry a headlamp, even on short walks", "Set a turnaround time and keep to it"],
               ["Sprawdź godzinę zachodu słońca i planuj zakończenie godzinę wcześniej", "Zawsze noś czołówkę, nawet na krótkie spacery", "Ustal godzinę zawrócenia i trzymaj się jej"]),
      pack: "day-hike"
    },
    {
      id: "power-outage", icon: "plug", common: 1,
      title: T("Power cut at home for several days", "Brak prądu w domu przez kilka dni"),
      situation: T("A winter storm has cut the power in your area. Repairs could take three days. Heating, the fridge and phone charging are all off.",
                   "Zimowa burza odcięła prąd w okolicy. Naprawa może potrwać trzy dni. Nie działa ogrzewanie, lodówka ani ładowanie telefonów."),
      fact: T("Carbon monoxide poisoning from generators, barbecues or gas heaters used indoors is a leading cause of death during power cuts.",
              "Zatrucie tlenkiem węgla z agregatów, grilli lub piecyków gazowych używanych w pomieszczeniach to jedna z głównych przyczyn zgonów podczas przerw w dostawie prądu."),
      priority: [
        { t: T("Prevent carbon monoxide", "Zapobiegaj zatruciu tlenkiem węgla"), b: T("Never use a generator, grill, camping stove or gas heater indoors or in a garage. Headache, dizziness and sickness in several people at once: get fresh air and call 112.", "Nigdy nie używaj agregatu, grilla, kuchenki turystycznej ani piecyka gazowego w domu lub garażu. Ból głowy, zawroty i mdłości u kilku osób naraz: wyjdź na świeże powietrze i dzwoń 112."), g: [] },
        { t: T("Stay warm in one room", "Ogrzewaj jedno pomieszczenie"), b: T("Gather in one small room, close the doors, cover windows. Wear layers and hats indoors, and share sleeping bags.", "Zbierzcie się w jednym małym pokoju, zamknijcie drzwi, zasłońcie okna. Noście warstwy i czapki w domu, dzielcie się śpiworami."), g: ["hypothermia"] },
        { t: T("Water and food safety", "Bezpieczeństwo wody i jedzenia"), b: T("Keep the fridge and freezer closed: a closed fridge stays cold about 4 hours, a full freezer about 48. If tap water is declared unsafe, boil it.", "Nie otwieraj lodówki i zamrażarki: zamknięta lodówka utrzymuje chłód ok. 4 godzin, pełna zamrażarka ok. 48. Jeśli woda z kranu zostanie uznana za niebezpieczną, gotuj ją."), g: ["boil-water"] },
        { t: T("Light and information", "Światło i informacje"), b: T("Use torches instead of candles. Save phone battery for calls; follow updates on a battery radio.", "Używaj latarek zamiast świec. Oszczędzaj baterię telefonu na rozmowy; śledź komunikaty w radiu na baterie."), g: [] },
        { t: T("Check on neighbours", "Sprawdź, co u sąsiadów"), b: T("Older people, babies and people with medical equipment are most at risk.", "Najbardziej zagrożone są osoby starsze, niemowlęta i osoby korzystające ze sprzętu medycznego."), g: [] }
      ],
      avoid: T(["Keep a 3-day home kit ready", "Have a carbon monoxide alarm with batteries", "Keep phones and power banks charged when storms are forecast"],
               ["Miej przygotowany domowy zestaw na 3 dni", "Miej czujnik tlenku węgla na baterie", "Ładuj telefony i powerbanki, gdy zapowiadane są burze"]),
      pack: "home-kit"
    },
    {
      id: "car-winter", icon: "car", common: 0,
      title: T("Stranded in a car in winter", "Utknięcie w samochodzie zimą"),
      situation: T("Heavy snow has blocked the road at night. Your car is stuck, it's −8°C outside and help may take hours.",
                   "W nocy intensywne opady śniegu zablokowały drogę. Samochód utknął, na zewnątrz jest −8°C, a pomoc może dotrzeć za kilka godzin."),
      fact: T("Staying with the car is almost always safer than walking. A car is easier to find and protects you from wind.",
              "Pozostanie w samochodzie jest prawie zawsze bezpieczniejsze niż pieszy marsz. Samochód łatwiej znaleźć i chroni przed wiatrem."),
      priority: [
        { t: T("Stay in the car and call", "Zostań w samochodzie i dzwoń"), b: T("Call 112 with your location. Don't walk away in a snowstorm; people get lost within metres.", "Zadzwoń pod 112 i podaj położenie. Nie odchodź w zamieci — ludzie gubią się w odległości kilku metrów."), g: ["signal-help"] },
        { t: T("Keep the exhaust clear", "Odśnieżaj rurę wydechową"), b: T("Run the engine about 10 minutes each hour for heat. Before each time, clear snow from the exhaust pipe and open a window slightly to avoid carbon monoxide.", "Włączaj silnik na ok. 10 minut co godzinę, by się ogrzać. Przed każdym razem odśnież rurę wydechową i lekko uchyl okno, by uniknąć tlenku węgla."), g: [] },
        { t: T("Hold on to heat", "Zatrzymaj ciepło"), b: T("Put on every layer, share blankets, huddle together. Move arms and legs regularly to keep blood flowing.", "Załóż wszystkie warstwy, dzielcie się kocami, przytulcie się. Regularnie ruszaj rękami i nogami, by krew krążyła."), g: ["hypothermia"] },
        { t: T("Be visible", "Bądź widoczny"), b: T("Tie something bright to the aerial or door. At night, switch the interior light on briefly when the engine runs.", "Przywiąż coś jaskrawego do anteny lub drzwi. W nocy, gdy pracuje silnik, na chwilę włącz światło wewnętrzne."), g: [] }
      ],
      avoid: T(["Check road and weather warnings before driving in winter", "Keep at least half a tank of fuel", "Carry blankets, a shovel, a torch, water and snacks in the car"],
               ["Przed jazdą zimą sprawdzaj ostrzeżenia drogowe i pogodowe", "Miej co najmniej pół baku paliwa", "Woź w aucie koce, łopatę, latarkę, wodę i przekąski"]),
      pack: "home-kit"
    }
  ];

  /* ------------------------------------------------------------------ FORUM */
  OUT.forumCats = [
    { id: "water-food", icon: "drop", name: T("Water & food", "Woda i jedzenie") },
    { id: "fire-shelter", icon: "flame", name: T("Fire & shelter", "Ogień i schronienie") },
    { id: "first-aid", icon: "cross", name: T("First aid", "Pierwsza pomoc") },
    { id: "gear", icon: "boot", name: T("Gear & checklists", "Sprzęt i listy") },
    { id: "trips", icon: "compass", name: T("Trips & scenarios", "Wyprawy i scenariusze") }
  ];

  OUT.forumRules = T([
    "Be kind. Everyone starts as a beginner.",
    "Safety first: don't post advice you aren't sure about. Say how you know something.",
    "New advice is marked 'unverified' until a moderator has checked it.",
    "Report posts that could get someone hurt, using the Report button.",
    "No selling, no spam, no personal data: don't post phone numbers, addresses or exact locations of people.",
    "In an emergency, call 112. The forum is not a rescue service."
  ], [
    "Bądź życzliwy. Każdy kiedyś zaczynał.",
    "Bezpieczeństwo przede wszystkim: nie publikuj porad, których nie jesteś pewny. Napisz, skąd to wiesz.",
    "Nowe porady są oznaczone jako „niezweryfikowane”, dopóki nie sprawdzi ich moderator.",
    "Zgłaszaj posty, które mogłyby komuś zaszkodzić, przyciskiem Zgłoś.",
    "Bez sprzedaży, spamu i danych osobowych: nie publikuj numerów telefonów, adresów ani dokładnych lokalizacji ludzi.",
    "W nagłym wypadku dzwoń pod 112. Forum nie jest służbą ratunkową."
  ]);

  /* ------------------------------------------------------------------ START PATHS */
  OUT.startPaths = [
    { id: "new", icon: "boot", t: T("New to the outdoors", "Dopiero zaczynasz"), b: T("The basics for a safe first hike.", "Podstawy bezpiecznej pierwszej wycieczki."), links: ["checklist:day-hike", "guide:lost-stop", "guide:boil-water"] },
    { id: "trip", icon: "tent", t: T("Planning a trip", "Planujesz wyprawę"), b: T("Think through what could go wrong.", "Przemyśl, co może pójść nie tak."), links: ["scenarios", "checklist:camping", "guide:tarp-shelter"] },
    { id: "home", icon: "home", t: T("Ready at home", "Gotowość w domu"), b: T("Power cuts, storms, floods.", "Przerwy w dostawie prądu, burze, powodzie."), links: ["checklist:home-kit", "scenario:power-outage", "guide:boil-water"] }
  ];
})();
