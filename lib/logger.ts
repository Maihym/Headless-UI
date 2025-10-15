const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (...args: any[]) => isDev && console.log(...args),
  info: console.info,
  warn: console.warn,
  error: console.error,
};

