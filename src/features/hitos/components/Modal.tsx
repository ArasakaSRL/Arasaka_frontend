type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string; // 👈 nuevo
};

export function Modal({ isOpen, onClose, children, title }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/30 backdrop-blur-sm
        flex items-center justify-center
      "
      onClick={onClose}
    >
      {/* Contenedor */}
      <div
        className="
          relative
          bg-white rounded-xl shadow-lg
          w-full max-w-sm
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/*  HEADER */}
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/*  CONTENIDO */}
        <div
          className="
            px-6 pb-6 pt-4
            flex flex-col gap-5
            w-full max-w-xs mx-auto
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}