import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

const VARIANTS = {up: styles.up, left: styles.left, right: styles.right, zoom: styles.zoom};

// Reveal children once they scroll into view. `variant` picks the direction
// they arrive from: up (default), left, right, or zoom.
export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  style,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Show once 15% is visible, or if a fast scroll already carried it
          // past the top of the screen (so nothing above you stays hidden).
          const passed = entry.boundingClientRect.bottom < (entry.rootBounds?.top ?? 0);
          if (entry.intersectionRatio >= 0.15 || passed) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      {threshold: [0, 0.15]},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${VARIANTS[variant] || styles.up} ${shown ? styles.revealIn : ''} ${className}`}
      style={{...style, transitionDelay: `${delay}ms`}}
      {...rest}>
      {children}
    </Tag>
  );
}
