import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthed, useAuthStore } from '@/app/store/authStore';
import { ROUTES } from './routes';

export const ProtectedRoute = () => {
  const isAuthed = useAuthStore(selectIsAuthed);
  const location = useLocation();

  if (!isAuthed) {
    return (
      <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
};
