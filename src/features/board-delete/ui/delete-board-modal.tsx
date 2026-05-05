import type { Board } from '@/entities/board';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { FormError } from '@/shared/ui/form-error';
import { useDeleteBoard } from '../api/use-delete-board';

type DeleteBoardModalProps = {
  board: Board;
  onClose: () => void;
};

export const DeleteBoardModal = ({ board, onClose }: DeleteBoardModalProps) => {
  const mutation = useDeleteBoard();

  const handleDelete = async () => {
    await mutation.mutateAsync(board.id);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Delete board">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Delete{' '}
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {board.name}
        </span>
        ? This cannot be undone — all of its tasks will be removed too.
      </p>
      <FormError>
        {mutation.isError &&
          (mutation.error instanceof Error
            ? mutation.error.message
            : 'Could not delete board.')}
      </FormError>
      <div className="mt-2 flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
};
