import { motion, AnimatePresence } from "framer-motion";

interface ModalFormProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  maxWidth?: string; 
}

const ModalForm = ({ isOpen, closeModal, children, maxWidth = "max-w-md" }: ModalFormProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/40
    p-4"
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`    relative
    w-full
    ${maxWidth}
    bg-white
    rounded-2xl
    shadow-xl`}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalForm;