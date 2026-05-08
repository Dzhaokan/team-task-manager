import { getInitials } from '../lib/initials';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_STYLES: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-16 w-16 text-base',
};

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
};

export const Avatar = ({
  name,
  src,
  size = 'md',
  className,
}: AvatarProps) => {
  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold uppercase ${SIZE_STYLES[size]} ${className ?? ''}`;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${base} bg-gray-100 object-cover dark:bg-gray-700`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${base} bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200`}
    >
      {getInitials(name)}
    </span>
  );
};
