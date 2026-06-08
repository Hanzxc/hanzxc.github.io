#!/usr/bin/env python3
"""Lightweight static-site validator (zero dependencies).

Checks that:
  - required files exist,
  - every local <a href> points at a file that exists,
  - the page contains the content sections the terminal reads from.
"""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

HTML_FILES = [ROOT / "index.html", ROOT / "resume.html", ROOT / "404.html"]
REQUIRED_FILES = [
    ROOT / "index.html",
    ROOT / "resume.html",
    ROOT / "404.html",
    ROOT / "styles.css",
    ROOT / "terminal.js",
    ROOT / "assets" / "favicon.svg",
]
# The terminal reads its content from these section ids in index.html.
REQUIRED_INDEX_SECTIONS = ["plain", "about", "projects", "skills", "experience", "contact"]


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])


def parse(path: Path) -> LinkParser:
    parser = LinkParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def main() -> int:
    errors = []

    for path in REQUIRED_FILES:
        if not path.exists():
            errors.append(f"missing required file: {path.relative_to(ROOT)}")

    for path in HTML_FILES:
        if not path.exists():
            continue
        for link in parse(path).links:
            if link.startswith(("http://", "https://", "mailto:", "tel:", "#")):
                continue
            target = (path.parent / link.split("#", 1)[0]).resolve()
            if link and not target.exists():
                errors.append(f"{path.name}: broken local link -> {link}")

    if (ROOT / "index.html").exists():
        index = parse(ROOT / "index.html")
        for section_id in REQUIRED_INDEX_SECTIONS:
            if section_id not in index.ids:
                errors.append(f"index.html: missing required id #{section_id}")

    if errors:
        print("Portfolio check failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("Portfolio check passed: files, local links, and content sections look good.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
