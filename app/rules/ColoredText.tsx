import type { ReactNode } from 'react';

type Props = {
  color: string;
  children: ReactNode;
};

export default function Color({ color, children }: Props) {
  return <span style={{ color }}>{children}</span>;
}
