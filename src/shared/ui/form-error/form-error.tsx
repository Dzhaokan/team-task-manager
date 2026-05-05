import type { ReactNode } from 'react';

type FormErrorProps = {
  children: ReactNode;
  className?: string;
};

export const FormError = ({ children, className }: FormErrorProps) => {
  if (!children) return null;
  return (
    <p className={`text-xs text-rose-600 dark:text-rose-400 ${className ?? ''}`}>
      {children}
    </p>
  );
};
