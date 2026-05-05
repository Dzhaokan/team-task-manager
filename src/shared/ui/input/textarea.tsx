import { forwardRef, type TextareaHTMLAttributes } from 'react';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid = false, rows = 3, ...rest }, ref) {
    const borderClasses = invalid
      ? 'border-rose-500 focus:ring-rose-500/40 dark:border-rose-500'
      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500/30 dark:border-gray-600';
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={`w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 ${borderClasses} ${className ?? ''}`}
        {...rest}
      />
    );
  }
);
