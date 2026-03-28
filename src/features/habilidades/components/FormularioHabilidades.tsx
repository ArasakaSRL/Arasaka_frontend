import { CircleX } from "lucide-react";
interface HabilidadesProps {
  closeModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FormularioHabilidades ({closeModal}:HabilidadesProps) {
  return (
    <div className="bg-light-500 rounded-2xl w-full shadow-xl">
      <div className="justify-between flex px-6 pt-4 items-center">
        <h2> Nueva Habilidad</h2>
        <button
        onClick={closeModal}
        className="text-primary-500 hover:text-secondary-500 transition-colors">
          <CircleX />
        </button>
      </div>
      <form className="px-6 pb-5 space-y-4 text-left">
        <div className="space-y-0.5">
          <label className="text-sm text-gray-700 font-medium">
          Seleccione la categoria <span className="text-error-500">*</span>
          </label>
          <input className="w-full border text-black bg-[#D4DBE2] border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2" />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={closeModal}
            className="text-sm px-4 py-2 rounded-md border-2 border-primary-500 text-primary-500 hover:bg-secondary-500 hover:text-white">
              Cancelar
          </button>
          <button
            type="submit"
            className="text-sm px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-secondary-500">
              Crear Habilidad
          </button>
        </div>
      </form>
    </div>
    )
}