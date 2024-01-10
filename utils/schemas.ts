import { z } from 'zod';

// Note: This is not the full response object, only the "most important" keys are present. If any other key is necessary from the full response, add it here 
export const authUserResponseSchema = z.object({
  logged_in_user: z.string(),
  logged_in_user_id: z.number().nullable(),
  discord: z.object({
    id: z.string(),
    username: z.string(),
    avatar: z.string().nullable(),
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

export const playerSchema = z.object({
  user_id: z.number().int(),
  discord_user_id: z.string(),
  discord_username: z.string(),
  osu_user_id: z.number().int(),
  osu_username: z.string()
});

export const teamSchema = z.object({
  osu_flag: z.string(),
  roster: z.array(playerSchema),
  candidates: z.array(playerSchema)
});
