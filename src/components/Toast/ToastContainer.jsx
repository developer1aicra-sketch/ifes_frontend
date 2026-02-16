import { AnimatePresence } from 'framer-motion';
import { useToastState } from '../../contexts/ToastContext';
import { ToastItem } from './Toast';

export function ToastContainer() {
  const { toasts, removeToast } = useToastState();

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem
              key={t.id}
              id={t.id}
              type={t.type}
              message={t.message}
              onClose={() => removeToast(t.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
