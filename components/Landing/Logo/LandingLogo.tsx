'use client';
import logo from '@/public/landing-header.svg';
import Image from 'next/image';
import styles from './LandingLogo.module.scss';

export default function LandingLogo() {
  return (
    <div className={styles.logoContainer}>
      <Image src={logo} alt="5WC Logo" fill />
    </div>
  );
}
