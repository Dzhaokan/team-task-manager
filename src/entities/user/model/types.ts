export type UserId = string;

export type User = {
  id: UserId;
  name: string;
  email: string;
  avatar: string | null;
};

export const NO_AUTHOR = 'none' as const;
export type NoAuthor = typeof NO_AUTHOR;

export type AuthorFilterValue = UserId | NoAuthor;
