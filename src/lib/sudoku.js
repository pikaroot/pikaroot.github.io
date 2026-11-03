// Sudoku generation: seeded, deterministic, unique-solution puzzles.

// `grade` is the logic level a puzzle must need (see gradePuzzle): easy falls
// to singles, medium needs pairs / locked candidates, hard needs X-wing,
// swordfish or XY-wing. None ever needs guessing.
export const DIFFICULTIES = {
  easy: {label: 'Easy', clues: 40, grade: 1},
  medium: {label: 'Medium', clues: 28, grade: 2},
  hard: {label: 'Hard', clues: 23, grade: 3},
};

const MYT_OFFSET_MS = 8 * 60 * 60 * 1000; // Malaysia is UTC+8, no DST
const DAY_MS = 24 * 60 * 60 * 1000;

/** Date key (YYYY-MM-DD) for the current day in Malaysia Time. */
export function getMalaysiaDateKey(now = Date.now()) {
  return new Date(now + MYT_OFFSET_MS).toISOString().slice(0, 10);
}

/** Milliseconds until the next 12:00am Malaysia Time. */
export function msUntilMalaysiaMidnight(now = Date.now()) {
  return DAY_MS - ((now + MYT_OFFSET_MS) % DAY_MS);
}

// FNV-1a string hash -> 32-bit seed
export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32 PRNG
export function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function popcount(n) {
  let c = 0;
  while (n) {
    n &= n - 1;
    c++;
  }
  return c;
}

export const boxOf = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

// Backtracking search with "fewest candidates first". Counts solutions up to
// ctx.limit and keeps the first found in ctx.out. If ctx.rng is set, digits are
// tried in random order (used to build a random full grid).
function search(grid, m, ctx) {
  let best = -1;
  let bestMask = 0;
  let bestCount = 10;

  for (let i = 0; i < 81; i++) {
    if (grid[i] !== 0) continue;
    const r = (i / 9) | 0;
    const c = i % 9;
    const mask = ~(m.r[r] | m.c[c] | m.b[boxOf(r, c)]) & 0x1ff;
    const cnt = popcount(mask);
    if (cnt === 0) return false;
    if (cnt < bestCount) {
      best = i;
      bestMask = mask;
      bestCount = cnt;
      if (cnt === 1) break;
    }
  }

  if (best === -1) {
    ctx.count++;
    if (!ctx.out) ctx.out = grid.slice();
    return ctx.count >= ctx.limit;
  }

  const digits = [];
  for (let d = 0; d < 9; d++) if (bestMask & (1 << d)) digits.push(d);
  if (ctx.rng) shuffle(digits, ctx.rng);

  const r = (best / 9) | 0;
  const c = best % 9;
  const b = boxOf(r, c);
  for (const d of digits) {
    const bit = 1 << d;
    grid[best] = d + 1;
    m.r[r] |= bit;
    m.c[c] |= bit;
    m.b[b] |= bit;
    const done = search(grid, m, ctx);
    grid[best] = 0;
    m.r[r] &= ~bit;
    m.c[c] &= ~bit;
    m.b[b] &= ~bit;
    if (done) return true;
  }
  return false;
}

function runSearch(puzzle, limit, rng) {
  const grid = puzzle.slice();
  const m = {r: new Array(9).fill(0), c: new Array(9).fill(0), b: new Array(9).fill(0)};
  for (let i = 0; i < 81; i++) {
    if (!grid[i]) continue;
    const r = (i / 9) | 0;
    const c = i % 9;
    const bit = 1 << (grid[i] - 1);
    m.r[r] |= bit;
    m.c[c] |= bit;
    m.b[boxOf(r, c)] |= bit;
  }
  const ctx = {count: 0, limit, out: null, rng};
  search(grid, m, ctx);
  return ctx;
}

// ---- Logic grader --------------------------------------------------------
// Solves the way a person would, always using the simplest technique that
// makes progress, and reports the hardest level it needed:
//   1 = naked / hidden singles
//   2 = locked candidates, naked / hidden pairs and triples
//   3 = X-wing, swordfish, XY-wing
//   4 = stuck without guessing (still has a unique solution)

const UNITS = [];
for (let k = 0; k < 9; k++) {
  UNITS.push(Array.from({length: 9}, (_, j) => k * 9 + j)); // rows
  UNITS.push(Array.from({length: 9}, (_, j) => j * 9 + k)); // columns
  const r0 = Math.floor(k / 3) * 3;
  const c0 = (k % 3) * 3;
  UNITS.push(Array.from({length: 9}, (_, j) => (r0 + Math.floor(j / 3)) * 9 + c0 + (j % 3))); // boxes
}
const ROWS = UNITS.filter((_, u) => u % 3 === 0);
const COLS = UNITS.filter((_, u) => u % 3 === 1);
const BOXES = UNITS.filter((_, u) => u % 3 === 2);
const GRADER_PEERS = Array.from({length: 81}, (_, i) => {
  const set = new Set();
  for (const unit of UNITS) if (unit.includes(i)) unit.forEach((j) => j !== i && set.add(j));
  return [...set];
});
const sees = (a, b) => GRADER_PEERS[a].includes(b);

// All k-element subsets of arr.
function combos(arr, k, start = 0, pick = [], out = []) {
  if (pick.length === k) {
    out.push(pick.slice());
    return out;
  }
  for (let i = start; i < arr.length; i++) {
    pick.push(arr[i]);
    combos(arr, k, i + 1, pick, out);
    pick.pop();
  }
  return out;
}

function makeState(puzzle) {
  const grid = puzzle.slice();
  const cands = new Array(81).fill(0);
  for (let i = 0; i < 81; i++) {
    if (grid[i]) continue;
    let mask = 0x1ff;
    for (const j of GRADER_PEERS[i]) if (grid[j]) mask &= ~(1 << (grid[j] - 1));
    cands[i] = mask;
  }
  return {grid, cands};
}

function place(s, i, d) {
  s.grid[i] = d;
  s.cands[i] = 0;
  const bit = ~(1 << (d - 1));
  for (const j of GRADER_PEERS[i]) s.cands[j] &= bit;
}

// Remove `mask` from the cells in `cells`; true if anything changed.
function eliminate(s, cells, mask) {
  let changed = false;
  for (const i of cells) {
    if (s.cands[i] & mask) {
      s.cands[i] &= ~mask;
      changed = true;
    }
  }
  return changed;
}

function singles(s) {
  for (let i = 0; i < 81; i++) {
    if (!s.grid[i] && popcount(s.cands[i]) === 1) {
      place(s, i, 31 - Math.clz32(s.cands[i]) + 1);
      return true;
    }
  }
  for (const unit of UNITS) {
    for (let d = 0; d < 9; d++) {
      const bit = 1 << d;
      let spot = -1;
      let n = 0;
      for (const i of unit) {
        if (s.cands[i] & bit) {
          spot = i;
          n++;
        }
      }
      if (n === 1) {
        place(s, spot, d + 1);
        return true;
      }
    }
  }
  return false;
}

function lockedCandidates(s) {
  for (let d = 0; d < 9; d++) {
    const bit = 1 << d;
    // Pointing: within a box, the digit is confined to one row / column.
    for (const box of BOXES) {
      const spots = box.filter((i) => s.cands[i] & bit);
      if (spots.length < 2) continue;
      for (const lines of [ROWS, COLS]) {
        const line = lines.find((l) => spots.every((i) => l.includes(i)));
        if (line && eliminate(s, line.filter((i) => !box.includes(i)), bit)) return true;
      }
    }
    // Claiming: within a row / column, the digit is confined to one box.
    for (const line of [...ROWS, ...COLS]) {
      const spots = line.filter((i) => s.cands[i] & bit);
      if (spots.length < 2) continue;
      const box = BOXES.find((b) => spots.every((i) => b.includes(i)));
      if (box && eliminate(s, box.filter((i) => !line.includes(i)), bit)) return true;
    }
  }
  return false;
}

function subsets(s, k) {
  for (const unit of UNITS) {
    const open = unit.filter((i) => !s.grid[i]);
    if (open.length <= k) continue;
    // Naked: k cells whose candidates together are exactly k digits.
    for (const cells of combos(open, k)) {
      let mask = 0;
      for (const i of cells) mask |= s.cands[i];
      if (popcount(mask) === k && eliminate(s, open.filter((i) => !cells.includes(i)), mask)) {
        return true;
      }
    }
    // Hidden: k digits that only fit in the same k cells.
    const digits = [];
    for (let d = 0; d < 9; d++) if (open.some((i) => s.cands[i] & (1 << d))) digits.push(d);
    for (const ds of combos(digits, k)) {
      const mask = ds.reduce((m, d) => m | (1 << d), 0);
      const cells = open.filter((i) => s.cands[i] & mask);
      if (cells.length === k && eliminate(s, cells, 0x1ff & ~mask)) return true;
    }
  }
  return false;
}

// X-wing (n = 2) and swordfish (n = 3), on rows and on columns.
function fish(s, n) {
  for (let d = 0; d < 9; d++) {
    const bit = 1 << d;
    for (const [bases, covers] of [
      [ROWS, COLS],
      [COLS, ROWS],
    ]) {
      const eligible = [];
      bases.forEach((line, b) => {
        const pos = covers.map((_, c) => c).filter((c) => s.cands[line[c]] & bit);
        if (pos.length >= 2 && pos.length <= n) eligible.push({b, pos});
      });
      for (const set of combos(eligible, n)) {
        const coverIdx = new Set(set.flatMap((e) => e.pos));
        if (coverIdx.size !== n) continue;
        const baseIdx = new Set(set.map((e) => e.b));
        const targets = [];
        for (const c of coverIdx) {
          covers[c].forEach((i, b) => {
            if (!baseIdx.has(b)) targets.push(i);
          });
        }
        if (eliminate(s, targets, bit)) return true;
      }
    }
  }
  return false;
}

function xyWing(s) {
  const bivalue = [];
  for (let i = 0; i < 81; i++) if (!s.grid[i] && popcount(s.cands[i]) === 2) bivalue.push(i);
  for (const pivot of bivalue) {
    const pm = s.cands[pivot];
    const wings = bivalue.filter((j) => j !== pivot && sees(pivot, j));
    for (const a of wings) {
      const am = s.cands[a];
      if (popcount(am & pm) !== 1) continue;
      for (const b of wings) {
        if (b === a) continue;
        const bm = s.cands[b];
        if (popcount(bm & pm) !== 1 || (bm & pm) === (am & pm)) continue;
        const z = am & bm & ~pm;
        if (popcount(z) !== 1 || (am | bm | pm) !== (pm | z)) continue;
        const targets = GRADER_PEERS[a].filter((i) => i !== b && i !== pivot && sees(b, i));
        if (eliminate(s, targets, z)) return true;
      }
    }
  }
  return false;
}

const TECHNIQUES = [
  [1, singles],
  [2, lockedCandidates],
  [2, (s) => subsets(s, 2)],
  [2, (s) => subsets(s, 3)],
  [3, (s) => fish(s, 2)],
  [3, xyWing],
  [3, (s) => fish(s, 3)],
];

/** The hardest technique level (1–4) needed to solve `puzzle` by logic. */
export function gradePuzzle(puzzle) {
  const s = makeState(puzzle);
  let level = 1;
  for (;;) {
    if (s.grid.every(Boolean)) return level;
    const step = TECHNIQUES.find(([, apply]) => apply(s));
    if (!step) return 4;
    level = Math.max(level, step[0]);
  }
}

/** A random complete, valid grid. */
export function randomSolution(rng) {
  return runSearch(new Array(81).fill(0), 1, rng).out;
}

// Allowed clues per row / column / box, so no unit is full or nearly empty.
const LIMITS = {
  easy: {min: 3, max: 6},
  medium: {min: 2, max: 5},
  hard: {min: 1, max: 5},
};

const unitsOf = (i) => {
  const r = (i / 9) | 0;
  const c = i % 9;
  return [r, 9 + c, 18 + boxOf(r, c)];
};

// Remove cells (in mirrored pairs) while keeping a unique solution and an even
// spread of clues across rows, columns and boxes.
function carvePuzzle(solution, rng, difficulty) {
  const {min, max} = LIMITS[difficulty];
  const target = DIFFICULTIES[difficulty].clues;
  const puzzle = solution.slice();
  const counts = new Array(27).fill(9);
  let clues = 81;

  const cellsOf = (i) => (i === 40 ? [40] : [i, 80 - i]);
  const crowded = (c) => unitsOf(c).some((u) => counts[u] > max);

  const tryRemove = (i) => {
    const cells = cellsOf(i);
    if (cells.some((c) => !puzzle[c])) return;
    const drop = new Array(27).fill(0);
    for (const c of cells) for (const u of unitsOf(c)) drop[u]++;
    if (drop.some((d, u) => d && counts[u] - d < min)) return;
    const saved = cells.map((c) => puzzle[c]);
    cells.forEach((c) => {
      puzzle[c] = 0;
    });
    if (runSearch(puzzle, 2).count !== 1) {
      cells.forEach((c, k) => {
        puzzle[c] = saved[k];
      });
      return;
    }
    drop.forEach((d, u) => {
      counts[u] -= d;
    });
    clues -= cells.length;
  };

  const order = shuffle(Array.from({length: 41}, (_, i) => i), rng);
  for (const i of order) if (cellsOf(i).some(crowded)) tryRemove(i); // thin crowded units first
  for (const i of order) if (clues > target) tryRemove(i); // then down to the target

  const even = counts.every((n) => n >= min && n <= max);
  return {puzzle, even, clues};
}

// A puzzle that needs more than `goal` is still uniquely solvable; giving back
// clues (in mirrored pairs, without overcrowding a unit) can only make it
// easier. Add them until it needs exactly `goal`, or return null.
function soften(made, solution, rng, difficulty, goal) {
  const {max} = LIMITS[difficulty];
  const puzzle = made.puzzle.slice();
  const counts = new Array(27).fill(0);
  for (let i = 0; i < 81; i++) if (puzzle[i]) unitsOf(i).forEach((u) => counts[u]++);

  const order = shuffle(Array.from({length: 41}, (_, i) => i), rng);
  for (const i of order) {
    const cells = i === 40 ? [40] : [i, 80 - i];
    if (cells.some((c) => puzzle[c])) continue;
    const add = new Array(27).fill(0);
    for (const c of cells) for (const u of unitsOf(c)) add[u]++;
    if (add.some((a, u) => counts[u] + a > max)) continue;

    cells.forEach((c) => {
      puzzle[c] = solution[c];
    });
    const grade = gradePuzzle(puzzle);
    if (grade === goal) {
      return {...made, puzzle, clues: made.clues + cells.length};
    }
    if (grade < goal) {
      cells.forEach((c) => {
        puzzle[c] = 0;
      }); // overshot: try a different pair
    } else {
      add.forEach((a, u) => {
        counts[u] += a;
      });
      made = {...made, clues: made.clues + cells.length};
    }
  }
  return null;
}

/**
 * Generate the classic puzzle for a date key + difficulty. The salt is mixed
 * into the seed, so the output is fixed for (salt, date, difficulty).
 */
export function generatePuzzle(dateKey, difficulty, salt = '') {
  const rng = makeRng(hashString(`${salt}|${dateKey}|${difficulty}`));
  const goal = DIFFICULTIES[difficulty].grade;
  // Rank: right grade first, then even spread, then "at least solvable by logic".
  const score = (m, grade) => (grade === goal ? 4 : 0) + (m.even ? 2 : 0) + (grade < 4 ? 1 : 0);
  let best = null;
  for (let attempt = 0; attempt < 200; attempt++) {
    const solution = randomSolution(rng);
    let made = carvePuzzle(solution, rng, difficulty);
    let grade = gradePuzzle(made.puzzle);
    if (grade > goal) {
      const softer = soften(made, solution, rng, difficulty, goal);
      if (softer) {
        made = softer;
        grade = goal;
      }
    }
    const s = score(made, grade);
    if (!best || s > best.s) best = {solution, made, s};
    if (s >= 6) break; // right grade and evenly spread
  }
  const {solution, made} = best;
  return {
    kind: 'classic',
    puzzle: made.puzzle,
    solution,
    cageOf: null,
    cages: null,
    id: hashString(made.puzzle.join('')).toString(36),
  };
}
