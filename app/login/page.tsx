'use client';
import { buildApiUrl } from '@/utils';
import { useRouter } from 'next/navigation';
import { useAsyncEffect } from '@/utils/hooks';
import styles from './login.module.scss';

export default function LoginPage() {
  const router = useRouter();

  useAsyncEffect(async () => {
    let resp: Response | undefined;

    try {
      resp = await fetch(buildApiUrl('/auth/session/login'), {
        credentials: 'include'
      });
    } catch(err) {
      console.error(err);
    }
    
    
    if (!resp?.ok) {
      const data = await resp?.text();
      console.info('Response: ' + data);
      // TODO: Display error to user
      return;
    }

    router.push('/');
  }, []);

  return <div className={styles.container}>
    <span>Logging into 5WC, please wait a moment...</span>
  </div>;
}
