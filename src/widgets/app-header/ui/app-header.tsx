import { Link } from 'react-router-dom';
import { selectCurrentUser, useAuthStore } from '@/app/store/authStore';
import { ROUTES } from '@/app/router';
import { UserMenu } from './user-menu';

export const AppHeader = () => {
  const user = useAuthStore(selectCurrentUser);

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to={ROUTES.boards}
          className="text-sm font-semibold tracking-tight text-gray-900 hover:text-purple-600 dark:text-gray-100 dark:hover:text-purple-400"
        >
          Team Task Manager
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {user && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
};
