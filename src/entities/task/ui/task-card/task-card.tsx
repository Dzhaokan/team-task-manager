import { useMemo, type CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  PRIORITY_SHORT_LABEL,
  type Priority,
  type Task,
} from '@/entities/task';
import { Card } from '@/shared/ui/card';
import { Badge, type BadgeVariant } from '@/shared/ui/badge';
import { Menu } from '@/shared/ui/menu';
import { MoreHorizontalIcon } from '@/shared/ui/icon';
import { formatDeadline } from '@/shared/lib/format-date';

const PRIORITY_VARIANT: Record<Priority, BadgeVariant> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

type TaskCardViewProps = {
  task: Task;
  isOverlay?: boolean;
  isDragging?: boolean;
  dndDisabled?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  innerRef?: (node: HTMLElement | null) => void;
  style?: CSSProperties;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  listeners?: React.HTMLAttributes<HTMLDivElement>;
};

export const TaskCardView = ({
  task,
  isOverlay = false,
  isDragging = false,
  dndDisabled = false,
  onEdit,
  onDelete,
  innerRef,
  style,
  attributes,
  listeners,
}: TaskCardViewProps) => {
  const dragStyles = dndDisabled
    ? 'cursor-default'
    : 'cursor-grab touch-none select-none active:cursor-grabbing';
  const dragStateClass = isDragging && !isOverlay ? 'opacity-40' : '';
  const overlayClass = isOverlay
    ? 'ring-2 ring-purple-400 shadow-lg cursor-grabbing'
    : '';

  const showMenu = !isOverlay && (onEdit || onDelete);
  const menuItems = [];
  if (onEdit) menuItems.push({ label: 'Edit', onSelect: () => onEdit(task) });
  if (onDelete) {
    menuItems.push({
      label: 'Delete',
      variant: 'danger' as const,
      onSelect: () => onDelete(task),
    });
  }

  return (
    <div ref={innerRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`transition-shadow hover:shadow-md ${dragStyles} ${dragStateClass} ${overlayClass}`}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {task.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1">
            <Badge variant={PRIORITY_VARIANT[task.priority]}>
              {PRIORITY_SHORT_LABEL[task.priority]}
            </Badge>
            {showMenu && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <Menu
                  trigger={(triggerProps) => (
                    <button
                      type="button"
                      aria-label="Task options"
                      className="cursor-pointer rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      {...triggerProps}
                    >
                      <MoreHorizontalIcon />
                    </button>
                  )}
                  items={menuItems}
                />
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDeadline(task.deadline)}
          </span>
        </div>
      </Card>
    </div>
  );
};

type TaskCardProps = {
  task: Task;
  dndDisabled?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

export const TaskCard = ({
  task,
  dndDisabled = false,
  onEdit,
  onDelete,
}: TaskCardProps) => {
  const sortableData = useMemo(() => ({ type: 'task' }), []);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: sortableData,
    disabled: dndDisabled,
  });

  return (
    <TaskCardView
      task={task}
      isDragging={isDragging}
      dndDisabled={dndDisabled}
      onEdit={onEdit}
      onDelete={onDelete}
      innerRef={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      attributes={attributes}
      listeners={listeners}
    />
  );
};
