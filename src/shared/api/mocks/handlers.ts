import { http, HttpResponse, delay } from 'msw';
import {
  listBoards,
  createBoard,
  renameBoard,
  deleteBoard,
} from './db';

const LATENCY_MS = 200;

type NamePayload = { name?: unknown };

const readName = (body: unknown): string | null => {
  if (!body || typeof body !== 'object') return null;
  const { name } = body as NamePayload;
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  return trimmed.length === 0 ? null : trimmed;
};

const errorJson = (message: string, status: number) =>
  HttpResponse.json({ message }, { status });

export const handlers = [
  http.get('/api/boards', async () => {
    await delay(LATENCY_MS);
    return HttpResponse.json(listBoards());
  }),

  http.post('/api/boards', async ({ request }) => {
    await delay(LATENCY_MS);
    const body = (await request.json().catch(() => null)) as unknown;
    const name = readName(body);
    if (!name) {
      return errorJson('Board name is required.', 400);
    }
    const board = createBoard(name);
    return HttpResponse.json(board, { status: 201 });
  }),

  http.patch('/api/boards/:id', async ({ params, request }) => {
    await delay(LATENCY_MS);
    const id = String(params.id);
    const body = (await request.json().catch(() => null)) as unknown;
    const name = readName(body);
    if (!name) {
      return errorJson('Board name is required.', 400);
    }
    const board = renameBoard(id, name);
    if (!board) {
      return errorJson('Board not found.', 404);
    }
    return HttpResponse.json(board);
  }),

  http.delete('/api/boards/:id', async ({ params }) => {
    await delay(LATENCY_MS);
    const id = String(params.id);
    const ok = deleteBoard(id);
    if (!ok) {
      return errorJson('Board not found.', 404);
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
