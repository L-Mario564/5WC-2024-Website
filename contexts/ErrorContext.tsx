'use client';
import { useState, useMemo, createContext, useEffect } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { ClientError } from '@/utils/types';

export const SetErrorContext = createContext<Dispatch<SetStateAction<ClientError | undefined>>>(undefined as any);
export const ErrorContext = createContext<ClientError | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export default function ErrorProvider({ children }: Props): JSX.Element {
  const [error, setError] = useState<ClientError | undefined>();

  useEffect(() => {
    if (!error) return;
    setTimeout(() => setError(undefined), 6000);
  }, [error]);

  return (
    <SetErrorContext.Provider value={useMemo(() => setError, [setError])}>
      <ErrorContext.Provider value={useMemo(() => error, [error])}>{children}</ErrorContext.Provider>
    </SetErrorContext.Provider>
  );
}
