import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from '../../components/Sudoku/styles.module.css';

export default function SudokuPage() {
  return (
    <Layout title="Daily Sudoku" description="A new classic and killer sudoku every day.">
      <main className="container margin-vert--lg">
        <h1 className={styles.title}>Daily Sudoku</h1>
        {/* Puzzles depend on the visitor's clock, so render in the browser only. */}
        <BrowserOnly fallback={<p className={styles.meta}>Loading puzzle…</p>}>
          {() => {
            const Game = require('../../components/Sudoku/Game').default;
            return <Game />;
          }}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
