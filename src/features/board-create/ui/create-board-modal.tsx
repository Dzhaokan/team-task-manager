import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardNameSchema, type BoardNameValues } from '@/entities/board';
import { Modal } from '@/shared/ui/modal';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { FormError } from '@/shared/ui/form-error';
import { useCreateBoard } from '../api/use-create-board';

type CreateBoardModalProps = {
  onClose: () => void;
};

export const CreateBoardModal = ({ onClose }: CreateBoardModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardNameValues>({
    resolver: zodResolver(boardNameSchema),
    defaultValues: { name: '' },
  });
  const mutation = useCreateBoard();

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values.name);
    onClose();
  });

  return (
    <Modal open onClose={onClose} title="Create board">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Board name
          </span>
          <Input
            autoFocus
            placeholder="e.g. Sprint 12"
            invalid={Boolean(errors.name)}
            {...register('name')}
          />
          <FormError>{errors.name?.message}</FormError>
        </label>
        <FormError>
          {mutation.isError &&
            (mutation.error instanceof Error
              ? mutation.error.message
              : 'Could not create board.')}
        </FormError>
        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
