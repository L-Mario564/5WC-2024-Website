import LandingButton from '@/components/LandingButton/LandingButton';
import BottomLandingBar from 'components/LandingBars/BottomLandingBar';
import TopLandingBar from 'components/LandingBars/TopLandingBar';
import LandingLogo from 'components/LandingLogo/LandingLogo';
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
