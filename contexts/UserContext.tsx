'use client';
import { useState, useMemo, createContext } from 'react';
import { useAsyncEffect, useError } from '@/utils/hooks';
import { buildApiUrl } from '@/utils';
import { authUserResponseSchema } from '@/utils/schemas';
import { z } from 'zod';
import type { ReactNode } from 'react';
import type { AuthUser } from '@/utils/types';

// undefined means that it hasn't fetched data, null means that the user isn't login
export const UserContext = createContext<AuthUser | null | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export default function UserProvider({ children }: Props): JSX.Element {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const { setError } = useError();

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
      const message = 'Failed to get session data';
      const data = await resp?.text();

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message,
        statusCode: resp?.status
      });
      return;
    }

    let data = await resp.text();
    const parsedUser = authUserResponseSchema.safeParse(JSON.parse(data));

    if (!parsedUser.success) {
      const message = `Server (at "${url}") sent a response different than the one expected while getting the session data`;

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message
      });
      return;
    }

    const user = parsedUser.data;

    if (user.logged_in_user_id === null || user.osu === null || user.discord === null) {
      setUser(null);
      return;
    }

    url = buildApiUrl(`/registrants/${user.logged_in_user_id}`);

    try {
      resp = await fetch(url, {
        credentials: 'include'
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const message = 'Failed to get registrant data';
      const data = await resp?.text();

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message,
        statusCode: resp?.status
      });
      return;
    }

    data = await resp.text();
    const parsedRegistrant = z
      .object({
        is_organizer: z.boolean()
      })
      .safeParse(JSON.parse(data));

    if (!parsedRegistrant.success) {
      const message = `Server (at "${url}") sent a response different than the one expected while getting the registrant data`;

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message
      });
      return;
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
