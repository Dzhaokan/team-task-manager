import { useNavigate } from 'react-router-dom';
import { Avatar, type User } from '@/entities/user';
import { Menu } from '@/shared/ui/menu';
import { useLogout } from '@/features/auth-logout';
import { ROUTES } from '@/app/router';

type UserMenuProps = {
  user: User;
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <Menu
      align="right"
      trigger={({ onClick, ...rest }) => (
        <button
          type="button"
          onClick={onClick}
          {...rest}
          className="inline-flex items-center gap-2 rounded-full border border-transparent p-0.5 pr-2 text-sm font-medium text-gray-700 hover:border-gray-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800"
        >
          <Avatar name={user.name} src={user.avatar} size="md" />
          <span className="hidden sm:inline">{user.name}</span>
        </button>
      )}
      items={[
        { label: 'Profile', onSelect: () => navigate(ROUTES.profile) },
        {
          label: 'Log out',
          variant: 'danger',
          onSelect: () => logout.mutate(),
        },
      ]}
    />
  );
};
