import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TaskFormFields,
  emptyTaskForm,
  formValuesToTaskInput,
  taskFormSchema,
  type TaskFormValues,
} from '@/entities/task';
import { useBoardStore } from '@/app/store/boardStore';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import type { ColumnId } from '@/shared/config/columns';
import type { BoardId } from '@/shared/config/ids';

export type CreateTaskTarget = {
  boardId: BoardId;
  columnId: ColumnId;
};

type CreateTaskModalProps = {
  target: CreateTaskTarget;
  onClose: () => void;
};

export const CreateTaskModal = ({ target, onClose }: CreateTaskModalProps) => {
  const addTask = useBoardStore((s) => s.addTask);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: emptyTaskForm(),
  });

  const onSubmit = handleSubmit((values) => {
    addTask(target.boardId, target.columnId, formValuesToTaskInput(values));
    onClose();
  });

  return (
    <Modal open onClose={onClose} title="Add task">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <TaskFormFields register={register} errors={errors} />
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
