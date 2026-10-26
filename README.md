# Vibe Coder's Engineering Handbook

Seven searchable cheat sheets that close the gap between vibe coding and software engineering:

1. Design Patterns
2. Design Principles
3. Testing, QA & CI/CD
4. Security
5. Compliance
6. Tech Stack Selector
7. SDLC

Each entry says what the idea is, the level it operates at (L1 code → L5 process), a prompt to give the AI, a red flag to spot in AI output, and when not to use it.

## Files

| File | What it holds | Edit it when… |
|------|---------------|---------------|
| `content.js` | All the content: every pattern, principle, test method, security risk, compliance regime, stack and SDLC model | You want to add, fix or update an entry |
| `app.js` | How the sheets are drawn, search, filters, tabs | You want to change behaviour |
| `index.html` | Page shell and styles | You want to change the look |

## Adding an entry

Open `content.js`, find the right list (`PATTERNS`, `PRINCIPLES`, `TESTING`, `SECURITY`, `COMPLIANCE`, `SDLC`, `FEATURES`, `STACKS`) and copy an existing entry. Card fields:

| Key | Meaning |
|-----|---------|
| `n` | Name |
| `c` | Category (becomes a filter chip) |
| `lv` | Level 1–5 (patterns and principles) |
| `w` | What it is, in plain words |
| `a` | Everyday analogy (optional) |
| `p` | “Say this to the AI” prompt |
| `r` | Red flag in AI output |
| `x` | When not to use it |
| `t` | Tools (optional) |

Inside the text, use curly quotes (‘ ’ “ ”) or escape straight double quotes, because entries are double-quoted strings.

## Preview locally

Open `index.html` in a browser. No build step.

## Publishing

GitHub Pages serves the `main` branch root. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.

Compliance dates were checked in October 2026. Laws change; confirm before relying on them.
