import { useMemo, type CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Priority, Task } from '@/entities/task';
import { Card } from '@/shared/ui/card';
import { Badge, type BadgeVariant } from '@/shared/ui/badge';
import { formatDeadline } from '@/shared/lib/format-date';

const PRIORITY_VARIANT: Record<Priority, BadgeVariant> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
};

type TaskCardViewProps = {
  task: Task;
  isOverlay?: boolean;
  isDragging?: boolean;
  dndDisabled?: boolean;
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

  return (
    <div ref={innerRef} style={style} {...attributes} {...listeners}>
      <Card className={`${dragStyles} ${dragStateClass} ${overlayClass}`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {task.title}
          </h3>
          <Badge variant={PRIORITY_VARIANT[task.priority]}>
            {PRIORITY_LABEL[task.priority]}
          </Badge>
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
};

export const TaskCard = ({ task, dndDisabled = false }: TaskCardProps) => {
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
      innerRef={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      attributes={attributes}
      listeners={listeners}
    />
  );
};
