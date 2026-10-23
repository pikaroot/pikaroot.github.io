// Sudoku generation: seeded, deterministic, unique-solution puzzles.

export const DIFFICULTIES = {
  easy: {label: 'Easy', clues: 40},
  medium: {label: 'Medium', clues: 32},
  hard: {label: 'Hard', clues: 25},
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

/**
 * Generate the classic puzzle for a date key + difficulty. The salt is mixed
 * into the seed, so the output is fixed for (salt, date, difficulty).
 */
export function generatePuzzle(dateKey, difficulty, salt = '') {
  const rng = makeRng(hashString(`${salt}|${dateKey}|${difficulty}`));
  let best = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    const solution = randomSolution(rng);
    const made = carvePuzzle(solution, rng, difficulty);
    if (!best || (made.even && !best.made.even)) best = {solution, made};
    if (made.even) break;
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
