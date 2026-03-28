import { CircleX } from 'lucide-react';
import { useState } from 'react';
import DropdownCheckbox from './MenuTecnologias';
interface FormularioProps {
    closeModal: () => void;
}

export default function FormularioProyectos({closeModal}:FormularioProps) {
    const [tecnologias, setTecnologias] = useState<string[]>([]);
    const techOptions = [
  { label: "React", value: "react" },
  { label: "Node.js", value: "node" },
  { label: "Python", value: "python" },
];
    const cerrarForm = () => {
        closeModal();
    }
    return(
    <div className="bg-light-500 rounded-2xl shadow-xl w-full">

      <div className="px-6 pt-4 flex justify-between items-center">
        <h2 className="text-base text-left font-semibold text-gray-800">
          Nuevo Proyecto
        </h2>
        <button 
        onClick={cerrarForm}
        className="text-primary-500 hover:text-secondary-500 transition-colors">
             <CircleX />
        </button>
      </div>

      <form className="px-6 pb-5 space-y-4 text-left">
        <div className="space-y-0.5">
            <label className="text-sm text-gray-700 font-medium">
            Título del Proyecto <span className="text-error-500">*</span>
            </label>
            <input className="w-full border text-black bg-[#D4DBE2] border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2" />
        </div>

  <div className="space-y-0.5">
    <label className="text-sm text-gray-700 font-medium">
      Descripción
    </label>
    <textarea
      rows={3}
      className="w-full border bg-[#D4DBE2] text-black border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2"
    />
  </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">
              Fecha de Inicio <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border bg-[#D4DBE2] text-black border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">
              Fecha de Fin <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border bg-[#D4DBE2] text-black border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-black font-medium-ui mb-2">
            Seleccione la(s) Tecnología(s) <span className="text-error-500">*</span>
          </label>
          <DropdownCheckbox
            values={tecnologias}
            onChange={setTecnologias}
            options={techOptions}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700 font-medium">
            URL del Proyecto
          </label>
          <input
            type="url"
            placeholder="https://"
            className="w-full border bg-[#D4DBE2] text-black border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700 font-medium">
            GitHub URL
          </label>
          <input
            type="url"
            placeholder="https://github.com/usuario/proyecto"
            className="w-full border bg-[#D4DBE2] text-black border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={cerrarForm}
            className="text-sm px-4 py-2 rounded-md border-2 border-primary-500 text-primary-500 hover:bg-secondary-500 hover:text-white"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="text-sm px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-secondary-500"
          >
            Crear Proyecto
          </button>
        </div>

      </form>
    </div>
    )
}