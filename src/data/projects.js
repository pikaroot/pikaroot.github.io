// Projects shown on the landing page. Add a repo here and the Projects
// section picks it up. Star/fork counts are a snapshot (last checked in the
// comment by each entry), since the page is a static build.
const projects = [
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
