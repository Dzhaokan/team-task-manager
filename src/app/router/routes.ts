export const ROUTES = {
  boards: '/',
  board: (id: string) => `/boards/${id}`,
} as const;

export const BOARD_ROUTE_PATTERN = '/boards/:boardId';
