import { z } from 'zod';
import { env } from '@/utils';

const paginationSchema = z
  .string()
  .url()
  .nullable()
  .transform((url) => {
    if (!url) return url;
    const urlObj = new URL(url);
    return url
      ? `${env.NEXT_PUBLIC_ORIGIN}${urlObj.pathname}${
          urlObj.searchParams.size === 0 ? '' : '?' + urlObj.searchParams.toString()
        }`
      : url;
  });

// Note: This is not the full response object, only the "most important" keys are present. If any other key is necessary from the full response, add it here
export const authUserResponseSchema = z.object({
  logged_in_user: z.string(),
  logged_in_user_id: z.number().nullable(),
  discord: z
    .object({
      id: z.string(),
      username: z.string(),
      avatar: z.string().nullable(),
      global_name: z.string().nullable()
    })
    .nullable(),
  osu: z
    .object({
      avatar_url: z.string(),
      id: z.number(),
      username: z.string(),
      is_restricted: z.boolean(),
      country: z.object({
        code: z.string(),
        name: z.string()
      })
    })
    .nullable()
});

export const playerSchema = z.object({
  user_id: z.number().int(),
  discord_user_id: z.string(),
  discord_username: z.string(),
  osu_user_id: z.number().int(),
  osu_username: z.string(),
  in_roster: z.boolean(),
  in_backup_roster: z.boolean(),
  rank_standard: z.number().int().nullable(),
  rank_standard_bws: z.number().nullable()
});

export const teamSchema = z.object({
  osu_flag: z.string(),
  roster: z.array(playerSchema),
  backups: z.array(playerSchema),
  candidates: z.object({
    count: z.number().int(),
    next: paginationSchema,
    previous: paginationSchema,
    results: z.array(playerSchema)
  })
});
