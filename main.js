/* =========================================================================
   Jun Han — Cybersecurity Portfolio
   Vanilla JS, no dependencies. Everything here is progressive enhancement:
   the site is fully usable with JavaScript disabled.
   ========================================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    var closeMenu = function () {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Scrollspy: highlight active nav link ---------- */
  var sections = ["projects", "skills", "story", "proof", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navAnchors = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var id = a.getAttribute("href").replace("#", "");
    navAnchors[id] = a;
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.keys(navAnchors).forEach(function (id) {
            navAnchors[id].classList.toggle("active", id === entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Project filtering ---------- */
  var chips = document.querySelectorAll(".filter-bar .chip");
  var cards = document.querySelectorAll("#project-grid .project-card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(" ");
        var show = filter === "all" || tags.indexOf(filter) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Terminal typing effect ---------- */
  var term = document.getElementById("term");
  if (term && !prefersReducedMotion) {
    var lines;
    try { lines = JSON.parse(term.getAttribute("data-lines") || "[]"); } catch (e) { lines = []; }
    if (lines.length) {
      term.textContent = "";
      var cursor = document.createElement("span");
      cursor.className = "term-cursor";
      cursor.innerHTML = "&nbsp;";
      term.appendChild(cursor);

      var li = 0, ci = 0;
      var typeChar = function () {
        if (li >= lines.length) { return; }
        var line = lines[li];
        if (ci < line.length) {
          cursor.insertAdjacentText("beforebegin", line.charAt(ci));
          ci++;
          setTimeout(typeChar, line.charAt(ci - 1) === " " ? 14 : 26);
        } else {
          cursor.insertAdjacentText("beforebegin", "\n");
          li++; ci = 0;
          setTimeout(typeChar, 230);
        }
      };
      // Start once the terminal scrolls into view (or immediately as fallback).
      if ("IntersectionObserver" in window) {
        var tio = new IntersectionObserver(function (entries, obs) {
          if (entries[0].isIntersecting) { setTimeout(typeChar, 350); obs.disconnect(); }
        }, { threshold: 0.4 });
        tio.observe(term);
      } else {
        setTimeout(typeChar, 350);
      }
    }
  }

  /* ---------- Copy to clipboard ---------- */
  var toast;
  var showToast = function (msg) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  };
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast("Copied: " + text);
        }).catch(function () { showToast(text); });
      } else {
        showToast(text);
      }
    });
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
