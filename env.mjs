import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const defaultUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_ORIGIN: z.string().url(),
    NEXT_PUBLIC_MAIN_SHEET_URL: z.string().url(),
    NEXT_PUBLIC_DISCORD_SERVER_INVITE: z.string().url(),
    NEXT_PUBLIC_TEAM_MIN_PLAYERS: z.number().int(),
    NEXT_PUBLIC_TEAM_MAX_PLAYERS: z.number().int(),
    NEXT_PUBLIC_REGISTRATION_END_DATE: z.number().int()
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ORIGIN: process.env.NEXT_PUBLIC_ORIGIN,
    NEXT_PUBLIC_MAIN_SHEET_URL: process.env.NEXT_PUBLIC_MAIN_SHEET_URL || defaultUrl,
    NEXT_PUBLIC_DISCORD_SERVER_INVITE: process.env.NEXT_PUBLIC_DISCORD_SERVER_INVITE || defaultUrl,
    NEXT_PUBLIC_TEAM_MIN_PLAYERS: Number(process.env.NEXT_PUBLIC_TEAM_MIN_PLAYERS),
    NEXT_PUBLIC_TEAM_MAX_PLAYERS: Number(process.env.NEXT_PUBLIC_TEAM_MAX_PLAYERS),
    NEXT_PUBLIC_REGISTRATION_END_DATE: Number(process.env.NEXT_PUBLIC_REGISTRATION_END_DATE)
  },
  skipValidation: false
});
