import LandingButton from '@/components/Landing/Button/LandingButton';
import BottomLandingBar from '@/components/Landing/Bars/BottomLandingBar';
import TopLandingBar from '@/components/Landing/Bars/TopLandingBar';
import LandingLogo from '@/components/Landing/Logo/LandingLogo';
import styles from './page.module.scss';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <TopLandingBar />
      <div className={styles.content}>
        <LandingLogo />
        <div className={styles.divider}></div>
        <span>RULESET - DATE</span>
        <LandingButton />
      </div>
      <BottomLandingBar />
    </div>
  );
}
