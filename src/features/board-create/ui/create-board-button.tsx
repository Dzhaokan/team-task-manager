import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { PlusIcon } from '@/shared/ui/icon';
import { CreateBoardModal } from './create-board-modal';

export const CreateBoardButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        New board
      </Button>
      {open && <CreateBoardModal onClose={() => setOpen(false)} />}
    </>
  );
};
