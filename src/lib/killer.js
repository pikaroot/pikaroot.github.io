// Killer sudoku: cages with sums, no repeated digit inside a cage.
// Generated deterministically from (salt, date), with a unique solution.

import {boxOf, hashString, makeRng, popcount, randomSolution, shuffle} from './sudoku';

const MAX_K = 10;
const MAX_REM = 46;
const NODE_BUDGET = 40000;

// can(k, rem, mask): can k distinct digits from `mask` sum to `rem`? (memoized)
const canCache = new Int8Array(MAX_K * MAX_REM * 512);
export function can(k, rem, mask) {
  if (k === 0) return rem === 0;
  if (rem < k || rem >= MAX_REM) return false;
  const key = (k * MAX_REM + rem) * 512 + mask;
  const cached = canCache[key];
  if (cached) return cached === 1;
  let ok = false;
  for (let d = 1; d <= 9 && d <= rem && !ok; d++) {
    const bit = 1 << (d - 1);
    if (!(mask & bit)) continue;
    // d is the smallest chosen digit; the rest come from digits above d
    if (can(k - 1, rem - d, mask & ~((1 << d) - 1))) ok = true;
  }
  canCache[key] = ok ? 1 : 2;
  return ok;
}

function ksearch(grid, m, cs, ctx) {
  if (++ctx.nodes > ctx.budget) {
    ctx.aborted = true;
    return true;
  }
  let best = -1;
  let bestMask = 0;
  let bestCount = 10;

  for (let i = 0; i < 81; i++) {
    if (grid[i] !== 0) continue;
    const r = (i / 9) | 0;
    const c = i % 9;
    let mask = ~(m.r[r] | m.c[c] | m.b[boxOf(r, c)]) & 0x1ff;
    const g = cs.cageOf[i];
    if (g >= 0) {
      mask &= ~cs.used[g];
      const k = cs.left[g] - 1;
      const rem = cs.rem[g];
      const avail = ~cs.used[g] & 0x1ff;
      for (let d = 1; d <= 9; d++) {
        const bit = 1 << (d - 1);
        if (mask & bit && !can(k, rem - d, avail & ~bit)) mask &= ~bit;
      }
    }
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
    else if (!ctx.out2) ctx.out2 = grid.slice();
    return ctx.count >= ctx.limit;
  }

  const r = (best / 9) | 0;
  const c = best % 9;
  const b = boxOf(r, c);
  const g = cs.cageOf[best];
  for (let d = 1; d <= 9; d++) {
    const bit = 1 << (d - 1);
    if (!(bestMask & bit)) continue;
    grid[best] = d;
    m.r[r] |= bit;
    m.c[c] |= bit;
    m.b[b] |= bit;
    if (g >= 0) {
      cs.used[g] |= bit;
      cs.rem[g] -= d;
      cs.left[g]--;
    }
    const done = ksearch(grid, m, cs, ctx);
    grid[best] = 0;
    m.r[r] &= ~bit;
    m.c[c] &= ~bit;
    m.b[b] &= ~bit;
    if (g >= 0) {
      cs.used[g] &= ~bit;
      cs.rem[g] += d;
      cs.left[g]++;
    }
    if (done) return true;
  }
  return false;
}

export function runKiller(puzzle, cageOf, cages, limit, budget = NODE_BUDGET) {
  const grid = puzzle.slice();
  const m = {r: new Array(9).fill(0), c: new Array(9).fill(0), b: new Array(9).fill(0)};
  const cs = {
    cageOf,
    used: cages.map(() => 0),
    rem: cages.map((cg) => cg.sum),
    left: cages.map((cg) => cg.cells.length),
  };
  for (let i = 0; i < 81; i++) {
    if (!grid[i]) continue;
    const r = (i / 9) | 0;
    const c = i % 9;
    const bit = 1 << (grid[i] - 1);
    m.r[r] |= bit;
    m.c[c] |= bit;
    m.b[boxOf(r, c)] |= bit;
    const g = cageOf[i];
    if (g >= 0) {
      cs.used[g] |= bit;
      cs.rem[g] -= grid[i];
      cs.left[g]--;
    }
  }
  const ctx = {count: 0, limit, out: null, out2: null, nodes: 0, budget, aborted: false};
  ksearch(grid, m, cs, ctx);
  return ctx;
}

const SIZE_WEIGHTS = [
  [2, 38],
  [3, 40],
  [4, 17],
  [5, 5],
];

function pickSize(rng) {
  let t = rng() * 100;
  for (const [size, w] of SIZE_WEIGHTS) {
    if ((t -= w) < 0) return size;
  }
  return 3;
}

function neighbours(i) {
  const r = (i / 9) | 0;
  const c = i % 9;
  const out = [];
  if (r > 0) out.push(i - 9);
  if (r < 8) out.push(i + 9);
  if (c > 0) out.push(i - 1);
  if (c < 8) out.push(i + 1);
  return out;
}

// Turn lists of cells into cage objects (sorted, with sums) plus a cell -> cage map.
function buildCages(cellLists, solution) {
  const cageOf = new Array(81).fill(-1);
  const cages = cellLists.map((list, idx) => {
    const cells = list.slice().sort((a, b) => a - b);
    cells.forEach((i) => {
      cageOf[i] = idx;
    });
    return {cells, sum: cells.reduce((t, i) => t + solution[i], 0)};
  });
  return {cageOf, cages};
}

// Cover the whole grid with connected cages of 2+ cells whose digits all differ.
// Returns null if some cell can't be placed in a cage of 2+ cells.
function randomCageLayout(solution, rng) {
  const owner = new Array(81).fill(-1);
  const tmp = [];
  for (const start of shuffle(Array.from({length: 81}, (_, i) => i), rng)) {
    if (owner[start] !== -1) continue;
    const id = tmp.length;
    const cage = {cells: [start], mask: 1 << (solution[start] - 1)};
    owner[start] = id;
    const target = pickSize(rng);
    while (cage.cells.length < target) {
      const options = [];
      for (const cell of cage.cells) {
        for (const n of neighbours(cell)) {
          if (owner[n] === -1 && !(cage.mask & (1 << (solution[n] - 1)))) options.push(n);
        }
      }
      if (!options.length) break;
      const n = options[Math.floor(rng() * options.length)];
      cage.cells.push(n);
      cage.mask |= 1 << (solution[n] - 1);
      owner[n] = id;
    }
    tmp.push(cage);
  }

  // Absorb single-cell cages into a neighbouring cage.
  for (let id = 0; id < tmp.length; id++) {
    if (tmp[id].cells.length !== 1) continue;
    const cell = tmp[id].cells[0];
    const bit = 1 << (solution[cell] - 1);
    const hosts = neighbours(cell)
      .map((n) => owner[n])
      .filter((o) => o !== id && tmp[o].cells.length < 6 && !(tmp[o].mask & bit));
    if (!hosts.length) return null;
    const host = hosts[Math.floor(rng() * hosts.length)];
    tmp[host].cells.push(cell);
    tmp[host].mask |= bit;
    owner[cell] = host;
    tmp[id].cells = [];
  }
  return tmp.filter((c) => c.cells.length > 0).map((c) => c.cells);
}

function isConnected(cells) {
  const set = new Set(cells);
  const seen = new Set([cells[0]]);
  const stack = [cells[0]];
  while (stack.length) {
    const cur = stack.pop();
    for (const n of neighbours(cur)) {
      if (set.has(n) && !seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return seen.size === cells.length;
}

// Split a cage into two connected parts of 2+ cells for which `breaks(partA)`
// holds (i.e. the split rules out the unwanted alternative solution).
function splitCage(cells, rng, breaks) {
  const n = cells.length;
  if (n < 4) return null;
  for (let attempt = 0; attempt < 30; attempt++) {
    const k = 2 + Math.floor(rng() * (n - 3)); // 2 .. n-2
    const part = [cells[Math.floor(rng() * n)]];
    while (part.length < k) {
      const options = [];
      for (const cell of part) {
        for (const nb of neighbours(cell)) {
          if (cells.includes(nb) && !part.includes(nb)) options.push(nb);
        }
      }
      if (!options.length) break;
      part.push(options[Math.floor(rng() * options.length)]);
    }
    if (part.length !== k) continue;
    const rest = cells.filter((c) => !part.includes(c));
    if (!isConnected(rest) || !breaks(part)) continue;
    return [part, rest];
  }
  return null;
}

const EMPTY = new Array(81).fill(0);
const MAX_ROUNDS = 60; // fresh solution grids to try
const LAYOUTS_PER_ROUND = 6; // random cage layouts per grid
const MAX_SPLITS = 25; // cage refinements per layout

/**
 * The daily killer puzzle for a date key: no pre-filled cells, and the cages
 * are checked (by exhaustive search) to give exactly one solution.
 */
export function generateKiller(dateKey, salt = '') {
  const rng = makeRng(hashString(`${salt}|${dateKey}|killer`));

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const solution = randomSolution(rng);
    for (let layout = 0; layout < LAYOUTS_PER_ROUND; layout++) {
      const lists = randomCageLayout(solution, rng);
      if (!lists) continue;
      let cellLists = lists;

      for (let step = 0; step <= MAX_SPLITS; step++) {
        const {cageOf, cages} = buildCages(cellLists, solution);
        const ctx = runKiller(EMPTY, cageOf, cages, 2);
        if (ctx.count === 1 && !ctx.aborted) {
          return {
            kind: 'killer',
            puzzle: EMPTY.slice(),
            solution,
            cageOf,
            cages,
            id: hashString(cageOf.join(',') + solution.join('')).toString(36),
          };
        }
        if (!ctx.out || !ctx.out2) break; // search gave up: try another layout

        // An alternative solution that differs from the intended one.
        const alt = ctx.out.some((v, i) => v !== solution[i]) ? ctx.out : ctx.out2;
        const candidates = [];
        cellLists.forEach((cells, idx) => {
          if (cells.length >= 4 && cells.some((i) => alt[i] !== solution[i])) candidates.push(idx);
        });
        let replaced = false;
        for (const idx of shuffle(candidates, rng)) {
          const cells = cellLists[idx];
          const sumOf = (list, grid) => list.reduce((t, i) => t + grid[i], 0);
          const parts = splitCage(
            cells,
            rng,
            (part) => sumOf(part, alt) !== sumOf(part, solution),
          );
          if (parts) {
            cellLists = cellLists.filter((_, j) => j !== idx).concat(parts);
            replaced = true;
            break;
          }
        }
        if (!replaced) break;
      }
    }
  }
  throw new Error('Could not generate a killer puzzle');
}
