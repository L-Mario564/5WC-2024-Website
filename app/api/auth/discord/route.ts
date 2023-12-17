// @ts-ignore The current file is a CommonJS module whose imports will produce 'require' calls;
import { env } from '@/env.mjs';
import { redirects } from '@/utils/server/api';
import { redirect } from 'next/navigation';

export function GET() {
  const url = redirects.promptLogin('discord', env.NEXT_PUBLIC_ORIGIN + '/login');
  redirect(url);
}
