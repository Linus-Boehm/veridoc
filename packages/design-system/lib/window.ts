export const isClient = typeof window !== 'undefined';
export const isWindowApiSupported = (api: string) => isClient && api in window;

const warnOnceCache = new Map();
export const warnOnce = (message: string) => {
  if (warnOnceCache.has(message)) return;

  warnOnceCache.set(message, true);

  console.warn(message);
};