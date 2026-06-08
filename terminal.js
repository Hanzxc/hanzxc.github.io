/* =========================================================================
   Jun Han — Interactive Terminal Portfolio
   Vanilla JS, no dependencies. The terminal reads its content from the
   #plain section in the DOM (single source of truth), so the site stays
   fully usable and indexable with JavaScript disabled.
   ========================================================================= */
(function () {
  "use strict";

  var output = document.getElementById("output");
  var form = document.getElementById("term-form");
  var input = document.getElementById("cmd");
  var screen = document.getElementById("screen");
  var rootEl = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!output || !form || !input) { return; }

  var THEMES = ["midnight", "matrix", "amber", "light"];

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function text(el) { return el ? el.textContent.replace(/\s+/g, " ").trim() : ""; }
  function sleep(ms) {
    return new Promise(function (res) {
      if (skipBoot) return res();
      setTimeout(res, ms);
    });
  }
  function scrollDown() { output.scrollTop = output.scrollHeight; }

  /* ---------- read content from the DOM ---------- */
  function getProjects() {
    return Array.prototype.map.call(document.querySelectorAll("#projects .project"), function (p) {
      return {
        id: p.getAttribute("data-id"),
        name: p.getAttribute("data-name"),
        tags: (p.getAttribute("data-tags") || "").trim(),
        status: p.getAttribute("data-status") || "",
        url: p.getAttribute("data-url") || "",
        desc: text(p.querySelector(".desc")),
        points: Array.prototype.map.call(p.querySelectorAll(".points li"), text)
      };
    });
  }
  function getSkills() {
    return Array.prototype.map.call(document.querySelectorAll("#skills .skill-group"), function (g) {
      return {
        group: text(g.querySelector("h3")),
        items: Array.prototype.map.call(g.querySelectorAll("li"), function (li) {
          return { label: text(li), level: li.getAttribute("data-level") || "" };
        })
      };
    });
  }
  function getExperience() {
    return Array.prototype.map.call(document.querySelectorAll("#experience .xp"), function (x) {
      return { when: x.getAttribute("data-when") || "", title: text(x.querySelector("h4")), body: text(x.querySelector("p")) };
    });
  }
  function getContacts() {
    return Array.prototype.map.call(document.querySelectorAll("#contact a[data-contact]"), function (a) {
      return { type: a.getAttribute("data-contact"), label: text(a), href: a.getAttribute("href") };
    });
  }

  /* ---------- printing ---------- */
  function printEcho(cmd) {
    var row = document.createElement("div");
    row.className = "row";
    row.innerHTML = '<span class="prompt-sm"><span class="u">junhan</span>@<span class="h">portfolio</span>:~$</span> ' +
      '<span class="typed">' + esc(cmd) + "</span>";
    output.appendChild(row);
  }
  function printOut(html, cls) {
    var div = document.createElement("div");
    div.className = "out" + (cls ? " " + cls : "");
    div.innerHTML = html;
    output.appendChild(div);
    scrollDown();
    return div;
  }

  /* ---------- command outputs ---------- */
  var BANNER =
    "     ██ ██   ██ ███   ██     ██  ██   ███   ██  ██\n" +
    "     ██ ██   ██ ████  ██     ██  ██  ██ ██  ███ ██\n" +
    "     ██ ██   ██ ██ ██ ██     ██████  █████  ██████\n" +
    "  ██ ██ ██   ██ ██  ████     ██  ██  ██ ██  ██ ███\n" +
    "   ███   █████  ██   ███     ██  ██  ██ ██  ██  ██";

  var HELP = [
    ["help", "show this list of commands"],
    ["whoami", "who is Jun Han (about me)"],
    ["projects", "list public projects  ·  project <id> for details"],
    ["skills", "technical skills and honest levels"],
    ["experience", "background / career story"],
    ["resume", "open the printable resume"],
    ["contact", "github, email, linkedin"],
    ["github", "open my github profile"],
    ["theme", "cycle terminal colors  ·  theme <midnight|matrix|amber|light>"],
    ["banner", "print the name banner"],
    ["clear", "clear the screen"]
  ];

  function cmdHelp() {
    var rows = HELP.map(function (h) {
      return "<tr><td><span class='cmdlink' data-run='" + esc(h[0]) + "'>" + esc(h[0]) +
        "</span></td><td class='tag'>" + esc(h[1]) + "</td></tr>";
    }).join("");
    return "<span class='head'>Available commands</span> <span class='tag'>(click any command, or type it)</span>\n" +
      "<table>" + rows + "</table>";
  }

  function cmdWhoami() {
    var about = text(document.querySelector('#about [data-field="about"]'));
    return "<span class='head'>Jun Han</span> <span class='tag'>— cybersecurity student · data center experience · OSCP-track</span>\n\n" +
      esc(about) + "\n\n" +
      "Next: try <span class='cmdlink' data-run='projects'>projects</span>, " +
      "<span class='cmdlink' data-run='skills'>skills</span>, or " +
      "<span class='cmdlink' data-run='resume'>resume</span>.";
  }

  function cmdProjects() {
    var ps = getProjects();
    var rows = ps.map(function (p) {
      return "<tr><td><span class='key'>▸</span> <span class='cmdlink' data-run='project " + esc(p.id) + "'>" +
        esc(p.id) + "</span></td><td>" + esc(p.name) + "</td><td class='tag'>" + esc(p.status) + "</td></tr>";
    }).join("");
    return "<span class='head'>Projects</span> <span class='tag'>(" + ps.length + ") — run </span><span class='key'>project &lt;id&gt;</span><span class='tag'> for details</span>\n" +
      "<table>" + rows + "</table>";
  }

  function cmdProject(arg) {
    var ps = getProjects();
    if (!arg) {
      return "<span class='warn'>usage:</span> project &lt;id&gt;\n" + cmdProjects();
    }
    var p = ps.filter(function (x) { return x.id === arg.toLowerCase(); })[0];
    if (!p) {
      var ids = ps.map(function (x) { return x.id; }).join(", ");
      return "<span class='err'>project not found:</span> " + esc(arg) + "\n<span class='tag'>known ids: " + esc(ids) + "</span>";
    }
    var bullets = p.points.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("");
    var tags = p.tags ? "<span class='tag'>tags: " + esc(p.tags.split(" ").join(", ")) + "</span>\n" : "";
    var link = p.url
      ? "<a href='" + esc(p.url) + "' rel='noopener' target='_blank'>" + esc(p.url) + " ↗</a>"
      : "<span class='tag'>(study system — no public repo)</span>";
    return "<span class='head'>" + esc(p.name) + "</span>  <span class='tag'>[" + esc(p.status) + "]</span>\n\n" +
      esc(p.desc) + "\n\n" +
      "<ul>" + bullets + "</ul>\n" + tags + link;
  }

  function cmdSkills() {
    var groups = getSkills();
    var out = "<span class='head'>Skills</span> <span class='tag'>(honest levels: comfortable / building / exploring)</span>\n";
    out += groups.map(function (g) {
      var items = g.items.map(function (it) {
        return "<tr><td>" + esc(it.label) + "</td><td class='lvl-" + esc(it.level) + "'>" + esc(it.level) + "</td></tr>";
      }).join("");
      return "\n<span class='key'># " + esc(g.group) + "</span>\n<table>" + items + "</table>";
    }).join("");
    return out;
  }

  function cmdExperience() {
    var xp = getExperience();
    return "<span class='head'>Experience &amp; story</span>\n\n" + xp.map(function (x) {
      return "<span class='key'>[" + esc(x.when) + "]</span> <span class='head'>" + esc(x.title) + "</span>\n  " + esc(x.body);
    }).join("\n\n");
  }

  function cmdResume() {
    return "Opening the printable resume → <a href='resume.html'>resume.html</a>\n" +
      "<span class='tag'>(also: </span><span class='cmdlink' data-run='whoami'>whoami</span><span class='tag'> for the short version)</span>";
  }

  function cmdContact() {
    var cs = getContacts();
    var rows = cs.map(function (c) {
      var val = /^https?:|^mailto:/.test(c.href)
        ? "<a href='" + esc(c.href) + "' rel='noopener'>" + esc(c.label) + "</a>"
        : esc(c.label);
      return "<tr><td class='key'>" + esc(c.type) + "</td><td>" + val + "</td></tr>";
    }).join("");
    return "<span class='head'>Contact</span>\n<table>" + rows + "</table>";
  }

  function cmdGithub() {
    window.open("https://github.com/Hanzxc", "_blank", "noopener");
    return "Opening <a href='https://github.com/Hanzxc' rel='noopener'>github.com/Hanzxc</a> in a new tab…";
  }

  function cmdTheme(arg) {
    var current = rootEl.getAttribute("data-term") || "midnight";
    var next;
    if (arg) {
      arg = arg.toLowerCase();
      if (THEMES.indexOf(arg) === -1) {
        return "<span class='err'>unknown theme:</span> " + esc(arg) + "\n<span class='tag'>options: " + THEMES.join(", ") + "</span>";
      }
      next = arg;
    } else {
      next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    }
    setTheme(next);
    return "theme set to <span class='ok'>" + esc(next) + "</span> <span class='tag'>(options: " + THEMES.join(", ") + ")</span>";
  }

  function setTheme(name) {
    rootEl.setAttribute("data-term", name);
    try { localStorage.setItem("term-theme", name); } catch (e) {}
  }

  /* ---------- command table ---------- */
  var COMMANDS = {
    help: cmdHelp, "?": cmdHelp, man: cmdHelp,
    whoami: cmdWhoami, about: cmdWhoami,
    projects: cmdProjects, ls: cmdProjects, "ls -la": cmdProjects,
    project: cmdProject, open: cmdProject, cat: cmdProject,
    skills: cmdSkills,
    experience: cmdExperience, story: cmdExperience, history_career: cmdExperience,
    resume: cmdResume, cv: cmdResume,
    contact: cmdContact,
    github: cmdGithub,
    theme: cmdTheme,
    banner: function () { return "<span class='banner'>" + esc(BANNER) + "</span>"; },
    echo: function (a) { return esc(a || ""); },
    date: function () { return esc(new Date().toString()); },
    sudo: function () { return "<span class='err'>[sudo]</span> nice try — you don't have root here. But the source is public: <a href='https://github.com/Hanzxc/hanzxc.github.io' rel='noopener'>github.com/Hanzxc/hanzxc.github.io</a>"; },
    history: function () { return hist.length ? hist.map(function (h, i) { return "  " + (i + 1) + "  " + esc(h); }).join("\n") : "<span class='tag'>no history yet</span>"; },
    clear: function () { return "__CLEAR__"; }
  };

  var COMPLETIONS = ["help", "whoami", "projects", "project", "skills", "experience",
    "resume", "contact", "github", "theme", "banner", "clear"];

  /* ---------- run a command ---------- */
  function run(raw) {
    var line = raw.trim();
    printEcho(line);
    if (line) { hist.push(line); }
    histIdx = hist.length;

    if (!line) { return; }

    var space = line.indexOf(" ");
    var name = (space === -1 ? line : line.slice(0, space)).toLowerCase();
    var arg = space === -1 ? "" : line.slice(space + 1).trim();

    var fn = COMMANDS[name];
    if (!fn) {
      printOut("<span class='err'>command not found:</span> " + esc(name) +
        "\nType <span class='cmdlink' data-run='help'>help</span> to see what's available.");
      return;
    }
    var result = fn(arg);
    if (result === "__CLEAR__") { output.innerHTML = ""; return; }
    printOut(result);
  }

  /* ---------- history + input ---------- */
  var hist = [];
  var histIdx = 0;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = input.value;
    input.value = "";
    run(val);
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = hist[histIdx] || ""; setCaretEnd(); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx < hist.length) { histIdx++; input.value = hist[histIdx] || ""; setCaretEnd(); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      autocomplete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      output.innerHTML = "";
    }
  });

  function setCaretEnd() {
    var v = input.value; input.value = ""; input.value = v;
  }

  function autocomplete() {
    var parts = input.value.split(" ");
    if (parts.length <= 1) {
      var pre = parts[0].toLowerCase();
      var matches = COMPLETIONS.filter(function (c) { return c.indexOf(pre) === 0; });
      if (matches.length === 1) { input.value = matches[0] + " "; }
      else if (matches.length > 1) { printEcho(input.value); printOut("<span class='tag'>" + matches.join("    ") + "</span>"); }
    } else if (/^(project|open|cat)$/.test(parts[0].toLowerCase())) {
      var ids = getProjects().map(function (p) { return p.id; });
      var p2 = (parts[1] || "").toLowerCase();
      var m2 = ids.filter(function (id) { return id.indexOf(p2) === 0; });
      if (m2.length === 1) { input.value = parts[0] + " " + m2[0]; }
      else if (m2.length > 1) { printEcho(input.value); printOut("<span class='tag'>" + m2.join("    ") + "</span>"); }
    }
  }

  /* ---------- delegated clicks: chips + in-output command links ---------- */
  document.querySelectorAll(".term-chips [data-cmd]").forEach(function (btn) {
    btn.addEventListener("click", function () { focusInput(); run(btn.getAttribute("data-cmd")); });
  });
  output.addEventListener("click", function (e) {
    var link = e.target.closest(".cmdlink[data-run]");
    if (link) { focusInput(); run(link.getAttribute("data-run")); }
  });

  /* ---------- theme + plain-view buttons ---------- */
  var themeBtn = document.getElementById("theme-btn");
  if (themeBtn) { themeBtn.addEventListener("click", function () { printEcho("theme"); printOut(cmdTheme("")); }); }

  function showPlain() { rootEl.classList.add("show-plain"); window.scrollTo(0, 0); }
  var plainBtn = document.getElementById("plain-btn");
  if (plainBtn) { plainBtn.addEventListener("click", showPlain); }

  // The skip link targets #plain, which is hidden while the terminal is active;
  // reveal the accessible plain version when it's used (keyboard / screen reader).
  var skip = document.querySelector(".skip-link");
  if (skip) { skip.addEventListener("click", showPlain); }

  var backLink = document.getElementById("back-to-term");
  if (backLink) {
    backLink.addEventListener("click", function (e) { e.preventDefault(); rootEl.classList.remove("show-plain"); focusInput(); });
  }

  /* ---------- focus management ---------- */
  function focusInput() { try { input.focus(); } catch (e) {} }
  screen.addEventListener("mouseup", function () {
    if (window.getSelection && String(window.getSelection())) { return; } // don't steal text selection
    focusInput();
  });

  /* ---------- footer year (plain view) ---------- */
  var year = document.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---------- boot sequence ---------- */
  var skipBoot = false;
  function requestSkip() { skipBoot = true; }
  document.addEventListener("keydown", requestSkip, { once: true });
  screen.addEventListener("click", requestSkip, { once: true });

  function bootLine(htmlChunks) { printOut(htmlChunks); }

  async function boot() {
    if (reduceMotion) {
      printOut("<span class='banner'>" + esc(BANNER) + "</span>");
      printOut("<span class='tag'>interactive resume — type </span><span class='cmdlink' data-run='help'>help</span><span class='tag'> to begin.</span>");
      focusInput();
      return;
    }
    bootLine("<span class='tag'>booting junhan-portfolio v1.0 …</span>");
    await sleep(360);
    bootLine("<span class='ok'>[ ok ]</span> loading profile");
    await sleep(200);
    bootLine("<span class='ok'>[ ok ]</span> mounting /projects");
    await sleep(200);
    bootLine("<span class='ok'>[ ok ]</span> establishing secure shell");
    await sleep(320);
    printOut("<span class='banner'>" + esc(BANNER) + "</span>");
    await sleep(160);
    printOut("Welcome. This is an <span class='head'>interactive resume</span>.\n" +
      "Type <span class='cmdlink' data-run='help'>help</span> to list commands, or tap one above. " +
      "Try <span class='cmdlink' data-run='whoami'>whoami</span>.");
    focusInput();
  }

  boot();
})();
