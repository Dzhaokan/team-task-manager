import type { Board } from '@/entities/board';

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

export { ApiError };
