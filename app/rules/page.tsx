'use client';
import RulesMDX from './5WC_Rules_Full.mdx';
import { useEffect } from 'react';
import { wrapTables } from '@/utils';
import styles from './rules.module.scss';

export default function RulesPage() {
  useEffect(() => {
    try {
      wrapTables('.markdown');
    } catch {
      // This is wrapped in a try/catch block because useEffect runs twice upon loading the page and the second time it runs it throws an error
    }
  }, []);

  return (
    <div className={`${styles.container} markdown`}>
      <RulesMDX />
    </div>
  );
}
