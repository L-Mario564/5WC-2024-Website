import { z } from 'zod';

export const authUserResponseSchema = z.object({
  logged_in_user: z.string(),
  logged_in_user_id: z.number().nullable(),
  discord: z.object({
    id: z.string(),
    username: z.string(),
    avatar: z.string(),
    global_name: z.string()
  }).nullable(),
  osu: z.object({
    avatar_url: z.string(),
    id: z.number(),
    username: z.string(),
    is_restricted: z.boolean(),
    country: z.object({
      code: z.string(),
      name: z.string()
    })
  }).nullable()
});
