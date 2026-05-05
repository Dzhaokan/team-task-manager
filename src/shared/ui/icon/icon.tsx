import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = (rest: IconProps) => ({
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...rest,
});

export const PlusIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const MoreHorizontalIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <path d="M6 6l12 12" />
    <path d="M18 6l-12 12" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const SunIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M4.93 19.07l1.41-1.41" />
    <path d="M17.66 6.34l1.41-1.41" />
  </svg>
);

export const MoonIcon = (props: IconProps) => (
  <svg {...baseProps(props)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
