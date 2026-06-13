export default function EliminarModal({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Eliminar elemento", 
  nombre = "este elemento",
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>; 
  titulo?: string; 
  nombre?: string;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-90 p-6 text-center">

        <div className="text-red-500 text-2xl mb-3">✕</div>

        <h2 className="text-lg font-semibold text-gray-800">
          {titulo} 
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Se eliminará <span className="font-medium text-gray-700">{nombre}</span>. Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              flex-1 py-2 rounded-md text-white
              flex items-center justify-center gap-2
              transition-all
              ${
                isLoading
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }
            `}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}

            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}