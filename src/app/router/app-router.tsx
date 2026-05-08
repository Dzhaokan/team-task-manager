import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { BoardPage } from '@/pages/board';
import { BoardsPage } from '@/pages/boards';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { ProfilePage } from '@/pages/profile';
import { ROUTES, BOARD_ROUTE_PATTERN } from './routes';
import { RootLayout } from './root-layout';
import { ProtectedRoute } from './protected-route';
import { GuestRoute } from './guest-route';
import { AuthedLayout } from './authed-layout';
import { GuestLayout } from './guest-layout';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthedLayout />,
            children: [
              { path: ROUTES.boards, element: <BoardsPage /> },
              { path: BOARD_ROUTE_PATTERN, element: <BoardPage /> },
              { path: ROUTES.profile, element: <ProfilePage /> },
            ],
          },
        ],
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: <GuestLayout />,
            children: [
              { path: ROUTES.login, element: <LoginPage /> },
              { path: ROUTES.register, element: <RegisterPage /> },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={ROUTES.boards} replace /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
