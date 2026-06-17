import { motion, AnimatePresence } from "framer-motion";

interface ModalFormProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal = ({
  isOpen,
  closeModal,
  children,
  maxWidth = "max-w-md",
}: ModalFormProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/40
            p-4
          "
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`
              w-full
              ${maxWidth}
              bg-white
              rounded-2xl
              shadow-xl
              max-h-[90vh]
              overflow-y-auto
            `}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="
                max-h-[90vh]
                overflow-y-auto
                modal-scroll
                custom-scroll
                p-6
              "
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;