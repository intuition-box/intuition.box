import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { TextType } from '../TextAnimations/TextType';
import { DecryptedText } from '../TextAnimations/DecryptedText';

const loopWords = [
  'makers',
  'dreamers',
  'designers',
  'coders',
  'artists',
  'builders',
  'tinkerers',
  'everyone',
  'you',
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Change word every 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % loopWords.length);
    }, 2000);
    return () => clearTimeout(timer);
  }, [index]);

  const word = loopWords[index];

  let loopNode: React.ReactNode;
  if (word === 'coders') {
    loopNode = (
      <DecryptedText
        text={word}
        duration={800}
        chars="@3<01>&#*"
        style={{ color: 'inherit' }}
      />
    );
  } else {
    loopNode = (
      <TextType
        text={word}
        duration={700}
        cursor
        cursorBlink
        style={{ color: 'inherit' }}
      />
    );
  }

  return (
    <div className={styles.parallax}>
      <section className={styles.hero}>
        <h1>INTUITION.BOX</h1>
        <h2>
          An online community where anyone can create, share, and build open projects for the common good.
        </h2>
        <h3 className={styles.textLoop}>
          A hub for&nbsp;
          <span className={styles.textLoopWord}>{loopNode}</span>
        </h3>
      </section>
    </div>
  );
}
