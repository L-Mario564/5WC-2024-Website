import type { ErrorInfo } from '../types';

export class FiveWCServerError extends Error {
  constructor(info: ErrorInfo) {
    let msg = `At ${new Date().toUTCString()}\n`
      + `Details: ${info.status} status code `
      + `on path "${info.pathname}" ${info.on === 'api-route' ? '(API route)' : '(during server-side render)'}`;
    
    if (info.error) {
      msg += `\nResponse data: ${info.error}\n`;
    }

    super(msg);
  }
}
