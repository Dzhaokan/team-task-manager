import { useRef, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, type User } from '@/entities/user';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { FormError } from '@/shared/ui/form-error';
import { errorMessage } from '@/shared/lib/error-message';
import { profileSchema, type ProfileValues } from '../model/schema';
import { readFileAsDataUrl } from '../lib/read-file-as-data-url';
import { useUpdateProfile } from '../api/use-update-profile';

type ProfileFormProps = {
  user: User;
};

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, avatar: user.avatar },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useUpdateProfile();

  const { avatar, name: watchedName } = useWatch({ control });
  const previewName = watchedName || user.name;

  const onPickFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    clearErrors('avatar');
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setValue('avatar', dataUrl, { shouldDirty: true });
    } catch (err) {
      setError('avatar', { message: errorMessage(err, 'Upload failed.') });
    }
  };

  const onRemoveAvatar = () => {
    clearErrors('avatar');
    setValue('avatar', null, { shouldDirty: true });
  };

  const onSubmit = handleSubmit((values) => {
    clearErrors('avatar');
    mutation.mutate(values, {
      onSuccess: (saved) => reset({ name: saved.name, avatar: saved.avatar }),
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar name={previewName} src={avatar} size="lg" />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatar ? 'Change avatar' : 'Upload avatar'}
          </Button>
          {avatar && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveAvatar}
            >
              Remove
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG or JPG, up to 200 KB.
          </p>
        </div>
      </div>
      <FormError>{errors.avatar?.message}</FormError>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
        <Input
          autoComplete="name"
          invalid={Boolean(errors.name)}
          {...register('name')}
        />
        <FormError>{errors.name?.message}</FormError>
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
        <Input value={user.email} disabled readOnly />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Email cannot be changed.
        </p>
      </div>

      <FormError>
        {mutation.isError &&
          errorMessage(mutation.error, 'Could not save changes.')}
      </FormError>

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending || !isDirty}>
          {mutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};
