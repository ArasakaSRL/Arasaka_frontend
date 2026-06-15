import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  nombre?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  nombre = "este proyecto",
}: Props) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await onConfirm();
    } finally {
      setLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-[#0B2240]/45
            backdrop-blur-sm
            p-4
          "
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              max-w-105
              bg-white
              rounded-4xl
              p-8
              shadow-2xl
              border border-gray-100
              flex flex-col
              items-center
              text-center
            "
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="
                w-16 h-16
                rounded-full
                bg-red-50
                flex items-center justify-center
                mb-6
              "
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 300,
              }}
            >
              <Trash2
                size={30}
                className="text-[#E50914]"
              />
            </motion.div>
            <h2
              className="
                text-xl
                font-extrabold
                text-[#0B2240]
                tracking-tight
                mb-3
              "
            >
              ¿Eliminar proyecto?
            </h2>
            <p
              className="
                text-sm
                text-gray-500
                leading-relaxed
                mb-8
              "
            >
              Se eliminará{" "}
              <span className="font-bold text-[#0B2240]">
                "{nombre}"
              </span>
              .
              <br />
              Esta acción no se puede deshacer.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={onClose}
                className=" py-3 px-5 rounded-2xl border border-gray-200 text-sm font-bold text-[#0B2240] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <motion.button
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={handleConfirm}
                disabled={loading}
                className=" py-3 px-5 rounded-2xl bg-[#E50914] text-white text-sm font-bold hover:bg-[#c40811] shadow-md shadow-red-500/10 trans disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      className="
                        w-4 h-4
                        border-2
                        border-white/30
                        border-t-white
                        rounded-full
                      "
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Eliminando...
                  </div>
                ) : (
                  "Eliminar"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}