import Logo from '@/components/Logo/Logo';
import styles from './landing.module.scss';

export default function LandingPage() {
  return (
    <div className={styles.fullLogoContainer}>
      <div>
        <Logo className={styles.logo} />
      </div>
      <div className={styles.nameContainer}>
        <span className={styles.five}>5</span>
        <span className={styles.digit}>Digit</span>
        <span className={styles.worldCup}>World Cup</span>
      </div>
    </div>
  );
}
