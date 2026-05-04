import type { HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...rest }: CardProps) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className ?? ''}`}
      {...rest}
    />
  );
};
