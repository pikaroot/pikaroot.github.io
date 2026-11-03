// Collects the CTF writeups and blog posts into global data, so the landing
// page always reflects the real content (counts, latest items, topics).
import fs from 'fs';
import path from 'path';

const DATE_LINE = /^\*([A-Z][a-z]+ \d{1,2}, \d{4})\*\s*$/m; // e.g. *March 31, 2024*

function readWriteup(doc, siteDir) {
  const file = doc.source.replace(/^@site/, siteDir);
  const dir = path.dirname(file);
  let date = null;
  let event = path.basename(dir);
  try {
    const m = fs.readFileSync(file, 'utf8').match(DATE_LINE);
    if (m) date = new Date(`${m[1]} UTC`).toISOString().slice(0, 10);
  } catch (e) {
    // unreadable source: keep going without a date
  }
  try {
    event = JSON.parse(fs.readFileSync(path.join(dir, '_category_.json'), 'utf8')).label || event;
  } catch (e) {
    // no category file: fall back to the folder name
  }
  return {
    title: doc.title,
    description: doc.description,
    permalink: doc.permalink,
    date,
    event,
    tags: doc.tags.map((t) => ({label: t.label, permalink: t.permalink})),
  };
}

export default function siteIndexPlugin(context) {
  return {
    name: 'site-index',
    async allContentLoaded({allContent, actions}) {
      const ctfVersion = allContent['docusaurus-plugin-content-docs']?.ctfs?.loadedVersions?.[0];
      const writeups = (ctfVersion?.docs ?? [])
        .filter((d) => d.id !== 'intro')
        .map((d) => readWriteup(d, context.siteDir))
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      const posts = (allContent['docusaurus-plugin-content-blog']?.default?.blogPosts ?? [])
        .map(({metadata: m}) => ({
          title: m.title,
          description: m.description,
          permalink: m.permalink,
          date: new Date(m.date).toISOString().slice(0, 10),
          readingTime: Math.max(1, Math.round(m.readingTime || 1)),
          tags: m.tags.map((t) => ({label: t.label, permalink: t.permalink})),
        }))
        .sort((a, b) => b.date.localeCompare(a.date));

      actions.setGlobalData({writeups, posts});
    },
  };
}
