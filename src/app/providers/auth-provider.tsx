import type { ReactNode } from 'react';
import { useAuthBootstrap } from '@/features/auth-bootstrap';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  useAuthBootstrap();
  return <>{children}</>;
};
