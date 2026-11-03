import React, {useEffect, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import Reveal from '@site/src/components/Reveal';
import styles from './styles.module.css';

/* ------------------------------------------------------------------ */
/* Profile data — sourced from linkedin.com/in/limweixun.             */
/* Edit freely; the layout adapts to whatever you put here.           */
/* ------------------------------------------------------------------ */

const PROFILE = {
  name: 'Wei Xun Lim',
  alias: 'pikaroot',
  roles: [
    'Penetration Tester',
    'Web App Hacker',
    'AI / LLM Red Teamer',
    'CTF Player',
    'Challenge Author',
  ],
  location: 'Malaysia',
  company: 'Intertek NTA',
  blurb:
    "David here — a Malaysia-based offensive security practitioner. I break things on purpose: web application and AI/LLM security assessments by day, capture-the-flag by night. I author cryptography challenges for the local CTF scene and love turning tricky bugs into clear, actionable findings.",
};

const FOCUS = [
  {
    icon: '🕸️',
    title: 'Web Application Security',
    blurb:
      'Hunting authentication flaws, injection, broken access control and business-logic bugs across modern web apps and APIs.',
    tags: ['OWASP Top 10', 'API Security', 'Auth Bypass', 'Server-Side Injection'],
  },
  {
    icon: '🤖',
    title: 'AI / LLM Security',
    blurb:
      'Red-teaming LLM-powered applications and agents — prompt injection, jailbreaks, data exfiltration and insecure tool integrations.',
    tags: ['Prompt Injection', 'Jailbreaks', 'LLM Red Teaming', 'OWASP LLM Top 10'],
  },
  {
    icon: '⚔️',
    title: 'Offensive Red Teaming',
    blurb:
      'Chaining footholds into full domain compromise across Active Directory and internal infrastructure.',
    tags: ['Active Directory', 'Privilege Escalation', 'C2 / Evasion', 'Lateral Movement'],
  },
];

const STATS = [
  {value: 2, suffix: '×', label: 'CTF Champion'},
  {value: 3, suffix: '×', label: 'ASEAN Cyber Shield Finalist'},
  {value: 9, suffix: '+', label: 'Industry Certifications'},
  {value: 3.79, decimals: 2, suffix: '', label: 'Degree CGPA / 4.0'},
];

const TIMELINE = [
  {
    side: 'left',
    tag: 'Now',
    title: 'Penetration Tester',
    place: 'Intertek NTA · Kuala Lumpur',
    period: 'Present',
    points: [
      'Offensive security engagements across web, network and infrastructure.',
      'Translating findings into clear, actionable reports for clients.',
    ],
  },
  {
    side: 'right',
    tag: 'Community',
    title: 'CTF Challenge Author',
    place: 'RE:HACK',
    period: 'Volunteer',
    points: [
      'Authored cryptography challenges for Girls CTF 2024.',
      'Authored cryptography challenges for UMCS CTF 2025.',
    ],
  },
  {
    side: 'left',
    tag: 'Education',
    title: 'BSc (Hons) — First Class, Best Student Award',
    place: 'Asia Pacific University of Technology & Innovation (APU)',
    period: '2020 — 2023',
    points: [
      'CGPA 3.79 / 4.0 · Vice Chancellor’s List (1 of 16 selected).',
      'APU CTF Team · Forensic & Security Research Centre (FSEC-SS) committee.',
    ],
  },
];

const CERTS = [
  {name: 'OSCP+', org: 'OffSec', year: '2026'},
  {name: 'OSCP', org: 'OffSec', year: '2026'},
  {name: 'OSWP', org: 'OffSec', year: '2026'},
  {name: 'CRTL', org: 'Zero-Point Security', year: '2023'},
  {name: 'CRTO', org: 'Zero-Point Security', year: '2022'},
  {name: 'PNPT', org: 'TCM Security', year: '2022'},
  {name: 'CPSA', org: 'CREST', year: '2024'},
  {name: 'CRT', org: 'CREST', year: '2024'},
  {name: 'AZ-900', org: 'Microsoft Azure', year: '2022'},
];

const CTF = [
  {event: 'ASEAN Cyber Shield Hacking Contest', result: '2023 / 2024 / 2025 Finalist', year: '2023–25', gold: true},
  {event: 'PETRONAS Inter-University CTF', result: 'Champion', year: '2023', gold: true},
  {event: 'UTAR The Amazing CyberHunt', result: 'Champion', year: '2023', gold: true},
  {event: 'WargamesMY', result: '2nd Runner-Up', year: '2024'},
  {event: 'SIBER SIAGA Code Combat', result: '1st Runner-Up', year: '2023'},
  {event: 'BAT × APU iCTF', result: '1st Runner-Up · Best Write-Up', year: '2022'},
  {event: 'iHACK (Jeopardy Quals)', result: '2nd Runner-Up', year: '2022'},
  {event: 'iHACK (Attack & Defense Finals)', result: '7th place', year: '2022'},
  {event: 'TARUC CTF', result: '2nd Runner-Up', year: '2021'},
  {event: 'APU iCTF', result: '2nd Runner-Up', year: '2021'},
];

const SKILLS = [
  'Web Application Security',
  'API Security',
  'LLM / AI Red Teaming',
  'Prompt Injection',
  'Network Penetration Testing',
  'Active Directory / Red Teaming',
  'Cryptography',
  'Reverse Engineering',
  'Report Writing',
  'Python',
  'Linux',
];

const LANGUAGES = [
  {name: 'Chinese', level: 'Native', pct: 100},
  {name: 'English', level: 'Professional', pct: 85},
  {name: 'Malay', level: 'Working', pct: 55},
  {name: 'Japanese', level: 'Basic', pct: 30},
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

// Count a number up from 0 when it first scrolls into view.
function CountUp({value, decimals = 0, suffix = ''}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return undefined;
    }
    let raf;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.unobserve(el);
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          setDisplay(value * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      {threshold: 0.4},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                           */
/* ------------------------------------------------------------------ */

function Hero() {
  const avatar = useBaseUrl('/img/pikaroot.jpg');
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % PROFILE.roles.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <header className={styles.hero}>
      <div className={styles.blob} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      <div className={styles.heroInner}>
        {/* Left: identity + call to action */}
        <div className={styles.heroIntro}>
          <div className={styles.heroId}>
            <div className={styles.avatarWrap}>
              <span className={styles.avatarRing} aria-hidden="true" />
              <img className={styles.avatar} src={avatar} alt={PROFILE.name} />
            </div>
            <div>
              <p className={styles.kicker}>
                <span className={styles.statusDot} aria-hidden="true" />
                Available for offensive security work
              </p>
              <Heading as="h1" className={styles.name}>
                {PROFILE.name}
              </Heading>
              <span className={styles.alias}>@{PROFILE.alias}</span>
            </div>
          </div>

          <div className={styles.roleSwap} aria-live="polite">
            <span className={styles.rolePrompt}>~$</span>
            <span key={roleIdx} className={styles.role}>
              {PROFILE.roles[roleIdx]}
            </span>
            <span className={styles.caret} aria-hidden="true" />
          </div>

          <p className={styles.blurb}>{PROFILE.blurb}</p>

          <p className={styles.meta}>
            <span>📍 {PROFILE.location}</span>
            <span>💼 {PROFILE.company}</span>
          </p>

          <div className={styles.ctaRow}>
            <Link className={styles.ctaPrimary} to="/ctfs">
              View CTF Writeups
            </Link>
            <Link className={styles.ctaGhost} to="/blog">
              Read the Blog
            </Link>
            <Link
              className={styles.ctaGhost}
              href="https://www.linkedin.com/in/limweixun/">
              LinkedIn ↗
            </Link>
          </div>
        </div>

        {/* Right: terminal window */}
        <Terminal />
      </div>
    </header>
  );
}

const TERMINAL_LINES = [
  {type: 'cmd', text: 'whoami'},
  {type: 'out', text: 'wei_xun_lim — offensive security engineer @ Intertek NTA'},
  {type: 'cmd', text: 'cat ~/focus.txt'},
  {type: 'out', text: 'web_app_security   ai_llm_red_teaming   cryptography_ctf'},
  {type: 'cmd', text: 'sudo ./break_things.sh --scope web,ai,infra'},
  {type: 'ok', text: '[+] foothold acquired → turning bugs into clear findings'},
  {type: 'cmd', text: ''},
];

function Terminal() {
  // Reveal the lines one by one, like a live session.
  const [shown, setShown] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let timer;
    const start = () => {
      let i = 0;
      const step = () => {
        i += 1;
        setShown(i);
        if (i < TERMINAL_LINES.length) {
          timer = setTimeout(step, TERMINAL_LINES[i - 1].type === 'cmd' ? 650 : 420);
        }
      };
      step();
    };
    if (typeof IntersectionObserver === 'undefined') {
      setShown(TERMINAL_LINES.length);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.unobserve(el);
          start();
        }
      },
      {threshold: 0.3},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className={styles.terminal}>
      <div className={styles.termBar}>
        <span className={`${styles.termDot} ${styles.termRed}`} />
        <span className={`${styles.termDot} ${styles.termYellow}`} />
        <span className={`${styles.termDot} ${styles.termGreen}`} />
        <span className={styles.termTitle}>root@pikaroot: ~ — zsh</span>
      </div>
      <div className={styles.termBody}>
        {TERMINAL_LINES.slice(0, shown).map((line, i) => {
          const isLast = i === shown - 1 && i === TERMINAL_LINES.length - 1;
          if (line.type === 'cmd') {
            return (
              <div key={i} className={styles.termLine}>
                <span className={styles.termPrompt}>
                  root@pikaroot<span className={styles.termPath}>:~$</span>
                </span>{' '}
                <span className={styles.termCmd}>{line.text}</span>
                {isLast && <span className={styles.termCaret} aria-hidden="true" />}
              </div>
            );
          }
          return (
            <div
              key={i}
              className={`${styles.termOut} ${
                line.type === 'ok' ? styles.termOk : ''
              }`}>
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stats() {
  return (
    <section className={styles.section}>
      <div className={styles.statsGrid}>
        {STATS.map((s, i) => (
          <Reveal key={s.label} className={styles.statCard} delay={i * 90}>
            <div className={styles.statValue}>
              <CountUp value={s.value} decimals={s.decimals || 0} suffix={s.suffix} />
            </div>
            <div className={styles.statLabel}>{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({children, sub}) {
  return (
    <Reveal className={styles.sectionHead}>
      <Heading as="h2" className={styles.sectionTitle}>
        {children}
      </Heading>
      {sub && <p className={styles.sectionSub}>{sub}</p>}
    </Reveal>
  );
}

function Focus() {
  return (
    <section className={styles.section}>
      <SectionTitle sub="Where I spend most of my offensive security time.">
        Focus Areas
      </SectionTitle>
      <div className={styles.focusGrid}>
        {FOCUS.map((f, i) => (
          <Reveal key={f.title} className={styles.focusCard} delay={i * 110}>
            <span className={styles.focusIcon} aria-hidden="true">
              {f.icon}
            </span>
            <h3 className={styles.focusTitle}>{f.title}</h3>
            <p className={styles.focusBlurb}>{f.blurb}</p>
            <div className={styles.focusTags}>
              {f.tags.map((t) => (
                <span key={t} className={styles.focusTag}>
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className={styles.section}>
      <SectionTitle sub="Where I work, build and learn.">Journey</SectionTitle>
      <div className={styles.timeline}>
        <span className={styles.timelineLine} aria-hidden="true" />
        {TIMELINE.map((item, i) => (
          <Reveal
            key={item.title}
            className={`${styles.tlItem} ${
              item.side === 'right' ? styles.tlRight : styles.tlLeft
            }`}
            delay={i * 60}>
            <span className={styles.tlDot} aria-hidden="true" />
            <div className={styles.tlCard}>
              <span className={styles.tlTag}>{item.tag}</span>
              <h3 className={styles.tlTitle}>{item.title}</h3>
              <p className={styles.tlPlace}>{item.place}</p>
              <p className={styles.tlPeriod}>{item.period}</p>
              <ul className={styles.tlPoints}>
                {item.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Certs() {
  return (
    <section className={styles.section}>
      <SectionTitle sub="Offensive security, red teaming and cloud.">
        Certifications
      </SectionTitle>
      <div className={styles.certGrid}>
        {CERTS.map((c, i) => (
          <Reveal key={c.name} className={styles.certCard} delay={(i % 3) * 80}>
            <div className={styles.certName}>{c.name}</div>
            <div className={styles.certOrg}>{c.org}</div>
            <div className={styles.certYear}>{c.year}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Ctf() {
  return (
    <section className={styles.section}>
      <SectionTitle sub="A few highlights from the scoreboard.">
        CTF Trophy Cabinet
      </SectionTitle>
      <div className={styles.ctfGrid}>
        {CTF.map((c, i) => (
          <Reveal
            key={c.event + c.year}
            className={`${styles.ctfCard} ${c.gold ? styles.ctfGold : ''}`}
            delay={(i % 2) * 70}>
            <div className={styles.ctfTop}>
              <span className={styles.ctfResult}>
                {c.gold ? '🏆 ' : ''}
                {c.result}
              </span>
              <span className={styles.ctfYear}>{c.year}</span>
            </div>
            <div className={styles.ctfEvent}>{c.event}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SkillsAndLangs() {
  return (
    <section className={styles.section}>
      <div className={styles.twoCol}>
        <div>
          <SectionTitle>Toolkit</SectionTitle>
          <div className={styles.chips}>
            {SKILLS.map((s, i) => (
              <Reveal
                key={s}
                as="span"
                className={styles.chip}
                delay={i * 50}>
                {s}
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle>Languages</SectionTitle>
          <div className={styles.langs}>
            {LANGUAGES.map((l, i) => (
              <Reveal key={l.name} className={styles.lang} delay={i * 80}>
                <div className={styles.langHead}>
                  <span>{l.name}</span>
                  <span className={styles.langLevel}>{l.level}</span>
                </div>
                <div className={styles.langBar}>
                  <span
                    className={styles.langFill}
                    style={{'--pct': `${l.pct}%`}}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Outro() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.outro}>
        <h2 className={styles.outroTitle}>Let&apos;s connect</h2>
        <p className={styles.outroText}>
          Always happy to talk offensive security, CTFs, or crypto challenges.
        </p>
        <div className={styles.ctaRow}>
          <Link
            className={styles.ctaPrimary}
            href="https://www.linkedin.com/in/limweixun/">
            LinkedIn ↗
          </Link>
          <Link className={styles.ctaGhost} to="/ctfs">
            CTF Writeups →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default function About() {
  return (
    <Layout
      title="About Me"
      description="Wei Xun Lim (pikaroot) — penetration tester, red teamer and CTF player based in Malaysia.">
      <main className={styles.page}>
        <Hero />
        <Stats />
        <Focus />
        <Journey />
        <Certs />
        <Ctf />
        <SkillsAndLangs />
        <Outro />
      </main>
    </Layout>
  );
}
