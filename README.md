# Jun Han — Cybersecurity Portfolio

This repository powers my GitHub Pages portfolio: https://hanzxc.github.io

It is built for job searches, recruiter screening, and interview preparation. The site presents a clear story:

- cybersecurity student at UOW / SIM
- former data-centre engineer with Equinix and Alibaba Cloud experience
- OSCP-track learner building practical security fundamentals
- Python/Bash automation and technical documentation focus

## What is included

- `index.html` — main portfolio landing page
- `resume.html` — printable one-page resume snapshot
- `styles.css` — responsive dark portfolio styling
- `404.html` — simple not-found page
- `robots.txt` and `sitemap.xml` — basic search engine metadata
- `scripts/check_site.py` — lightweight local validation for links and required sections

## Local preview

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Validate

```bash
python3 scripts/check_site.py
```

## Next portfolio improvements

- Add a real contact email and LinkedIn URL when ready.
- Build and link the ReconForge CLI project.
- Build and link the Updatr patch tracker project.
- Add legal HTB/THM-style writeups focused on methodology and lessons learned.
- Export a polished PDF resume from `resume.html`.
