import { redirects } from '@/utils/server/api';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export function GET({ nextUrl }: NextRequest) {
  const url = redirects.promptLogin('discord', nextUrl.origin + '/login');
  redirect(url);
}
