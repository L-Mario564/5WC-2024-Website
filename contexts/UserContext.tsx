'use client';
import { useState, useMemo, createContext } from 'react';
import { useAsyncEffect } from '@/utils/hooks';
import { buildApiUrl } from '@/utils';
import { authUserResponseSchema } from '@/utils/schemas';
import { z } from 'zod';
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
    let url = buildApiUrl('/auth/session');

    try {
      resp = await fetch(url, {
        credentials: 'include'
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const data = await resp?.text();
      console.info('Response: ' + data);
      // TODO: Display error to user
      return;
    }

    let data = await resp.text();
    const parsedUser = authUserResponseSchema.safeParse(JSON.parse(data));

    if (!parsedUser.success) {
      // TODO: Display error to user / improve error handling
      console.info('Response: ' + data);
      throw Error(`Server (at "${url}") sent a response different than the one expected`);
    }

    const user = parsedUser.data;

    if (user.logged_in_user_id === null || user.osu === null || user.discord === null) return;

    url = buildApiUrl(`/registrants/${user.logged_in_user_id}`);

    try {
      resp = await fetch(url, {
        credentials: 'include'
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const data = await resp?.text();
      console.info('Response: ' + data);
      // TODO: Display error to user
      return;
    }

    data = await resp.text();
    const parsedRegistrant = z
      .object({
        is_organizer: z.boolean()
      })
      .safeParse(JSON.parse(data));

    if (!parsedRegistrant.success) {
      // TODO: Display error to user / improve error handling
      console.info('Response: ' + data);
      throw Error(`Server (at "${url}") sent a response different than the one expected`);
    }

    const registrant = parsedRegistrant.data;

    setUser({
      ...user,
      ...registrant
    } as AuthUser);
  }, []);

  return (
    <UserContext.Provider value={useMemo(() => user, [user])}>{children}</UserContext.Provider>
  );
}
