import type { Board } from '@/entities/board';
import { SEED_BOARDS } from '@/entities/board';
import type { User } from '@/entities/user';
import { USERS } from '@/entities/user';
import { generateId } from '@/shared/lib/generate-id';

const STORAGE_KEY = 'mock-db-v2';

type UserRecord = User & { passwordHash: string };

type DbShape = {
  boards: Board[];
  users: UserRecord[];
};

const mockHash = (password: string): string => btoa(password);

const SEED_USER_RECORDS: UserRecord[] = USERS.map((u) => ({
  ...u,
  passwordHash: mockHash('password123'),
}));

const seedDb = (): DbShape => ({
  boards: [...SEED_BOARDS],
  users: SEED_USER_RECORDS.map((u) => ({ ...u })),
});

const loadDb = (): DbShape => {
  if (typeof localStorage === 'undefined') return seedDb();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedDb();
  try {
    return JSON.parse(raw) as DbShape;
  } catch {
    return seedDb();
  }
};

const db: DbShape = loadDb();

const saveDb = (): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.warn('failed to save db', err);
  }
};

const toPublicUser = (record: UserRecord): User => ({
  id: record.id,
  name: record.name,
  email: record.email,
  avatar: record.avatar,
});

export const listBoards = (): Board[] => [...db.boards];

export const findBoard = (id: string): Board | undefined =>
  db.boards.find((b) => b.id === id);

export const createBoard = (name: string): Board => {
  const board: Board = {
    id: generateId('b'),
    name,
    createdAt: new Date().toISOString(),
  };
  db.boards.push(board);
  saveDb();
  return board;
};

export const renameBoard = (id: string, name: string): Board | null => {
  const board = db.boards.find((b) => b.id === id);
  if (!board) return null;
  board.name = name;
  saveDb();
  return board;
};

export const deleteBoard = (id: string): boolean => {
  const i = db.boards.findIndex((b) => b.id === id);
  if (i === -1) return false;
  db.boards.splice(i, 1);
  saveDb();
  return true;
};

export const tokenForUser = (id: string): string => `tok-${id}`;

const findRecordByEmail = (email: string): UserRecord | undefined =>
  db.users.find((u) => u.email === email.toLowerCase());

export const findUserByEmail = (email: string): User | null => {
  const record = findRecordByEmail(email);
  return record ? toPublicUser(record) : null;
};

export const findUserById = (id: string): User | null => {
  const record = db.users.find((u) => u.id === id);
  return record ? toPublicUser(record) : null;
};

export const findUserByToken = (token: string): User | null => {
  if (!token.startsWith('tok-')) return null;
  return findUserById(token.slice(4));
};

export const verifyCredentials = (
  email: string,
  password: string
): User | null => {
  const record = findRecordByEmail(email);
  if (!record || record.passwordHash !== mockHash(password)) return null;
  return toPublicUser(record);
};

export const createUser = (input: {
  name: string;
  email: string;
  password: string;
}): User => {
  const record: UserRecord = {
    id: generateId('u'),
    name: input.name,
    email: input.email.toLowerCase(),
    avatar: null,
    passwordHash: mockHash(input.password),
  };
  db.users.push(record);
  saveDb();
  return toPublicUser(record);
};

export const updateUser = (
  id: string,
  patch: Partial<Pick<User, 'name' | 'avatar'>>
): User | null => {
  const record = db.users.find((u) => u.id === id);
  if (!record) return null;
  if (patch.name !== undefined) record.name = patch.name;
  if (patch.avatar !== undefined) record.avatar = patch.avatar;
  saveDb();
  return toPublicUser(record);
};
