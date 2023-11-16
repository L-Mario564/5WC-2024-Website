'use client';
import Link from 'next/link';
import styles from './NavbarLogo.module.scss';

export default function NavbarLogo() {
  return <Link href="/" className={styles.anchor}>
    <div className={styles.logo}></div>
  </Link>;
}
