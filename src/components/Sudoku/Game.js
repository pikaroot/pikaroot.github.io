import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  DIFFICULTIES,
  generatePuzzle,
  getMalaysiaDateKey,
  hashString,
  msUntilMalaysiaMidnight,
} from '../../lib/sudoku';
import {generateKiller} from '../../lib/killer';
import Cell from './Cell';
import Settings, {DEFAULT_PREFS} from './Settings';
import styles from './styles.module.css';

const PREFS_KEY = 'sudoku-prefs';

// Cells sharing a row, column or box with each cell.
const PEERS = Array.from({length: 81}, (_, i) => {
  const r = (i / 9) | 0;
  const c = i % 9;
  const out = [];
  for (let j = 0; j < 81; j++) {
    if (j === i) continue;
    const rj = (j / 9) | 0;
    const cj = j % 9;
    if (
      r === rj ||
      c === cj ||
      (Math.floor(r / 3) === Math.floor(rj / 3) && Math.floor(c / 3) === Math.floor(cj / 3))
    ) {
      out.push(j);
    }
  }
  return out;
});

const blank = () => ({
  entries: new Array(81).fill(0),
  notes: new Array(81).fill(0),
  elapsed: 0,
});
const BLANK = blank();

function loadPrefs() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PREFS_KEY) || 'null');
    if (parsed && typeof parsed === 'object') {
      const prefs = {...DEFAULT_PREFS, ...parsed};
      if (!['classic', 'killer'].includes(prefs.mode)) prefs.mode = DEFAULT_PREFS.mode;
      if (!DIFFICULTIES[prefs.difficulty]) prefs.difficulty = DEFAULT_PREFS.difficulty;
      return prefs;
    }
  } catch (e) {
    // storage unavailable
  }
  return DEFAULT_PREFS;
}

function savePrefs(prefs) {
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    // ignore
  }
}

const progressKey = (dateKey, variant, id) => `sudoku:${dateKey}:${variant}:${id}`;

function loadProgress(dateKey, variant, id) {
  try {
    const raw = window.localStorage.getItem(progressKey(dateKey, variant, id));
    const p = raw ? JSON.parse(raw) : null;
    if (p && p.entries?.length === 81 && p.notes?.length === 81) {
      return {entries: p.entries, notes: p.notes, elapsed: Number(p.elapsed) || 0};
    }
  } catch (e) {
    // fall through
  }
  return blank();
}

function saveProgress(dateKey, variant, id, p) {
  try {
    window.localStorage.setItem(
      progressKey(dateKey, variant, id),
      JSON.stringify({entries: p.entries, notes: p.notes, elapsed: p.elapsed}),
    );
  } catch (e) {
    // ignore
  }
}

// Keep only today's saved puzzles.
function pruneOld(dateKey) {
  try {
    const ls = window.localStorage;
    for (let i = ls.length - 1; i >= 0; i--) {
      const k = ls.key(i);
      if (k && k.startsWith('sudoku:') && !k.startsWith(`sudoku:${dateKey}:`)) ls.removeItem(k);
    }
  } catch (e) {
    // ignore
  }
}

const cacheKey = (dateKey, salt) =>
  `sudoku:${dateKey}:cache-killer:${hashString(salt).toString(36)}`;

function readCachedKiller(dateKey, salt) {
  try {
    const g = JSON.parse(window.localStorage.getItem(cacheKey(dateKey, salt)) || 'null');
    if (g && g.kind === 'killer' && g.solution?.length === 81 && g.cageOf?.length === 81) return g;
  } catch (e) {
    // ignore
  }
  return null;
}

function writeCachedKiller(dateKey, salt, game) {
  try {
    window.localStorage.setItem(cacheKey(dateKey, salt), JSON.stringify(game));
  } catch (e) {
    // ignore
  }
}

function formatTime(total) {
  const h = Math.floor(total / 3600);
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
}

function Countdown() {
  const [ms, setMs] = useState(() => msUntilMalaysiaMidnight());
  useEffect(() => {
    const id = setInterval(() => setMs(msUntilMalaysiaMidnight()), 1000);
    return () => clearInterval(id);
  }, []);
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <strong className={styles.tabular}>
      {pad(Math.floor(total / 3600))}:{pad(Math.floor((total % 3600) / 60))}:{pad(total % 60)}
    </strong>
  );
}

function SolvedDialog({time, label, onClose}) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sudoku-solved-title"
        onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogEmoji} aria-hidden="true">
          🎉
        </div>
        <h2 id="sudoku-solved-title" className={styles.dialogTitle}>
          Puzzle solved!
        </h2>
        <p className={styles.dialogText}>
          You finished today's {label} puzzle in <strong>{time}</strong>.
        </p>
        <p className={styles.hint}>New puzzles arrive at 12:00am Malaysia Time.</p>
        <button ref={closeRef} className="button button--primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function Board({game, dateKey, variant, prefs, setPref, resetPrefs}) {
  const killer = game.kind === 'killer';
  const [progress, setProgress] = useState(() => loadProgress(dateKey, variant, game.id));
  const [selected, setSelected] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    saveProgress(dateKey, variant, game.id, progress);
  }, [progress, dateKey, variant, game.id]);

  const update = setProgress;

  const values = useMemo(
    () => game.puzzle.map((v, i) => v || progress.entries[i] || 0),
    [game.puzzle, progress.entries],
  );
  const solved = useMemo(
    () => values.every((v, i) => v === game.solution[i]),
    [values, game.solution],
  );

  // Pop up once when the puzzle becomes solved (not when reopening a solved one).
  const wasSolved = useRef(solved);
  useEffect(() => {
    if (solved && !wasSolved.current) setShowCongrats(true);
    wasSolved.current = solved;
  }, [solved]);
  const closeCongrats = useCallback(() => {
    setShowCongrats(false);
    gridRef.current?.focus();
  }, []);

  // Timer: counts seconds while the puzzle is open, visible and unsolved.
  const running = !solved && !revealed;
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      if (!document.hidden) update((p) => ({...p, elapsed: p.elapsed + 1}));
    }, 1000);
    return () => clearInterval(id);
  }, [running, update]);

  // Killer layout: cage outline sides and the sum label cell.
  const cageInfo = useMemo(() => {
    if (!game.cages) return null;
    const edges = new Array(81).fill(0);
    const sums = new Array(81).fill(0);
    for (let i = 0; i < 81; i++) {
      const g = game.cageOf[i];
      if (g < 0) continue;
      const r = (i / 9) | 0;
      const c = i % 9;
      if (r === 0 || game.cageOf[i - 9] !== g) edges[i] |= 1;
      if (c === 8 || game.cageOf[i + 1] !== g) edges[i] |= 2;
      if (r === 8 || game.cageOf[i + 9] !== g) edges[i] |= 4;
      if (c === 0 || game.cageOf[i - 1] !== g) edges[i] |= 8;
    }
    game.cages.forEach((cg) => {
      sums[cg.cells[0]] = cg.sum;
    });
    return {edges, sums};
  }, [game]);

  // Cells sharing a row/column/box (or cage) with `i`.
  const related = useCallback(
    (i) => {
      const set = new Set(PEERS[i]);
      const g = game.cageOf ? game.cageOf[i] : -1;
      if (g >= 0) game.cages[g].cells.forEach((j) => j !== i && set.add(j));
      return set;
    },
    [game],
  );

  const conflicts = useMemo(() => {
    const bad = new Set();
    for (let i = 0; i < 81; i++) {
      const v = values[i];
      if (!v) continue;
      if (PEERS[i].some((j) => values[j] === v)) bad.add(i);
    }
    if (game.cages) {
      for (const cg of game.cages) {
        let sum = 0;
        let filled = 0;
        const seen = {};
        for (const i of cg.cells) {
          const v = values[i];
          if (!v) continue;
          sum += v;
          filled++;
          if (seen[v] !== undefined) {
            bad.add(i);
            bad.add(seen[v]);
          } else {
            seen[v] = i;
          }
        }
        if (sum > cg.sum || (filled === cg.cells.length && sum !== cg.sum)) {
          cg.cells.forEach((i) => values[i] && bad.add(i));
        }
      }
    }
    return bad;
  }, [values, game]);

  const digitCounts = useMemo(() => {
    const counts = new Array(10).fill(0);
    values.forEach((v) => counts[v]++);
    return counts;
  }, [values]);

  const onSelect = useCallback((i) => {
    setSelected(i);
    gridRef.current?.focus();
  }, []);

  const canEdit = selected !== null && !game.puzzle[selected] && !revealed;

  const enterDigit = useCallback(
    (digit, asNote) => {
      if (!canEdit) return;
      const i = selected;
      update((p) => {
        const entries = p.entries.slice();
        const notes = p.notes.slice();
        if (asNote) {
          if (entries[i]) return p;
          notes[i] ^= 1 << (digit - 1);
        } else if (entries[i] === digit) {
          entries[i] = 0;
        } else {
          entries[i] = digit;
          notes[i] = 0;
          if (prefs.autoClearNotes) {
            const bit = ~(1 << (digit - 1));
            related(i).forEach((j) => {
              notes[j] &= bit;
            });
          }
        }
        return {...p, entries, notes};
      });
    },
    [canEdit, selected, update, prefs.autoClearNotes, related],
  );

  const erase = useCallback(() => {
    if (!canEdit) return;
    const i = selected;
    update((p) => {
      const entries = p.entries.slice();
      const notes = p.notes.slice();
      if (entries[i]) entries[i] = 0;
      else notes[i] = 0;
      return {...p, entries, notes};
    });
  }, [canEdit, selected, update]);

  const fillNotes = () => {
    if (revealed) return;
    update((p) => {
      const v = game.puzzle.map((g, i) => g || p.entries[i]);
      const notes = v.map((val, i) => {
        if (val) return 0;
        let mask = 0x1ff;
        related(i).forEach((j) => {
          if (v[j]) mask &= ~(1 << (v[j] - 1));
        });
        return mask;
      });
      return {...p, notes};
    });
  };

  const onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const shiftDigit = e.shiftKey && /^Digit[1-9]$/.test(e.code);
    if (shiftDigit) {
      enterDigit(Number(e.code.slice(5)), true);
      e.preventDefault();
    } else if (/^[1-9]$/.test(e.key)) {
      enterDigit(Number(e.key), noteMode);
      e.preventDefault();
    } else if (['Backspace', 'Delete', '0'].includes(e.key)) {
      erase();
      e.preventDefault();
    } else if (e.key === 'n' || e.key === 'N' || e.key === 'p' || e.key === 'P') {
      setNoteMode((m) => !m);
      e.preventDefault();
    } else if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      setSelected((cur) => {
        if (cur === null) return 0;
        let r = (cur / 9) | 0;
        let c = cur % 9;
        if (e.key === 'ArrowUp') r = (r + 8) % 9;
        if (e.key === 'ArrowDown') r = (r + 1) % 9;
        if (e.key === 'ArrowLeft') c = (c + 8) % 9;
        if (e.key === 'ArrowRight') c = (c + 1) % 9;
        return r * 9 + c;
      });
    }
  };

  const reset = () => {
    setProgress(blank());
    setShowMistakes(false);
    setRevealed(false);
  };

  const shown = revealed ? game.solution : values;
  const selValue = selected !== null ? shown[selected] : 0;
  const relatedSet = useMemo(
    () => (selected !== null && prefs.highlightRelated ? new Set([...PEERS[selected], selected]) : null),
    [selected, prefs.highlightRelated],
  );
  const selCage = selected !== null && game.cageOf ? game.cageOf[selected] : -1;

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div
          ref={gridRef}
          className={styles.grid}
          tabIndex={0}
          onKeyDown={onKeyDown}
          role="grid"
          aria-label={killer ? 'Killer sudoku grid' : 'Sudoku grid'}>
          {shown.map((v, i) => {
            const given = game.puzzle[i] !== 0;
            const g = game.cageOf ? game.cageOf[i] : -1;
            return (
              <Cell
                key={i}
                index={i}
                value={v}
                notes={revealed ? 0 : progress.notes[i]}
                given={given}
                killer={killer}
                inCage={g >= 0}
                sum={cageInfo ? cageInfo.sums[i] : 0}
                edges={cageInfo ? cageInfo.edges[i] : 0}
                selected={selected === i}
                related={!!relatedSet && relatedSet.has(i)}
                sameDigit={prefs.highlightSame && !!selValue && v === selValue}
                sameCage={prefs.highlightCage && g >= 0 && g === selCage}
                wrong={
                  !revealed &&
                  !given &&
                  !!v &&
                  ((prefs.showConflicts && conflicts.has(i)) ||
                    (showMistakes && v !== game.solution[i]))
                }
                onSelect={onSelect}
              />
            );
          })}
        </div>

        <div className={styles.pad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <button
              key={d}
              className={clsx(
                styles.padKey,
                noteMode && styles.padNote,
                prefs.dimDone && digitCounts[d] >= 9 && styles.padDone,
              )}
              onClick={() => enterDigit(d, noteMode)}>
              {d}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={clsx('button button--sm', noteMode ? 'button--primary' : 'button--secondary')}
            aria-pressed={noteMode}
            onClick={() => setNoteMode((m) => !m)}
            title="Toggle pencil marks (N)">
            ✎ Pencil {noteMode ? 'on' : 'off'}
          </button>
          <button className="button button--sm button--secondary" onClick={erase}>
            ⌫ Erase
          </button>
          <button className="button button--sm button--secondary" onClick={fillNotes}>
            Fill pencil marks
          </button>
        </div>

        <div className={styles.actions}>
          <button className="button button--sm button--secondary" onClick={() => setShowMistakes((m) => !m)}>
            {showMistakes ? 'Hide mistakes' : 'Check mistakes'}
          </button>
          <button
            className="button button--sm button--secondary"
            onClick={() => {
              setRevealed(true);
              setShowMistakes(false);
            }}>
            Show solution
          </button>
          <button className="button button--sm button--secondary" onClick={reset}>
            Reset
          </button>
        </div>

      </div>

      <aside className={styles.side}>
        <div className={styles.info}>
          <div className={styles.infoTitle}>{killer ? 'Daily killer' : `Daily ${prefs.difficulty}`}</div>
          <div className={styles.infoDate}>{dateKey} · Malaysia Time</div>
          {solved && !revealed && (
            <div className={styles.solved}>✅ Solved in {formatTime(progress.elapsed)}</div>
          )}
          {prefs.showTimer && (
            <div className={styles.timer} aria-label="Time spent">
              ⏱ {formatTime(progress.elapsed)}
            </div>
          )}
          {prefs.showCountdown && (
            <div className={styles.infoDate}>
              New puzzles in <Countdown />
            </div>
          )}
          {killer && (
            <p className={styles.hint}>
              Digits in a dashed cage add up to its number and never repeat. No digits are
              pre-filled.
            </p>
          )}
        </div>

        <Settings prefs={prefs} setPref={setPref} reset={resetPrefs} mode={prefs.mode} />

        <p className={styles.hint}>
          Keys: 1–9 enter a digit · Shift+1–9 or N toggles pencil marks · Backspace erases · arrows
          move
        </p>
      </aside>

      {showCongrats && (
        <SolvedDialog
          time={formatTime(progress.elapsed)}
          label={killer ? 'killer' : prefs.difficulty}
          onClose={closeCongrats}
        />
      )}
    </div>
  );
}

export default function Game() {
  const {siteConfig} = useDocusaurusContext();
  const salt = String(siteConfig.customFields?.sudokuSalt || '');

  const [prefs, setPrefs] = useState(loadPrefs);
  const [dateKey, setDateKey] = useState(() => getMalaysiaDateKey());
  const killer = prefs.mode === 'killer';
  const variant = killer ? 'killer' : prefs.difficulty;

  const setPref = useCallback((key, value) => {
    setPrefs((prev) => {
      const next = {...prev, [key]: value};
      savePrefs(next);
      return next;
    });
  }, []);
  const resetPrefs = () => {
    // keep which puzzle is open and whether the panel is open; only restore the toggles
    const next = {
      ...DEFAULT_PREFS,
      mode: prefs.mode,
      difficulty: prefs.difficulty,
      settingsOpen: prefs.settingsOpen,
    };
    savePrefs(next);
    setPrefs(next);
  };

  // New day at 12:00am Malaysia Time.
  useEffect(() => {
    const id = setInterval(() => setDateKey(getMalaysiaDateKey()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => pruneOld(dateKey), [dateKey]);

  const classicGame = useMemo(
    () => (killer ? null : generatePuzzle(dateKey, prefs.difficulty, salt)),
    [killer, dateKey, prefs.difficulty, salt],
  );

  // Killer generation can take a moment: run it after paint and cache it for the day.
  const killerKey = `${dateKey}|${salt}`;
  const [killerGame, setKillerGame] = useState(null);
  useEffect(() => {
    if (!killer || killerGame?.key === killerKey) return undefined;
    const cached = readCachedKiller(dateKey, salt);
    if (cached) {
      setKillerGame({key: killerKey, game: cached});
      return undefined;
    }
    const timer = setTimeout(() => {
      const game = generateKiller(dateKey, salt);
      writeCachedKiller(dateKey, salt, game);
      setKillerGame({key: killerKey, game});
    }, 30);
    return () => clearTimeout(timer);
  }, [killer, killerKey, killerGame, dateKey, salt]);

  const game = killer ? (killerGame?.key === killerKey ? killerGame.game : null) : classicGame;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs} role="tablist" aria-label="Puzzle type">
        {[
          ['classic', 'Classic'],
          ['killer', 'Killer'],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={prefs.mode === key}
            className={clsx(styles.tab, prefs.mode === key && styles.tabActive)}
            onClick={() => setPref('mode', key)}>
            {label}
          </button>
        ))}
        {!killer && <span className={styles.tabDivider} aria-hidden="true" />}
        {!killer &&
          Object.entries(DIFFICULTIES).map(([key, {label}]) => (
            <button
              key={key}
              role="tab"
              aria-selected={prefs.difficulty === key}
              className={clsx(styles.tab, styles.tabSmall, prefs.difficulty === key && styles.tabActive)}
              onClick={() => setPref('difficulty', key)}>
              {label}
            </button>
          ))}
      </div>

      {game ? (
        <Board
          key={`${dateKey}:${variant}:${game.id}`}
          game={game}
          dateKey={dateKey}
          variant={variant}
          prefs={prefs}
          setPref={setPref}
          resetPrefs={resetPrefs}
        />
      ) : (
        <p className={styles.loading}>Generating today's killer puzzle…</p>
      )}
    </div>
  );
}
