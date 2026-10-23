import React from 'react';
import styles from './styles.module.css';

export const DEFAULT_PREFS = {
  mode: 'classic',
  difficulty: 'easy',
  settingsOpen: false,
  highlightRelated: true,
  highlightSame: true,
  highlightCage: true,
  showConflicts: true,
  showTimer: true,
  autoClearNotes: true,
  dimDone: true,
  showCountdown: true,
};

const TOGGLES = [
  ['highlightRelated', 'Highlight row, column & box', 'Tint the cells that share a row, column or box with the selected cell.'],
  ['highlightSame', 'Highlight matching digits', 'Tint every cell holding the same digit as the selected cell.'],
  ['highlightCage', 'Highlight cage', 'Killer only: tint the cage of the selected cell.', 'killer'],
  ['showConflicts', 'Show conflicts', 'Mark digits that repeat in a row, column, box or cage, or break a cage sum.'],
  ['showTimer', 'Show timer', 'The timer keeps running even when hidden.'],
  ['autoClearNotes', 'Auto-remove pencil marks', 'Placing a digit removes it from the pencil marks of related cells.'],
  ['dimDone', 'Dim completed digits', 'Grey out number keys once all nine of a digit are placed.'],
  ['showCountdown', 'Show next-puzzle countdown', 'Time left until 12:00am Malaysia Time.'],
];

export default function Settings({prefs, setPref, reset, mode}) {
  return (
    <details
      className={styles.settings}
      open={!!prefs.settingsOpen}
      onToggle={(e) => setPref('settingsOpen', e.currentTarget.open)}>
      <summary>Settings</summary>
      <div className={styles.settingsBody}>
        {TOGGLES.filter(([, , , only]) => !only || only === mode).map(([key, label, hint]) => (
          <label key={key} className={styles.toggle} title={hint}>
            <span className={styles.toggleText}>
              {label}
              <small>{hint}</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={!!prefs[key]}
              onChange={(e) => setPref(key, e.target.checked)}
            />
            <span className={styles.slider} aria-hidden="true" />
          </label>
        ))}
        <button className="button button--link button--sm" onClick={reset}>
          Restore defaults
        </button>
      </div>
    </details>
  );
}
