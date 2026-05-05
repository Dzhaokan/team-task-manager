import { useEffect, useRef, useState, type ReactNode } from 'react';

const MENU_ITEM_BASE = 'block w-full px-3 py-1.5 text-left text-sm';
const MENU_ITEM_DEFAULT =
  'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700';
const MENU_ITEM_DANGER =
  'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30';

type MenuItem = {
  label: string;
  onSelect: () => void;
  variant?: 'default' | 'danger';
};

type MenuProps = {
  trigger: (props: {
    onClick: () => void;
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
  }) => ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
};

export const Menu = ({ trigger, items, align = 'right' }: MenuProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSelect = (item: MenuItem) => {
    setOpen(false);
    item.onSelect();
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {trigger({
        onClick: () => setOpen((v) => !v),
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })}
      {open && (
        <div
          role="menu"
          className={`absolute z-10 mt-1 min-w-[10rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              role="menuitem"
              type="button"
              onClick={() => handleSelect(item)}
              className={`${MENU_ITEM_BASE} ${
                item.variant === 'danger' ? MENU_ITEM_DANGER : MENU_ITEM_DEFAULT
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
