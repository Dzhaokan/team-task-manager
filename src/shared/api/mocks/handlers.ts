import { http, HttpResponse, delay } from 'msw';
import {
  createBoard,
  createUser,
  deleteBoard,
  findUserByEmail,
  findUserByToken,
  listBoards,
  renameBoard,
  tokenForUser,
  updateUser,
  verifyCredentials,
} from './db';

const LATENCY_MS = 200;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 1;
const NAME_MAX = 60;
const PASSWORD_MIN = 6;
const AVATAR_MAX_CHARS = 350_000;

type NamePayload = { name?: unknown };

const readName = (body: unknown): string | null => {
  if (typeof body !== 'object' || body === null) return null;
  const { name } = body as NamePayload;
  if (typeof name !== 'string') return null;
  const trimmed = name.trim();
  return trimmed.length === 0 ? null : trimmed;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const errorJson = (message: string, status: number) =>
  HttpResponse.json({ message }, { status });

const readBearerToken = (request: Request): string | null => {
  const header = request.headers.get('Authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
};

const requireUser = (request: Request) => {
  const token = readBearerToken(request);
  const user = token ? findUserByToken(token) : null;
  if (!user) return { user: null, error: errorJson('Unauthorized', 401) };
  return { user, error: null };
};

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
      return errorJson('Please provide a board name.', 400);
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
      return errorJson('Please provide a board name.', 400);
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

  http.post('/api/auth/register', async ({ request }) => {
    await delay(LATENCY_MS);
    const body = (await request.json().catch(() => null)) as unknown;
    if (!isObject(body)) return errorJson('Invalid payload.', 400);

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      return errorJson('Name must be 1-60 characters.', 400);
    }
    if (!EMAIL_RE.test(emailRaw)) {
      return errorJson('Enter a valid email.', 400);
    }
    if (password.length < PASSWORD_MIN) {
      return errorJson('Password must be at least 6 characters.', 400);
    }

    const email = emailRaw.toLowerCase();
    if (findUserByEmail(email)) {
      return errorJson('Email is already in use.', 409);
    }

    const user = createUser({ name, email, password });
    return HttpResponse.json(
      { token: tokenForUser(user.id), user },
      { status: 201 }
    );
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(LATENCY_MS);
    const body = (await request.json().catch(() => null)) as unknown;
    if (!isObject(body)) return errorJson('Invalid payload.', 400);

    const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!EMAIL_RE.test(emailRaw) || password.length < PASSWORD_MIN) {
      return errorJson('Invalid email or password.', 400);
    }

    const user = verifyCredentials(emailRaw.toLowerCase(), password);
    if (!user) {
      return errorJson('Invalid email or password.', 401);
    }

    return HttpResponse.json({ token: tokenForUser(user.id), user });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(LATENCY_MS);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(LATENCY_MS);
    const { user, error } = requireUser(request);
    if (error) return error;
    return HttpResponse.json(user);
  }),

  http.patch('/api/users/me', async ({ request }) => {
    await delay(LATENCY_MS);
    const { user, error } = requireUser(request);
    if (error) return error;

    const body = (await request.json().catch(() => null)) as unknown;
    if (!isObject(body)) return errorJson('Invalid payload.', 400);

    const patch: { name?: string; avatar?: string | null } = {};

    if (body.name !== undefined) {
      if (typeof body.name !== 'string') {
        return errorJson('Name must be a string.', 400);
      }
      const trimmed = body.name.trim();
      if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
        return errorJson('Name must be 1-60 characters.', 400);
      }
      patch.name = trimmed;
    }

    if (body.avatar !== undefined) {
      if (body.avatar === null) {
        patch.avatar = null;
      } else if (typeof body.avatar !== 'string') {
        return errorJson('Avatar must be a data URL or null.', 400);
      } else if (!body.avatar.startsWith('data:image/')) {
        return errorJson('Avatar must be a data:image/* URL.', 400);
      } else if (body.avatar.length > AVATAR_MAX_CHARS) {
        return errorJson('Avatar image is too large.', 400);
      } else {
        patch.avatar = body.avatar;
      }
    }

    const updated = updateUser(user.id, patch);
    if (!updated) return errorJson('User not found.', 404);
    return HttpResponse.json(updated);
  }),
];
