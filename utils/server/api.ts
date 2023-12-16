import { buildApiUrl } from '..';

export const redirects = {
  promptLogin: (auth: 'osu' | 'discord', redirectUrl: string) => buildApiUrl(`/auth/${auth}/prompt_login/?return_page=${encodeURI(redirectUrl)}`)
};
