// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore The current file is a CommonJS module whose imports will produce 'require' calls;
import { env } from '@/env.mjs';

/**
 * Wraps tables parsed from markdown to make them responsive
 */
export function wrapTables(querySelector: string) {
  const content = document.querySelector(querySelector);
  const tables = document.querySelectorAll('table');

  if (!content) return;

  tables.forEach((el) => {
    const div = document.createElement('div');
    div.style.overflowX = 'auto';
    div.appendChild(el.cloneNode(true));

    if (content.contains(el)) {
      content.replaceChild(div, el);
    }
  });
}

export function buildApiUrl(endpoint: string) {
  return `${env.NEXT_PUBLIC_API_URL}${endpoint}`;
}

export function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]?.trim() || '';

      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

export function formatRank(n: number) {
  return `#${Math.round(n).toLocaleString('en-US')}`;
}

export function formatTimeLeft(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const thresholds = {
    years: 31536000,
    months: 2592000,
    days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1
  };

  for (const unit in thresholds) {
    const threshold = thresholds[unit as keyof typeof thresholds];
    const delta = Math.round(Math.abs(diffInSeconds) / threshold);

    if (delta >= 1) {
      const unitLabel = delta === 1 ? unit.slice(0, -1) : unit;
      return `${delta} ${unitLabel}`;
    }
  }

  return '0 seconds';
}

export { env };
