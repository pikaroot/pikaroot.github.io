# pikaroot

[**pikaroot.com**](https://pikaroot.com) — a hub for my projects, CTF writeups, blog posts and a daily sudoku.
Built with [Docusaurus](https://docusaurus.io/), published on GitHub Pages.

## What's on the site
- **Projects**: cards generated from [`src/data/projects.js`](src/data/projects.js), including [KEVlar](https://kevlar.pikaroot.com).
- **CTF writeups** (`ctfs/`) and **blog** (`blog/`).
- **Daily sudoku** (`src/pages/sudoku`) with a small solve counter.
- **Daily accent colour**: the site's accent rotates each day.

## Add a project
Add an entry to [`src/data/projects.js`](src/data/projects.js). Set `live` if it has a running instance
and the card gets an "Open live app" link. The landing page picks it up on the next build.

## Develop
```bash
npm ci
npm start          # dev server on http://localhost:3000
npm run build      # static site in ./build
```
No Node on the host? `docker run --rm -it -u $(id -u):$(id -g) -v "$PWD":/site -w /site -e HOME=/tmp -p 3000:3000 node:22-bookworm-slim npm start -- --host 0.0.0.0`

## Deploy
Every push to `main` builds and publishes through GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).
Repo settings: **Pages → Source: GitHub Actions**, custom domain `pikaroot.com` (also set in [`static/CNAME`](static/CNAME)).

## Privacy
No cookies, no third-party trackers. Page views and sudoku solves are counted by my own homelab server
(`kevlar.pikaroot.com`), skipped when the browser sends Do Not Track / Global Privacy Control.
IPs are anonymised in the reports; the sudoku counter stores only a per-day pseudonym.

## History
This replaced the old Jekyll site (minimal-mistakes theme), which is preserved on the
`legacy-jekyll` branch. Old URLs (`/ctfs/<event>/...`, `/blogs/...`) redirect to their new
locations via [`redirects.js`](redirects.js).

## License
- **Code** (`src/`, `plugins/`, config): [MIT](LICENSE)
- **Content** (CTF writeups in `ctfs/`, posts in `blog/`, images in `static/img/`): [CC BY 4.0](LICENSE-CONTENT). Reuse freely with credit to pikaroot and a link back.
