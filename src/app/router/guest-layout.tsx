import { Outlet } from 'react-router-dom';

export const GuestLayout = () => (
  <div className="flex min-h-screen items-center justify-center px-4 py-10">
    <div className="w-full max-w-sm">
      <Outlet />
    </div>
  </div>
);
