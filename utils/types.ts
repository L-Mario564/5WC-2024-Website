export type ErrorInfo = {
  error?: string;
  message: string;
  status: number;
  on: 'ssr' | 'api-route';
  pathname: string;
};
