'use client';
import { buildApiUrl, env } from '@/utils';
import { useAsyncEffect } from '@/utils/hooks';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [shouldFetch, setShouldFetchedState] = useState(false);

  // We do an additional side-effect due to the dev server running the mounting side-effect twice instead of once
  useEffect(() => {
    setShouldFetchedState(true);
  }, []);
  
  useAsyncEffect(async () => {
    if (!shouldFetch) return;
    let resp: Response | undefined;

    try {
      resp = await fetch(buildApiUrl('/auth/session/login'), {
        credentials: 'include',
        cache: 'no-cache'
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

    console.info(await resp.text());
    location.href = `${env.NEXT_PUBLIC_ORIGIN}?prompt_discord=true`;
  }, [shouldFetch]);

  return <div className='simple-message-container'>
    <span>Logging into 5WC, please wait a moment...</span>
  </div>;
}
