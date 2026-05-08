import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { setAuthTokenGetter } from '@/shared/api';
import { useAuthStore } from '@/app/store/authStore';

setAuthTokenGetter(() => useAuthStore.getState().token);

const enableMocks = async () => {
  if (!import.meta.env.DEV) return;
  const { worker } = await import('@/shared/api/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
};

void enableMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
