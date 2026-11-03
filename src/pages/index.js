import React, {useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import Reveal from '@site/src/components/Reveal';
import {generatePuzzle, getMalaysiaDateKey, msUntilMalaysiaMidnight} from '@site/src/lib/sudoku';
import styles from './index.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

// Derived numbers for the stats strip and the gallery tiles.
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

function Hero({stats, puzzle}) {
  const latestWriteup = stats.writeups[0];
  const latestPost = stats.posts[0];
  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>
            <span className={styles.prompt}>~/pikaroot</span> $ cat README.md
          </p>
          <Heading as="h1" className={styles.title}>
            Notes from the <span className={styles.accent}>offensive side</span>.
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
          <dl className={styles.stats}>
            {[
              [stats.writeups.length, 'writeups'],
              [stats.events, 'CTF events'],
              [stats.posts.length, 'blog posts'],
              [stats.years.length ? `${stats.years[0]}–${stats.years.at(-1).slice(2)}` : '—', 'and counting'],
            ].map(([value, label]) => (
              <div key={label} className={styles.stat}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
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
    </header>
  );
}

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
        <Reveal as={Link} to="/ctfs" className={clsx(styles.tile, styles.tileCtf)}>
          <span className={styles.tileIcon} aria-hidden="true">
            🚩
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
        </Reveal>

        <Reveal as={Link} to="/blog" className={clsx(styles.tile, styles.tileBlog)} delay={80}>
          <span className={styles.tileIcon} aria-hidden="true">
            ✍️
          </span>
          <h3 className={styles.tileTitle}>Blog</h3>
          <p className={styles.tileText}>
            {stats.posts.length} longer posts: event recaps, workshops, install guides and
            cheat sheets.
          </p>
          <span className={styles.tileGo}>Read the posts →</span>
        </Reveal>

        <Reveal as={Link} to="/sudoku" className={clsx(styles.tile, styles.tileSudoku)} delay={160}>
          <span className={styles.tileIcon} aria-hidden="true">
            🧩
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
        </Reveal>

        <Reveal as={Link} to="/about" className={clsx(styles.tile, styles.tileAbout)} delay={240}>
          <img className={styles.tileAvatar} src={avatar} alt="" />
          <div>
            <h3 className={styles.tileTitle}>About me</h3>
            <p className={styles.tileText}>
              Penetration tester, CTF player and challenge author. OSCP+, CRTO, CRTL and friends.
            </p>
            <span className={styles.tileGo}>Read more →</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Feed({stats}) {
  return (
    <section className={styles.section}>
      <SectionHead kicker="02 · changelog" title="Recently published" />
      <ol className={styles.feed}>
        {stats.feed.slice(0, 6).map((item, i) => (
          <Reveal as="li" key={item.permalink} delay={i * 60}>
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
      <SectionHead kicker="03 · grep -c" title="Topics I keep coming back to">
        Every CTF tag, sized by how many writeups use it.
      </SectionHead>
      <Reveal className={styles.cloud}>
        {stats.topics.map((t) => (
          <Link
            key={t.label}
            to={t.permalink}
            className={styles.topic}
            style={{'--weight': 0.85 + (t.count / max) * 0.75}}>
            #{t.label}
            <span className={styles.topicCount}>{t.count}</span>
          </Link>
        ))}
      </Reveal>
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
      <main className={styles.page}>
        <Hero stats={stats} puzzle={puzzle} />
        <Explore stats={stats} puzzle={puzzle} />
        <Feed stats={stats} />
        <Topics stats={stats} />
      </main>
    </Layout>
  );
}
