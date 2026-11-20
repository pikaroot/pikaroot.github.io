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
import {ordinal, reportSolve} from '../../lib/solveCounter';
import Cell from './Cell';
import Settings, {DEFAULT_PREFS} from './Settings';
import styles from './styles.module.css';

const PREFS_KEY = 'sudoku-prefs';
const HISTORY_LIMIT = 200;

const sameCells = (a, b) => a === b || a.every((v, i) => v === b[i]);

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

function SolvedDialog({time, label, solveStats, onClose}) {
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
        {solveStats && (
          <p className={styles.dialogText}>
            🏅 You're the <strong>{ordinal(solveStats.rank)}</strong> person to solve it today
            {solveStats.total > solveStats.rank && <> ({solveStats.total} solvers so far)</>}.
          </p>
        )}
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
  const [solveStats, setSolveStats] = useState(null);
  const [paused, setPaused] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    saveProgress(dateKey, variant, game.id, progress);
  }, [progress, dateKey, variant, game.id]);

  const update = setProgress;

  // Undo history: snapshots of entries/notes taken before each edit. Read and
  // written through refs so quick successive edits never see stale state.
  const [history, setHistory] = useState([]);
  const historyRef = useRef(history);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const pushHistory = (snap) => {
    historyRef.current = [...historyRef.current.slice(-(HISTORY_LIMIT - 1)), snap];
    setHistory(historyRef.current);
  };

  // Apply `change(progress) -> {entries, notes}`; records an undo step if it changed anything.
  const edit = useCallback((change) => {
    const p = progressRef.current;
    const next = change(p);
    if (!next || (sameCells(next.entries, p.entries) && sameCells(next.notes, p.notes))) return;
    pushHistory({entries: p.entries, notes: p.notes});
    progressRef.current = {...p, entries: next.entries, notes: next.notes};
    setProgress((cur) => ({...cur, entries: next.entries, notes: next.notes}));
  }, []);

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (!h.length || revealed || paused) return;
    const prev = h[h.length - 1];
    historyRef.current = h.slice(0, -1);
    setHistory(historyRef.current);
    const restore = (cur) => ({
      ...cur,
      entries: prev.entries,
      notes: prev.notes,
      elapsed: prev.elapsed ?? cur.elapsed, // undoing a reset brings the time back too
    });
    progressRef.current = restore(progressRef.current);
    setProgress(restore);
  }, [revealed, paused]);

  // Ctrl+Z / Cmd+Z anywhere on the page (except while typing in a text field).
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || e.key.toLowerCase() !== 'z') return;
      const t = e.target;
      const typing =
        t instanceof HTMLElement &&
        (t.isContentEditable ||
          t.tagName === 'TEXTAREA' ||
          (t.tagName === 'INPUT' && !['checkbox', 'radio', 'button'].includes(t.type)));
      if (typing) return;
      e.preventDefault();
      undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo]);

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
    if (solved && !wasSolved.current) {
      setShowCongrats(true);
      // Count the solve; the dialog adds "you're the n-th solver" when the answer arrives.
      if (!revealed) {
        reportSolve({date: dateKey, variant, seconds: progressRef.current.elapsed}).then(
          (stats) => stats && setSolveStats(stats),
        );
      }
    }
    wasSolved.current = solved;
  }, [solved, revealed, dateKey, variant]);
  const closeCongrats = useCallback(() => {
    setShowCongrats(false);
    gridRef.current?.focus();
  }, []);

  // Pause: stops the timer and locks (and hides) the board until resumed.
  const canPause = !solved && !revealed;
  const togglePause = useCallback(() => {
    if (!canPause) return;
    setPaused((p) => !p);
    gridRef.current?.focus();
  }, [canPause]);

  // Spacebar pauses / resumes from anywhere on the page, except form controls.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || e.repeat || e.ctrlKey || e.metaKey || e.altKey || !canPause) return;
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY'].includes(t.tagName))
      ) {
        return;
      }
      e.preventDefault(); // no page scroll, and no "click" on a focused button
      togglePause();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canPause, togglePause]);

  // Timer: counts seconds while the puzzle is open, visible, unsolved and not paused.
  const running = !solved && !revealed && !paused;
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

  const canEdit = selected !== null && !game.puzzle[selected] && !revealed && !paused;

  const enterDigit = useCallback(
    (digit, asNote) => {
      if (!canEdit) return;
      const i = selected;
      edit((p) => {
        const entries = p.entries.slice();
        const notes = p.notes.slice();
        if (asNote) {
          if (entries[i]) return null;
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
        return {entries, notes};
      });
    },
    [canEdit, selected, edit, prefs.autoClearNotes, related],
  );

  const erase = useCallback(() => {
    if (!canEdit) return;
    const i = selected;
    edit((p) => {
      const entries = p.entries.slice();
      const notes = p.notes.slice();
      if (entries[i]) entries[i] = 0;
      else notes[i] = 0;
      return {entries, notes};
    });
  }, [canEdit, selected, edit]);

  const fillNotes = () => {
    if (revealed || paused) return;
    edit((p) => {
      const v = game.puzzle.map((g, i) => g || p.entries[i]);
      const notes = v.map((val, i) => {
        if (val) return 0;
        let mask = 0x1ff;
        related(i).forEach((j) => {
          if (v[j]) mask &= ~(1 << (v[j] - 1));
        });
        return mask;
      });
      return {entries: p.entries, notes};
    });
  };

  const onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || paused) return;
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
    const p = progressRef.current;
    if (p.entries.some(Boolean) || p.notes.some(Boolean)) {
      pushHistory({entries: p.entries, notes: p.notes, elapsed: p.elapsed});
    }
    progressRef.current = blank();
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
        <div className={styles.gridWrap}>
          <div
            ref={gridRef}
            className={styles.grid}
            tabIndex={0}
            onKeyDown={onKeyDown}
            role="grid"
            aria-hidden={paused || undefined}
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
          {paused && (
            <button type="button" className={styles.pauseOverlay} onClick={togglePause}>
              <span className={styles.pauseIcon} aria-hidden="true">
                ⏸
              </span>
              <span className={styles.pauseTitle}>Paused</span>
              <span className={styles.pauseHint}>Press Space or click to resume</span>
            </button>
          )}
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
              disabled={paused}
              onClick={() => enterDigit(d, noteMode)}>
              {d}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={clsx('button button--sm', noteMode ? 'button--primary' : 'button--secondary')}
            aria-pressed={noteMode}
            disabled={paused}
            onClick={() => setNoteMode((m) => !m)}
            title="Toggle pencil marks (N)">
            ✎ Pencil {noteMode ? 'on' : 'off'}
          </button>
          <button
            className="button button--sm button--secondary"
            onClick={undo}
            disabled={!history.length || revealed || paused}
            title="Undo (Ctrl+Z)">
            ↶ Undo
          </button>
          <button className="button button--sm button--secondary" disabled={paused} onClick={erase}>
            ⌫ Erase
          </button>
          <button className="button button--sm button--secondary" disabled={paused} onClick={fillNotes}>
            Fill pencil marks
          </button>
        </div>

        <div className={styles.actions}>
          <button
            className="button button--sm button--secondary"
            disabled={paused}
            onClick={() => setShowMistakes((m) => !m)}>
            {showMistakes ? 'Hide mistakes' : 'Check mistakes'}
          </button>
          <button
            className="button button--sm button--secondary"
            disabled={paused}
            onClick={() => {
              setRevealed(true);
              setShowMistakes(false);
            }}>
            Show solution
          </button>
          <button className="button button--sm button--secondary" disabled={paused} onClick={reset}>
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
          <div className={styles.timerRow}>
            {prefs.showTimer && (
              <div className={clsx(styles.timer, paused && styles.timerPaused)} aria-label="Time spent">
                ⏱ {formatTime(progress.elapsed)}
              </div>
            )}
            <button
              className={clsx('button button--sm', paused ? 'button--primary' : 'button--secondary')}
              aria-pressed={paused}
              disabled={!canPause}
              onClick={togglePause}
              title="Pause / resume (Space)">
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          </div>
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
          Keys: 1–9 enter a digit · Shift+1–9 or N toggles pencil marks · Backspace erases · Ctrl+Z
          undoes · Space pauses · arrows move
        </p>
      </aside>

      {showCongrats && (
        <SolvedDialog
          time={formatTime(progress.elapsed)}
          label={killer ? 'killer' : prefs.difficulty}
          solveStats={solveStats}
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
        {/* Always laid out (just hidden in killer mode) so Classic/Killer never shift. */}
        <span
          className={clsx(styles.tabGroup, killer && styles.tabGroupHidden)}
          aria-hidden={killer || undefined}>
          <span className={styles.tabDivider} aria-hidden="true" />
          {Object.entries(DIFFICULTIES).map(([key, {label}]) => (
            <button
              key={key}
              role="tab"
              aria-selected={prefs.difficulty === key}
              tabIndex={killer ? -1 : undefined}
              disabled={killer}
              className={clsx(styles.tab, styles.tabSmall, prefs.difficulty === key && styles.tabActive)}
              onClick={() => setPref('difficulty', key)}>
              {label}
            </button>
          ))}
        </span>
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
