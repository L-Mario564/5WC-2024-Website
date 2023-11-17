'use client';
import flowerSVG from '@/public/flower.svg';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Landingbutton.module.scss';

export default function LandingButton() {
  return (
    <Link className={styles.button} href={''}>
      <span className={styles.border} />
      <span className={styles.text}>REGISTER NOW</span>
      <div className={styles.flower}>
        <Image src={flowerSVG} fill alt="flower" />
      </div>
    </Link>
  );
}
