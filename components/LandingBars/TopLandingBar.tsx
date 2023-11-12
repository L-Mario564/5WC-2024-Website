'use client';
import clsx from 'clsx';
import styles from './bars.module.scss';

export default function TopLandingBar() {
  return (
    <div className={clsx(styles.bar, styles.top)}>
      <span>5 digit world cup</span>
    </div>
  );
}
