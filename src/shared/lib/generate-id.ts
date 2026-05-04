export const generateId = (prefix: string): string =>
  `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
