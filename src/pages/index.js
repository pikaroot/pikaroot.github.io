import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import Reveal from '@site/src/components/Reveal';
import CountUp from '@site/src/components/CountUp';
import {generatePuzzle, getMalaysiaDateKey, msUntilMalaysiaMidnight} from '@site/src/lib/sudoku';
import projects from '@site/src/data/projects';
import styles from './index.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

// Derived numbers for the stats band and the gallery tiles.
function useSiteStats() {
  const {writeups = [], posts = []} = usePluginData('site-index') || {};
  return useMemo(() => {
    const years = [...new Set(writeups.map((w) => w.date?.slice(0, 4)).filter(Boolean))].sort();
    const tagCounts = new Map();
    for (const w of writeups) {
      for (const t of w.tags) {
        const cur = tagCounts.get(t.label) || {...t, count: 0};
        cur.count++;
        tagCounts.set(t.label, cur);
      }
    }
    const topics = [...tagCounts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    const feed = [
      ...writeups.map((w) => ({...w, kind: 'writeup'})),
      ...posts.map((p) => ({...p, kind: 'post'})),
    ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return {
      writeups,
      posts,
      years,
      events: new Set(writeups.map((w) => w.event)).size,
      topics,
      feed,
    };
  }, [writeups, posts]);
}

// Today's easy puzzle, computed after mount (the date is the visitor's, not the build's).
function useTodaysPuzzle() {
  const {siteConfig} = useDocusaurusContext();
  const [puzzle, setPuzzle] = useState(null);
  useEffect(() => {
    const salt = String(siteConfig.customFields?.sudokuSalt || '');
    setPuzzle(generatePuzzle(getMalaysiaDateKey(), 'easy', salt).puzzle);
  }, [siteConfig]);
  return puzzle;
}

function useCountdown() {
  const [ms, setMs] = useState(null);
  useEffect(() => {
    const tick = () => setMs(msUntilMalaysiaMidnight());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (ms === null) return '--:--:--';
  const s = Math.floor(ms / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

function MiniBoard({puzzle, className}) {
  const cells = puzzle || new Array(81).fill(0);
  return (
    <div className={clsx(styles.mini, className)} aria-hidden="true">
      {cells.map((v, i) => (
        <span key={i} className={clsx(styles.miniCell, v && styles.miniGiven)}>
          {v || ''}
        </span>
      ))}
    </div>
  );
}

function Tags({tags, max = 3}) {
  return (
    <span className={styles.tags}>
      {tags.slice(0, max).map((t) => (
        <span key={t.label} className={styles.tag}>
          {t.label}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Intro: the wordmark draws itself, then the screen wipes away.       */
/* The whole timeline is CSS, so it can never get stuck; JS only lets  */
/* you skip it and remembers that it played (see headTags in config).  */
/* ------------------------------------------------------------------ */

const INTRO_KEY = 'pk-intro';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const introSeen = () => {
  try {
    return !!sessionStorage.getItem(INTRO_KEY);
  } catch (e) {
    return false;
  }
};

// Marks the intro as done: hides the overlay and drops the hero's start delay.
const markIntroSeen = () => document.documentElement.setAttribute('data-intro-seen', '');

function Intro() {
  const [skipped, setSkipped] = useState(false);

  // Coming back to the homepage within the app: skip it before the first paint.
  useIsoLayoutEffect(() => {
    if (introSeen()) markIntroSeen();
  }, []);

  useEffect(() => {
    if (introSeen()) return undefined;
    const remember = () => {
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch (e) {
        // storage unavailable: it simply plays again next time
      }
    };
    // Natural end: only remember it. Flipping the attribute now would shift
    // the hero's running animations.
    const timer = setTimeout(remember, 1900);
    let skipTimer;
    const skip = () => {
      clearTimeout(timer);
      remember();
      setSkipped(true);
      skipTimer = setTimeout(markIntroSeen, 380); // after the quick wipe
    };
    window.addEventListener('keydown', skip, {once: true});
    window.addEventListener('wheel', skip, {once: true, passive: true});
    window.addEventListener('pointerdown', skip, {once: true});
    return () => {
      clearTimeout(timer);
      clearTimeout(skipTimer);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, []);

  return (
    <div className={clsx(styles.intro, skipped && styles.introSkipped)} aria-hidden="true">
      <svg className={styles.introMark} viewBox="0 0 520 110">
        <text x="50%" y="78" textAnchor="middle">
          pikaroot
        </text>
      </svg>
      <span className={styles.introBar} />
      <span className={styles.introHint}>~/ loading notes</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

const TITLE = [
  ['From'],
  ['recon'],
  ['to'],
  ['root.', true],
];

// recon → root, drawn left to right like a route up a wall
const ROUTE = 'M40 95 C 140 95, 200 40, 300 40 S 460 88, 560 88 S 740 30, 840 30 S 1060 72, 1160 72';
const NODES = [
  {x: 40, y: 95, label: 'recon', below: true},
  {x: 300, y: 40, label: 'foothold'},
  {x: 560, y: 88, label: 'lateral', below: true},
  {x: 840, y: 30, label: 'privesc'},
  {x: 1160, y: 72, label: 'root #', root: true, below: true},
];

function AttackPath() {
  return (
    <svg className={styles.route} viewBox="0 0 1200 130" aria-hidden="true">
      <path className={styles.routeGhost} d={ROUTE} />
      <path className={styles.routeLine} d={ROUTE} pathLength="1" />
      {NODES.map((n, i) => (
        <g
          key={n.label}
          className={clsx(styles.node, n.root && styles.nodeRoot)}
          style={{'--n': i}}
          transform={`translate(${n.x} ${n.y})`}>
          {n.root && <circle className={styles.nodePulse} r="9" />}
          <circle className={styles.nodeDot} r="7" />
          <text y={n.below ? 30 : -18} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Hero({stats, puzzle}) {
  const latestWriteup = stats.writeups[0];
  const latestPost = stats.posts[0];
  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.heroInner}>
        <div>
          <p className={styles.kicker}>
            <span className={styles.prompt}>~/pikaroot</span> ${' '}
            <span className={styles.typed}>cat README.md</span>
          </p>
          <Heading as="h1" className={styles.title}>
            {TITLE.map(([word, accent], i) => (
              <React.Fragment key={word}>
                <span className={styles.wordMask}>
                  <span className={clsx(styles.word, accent && styles.accent)} style={{'--i': i}}>
                    {word}
                  </span>
                </span>{' '}
              </React.Fragment>
            ))}
          </Heading>
          <p className={styles.lead}>
            CTF writeups, security notes and a daily sudoku, kept by a penetration tester and
            CTF player from Malaysia. Everything I break, I try to write down.
          </p>
          <div className={styles.ctas}>
            <Link className={styles.ctaPrimary} to="/ctfs">
              Browse writeups →
            </Link>
            <Link className={styles.ctaGhost} to="/blog">
              Read the blog
            </Link>
            <Link className={styles.ctaGhost} to="/about">
              About me
            </Link>
          </div>
        </div>

        {/* A fanned deck of "what's new" cards; spreads out on hover */}
        <div className={styles.deck}>
          {latestPost && (
            <Link to={latestPost.permalink} className={clsx(styles.card, styles.cardBack)}>
              <span className={styles.cardKind}>Latest post</span>
              <span className={styles.cardTitle}>{latestPost.title}</span>
              <span className={styles.cardMeta}>
                {formatDate(latestPost.date)} · {latestPost.readingTime} min read
              </span>
              <span className={styles.cardDesc}>{latestPost.description}</span>
            </Link>
          )}
          <Link to="/sudoku" className={clsx(styles.card, styles.cardMid)}>
            <span className={styles.cardKind}>Today&apos;s sudoku</span>
            <MiniBoard puzzle={puzzle} />
            <span className={styles.cardMeta}>Easy · Medium · Hard · Killer</span>
          </Link>
          {latestWriteup && (
            <Link to={latestWriteup.permalink} className={clsx(styles.card, styles.cardFront)}>
              <span className={styles.cardKind}>Latest writeup</span>
              <span className={styles.cardEvent}>{latestWriteup.event}</span>
              <span className={styles.cardTitle}>{latestWriteup.title}</span>
              <span className={styles.cardMeta}>{formatDate(latestWriteup.date)}</span>
              <span className={styles.cardDesc}>{latestWriteup.description}</span>
              <Tags tags={latestWriteup.tags} />
            </Link>
          )}
        </div>
      </div>

      <div className={styles.routeWrap}>
        <AttackPath />
      </div>

      <a className={styles.scrollCue} href="#numbers" aria-label="Scroll down">
        <span className={styles.chevron} aria-hidden="true" />
        scroll
      </a>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Full-bleed bands                                                   */
/* ------------------------------------------------------------------ */

function Numbers({stats}) {
  const items = [
    [stats.writeups.length, 'Writeups'],
    [stats.events, 'CTF events'],
    [stats.posts.length, 'Blog posts'],
    [stats.years.length, 'Years of notes'],
  ];
  return (
    <section id="numbers" className={clsx(styles.band, styles.numbers)}>
      <div className={styles.bandInner}>
        {items.map(([value, label], i) => (
          <Reveal key={label} className={styles.number} delay={i * 130}>
            <span className={styles.numberValue}>
              <CountUp value={value} duration={1600} />
            </span>
            <span className={styles.numberLabel}>{label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// A waveform that keeps settling toward silence, next to the quote.
const WAVE = Array.from({length: 48}, (_, i) => {
  const fade = 1 - i / 60; // louder on the left, quieter to the right
  return {
    amp: (0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45))) * fade,
    delay: -((i * 137) % 1100) / 1000,
  };
});

function Quote() {
  return (
    <section className={clsx(styles.band, styles.quoteBand)}>
      <div className={styles.quoteSticky}>
        <Reveal as="figure" variant="left" className={styles.quote}>
          <blockquote>The quieter you become, the more you are able to hear.</blockquote>
          <figcaption>— the Kali Linux motto</figcaption>
        </Reveal>
        <Reveal variant="right" delay={200} className={styles.wave} aria-hidden="true">
          {WAVE.map((b, i) => (
            <span key={i} style={{'--amp': b.amp.toFixed(3), animationDelay: `${b.delay}s`}} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                           */
/* ------------------------------------------------------------------ */

function SectionHead({kicker, title, children}) {
  return (
    <Reveal className={styles.sectionHead}>
      <p className={styles.sectionKicker}>{kicker}</p>
      <Heading as="h2" className={styles.sectionTitle}>
        {title}
      </Heading>
      {children && <p className={styles.sectionSub}>{children}</p>}
    </Reveal>
  );
}

function Explore({stats, puzzle}) {
  const avatar = useBaseUrl('/img/pikaroot.jpg');
  const countdown = useCountdown();
  return (
    <section className={styles.section}>
      <SectionHead kicker="01 · explore" title="What's on this site">
        Four corners of the notebook. Pick one.
      </SectionHead>
      <div className={styles.bento}>
        <Reveal variant="left" className={styles.areaCtf}>
          <Link to="/ctfs" className={clsx(styles.tile, styles.tileCtf)}>
            <span className={styles.tileIcon} aria-hidden="true">
              ~/ctfs
            </span>
            <h3 className={styles.tileTitle}>CTF Writeups</h3>
            <p className={styles.tileText}>
              {stats.writeups.length} step-by-step solutions from {stats.events} competitions — crypto,
              forensics, web, hardware and more, sorted by year.
            </p>
            <div className={styles.yearRow}>
              {[...stats.years].reverse().map((y) => (
                <span key={y} className={styles.year}>
                  {y}
                  <small>{stats.writeups.filter((w) => w.date?.startsWith(y)).length}</small>
                </span>
              ))}
            </div>
            <ul className={styles.miniList}>
              {stats.writeups.slice(0, 5).map((w) => (
                <li key={w.permalink}>
                  <span className={styles.miniEvent}>{w.event}</span>
                  {w.title}
                </li>
              ))}
            </ul>
            <span className={styles.tileGo}>Open the archive →</span>
          </Link>
        </Reveal>

        <Reveal variant="right" className={styles.areaBlog} delay={120}>
          <Link to="/blog" className={styles.tile}>
            <span className={styles.tileIcon} aria-hidden="true">
              ~/blog
            </span>
            <h3 className={styles.tileTitle}>Blog</h3>
            <p className={styles.tileText}>
              {stats.posts.length} longer posts: event recaps, workshops, install guides and
              cheat sheets.
            </p>
            <span className={styles.tileGo}>Read the posts →</span>
          </Link>
        </Reveal>

        <Reveal variant="right" className={styles.areaSudoku} delay={240}>
          <Link to="/sudoku" className={clsx(styles.tile, styles.tileSudoku)}>
            <span className={styles.tileIcon} aria-hidden="true">
              ~/sudoku
            </span>
            <h3 className={styles.tileTitle}>Daily Sudoku</h3>
            <p className={styles.tileText}>
              Fresh classic and killer puzzles every day at 12:00am Malaysia Time, graded by the
              techniques they need.
            </p>
            <MiniBoard puzzle={puzzle} className={styles.tileBoard} />
            <span className={styles.countdown}>
              next puzzle in <strong>{countdown}</strong>
            </span>
            <span className={styles.tileGo}>Play today&apos;s →</span>
          </Link>
        </Reveal>

        <Reveal className={styles.areaAbout} delay={360}>
          <Link to="/about" className={clsx(styles.tile, styles.tileAbout)}>
            <img className={styles.tileAvatar} src={avatar} alt="" />
            <div>
              <h3 className={styles.tileTitle}>About me</h3>
              <p className={styles.tileText}>
                Penetration tester, CTF player and challenge author. OSCP+, CRTO, CRTL and friends.
              </p>
              <span className={styles.tileGo}>Read more →</span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Projects() {
  if (!projects.length) return null;
  return (
    <section className={styles.section}>
      <SectionHead kicker="02 · ~/projects" title="Things I've built">
        Open-source tools from my offensive security work.
      </SectionHead>
      <div className={styles.projectGrid}>
        {projects.map((p, i) => (
          <Reveal
            as="article"
            key={p.repo}
            variant="up"
            delay={i * 100}
            className={clsx(styles.project, p.featured && styles.projectFeatured)}>
            <div className={styles.projectBar} aria-hidden="true">
              <span className={styles.projectDots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.projectRepo}>{p.repo}</span>
            </div>
            <div className={styles.projectBody}>
              <Link to={p.url} className={styles.projectName}>
                {p.name}
                <span className={styles.projectExt} aria-hidden="true">
                  ↗
                </span>
              </Link>
              <p className={styles.projectDesc}>{p.description}</p>
              {p.topics?.length > 0 && (
                <div className={styles.projectTopics}>
                  {p.topics.map((t) => (
                    <span key={t} className={styles.projectTopic}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.projectMeta}>
                {p.language && (
                  <span className={styles.projectStat}>
                    <span
                      className={styles.langDot}
                      style={{background: p.languageColor || 'var(--ctp-overlay1)'}}
                    />
                    {p.language}
                  </span>
                )}
                {typeof p.stars === 'number' && (
                  <span className={styles.projectStat}>★ {p.stars}</span>
                )}
                {typeof p.forks === 'number' && (
                  <span className={styles.projectStat}>⑂ {p.forks}</span>
                )}
                {p.license && <span className={styles.projectStat}>{p.license}</span>}
                {p.since && <span className={styles.projectStat}>since {p.since}</span>}
              </div>
              {p.live && (
                <Link to={p.live} className={styles.projectGo}>
                  Open live app →
                </Link>
              )}
              <Link to={p.url} className={styles.projectGo}>
                View on GitHub →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Feed({stats}) {
  return (
    <section className={styles.section}>
      <SectionHead kicker="03 · changelog" title="Recently published" />
      <ol className={styles.feed}>
        {stats.feed.slice(0, 6).map((item, i) => (
          <Reveal as="li" key={item.permalink} variant="left" delay={i * 80}>
            <Link to={item.permalink} className={styles.feedItem}>
              <time className={styles.feedDate} dateTime={item.date}>
                {formatDate(item.date)}
              </time>
              <span className={clsx(styles.badge, item.kind === 'post' && styles.badgePost)}>
                {item.kind === 'post' ? 'post' : 'writeup'}
              </span>
              <span className={styles.feedTitle}>
                {item.kind === 'writeup' && <span className={styles.feedEvent}>{item.event} /</span>}{' '}
                {item.title}
              </span>
              <Tags tags={item.tags} max={2} />
              <span className={styles.feedArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Topics({stats}) {
  const max = stats.topics[0]?.count || 1;
  return (
    <section className={styles.section}>
      <SectionHead kicker="04 · grep -c" title="Topics I keep coming back to">
        Every CTF tag, sized by how many writeups use it.
      </SectionHead>
      <div className={styles.cloud}>
        {stats.topics.map((t, i) => (
          <Reveal as="span" key={t.label} variant="zoom" delay={i * 60}>
            <Link
              to={t.permalink}
              className={styles.topic}
              style={{'--weight': 0.85 + (t.count / max) * 0.75}}>
              #{t.label}
              <span className={styles.topicCount}>{t.count}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const stats = useSiteStats();
  const puzzle = useTodaysPuzzle();
  return (
    <Layout
      title="Offensive security notes"
      description="CTF writeups, security notes and a daily sudoku by pikaroot.">
      <Intro />
      <main className={styles.page}>
        <Hero stats={stats} puzzle={puzzle} />
        <Numbers stats={stats} />
        <Explore stats={stats} puzzle={puzzle} />
        <Projects />
        <Quote />
        <Feed stats={stats} />
        <Topics stats={stats} />
      </main>
    </Layout>
  );
}
