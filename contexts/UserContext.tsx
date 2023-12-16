'use client';
import { useState, useMemo, createContext } from 'react';
import { useAsyncEffect } from '@/utils/hooks';
import { buildApiUrl } from '@/utils';
import { authUserResponseSchema } from '@/utils/schemas';
import type { ReactNode } from 'react';
import type { AuthUser } from '@/utils/types';

export const UserContext = createContext<AuthUser | null>(null);

type Props = {
  children: ReactNode;
};

export default function UserProvider({ children }: Props): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  
  useAsyncEffect(async (): Promise<void> => {
    let resp: Response | undefined;
    const url = buildApiUrl('/auth/session/login');

    try {
      resp = await fetch(url);
    } catch(err) {
      console.error(err);
    }
    
    
    if (!resp?.ok) {
      const data = await resp?.text();
      console.info('Response: ' + data);
      // TODO: Display error to user
      return;
    }

    const data = await resp.json();
    const parsed = authUserResponseSchema.safeParse(data);

    if (!parsed.success) {
      // TODO: Display error to user / improve error handling
      throw Error(`Server (at "${url}") sent a response different than the one expected`);
    }

    const user = parsed.data;

    if (user.logged_in_user_id !== null && user.osu !== null && user.discord !== null) {
      setUser(user as AuthUser);
    }
  }, []);

  return <UserContext.Provider value={useMemo(() => user, [user])}>
    {children}
  </UserContext.Provider>;
}