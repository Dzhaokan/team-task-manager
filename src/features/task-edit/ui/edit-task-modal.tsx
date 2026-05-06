import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TaskFormFields,
  formValuesToTaskInput,
  taskFormSchema,
  taskToFormValues,
  type Task,
  type TaskFormValues,
} from '@/entities/task';
import { useBoardStore } from '@/app/store/boardStore';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';

type EditTaskModalProps = {
  task: Task;
  onClose: () => void;
};

export const EditTaskModal = ({ task, onClose }: EditTaskModalProps) => {
  const updateTask = useBoardStore((s) => s.updateTask);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: taskToFormValues(task),
  });

  const onSubmit = handleSubmit((values) => {
    updateTask(task.id, formValuesToTaskInput(values));
    onClose();
  });

  return (
    <Modal open onClose={onClose} title="Edit task">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <TaskFormFields register={register} errors={errors} />
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};
