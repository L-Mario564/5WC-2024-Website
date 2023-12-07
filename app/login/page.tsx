'use client';
import { buildApiUrl } from '@/utils';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    (async () => {
      const resp = await fetch(buildApiUrl('/auth/session/login'));

      if (!resp.ok) {
        // TODO: Display error to user
        return;
      }

      redirect('/');
    })();
  });

  return <></>;
}
