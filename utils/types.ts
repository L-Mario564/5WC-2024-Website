import type { z } from 'zod'
import type { authUserResponseSchema } from './schemas';

export type ErrorInfo = {
  error?: string;
  message: string;
  status: number;
  on: 'ssr' | 'api-route';
  pathname: string;
};

export type AuthUserResponse = z.infer<typeof authUserResponseSchema>;
export type AuthUser = { [K in keyof AuthUserResponse]: NonNullable<AuthUserResponse[K]> };
