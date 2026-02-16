import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50 border-emerald-400 text-emerald-800',
    iconClass: 'text-emerald-500',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 border-red-400 text-red-800',
    iconClass: 'text-red-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-400 text-blue-800',
    iconClass: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 border-amber-400 text-amber-800',
    iconClass: 'text-amber-500',
  },
};

export function ToastItem({ id, type, message, onClose }) {
  const config = typeConfig[type] ?? typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${config.bg}`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconClass}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded p-1 hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
