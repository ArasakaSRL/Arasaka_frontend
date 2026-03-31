/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Info, CircleAlert, CircleX } from "lucide-react";

type ToastType = "success" | "error" | "warning" ;

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
};

let root: Root | null = null;
let pushToast: ((toast: ToastItem) => void) | null = null;

export const toast = {
  success: (msg: string, duration = 4000) =>
    emit(msg, "success", duration),
  error: (msg: string, duration = 4000) =>
    emit(msg, "error", duration),
  warning: (msg: string, duration = 4000) =>
    emit(msg, "warning", duration),
};

function emit(message: string, type: ToastType, duration: number) {
  if (!root) {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    root.render(<ToastContainer />);
  }

  pushToast?.({
    id: Date.now(),
    message,
    type,
    duration,
  });
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    pushToast = (toast) =>
      setToasts((prev) => [...prev, toast]);

    return () => {
      pushToast = null;
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration);
    return () => clearTimeout(timer);
  }, [onClose, toast.duration]);

  const styles = {
    success: {
      icon: <CircleCheck className="text-green-500 w-6 h-6" />,
      bg: "bg-green-50 border-green-200",
    },
    error: {
      icon: <CircleAlert className="text-red-500 w-6 h-6" />,
      bg: "bg-red-50 border-red-300",
    },
    warning: {
      icon: <Info className="text-yellow-500 w-6 h-6" />,
      bg: "bg-yellow-50 border-yellow-200",
    },
  };

  const { icon, bg } = styles[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`${bg} border shadow-lg rounded-xl p-4 flex items-center gap-3 w-104`}
    >
      {icon}

      <p className="flex-1 text-sm font-medium text-gray-800">
        {toast.message}
      </p>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 text-lg"
      >
        <CircleX className="w-5 h-5" />
      </button>
    </motion.div>
  );
};