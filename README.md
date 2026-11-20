# pikaroot

Source for **https://pikaroot.github.io**: a hub for my projects, CTF writeups, blog posts and a daily sudoku.
Built with [Docusaurus](https://docusaurus.io/).

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
Repo setting: **Pages → Source: GitHub Actions**.

## History
This replaced the old Jekyll site (minimal-mistakes theme), which is preserved on the
`legacy-jekyll` branch. Old URLs (`/ctfs/<event>/...`, `/blogs/...`) redirect to their new
locations via [`redirects.js`](redirects.js).
