import { Link } from 'react-router-dom';
import { RegisterForm } from '@/features/auth-register';
import { ROUTES } from '@/app/router';

export const RegisterPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <header className="mb-5">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        It only takes a few seconds.
      </p>
    </header>
    <RegisterForm />
    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      Already have an account?{' '}
      <Link
        to={ROUTES.login}
        className="font-medium text-purple-600 hover:underline dark:text-purple-400"
      >
        Sign in
      </Link>
    </p>
  </div>
);
