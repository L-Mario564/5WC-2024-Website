'use client';
import clsx from 'clsx';
import styles from './bars.module.scss';

export default function BottomLandingBar() {
  return <div className={clsx(styles.bar, styles.bottom)}></div>;
}
