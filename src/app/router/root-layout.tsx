import { Outlet } from 'react-router-dom';

export const RootLayout = () => (
  <main className="min-h-screen bg-white dark:bg-gray-900">
    <Outlet />
  </main>
);
