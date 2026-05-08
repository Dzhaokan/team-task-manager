export const ROUTES = {
  boards: '/',
  board: (id: string) => `/boards/${id}`,
  login: '/login',
  register: '/register',
  profile: '/profile',
} as const;

export const BOARD_ROUTE_PATTERN = '/boards/:boardId';
