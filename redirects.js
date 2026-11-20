// Redirects from the old Jekyll site (pikaroot.github.io, minimal-mistakes theme)
// to the Docusaurus routes. Docusaurus emits a small HTML redirect page at each old path.
//   /ctfs/<event>[/<post>]            -> /ctfs/<year>/<event>[/<post>]
//   /blogs/<YYYY-MM-DD-Old_Name>      -> /blog/<slug>
import fs from 'node:fs';
import path from 'node:path';

const BLOGS = {
  '2022-12-21-iHack2022_blog': '/blog/ihack-2022',
  '2023-02-06-Sagemath_Installation_without_git_clone_repo': '/blog/sagemath-in-debian',
  '2023-02-25-HAVOC_Framework': '/blog/havoc-101-workshop',
  '2024-12-31-latex-symbols': '/blog/latex-symbols',
};

// event dir name -> year, read from ctfs/<year>/<event>/
const eventYear = {};
for (const year of fs.readdirSync('ctfs').filter((d) => /^\d{4}$/.test(d))) {
  for (const ev of fs.readdirSync(path.join('ctfs', year))) {
    if (fs.statSync(path.join('ctfs', year, ev)).isDirectory()) eventYear[ev] = year;
  }
}

/** @param {string} existingPath a route that exists on the new site */
export function createRedirects(existingPath) {
  const from = [];
  let m;
  if ((m = existingPath.match(/^\/ctfs\/(\d{4})\/([^/]+)(\/[^/]+)?$/)) && eventYear[m[2]] === m[1]) {
    from.push(`/ctfs/${m[2]}${m[3] || ''}`);
    if (!m[3]) from.push(`/_pages/ctfs/${m[2]}`);
  }
  if (existingPath === '/ctfs' || existingPath === '/ctfs/') from.push('/ctfs/ctfs', '/ctfs/posts');
  if (existingPath === '/blog') from.push('/blogs');
  for (const [old, to] of Object.entries(BLOGS)) {
    if (existingPath === to) from.push(`/blogs/${old}`, `/_blogs/${old}`);
  }
  return from.length ? from : undefined;
}
