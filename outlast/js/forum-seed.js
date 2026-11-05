/* Outlast — example forum posts. They show how the forum works and are labelled "Example" in the UI.
   Times are hours before now, so the feed always looks lived-in. */
(function () {
  const OUT = (window.OUT = window.OUT || {});
  const P = (id, cat, hrs, user, score, title, body, comments) => ({ id, cat, hrs, user, score, title, body, comments: comments || [], example: true });
  const R = (id, hrs, user, score, body) => ({ id, hrs, user, score, body, example: true });
  OUT.forumSeed = [
    P("ex1", "water-food", 3, "trail_mia", 42, "Is a clear mountain stream safe to drink straight?",
      "Going on a 2-day hike in the Rila mountains. The streams look super clean. Do I really need a filter?",
      [R("ex1a", 2, "scout_leader_tom", 31, "Clear isn't the same as clean. Animals upstream are enough to make you ill. Filter or boil, every time."),
       R("ex1b", 1, "mia_hikes", 8, "If you only bring one thing, bring tablets as backup. They weigh nothing.")]),
    P("ex2", "gear", 7, "jan_k", 27, "Day hike checklist: what did you forget once and regret?",
      "Mine was a headlamp. The walk back in the dark took twice as long.",
      [R("ex2a", 6, "ola_w", 19, "Rain jacket. Sunny forecast, soaked by 3 pm."), R("ex2b", 5, "nedko_b", 12, "A spare warm layer. You cool down fast when you stop.")]),
    P("ex3", "fire-shelter", 11, "ania_outdoors", 35, "Pierwszy raz rozbiłam plandekę na dwóch drzewach — działa!",
      "Węzeł ratowniczy na jednym drzewie, namiotowy na drugim. Najtrudniejsze było napięcie linki. Jakieś rady?",
      [R("ex3a", 10, "piotr_gopr_fan", 14, "Dociągaj węzeł namiotowy po rozpięciu narożników, nie przed. I sprawdź gałęzie nad głową.")]),
    P("ex4", "first-aid", 20, "leo_scouts", 51, "What goes in a small first-aid kit for day hikes?",
      "Our scout group is making kits. What would you put in a pocket-sized one?",
      [R("ex4a", 18, "nurse_kasia", 40, "Plasters, gauze, an elastic bandage, tape, gloves, foil blanket, tweezers, and your own medicines. Then do a first-aid course: the kit only helps if you know how to use it."),
       R("ex4b", 16, "leo_scouts", 6, "Thanks, adding a foil blanket to every kit.")]),
    P("ex5", "trips", 28, "maja_m", 23, "Thunder while we were on the ridge. Did we do the right thing?",
      "We heard thunder and went down into the trees straight away, spaced out. Took an hour longer but felt right.",
      [R("ex5a", 26, "storm_chaser_no", 17, "Yes. If you can hear thunder you're close enough to be hit. Getting off the ridge fast was the right call.")]),
    P("ex6", "water-food", 34, "kuba_trek", 15, "Czy tabletki do wody naprawdę wystarczą?",
      "Mam filtr i tabletki. Kiedy używać czego?",
      [R("ex6a", 33, "ola_w", 9, "Filtr na pasożyty i bakterie, tabletki na wirusy. Blisko wsi i pastwisk — jedno i drugie. I czekaj pełny czas z opakowania.")]),
    P("ex7", "fire-shelter", 46, "first_timer_sam", 12, "My fire keeps going out after the tinder burns",
      "The tinder flares up but the sticks never catch. What am I doing wrong?",
      [R("ex7a", 44, "scout_leader_tom", 21, "Your kindling is probably too thick or damp. Start with sticks as thin as a pencil lead and add thicker ones only when those are burning well.")]),
    P("ex8", "trips", 60, "eli_runs", 30, "Tip: set a turnaround time before you start",
      "Decide at home: 'if we're not at the top by 13:00, we turn back'. It removes the argument when everyone is tired.")
  ];
})();
