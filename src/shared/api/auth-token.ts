let read: () => string | null = () => null;

export const setAuthTokenGetter = (fn: () => string | null) => {
  read = fn;
};

export const getAuthToken = (): string | null => read();
