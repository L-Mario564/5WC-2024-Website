'use client';
import type { ClientError } from '@/utils/types';
import styles from './Toast.module.scss'

type Props = {
  error: ClientError;
};

export default function Toast({ error }: Props) {
  return (
    <div className={styles.toast}>
      <div className={styles.code}>Error{error?.statusCode ? ': ' + error.statusCode : ''}</div>
      <div>{error?.info}</div>
    </div>
  );
}
