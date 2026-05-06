import type { Task } from '@/entities/task';
import { useBoardStore } from '@/app/store/boardStore';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';

type DeleteTaskModalProps = {
  task: Task;
  onClose: () => void;
};

export const DeleteTaskModal = ({ task, onClose }: DeleteTaskModalProps) => {
  const deleteTask = useBoardStore((s) => s.deleteTask);

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Delete task">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Delete{' '}
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {task.title}
        </span>
        ? This cannot be undone.
      </p>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button autoFocus variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
