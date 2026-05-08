import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { FormError } from '@/shared/ui/form-error';
import { errorMessage } from '@/shared/lib/error-message';
import { registerSchema, type RegisterValues } from '../model/schema';
import { useRegister } from '../api/use-register';

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });
  const mutation = useRegister();

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
        <Input
          autoComplete="name"
          autoFocus
          placeholder="Your name"
          invalid={Boolean(errors.name)}
          {...register('name')}
        />
        <FormError>{errors.name?.message}</FormError>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
        <Input
          type="email"
          autoComplete="email"
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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          invalid={Boolean(errors.password)}
          {...register('password')}
        />
        <FormError>{errors.password?.message}</FormError>
      </label>
      <FormError>
        {mutation.isError &&
          errorMessage(mutation.error, 'Could not create your account.')}
      </FormError>
      <Button type="submit" disabled={mutation.isPending} className="mt-2">
        {mutation.isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
};
