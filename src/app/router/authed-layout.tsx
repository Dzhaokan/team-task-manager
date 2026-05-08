import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/widgets/app-header';

export const AuthedLayout = () => (
  <>
    <AppHeader />
    <Outlet />
  </>
);
