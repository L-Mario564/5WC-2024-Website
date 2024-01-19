import type { z } from 'zod';
import type { authUserResponseSchema, playerSchema, teamSchema } from './schemas';

export type ClientError = {
  statusCode?: number;
  info: string;
};

export type AuthUserResponse = z.infer<typeof authUserResponseSchema>;
export type AuthUser = { [K in keyof AuthUserResponse]: NonNullable<AuthUserResponse[K]> } & {
  is_organizer: boolean;
};

export type Team = z.infer<typeof teamSchema>;
export type Player = z.infer<typeof playerSchema>;
