import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { BoardPage } from '@/pages/board';
import { BoardsPage } from '@/pages/boards';
import { ROUTES, BOARD_ROUTE_PATTERN } from './routes';
import { RootLayout } from './root-layout';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.boards, element: <BoardsPage /> },
      { path: BOARD_ROUTE_PATTERN, element: <BoardPage /> },
      { path: '*', element: <Navigate to={ROUTES.boards} replace /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
