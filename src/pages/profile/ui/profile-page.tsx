import { selectCurrentUser, useAuthStore } from '@/app/store/authStore';
import { ProfileForm } from '@/features/profile-edit';

export const ProfilePage = () => {
  // ProtectedRoute guarantees an authed user before this renders.
  const user = useAuthStore(selectCurrentUser)!;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your profile
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update your name and avatar.
        </p>
      </header>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <ProfileForm user={user} />
      </div>
    </div>
  );
};
