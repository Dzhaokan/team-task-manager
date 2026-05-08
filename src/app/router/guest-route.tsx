import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthed, useAuthStore } from '@/app/store/authStore';
import { ROUTES } from './routes';

type LocationState = { from?: string } | null;

export const GuestRoute = () => {
  const isAuthed = useAuthStore(selectIsAuthed);
  const location = useLocation();

  if (isAuthed) {
    const state = location.state as LocationState;
    return <Navigate to={state?.from ?? ROUTES.boards} replace />;
  }

  return <Outlet />;
};
