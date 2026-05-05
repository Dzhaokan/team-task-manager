import { forwardRef, type InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, type = 'text', ...rest },
  ref
) {
  const borderClasses = invalid
    ? 'border-rose-500 focus:ring-rose-500/40 dark:border-rose-500'
    : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/30 dark:border-gray-600';
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${borderClasses} ${className ?? ''}`}
      {...rest}
    />
  );
});
