export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  nombre = "esta habilidad",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nombre?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[360px] p-6 text-center">

        {/* Ícono simple */}
        <div className="text-red-500 text-2xl mb-3">✕</div>

        {/* Título */}
        <h2 className="text-lg font-semibold text-gray-800">
          Eliminar habilidad
        </h2>

        {/* Texto */}
        <p className="text-sm text-gray-500 mt-2">
          Se eliminará <span className="font-medium text-gray-700">{nombre}</span>. Esta acción no se puede deshacer.
        </p>

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}