import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-purple-600 text-white hover:bg-purple-500 disabled:bg-purple-400 dark:bg-purple-500 dark:hover:bg-purple-400 dark:disabled:bg-purple-700',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-60 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-60 dark:text-gray-200 dark:hover:bg-gray-800',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 disabled:bg-rose-400 dark:bg-rose-500 dark:hover:bg-rose-400 dark:disabled:bg-rose-700',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className ?? ''}`}
      {...rest}
    />
  );
});
