import { z } from 'zod';

// Note: This is not the full response object, only the "most important" keys are present. If any other key is necessary from the full response, add it here 
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
