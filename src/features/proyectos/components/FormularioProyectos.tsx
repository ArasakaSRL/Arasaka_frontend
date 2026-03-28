import { CircleX } from 'lucide-react';
import { useState, useEffect } from 'react';
import DropdownCheckbox from './MenuTecnologias';
import { obtenerTecnologia } from '../lib/ProyectosApi';
import { crearProyecto } from '../lib/ProyectosApi';

interface FormularioProps {
    closeModal: () => void;
}

export default function FormularioProyectos({closeModal}:FormularioProps) {
    const [tecnologias, setTecnologias] = useState<string[]>([]);
    const [opciones, setOpciones] = useState<{label:string; value:string }[]>([]);
    const cerrarForm = () => {
        closeModal();
    }

    const [formularioData, setFormularioData] = useState({
      title:"",
      descripcion:"",
      startDate: "",
      endDate: "",
      projectUrl:"",
      githubUrl:"",
    });

    const handleSubmit = async (e:React.FormEvent) => {
      e.preventDefault();
        try {
    const payload = {
      id_portafolio: "b7a37adf-3fd9-498c-a855-4dd97cee53b2",
      nombre: formularioData.title,
      descripcion: formularioData.descripcion || null,
      fecha_inicio: formularioData.startDate,
      fecha_fin: formularioData.endDate || null,
      tecnologias: tecnologias,
      url_proyecto: formularioData.projectUrl || null,
      url_repositorio: formularioData.githubUrl || null,
    };

    const res = await crearProyecto(payload);

    console.log("CREADO:", res);

    setFormularioData({
      title: "",
      descripcion: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      githubUrl: "",
    });

    setTecnologias([]);

    closeModal();

  } catch (error) {
    console.error("Error al crear proyecto", error);
  }
    }

    useEffect(() => {
  const fetchTecnologias = async () => {
    try {
      const data = await obtenerTecnologia();

      const formatted = data.map((tech) => ({
        label: tech.nombre,
        value: tech.id_tecnologia,
      }));

      setOpciones(formatted);
    } catch (error) {
      console.error("Error al cargar tecnologías", error);
    }
  };

  fetchTecnologias();
}, []);
    
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

      <form onSubmit={handleSubmit} className="px-6 pb-5 space-y-4 text-left">
        <div className="space-y-0.5">
            <label className="text-sm text-gray-700 font-medium">
            Título del Proyecto <span className="text-error-500">*</span>
            </label>
            <input
              className="w-full border text-black bg-[#D4DBE2] border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2" 
              value={formularioData.title}
              onChange={(e) => setFormularioData({ ...formularioData, title: e.target.value })}
              />
        </div>

  <div className="space-y-0.5">
    <label className="text-sm text-gray-700 font-medium">
      Descripción
    </label>
    <textarea
      rows={3}
      value={formularioData.descripcion}
      onChange={(e) => setFormularioData({ ...formularioData, descripcion: e.target.value })}
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
              value={formularioData.startDate}
              onChange={(e) => setFormularioData({ ...formularioData, startDate: e.target.value })}
              className="w-full border bg-[#D4DBE2] text-black border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">
              Fecha de Fin <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              value={formularioData.endDate}
              onChange={(e) => setFormularioData({ ...formularioData, endDate: e.target.value })}
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
            options={opciones}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700 font-medium">
            URL del Proyecto
          </label>
          <input
            type="url"
            placeholder="https://"
            value={formularioData.projectUrl}
            onChange={(e) => setFormularioData({ ...formularioData, projectUrl: e.target.value })}
            className="w-full border bg-[#D4DBE2] text-black border-primary-500 rounded-md px-3 py-2 text-sm ring-primary-400 focus-visible:outline-none focus-visible:ring-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700 font-medium">
            GitHub URL
          </label>
          <input
            type="url"
            value={formularioData.githubUrl}
            onChange={(e) => setFormularioData({ ...formularioData, githubUrl: e.target.value })}
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