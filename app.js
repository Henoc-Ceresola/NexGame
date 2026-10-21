// NexMine.Core: misiones sacadas de los Issues con la etiqueta "mision".
(function () {
  "use strict";

  var REPO = "Henoc-Ceresola/NexMine";
  var API = "https://api.github.com/repos/" + REPO + "/issues?labels=mision&state=all&per_page=100";

  // Textos en inglés. El español está escrito en index.html.
  var EN = {
    "nav.red": "Network", "nav.ruta": "Route", "nav.lab": "Lab", "nav.eco": "Ecosystem", "nav.buzon": "Mailbox",
    "hero.tag": "Intelligence mining lab",
    "hero.lead": "We are building an \"Interlocutor\": an AI that understands exactly what you want, no more, no less. We build it like Lego pieces, and you can help.",
    "hero.cta": "[ See missions ]",
    "red.h": "Network",
    "red.p1": "NexMine is an AI assistant. Its job is to understand what you ask and turn it into a clear, well-organized text. Then you take that text to whatever tool you choose.",
    "red.quote": "\"The Interlocutor doesn't learn projects. It learns intention.\"",
    "red.p2": "The network is the people who build it: ideas, debates, tests and design. You don't need to know how to code.",
    "ruta.h": "Route",
    "ruta.1h": "Open the project", "ruta.1p": "Presentation, ideas and issues on GitHub.",
    "ruta.2h": "First missions", "ruta.2p": "Ideas, debates, design and translations. No code.",
    "ruta.3h": "Public Interlocutor", "ruta.3p": "A first version of the code, open to everyone.",
    "ruta.4h": "Code missions", "ruta.4p": "Build and test new pieces.",
    "lab.h": "Active mining contracts",
    "lab.hint": "Each mission is an Issue on GitHub. Open it, leave a comment and get started.",
    "f.all": "All", "f.open": "Open", "f.progress": "In progress", "f.done": "Completed",
    "t.mision": "Mission", "t.estado": "Status", "t.puntos": "Points", "t.rango": "Rank",
    "board.h": "Scoreboard",
    "board.hint": "When a mission is completed, its points go to whoever did it. Level 1 = 10 points · Level 2 = 30 · Level 3 = 100.",
    "board.note": "Points are a record of your participation. They are not money or shares.",
    "rangos.h": "Ranks",
    "r.minero": "Miner", "r.minero.p": "Complete your first mission.",
    "r.ing": "Engineer", "r.ing.p": "Complete 3 missions, or 1 level-2 mission.",
    "r.fund": "Founder", "r.fund.p": "Among the first to complete a level-3 mission.",
    "eco.h": "Ecosystem",
    "eco.1h": "Pieces", "eco.1p": "Each piece does one single thing and can be plugged in, like a Lego brick.",
    "eco.2h": "Orchestrator", "eco.2p": "Connects the pieces and coordinates them, like a machine's control unit.",
    "eco.3h": "Community", "eco.3p": "Proposes pieces, debates ideas and completes missions.",
    "buzon.h": "Mailbox",
    "foro.hint": "The game forum: talk with other miners, ask for help and share your missions.",
    "foro.h": "Lab channel",
    "buzon.1h": "💡 Ideas and questions", "buzon.1p": "Discussions",
    "buzon.2h": "🐞 Bugs", "buzon.2p": "Issues",
    "buzon.warn": "⚠️ Never post passwords, keys or personal data.",
    "buzon.lang": "English and Spanish are both welcome."
  };

  var WORDS = {
    es: {
      open: "[ ABIERTA ]", progress: "[ EN CURSO ]", done: "[ COMPLETADA ]",
      level: "nivel", loading: "Cargando misiones…",
      empty: "Todavía no hay misiones. ¡Muy pronto!",
      error: "No se han podido cargar las misiones. Míralas en GitHub: ",
      demo: "Vista de ejemplo: estas misiones no son reales todavía.",
      boardEmpty: "Nadie ha completado una misión todavía. ¡Sé la primera persona!",
      pts: "pts", missionsDone: "misiones", missionDone: "misión",
      foroInput: "Entra con tu cuenta de GitHub para escribir…",
      ranks: { 0: "Aspirante", 1: "⛏️ Minero", 2: "🔧 Ingeniero", 3: "🏛️ Fundador" }
    },
    en: {
      open: "[ OPEN ]", progress: "[ IN PROGRESS ]", done: "[ COMPLETED ]",
      level: "level", loading: "Loading missions…",
      empty: "No missions yet. Coming soon!",
      error: "Missions could not be loaded. See them on GitHub: ",
      demo: "Example view: these missions are not real yet.",
      boardEmpty: "Nobody has completed a mission yet. Be the first!",
      pts: "pts", missionsDone: "missions", missionDone: "mission",
      foroInput: "Sign in with your GitHub account to write…",
      ranks: { 0: "Aspirant", 1: "⛏️ Miner", 2: "🔧 Engineer", 3: "🏛️ Founder" }
    }
  };

  // Misiones de ejemplo, solo con ?demo en la dirección.
  var DEMO = [
    { title: "Preséntate: qué te gustaría que hiciera una IA por ti", type: "IDEA", level: 1, state: "done", url: "#", people: [{ login: "ejemplo_ana" }, { login: "ejemplo_leo" }] },
    { title: "Propón una pieza de Lego para NexMine", type: "IDEA", level: 1, state: "progress", url: "#", people: [{ login: "ejemplo_leo" }] },
    { title: "Debate: ¿qué hace el orquestador si dos piezas no se entienden?", type: "IDEA", level: 2, state: "done", url: "#", people: [{ login: "ejemplo_ana" }] },
    { title: "Diseña un icono para un rango", type: "DISEÑO", level: 1, state: "done", url: "#", people: [{ login: "ejemplo_kai" }] },
    { title: "Traduce la presentación a otro idioma", type: "DEV", level: 1, state: "open", url: "#", people: [] }
  ];

  // Mensajes de ejemplo del foro, solo con ?demo.
  var DEMO_FORO = [
    { who: "ejemplo_ana", rank: 2, text: "¡Misión del debate completada! ¿Alguien se apunta a la de traducir?" },
    { who: "ejemplo_leo", rank: 1, text: "Yo me apunto. ¿La hacemos al inglés y al portugués?" },
    { who: "ejemplo_kai", rank: 1, text: "Subo mi icono de Minero en un rato." }
  ];

  // Puntos por nivel de misión.
  var POINTS = { 1: 10, 2: 30, 3: 100 };

  var TYPES = ["HACK", "BUG", "DEV", "IDEA", "DISEÑO"];
  var lang = "es";
  var missions = null;
  var failed = false;
  var filter = "all";
  var spanish = {};

  function labelNames(issue) {
    return (issue.labels || []).map(function (l) { return typeof l === "string" ? l : l.name; });
  }

  function toMission(issue) {
    var names = labelNames(issue);
    var lower = names.map(function (n) { return n.toLowerCase(); });
    var state = "open";
    if (issue.state === "closed") state = "done";
    else if (lower.indexOf("en-curso") !== -1) state = "progress";
    var level = 1;
    lower.forEach(function (n) {
      var m = /^nivel-(\d)$/.exec(n);
      if (m) level = Number(m[1]);
    });
    var type = "";
    names.forEach(function (n) { if (TYPES.indexOf(n.toUpperCase()) !== -1) type = n.toUpperCase(); });
    var people = (issue.assignees || []).map(function (a) {
      return { login: a.login, avatar: a.avatar_url, url: a.html_url };
    });
    return { title: issue.title, type: type, level: level, state: state, url: issue.html_url, people: people };
  }

  function levelOf(m) { return Math.min(Math.max(m.level, 1), 3); }

  // Suma los puntos de las misiones completadas de cada persona (quien tiene asignado el Issue).
  // Rango: Minero = 1 misión; Ingeniero = 3 misiones o 1 de nivel 2; Fundador = 1 de nivel 3.
  function scoreboard() {
    var byLogin = {};
    missions.forEach(function (m) {
      if (m.state !== "done") return;
      m.people.forEach(function (p) {
        var s = byLogin[p.login] || (byLogin[p.login] = { person: p, points: 0, done: 0, top: 0 });
        s.points += POINTS[levelOf(m)];
        s.done += 1;
        s.top = Math.max(s.top, levelOf(m));
      });
    });
    return Object.keys(byLogin).map(function (k) {
      var s = byLogin[k];
      s.rank = s.top >= 3 ? 3 : (s.top >= 2 || s.done >= 3) ? 2 : s.done >= 1 ? 1 : 0;
      return s;
    }).sort(function (a, b) { return b.points - a.points || a.person.login.localeCompare(b.person.login); });
  }

  function renderBoard() {
    var w = WORDS[lang];
    var list = document.getElementById("board");
    var status = document.getElementById("board-status");
    list.textContent = "";
    status.textContent = "";
    if (!missions) return;

    var rows = scoreboard();
    if (!rows.length) { status.textContent = w.boardEmpty; return; }

    rows.forEach(function (s) {
      var li = document.createElement("li");
      var av;
      if (s.person.avatar) {
        av = document.createElement("img");
        av.src = s.person.avatar + "&s=80";
        av.alt = "";
      } else {
        av = document.createElement("span");
        av.textContent = s.person.login.replace(/^ejemplo_/, "").charAt(0).toUpperCase();
      }
      av.className = "avatar";

      var who = document.createElement("a");
      who.className = "who";
      who.href = s.person.url || "#";
      who.textContent = s.person.login;

      var pts = document.createElement("span");
      pts.className = "pts";
      pts.textContent = s.points + " " + w.pts;

      var rk = document.createElement("span");
      rk.className = "rk";
      rk.textContent = w.ranks[s.rank] + " · " + s.done + " " + (s.done === 1 ? w.missionDone : w.missionsDone);

      li.appendChild(av);
      li.appendChild(who);
      li.appendChild(pts);
      li.appendChild(rk);
      list.appendChild(li);
    });
  }

  function render() {
    var w = WORDS[lang];
    var body = document.getElementById("missions");
    var status = document.getElementById("missions-status");
    body.textContent = "";
    status.textContent = "";

    if (failed) {
      status.textContent = w.error;
      var a = document.createElement("a");
      a.href = "https://github.com/" + REPO + "/issues?q=label%3Amision";
      a.textContent = "github.com/" + REPO;
      status.appendChild(a);
      return;
    }
    if (!missions) { status.textContent = w.loading; return; }

    var shown = missions.filter(function (m) { return filter === "all" || m.state === filter; });
    if (!shown.length) status.textContent = w.empty;
    if (isDemo()) status.textContent = w.demo;

    shown.forEach(function (m) {
      var tr = document.createElement("tr");

      var td1 = document.createElement("td");
      if (m.type) {
        var tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = "[ " + m.type + " ]";
        td1.appendChild(tag);
      }
      var link = document.createElement("a");
      link.href = m.url;
      link.textContent = m.title;
      td1.appendChild(link);
      var lv = document.createElement("span");
      lv.className = "level";
      lv.textContent = "· " + w.level + " " + m.level;
      td1.appendChild(lv);

      var td2 = document.createElement("td");
      td2.className = "state " + m.state;
      td2.textContent = w[m.state];

      var tdP = document.createElement("td");
      tdP.className = "points";
      tdP.textContent = "+" + POINTS[levelOf(m)];

      var td3 = document.createElement("td");
      td3.className = "rank-cell";
      td3.textContent = w.ranks[levelOf(m)];

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(tdP);
      tr.appendChild(td3);
      body.appendChild(tr);
    });
    renderBoard();
  }

  // Foro principal: giscus muestra dentro de la web una conversación de las Discussions de NexMine
  // (categoría General). Los chats de cada misión irán aparte.
  var GISCUS = {
    repo: REPO,
    repoId: "R_kgDOVRZ9zg",
    category: "General",
    categoryId: "DIC_kwDOVRZ9zs4DJMtM",
    term: "Canal del laboratorio"
  };

  function giscusTheme() {
    return /github\.io$/.test(location.hostname)
      ? location.origin + "/NexGame/giscus-theme.css"
      : "transparent_dark";
  }

  function renderForo() {
    var w = WORDS[lang];
    var body = document.getElementById("foro-body");
    body.textContent = "";
    var old = document.querySelector("#foro .chat-input");
    if (old) old.remove();

    if (!isDemo()) {
      var s = document.createElement("script");
      s.src = "https://giscus.app/client.js";
      s.setAttribute("data-repo", GISCUS.repo);
      s.setAttribute("data-repo-id", GISCUS.repoId);
      s.setAttribute("data-category", GISCUS.category);
      s.setAttribute("data-category-id", GISCUS.categoryId);
      s.setAttribute("data-mapping", "specific");
      s.setAttribute("data-term", GISCUS.term);
      s.setAttribute("data-strict", "1");
      s.setAttribute("data-reactions-enabled", "0");
      s.setAttribute("data-emit-metadata", "0");
      s.setAttribute("data-input-position", "bottom");
      s.setAttribute("data-theme", giscusTheme());
      s.setAttribute("data-lang", lang);
      s.setAttribute("data-loading", "lazy");
      s.crossOrigin = "anonymous";
      s.async = true;
      body.appendChild(s);
      return;
    }

    DEMO_FORO.forEach(function (m) {
      var p = document.createElement("p");
      p.className = "msg";
      var b = document.createElement("b");
      b.textContent = m.who;
      var r = document.createElement("span");
      r.className = "r";
      r.textContent = w.ranks[m.rank];
      p.appendChild(b);
      p.appendChild(r);
      p.appendChild(document.createTextNode(m.text));
      body.appendChild(p);
    });
    var input = document.createElement("div");
    input.className = "chat-input";
    input.textContent = w.foroInput;
    document.getElementById("foro").appendChild(input);
  }

  function isDemo() { return /[?&]demo\b/.test(location.search); }

  function load() {
    if (isDemo()) { missions = DEMO; render(); return; }
    render();
    fetch(API, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (list) {
        missions = list
          .filter(function (i) { return !i.pull_request && i.state_reason !== "not_planned"; })
          .map(toMission);
        render();
      })
      .catch(function () { failed = true; render(); });
  }

  function setLang(next) {
    lang = next;
    document.documentElement.lang = next;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!(key in spanish)) spanish[key] = el.textContent;
      el.textContent = next === "en" ? (EN[key] || spanish[key]) : spanish[key];
    });
    document.getElementById("lang").textContent = next === "en" ? "ES" : "EN";
    try { localStorage.setItem("nexmine-lang", next); } catch (e) { /* sin memoria del navegador */ }
    render();
    renderForo();
  }

  document.getElementById("lang").addEventListener("click", function () {
    setLang(lang === "es" ? "en" : "es");
  });

  document.querySelectorAll(".filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      filter = b.getAttribute("data-filter");
      document.querySelectorAll(".filters button").forEach(function (x) { x.classList.toggle("on", x === b); });
      render();
    });
  });

  var saved = null;
  try { saved = localStorage.getItem("nexmine-lang"); } catch (e) { /* nada */ }
  var start = saved || ((navigator.language || "es").slice(0, 2) === "es" ? "es" : "en");
  setLang(start);
  load();
})();
