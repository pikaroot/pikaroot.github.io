// Reports a finished daily sudoku to the homelab counter API and returns
// {rank, total}: "you were the rank-th solver of this puzzle today, out of total".
// Returns null when not on the live site, when the browser asks not to be tracked,
// or when the homelab can't be reached — the game works the same without it.
// Server side: ~/homelab/stacks/site-counter (no cookies; IPs stored only as a
// per-day pseudonym so a repeat solve keeps its original rank).
import {KEVLAR_URL} from '../data/projects.js';

const API = `${KEVLAR_URL}/counter`;
const SITE_HOST = 'pikaroot.github.io';

export async function reportSolve({date, variant, seconds}) {
  if (window.location.hostname !== SITE_HOST) return null;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return null;
  try {
    const res = await fetch(`${API}/sudoku/solve`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({date, variant, seconds}),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Number.isInteger(data.rank) && Number.isInteger(data.total) ? data : null;
  } catch {
    return null;
  }
}

/** 1 -> "1st", 2 -> "2nd", 11 -> "11th", 23 -> "23rd" */
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
