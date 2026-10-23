import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// `edges` is a bitmask of cage boundaries: 1 top, 2 right, 4 bottom, 8 left.
function Cell({
  index,
  value,
  notes,
  given,
  sum,
  edges,
  inCage,
  killer,
  related,
  sameDigit,
  sameCage,
  selected,
  wrong,
  onSelect,
}) {
  const row = (index / 9) | 0;
  const col = index % 9;
  return (
    <button
      role="gridcell"
      tabIndex={-1}
      aria-label={`Row ${row + 1}, column ${col + 1}${value ? `, ${value}` : ', empty'}`}
      onClick={() => onSelect(index)}
      className={clsx(
        styles.cell,
        col % 3 === 2 && col !== 8 && styles.boxRight,
        row % 3 === 2 && row !== 8 && styles.boxBottom,
        related && styles.related,
        sameCage && styles.sameCage,
        sameDigit && styles.sameDigit,
        selected && styles.selected,
        given ? styles.given : styles.entry,
        wrong && styles.wrong,
      )}>
      {inCage && (
        <span
          className={clsx(
            styles.cageBox,
            edges & 1 && styles.cageTop,
            edges & 2 && styles.cageRight,
            edges & 4 && styles.cageBottom,
            edges & 8 && styles.cageLeft,
          )}
        />
      )}
      {sum ? <span className={styles.sum}>{sum}</span> : null}
      {value ? (
        <span className={styles.value}>{value}</span>
      ) : notes ? (
        <span className={clsx(styles.notes, killer && styles.notesKiller)}>
          {DIGITS.map((d) => (
            <span key={d}>{notes & (1 << (d - 1)) ? d : ''}</span>
          ))}
        </span>
      ) : null}
    </button>
  );
}

export default React.memo(Cell);
