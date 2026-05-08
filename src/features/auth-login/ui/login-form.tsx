import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { FormError } from '@/shared/ui/form-error';
import { errorMessage } from '@/shared/lib/error-message';
import { loginSchema, type LoginValues } from '../model/schema';
import { useLogin } from '../api/use-login';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const mutation = useLogin();

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
        <Input
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="you@example.com"
          invalid={Boolean(errors.email)}
          {...register('email')}
        />
        <FormError>{errors.email?.message}</FormError>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Password
        </span>
        <Input
          type="password"
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          {...register('password')}
        />
        <FormError>{errors.password?.message}</FormError>
      </label>
      <FormError>
        {mutation.isError && errorMessage(mutation.error, 'Could not sign in.')}
      </FormError>
      <Button type="submit" disabled={mutation.isPending} className="mt-2">
        {mutation.isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
};
