import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

// Reveal children with a fade/slide once they scroll into view.
export default function Reveal({children, className = '', delay = 0, as: Tag = 'div', ...rest}) {
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
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.15},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${shown ? styles.revealIn : ''} ${className}`}
      style={{transitionDelay: `${delay}ms`}}
      {...rest}>
      {children}
    </Tag>
  );
}
