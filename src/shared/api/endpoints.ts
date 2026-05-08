import type { Board } from '@/entities/board';
import type { User } from '@/entities/user';
import { getAuthToken } from './auth-token';

const jsonHeaders = { 'Content-Type': 'application/json' };

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const parseError = async (res: Response): Promise<ApiError> => {
  try {
    const body = (await res.json()) as { message?: string };
    return new ApiError(body.message ?? res.statusText, res.status);
  } catch {
    return new ApiError(res.statusText, res.status);
  }
};

const authHeader = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchBoards = async (): Promise<Board[]> => {
  const res = await fetch('/api/boards');
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as Board[];
};

export const postBoard = async (name: string): Promise<Board> => {
  const res = await fetch('/api/boards', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as Board;
};

export const patchBoard = async (
  id: string,
  name: string
): Promise<Board> => {
  const res = await fetch(`/api/boards/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as Board;
};

export const deleteBoardRequest = async (id: string): Promise<void> => {
  const res = await fetch(`/api/boards/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await parseError(res);
};

export type AuthSession = { token: string; user: User };

export const postLogin = async (
  email: string,
  password: string
): Promise<AuthSession> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as AuthSession;
};

export const postRegister = async (input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSession> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as AuthSession;
};

export const postLogout = async (): Promise<void> => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw await parseError(res);
};

export const getAuthMe = async (): Promise<User> => {
  const res = await fetch('/api/auth/me', {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as User;
};

export const patchUserMe = async (patch: {
  name?: string;
  avatar?: string | null;
}): Promise<User> => {
  const res = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: { ...jsonHeaders, ...authHeader() },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as User;
};

export { ApiError };
