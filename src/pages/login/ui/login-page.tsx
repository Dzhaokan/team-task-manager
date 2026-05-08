import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth-login';
import { ROUTES } from '@/app/router';

export const LoginPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <header className="mb-5">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Sign in to continue to your boards.
      </p>
    </header>
    <LoginForm />
    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      Don&apos;t have an account?{' '}
      <Link
        to={ROUTES.register}
        className="font-medium text-purple-600 hover:underline dark:text-purple-400"
      >
        Create one
      </Link>
    </p>
  </div>
);
