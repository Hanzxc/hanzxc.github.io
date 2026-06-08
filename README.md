# Jun Han — Cybersecurity Portfolio

Source for my GitHub Pages portfolio: **https://hanzxc.github.io**

Built for job searches, recruiter screening, and interview prep. It tells one
honest story: infrastructure foundation → security growth → practical execution.

- Cybersecurity student at UOW / SIM
- Hands-on data center experience (Equinix, Alibaba Cloud)
- OSCP-track learner building practical security fundamentals
- Python / Bash automation and clear technical documentation

## Tech

Plain **HTML + CSS + vanilla JavaScript** — no framework, no build step, instant
load on GitHub Pages. JavaScript is purely progressive enhancement: the site is
fully usable with JS disabled.

### Features

- **Light & dark themes** with a toggle, persisted in `localStorage` and seeded
  from the visitor's OS preference (no flash of the wrong theme on load).
- **Filterable project grid** (All / Python / Cryptography / Detection / Web).
- **Scroll-reveal** animations, **scrollspy** nav highlighting, animated
  terminal hero, mobile nav, and copy-to-clipboard contact — all with graceful
  fallbacks and `prefers-reduced-motion` support.
- **Accessible**: skip link, semantic landmarks, visible focus states, ARIA on
  interactive controls, keyboard-dismissable menu.
- **SEO**: canonical URL, Open Graph/Twitter meta, JSON-LD `Person`, sitemap,
  robots, per-theme `theme-color`.
- **Printable resume** (`resume.html`) that exports cleanly to PDF.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main single-page portfolio |
| `resume.html` | Printable one-page resume snapshot |
| `404.html` | Themed not-found page |
| `styles.css` | Design-token-driven styles (dark + light) |
| `main.js` | Theme, nav, reveal, scrollspy, filter, typing, copy |
| `assets/favicon.svg` | Scalable JH monogram favicon |
| `scripts/check_site.py` | Zero-dependency link/section validator |
| `.github/workflows/portfolio-check.yml` | Runs the validator on every push/PR |
| `robots.txt`, `sitemap.xml`, `_config.yml`, `.nojekyll` | Hosting/SEO metadata |

## Selected projects

- [Auto OSCP Recon Notes](https://github.com/Hanzxc/auto-oscp-recon-notes) — Python CLI that turns local Nmap XML from authorized labs into plain-text notes, service checklists, and a report template.
- [Lamport OTP](https://github.com/Hanzxc/lamport-otp) — standard-library Python implementation of a hash-chain one-time password scheme.
- [Intrusion Detection System Simulation](https://github.com/Hanzxc/intrusion-detection-system) — anomaly-based IDS using baselines, weighted deviations, and alerting logic.
- [TOTP Simulator](https://github.com/Hanzxc/totp-simulator) — RFC 6238 time-based one-time password implementation verified against official test vectors.

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Validate

```bash
python3 scripts/check_site.py
```

## Before you publish — fill in the placeholders

Search the project for `TODO(Jun)` and replace:

- **Email** — `index.html` contact section (the copy-to-clipboard card) and
  optionally `resume.html`.
- **LinkedIn URL** — `index.html` contact section and `resume.html`.

Everything else (name, school, experience, projects, GitHub) is already wired up.

## Next improvements

- Add legal HTB/THM-style writeups focused on methodology and lessons learned.
- Add screenshots or short demo clips for the recon-notes, Lamport OTP, and IDS projects.
- Export a polished PDF resume from `resume.html`.
