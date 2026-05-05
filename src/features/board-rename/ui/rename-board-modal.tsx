import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  boardNameSchema,
  type Board,
  type BoardNameValues,
} from '@/entities/board';
import { Modal } from '@/shared/ui/modal';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { FormError } from '@/shared/ui/form-error';
import { useRenameBoard } from '../api/use-rename-board';

type RenameBoardModalProps = {
  board: Board;
  onClose: () => void;
};

export const RenameBoardModal = ({ board, onClose }: RenameBoardModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardNameValues>({
    resolver: zodResolver(boardNameSchema),
    defaultValues: { name: board.name },
  });
  const mutation = useRenameBoard();

  const onSubmit = handleSubmit(async (values) => {
    if (values.name === board.name) {
      onClose();
      return;
    }
    await mutation.mutateAsync({ id: board.id, name: values.name });
    onClose();
  });

  return (
    <Modal open onClose={onClose} title="Rename board">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Board name
          </span>
          <Input
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            invalid={Boolean(errors.name)}
            {...register('name')}
          />
          <FormError>{errors.name?.message}</FormError>
        </label>
        <FormError>
          {mutation.isError &&
            (mutation.error instanceof Error
              ? mutation.error.message
              : 'Could not rename board.')}
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
            {mutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
