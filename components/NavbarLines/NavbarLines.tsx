'use client';
import styles from './NavbarLines.module.scss';

export default function NavbarLines() {
  return (
    <div className={styles.container}>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
    </div>
  );
}
