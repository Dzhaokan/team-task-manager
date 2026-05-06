import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input, Textarea } from '@/shared/ui/input';
import { FormError } from '@/shared/ui/form-error';
import {
  PRIORITIES,
  PRIORITY_LABEL,
  type TaskFormValues,
} from '../../model/schema';

type TaskFormFieldsProps = {
  register: UseFormRegister<TaskFormValues>;
  errors: FieldErrors<TaskFormValues>;
};

const FieldLabel = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="text-sm text-gray-700 dark:text-gray-300"
  >
    {children}
  </label>
);

export const TaskFormFields = ({ register, errors }: TaskFormFieldsProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor="task-title">Title</FieldLabel>
      <Input
        id="task-title"
        autoFocus
        placeholder="What needs doing?"
        invalid={Boolean(errors.title)}
        {...register('title')}
      />
      <FormError>{errors.title?.message}</FormError>
    </div>

    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor="task-description">Description</FieldLabel>
      <Textarea
        id="task-description"
        invalid={Boolean(errors.description)}
        {...register('description')}
      />
      <FormError>{errors.description?.message}</FormError>
    </div>

    <div className="flex flex-col gap-1.5">
      <FieldLabel>Priority</FieldLabel>
      <div className="flex gap-3">
        {PRIORITIES.map((p) => (
          <label
            key={p}
            className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300"
          >
            <input
              type="radio"
              value={p}
              className="accent-purple-600"
              {...register('priority')}
            />
            {PRIORITY_LABEL[p]}
          </label>
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor="task-tags">Tags</FieldLabel>
      <Input
        id="task-tags"
        placeholder="shopping, urgent"
        invalid={Boolean(errors.tags)}
        {...register('tags')}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Comma-separated. Up to 10 tags.
      </span>
      <FormError>{errors.tags?.message}</FormError>
    </div>

    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor="task-deadline">Deadline</FieldLabel>
      <Input
        id="task-deadline"
        type="date"
        invalid={Boolean(errors.deadline)}
        {...register('deadline')}
      />
      <FormError>{errors.deadline?.message}</FormError>
    </div>
  </div>
);
