import { env } from '@/env.mjs';

export function buildApiUrl(endpoint: string) {
  return `${env.NEXT_PUBLIC_API_URL}${endpoint}`;
}
