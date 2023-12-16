import { env } from '@/env.mjs';
import { redirects } from '@/utils/server/api';
import { redirect } from 'next/navigation';

export function GET() {
  const url = redirects.promptLogin('osu', env.NEXT_PUBLIC_ORIGIN + '/api/auth/discord');
  redirect(url);
}
