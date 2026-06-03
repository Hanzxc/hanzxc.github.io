# Jun Han - Cybersecurity Portfolio

This repository powers my GitHub Pages portfolio: https://hanzxc.github.io

It is built for job searches, recruiter screening, and interview preparation. The site presents a clear story:

- cybersecurity student at UOW / SIM
- cybersecurity student with hands-on data center experience from Equinix and Alibaba Cloud
- OSCP-track learner building practical security fundamentals
- Python/Bash automation and technical documentation focus

## What is included

- `index.html` - main portfolio landing page
- `resume.html` - printable one-page resume snapshot
- `styles.css` - responsive dark portfolio styling
- `404.html` - simple not-found page
- `robots.txt` and `sitemap.xml` - basic search engine metadata
- `scripts/check_site.py` - lightweight local validation for links and required sections

## Selected projects

- [Auto OSCP Recon Notes](https://github.com/Hanzxc/auto-oscp-recon-notes) - Python CLI that turns local Nmap XML from authorized labs into plain-text notes, service checklists, and a report template.
- [Lamport OTP](https://github.com/Hanzxc/lamport-otp) - standard-library Python implementation of a hash-chain one-time password scheme.
- [Intrusion Detection System Simulation](https://github.com/Hanzxc/intrusion-detection-system) - anomaly-based IDS project using baselines, weighted deviations, and alerting logic.
- [TOTP Simulator](https://github.com/Hanzxc/totp-simulator) - RFC 6238 time-based one-time password implementation verified against official test vectors.

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
- Add legal HTB/THM-style writeups focused on methodology and lessons learned.
- Add screenshots or short demo notes for the Auto OSCP Recon Notes, Lamport OTP, and IDS projects.
- Export a polished PDF resume from `resume.html`.
