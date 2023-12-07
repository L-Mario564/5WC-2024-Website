//import { FiveWCServerError } from '.';
import { buildApiUrl } from '..';

export const redirects = {
  promptLogin: (auth: 'osu' | 'discord', redirectUrl: string) => buildApiUrl(`/auth/${auth}/prompt_login/?return_page=${encodeURI(redirectUrl)}`)
};

// export async function login(pathname: string) {
//   const resp = await fetch(buildApiUrl('/auth/session/login'));

//   if (!resp.ok) {
//     throw new FiveWCServerError({
//       error: await resp.text(),
//       message: 'An error ocurred while trying to login',
//       on: 'api-route',
//       status: resp.status,
//       pathname
//     });
//   }

//   return await resp.json() as {
//     ok: 'logged in';
//     user: string;
//   };
// }
