import { useEffect, useRef, useState } from 'react';
import { CheckIcon } from '@/shared/ui/icon';

export type MultiSelectOption<T extends string> = {
  value: T;
  label: string;
};

type MultiSelectDropdownProps<T extends string> = {
  label: string;
  options: MultiSelectOption<T>[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  emptyLabel?: string;
  align?: 'left' | 'right';
};

export const MultiSelectDropdown = <T extends string>({
  label,
  options,
  selected,
  onToggle,
  emptyLabel = 'Any',
  align = 'left',
}: MultiSelectDropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const triggerLabel =
    selected.length === 0
      ? emptyLabel
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? selected[0])
        : `${selected.length} selected`;

  const active = selected.length > 0;
  const triggerColor = active
    ? 'border-purple-500 bg-purple-100 text-purple-900 dark:border-purple-400 dark:bg-purple-900/40 dark:text-purple-100'
    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700';

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        disabled={options.length === 0}
        className={`inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-60 ${triggerColor}`}
      >
        <span className="text-gray-500 dark:text-gray-400">{label}:</span>
        <span>{triggerLabel}</span>
      </button>
      {open && options.length > 0 && (
        <div
          role="listbox"
          aria-multiselectable
          className={`absolute z-10 mt-1 max-h-64 min-w-[12rem] overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                role="option"
                aria-selected={checked}
                type="button"
                onClick={() => onToggle(opt.value)}
                className="flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <span className="truncate">{opt.label}</span>
                <span
                  className={`shrink-0 text-purple-600 dark:text-purple-300 ${checked ? 'opacity-100' : 'opacity-0'}`}
                >
                  <CheckIcon />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
