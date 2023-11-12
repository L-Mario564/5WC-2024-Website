'use client';
import logo from '@/public/landing-header.svg';
import Image from 'next/image';
import styles from './logo.module.scss';

export default function LandingLogo() {
  return (
    <div className={styles.logo}>
      <Image src={logo} alt="5WC Logo"></Image>
    </div>
  );
}
