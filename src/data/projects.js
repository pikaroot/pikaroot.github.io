// Projects shown on the landing page. Add a repo here and the Projects
// section picks it up. Star/fork counts are a snapshot (last checked in the
// comment by each entry), since the page is a static build.
// Optional `live`: URL of a running instance — adds an "Open live app" link.
export const KEVLAR_URL = 'https://pikaroot.tail583cf5.ts.net';

const projects = [
  {
    name: 'KEVlar',
    repo: 'pikaroot/KEVlar',
    url: 'https://github.com/pikaroot/KEVlar',
    live: KEVLAR_URL,
    description:
      'CVE, CISA KEV & lifecycle intelligence — search by CVE ID, branded name (Log4Shell, Heartbleed) or product version for live exploitation status, end-of-life checks and report-ready output.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    license: 'MIT',
    since: 2026,
    stars: 0, // checked 2026-11-20
    forks: 0,
    topics: ['cve', 'cisa-kev', 'vulnerability-management', 'threat-intelligence'],
    featured: true,
  },
  {
    name: 'cr4ckalysis',
    repo: 'pikaroot/cr4ckalysis',
    url: 'https://github.com/pikaroot/cr4ckalysis',
    description:
      'An interactive Python shell for hash analysis and password recovery — identifies ~60 hash types with their hashcat/John modes and drives the real crackers, on the standard library alone.',
    language: 'Python',
    languageColor: '#3572A5',
    license: 'MIT',
    since: 2022,
    stars: 12, // checked 2026-11-05
    forks: 2,
    topics: ['hash-cracker', 'password-cracker', 'cryptography', 'python3'],
    featured: true,
  },
];

export default projects;
