# Jun Han — Interactive Terminal Portfolio

Source for my GitHub Pages portfolio: **https://hanzxc.github.io**

The site is an **interactive terminal**. Visitors type (or click) commands —
`help`, `whoami`, `projects`, `project totp`, `skills`, `resume`, `theme amber`,
`clear` — to explore my background and work. It's built for recruiter screening
and technical interviews, and it's deliberately on-brand for security work.

## How it works

- **Real shell loop** with command history (↑/↓), Tab autocomplete, `Ctrl+L` to
  clear, a short boot sequence, and clickable command links in the output.
- **Four terminal color themes** (`theme midnight|matrix|amber|light`), persisted
  in `localStorage`.
- **Single source of truth:** the terminal reads all of its content from the
  semantic `#plain` section in `index.html` — so there's no duplicated copy to
  keep in sync.
- **Works without JavaScript:** if JS is off (or fails), the same content renders
  as a clean, accessible, indexable plain-text page. A "plain view" button in the
  terminal reveals it on demand, which is also the screen-reader-friendly path.

## Tech

Plain **HTML + CSS + vanilla JavaScript**. No framework, no build step, no
dependencies — it just works on GitHub Pages.

| File | Purpose |
|------|---------|
| `index.html` | Terminal UI + `#plain` fallback content (the data source) |
| `terminal.js` | Command engine: parsing, history, autocomplete, themes, boot |
| `styles.css` | Terminal themes + plain/resume/404 styling |
| `resume.html` | Printable one-page resume snapshot |
| `404.html` | "command not found" themed error page |
| `assets/favicon.svg` | Terminal-prompt favicon |
| `scripts/check_site.py` | Zero-dependency link/section validator |
| `.github/workflows/portfolio-check.yml` | Runs the validator on every push/PR |
| `robots.txt`, `sitemap.xml`, `_config.yml`, `.nojekyll` | Hosting/SEO metadata |

## Commands

```
help        list commands            theme       cycle color schemes
whoami      about me                 banner      print the name banner
projects    list projects            clear       clear the screen
project <id>  project details        contact     github / email / linkedin
skills      skills + honest levels   github      open my github
experience  background / story       resume      open the printable resume
```

Easter eggs: `sudo`, `date`, `echo <text>`, `history`.

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

- **Email** — `index.html` (`#contact`, the `data-contact="email"` link) and `resume.html`.
- **LinkedIn URL** — `index.html` (`#contact`) and `resume.html`.

Everything else (name, school, experience, projects, GitHub) is already wired up.

## Adding or editing a project

Edit the matching `<article class="project" …>` block in `index.html`. The
terminal picks up `data-id`, `data-name`, `data-tags`, `data-status`, `data-url`,
the `.desc` paragraph, and the `.points` list automatically — no JS changes needed.

## Selected projects

- [Auto OSCP Recon Notes](https://github.com/Hanzxc/auto-oscp-recon-notes)
- [Lamport OTP](https://github.com/Hanzxc/lamport-otp)
- [Intrusion Detection System Simulation](https://github.com/Hanzxc/intrusion-detection-system)
- [TOTP Simulator](https://github.com/Hanzxc/totp-simulator)
