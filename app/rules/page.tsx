'use client';

import RulesMDX from './5WC_Rules_Full.mdx';
import styles from './rules.module.scss';

export default function RulesPage() {
  return (
    <div className={styles.container}>
      <RulesMDX />
    </div>
  );
}