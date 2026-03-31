import { CircleX } from 'lucide-react';
import { useState, useEffect } from 'react';
import DropdownCheckbox from './MenuTecnologias';
import { obtenerTecnologia } from '../lib/ProyectosApi';
import { crearProyecto } from '../lib/ProyectosApi';
import { ProyectoSchema } from '../utils/ProyectosSchema';
import { toast } from '../../../components/Alerta';

interface FormularioProps {
    closeModal: () => void;
}

export default function FormularioProyectos({closeModal}:FormularioProps) {
    const [tecnologias, setTecnologias] = useState<string[]>([]);
    const [opciones, setOpciones] = useState<{label:string; value:string }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formularioData, setFormularioData] = useState({
      title: "",
      descripcion: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      githubUrl: "",
    });  

    const resetForm = () => {
      setFormularioData({
        title: "",
        descripcion: "",
        startDate: "",
        endDate: "",
        projectUrl: "",
        githubUrl: "",
      });
      setTecnologias([]);
      setErrors({});
    };

    const cerrarForm = () => {
      resetForm();
        closeModal();
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const result = ProyectoSchema.safeParse({
        titulo: formularioData.title,
        descripcion: formularioData.descripcion,
        fechaInicio: formularioData.startDate,
        fechaFin: formularioData.endDate,
        tecnologias: tecnologias,
        projectUrl: formularioData.projectUrl,
        githubUrl: formularioData.githubUrl,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};

        result.error.issues.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });

        setErrors(fieldErrors);

        const firstErrorField = Object.keys(fieldErrors)[0];
        const element = document.querySelector(
          `[name="${firstErrorField}"]`
        ) as HTMLElement;

        element?.focus();

        return;
      }

      setErrors({});

      try {
        const payload = {
          id_portafolio: "7c8c45d6-1037-481e-8ea3-4fb5bea6e81a",
          nombre: formularioData.title,
          descripcion: formularioData.descripcion || undefined,
          fecha_inicio: formularioData.startDate,
          fecha_fin: formularioData.endDate || undefined,
          tecnologias: tecnologias,
          url_proyecto: formularioData.projectUrl || undefined,
          url_repositorio: formularioData.githubUrl || undefined,
        };

        await crearProyecto(payload);
        toast.success("Proyecto creado exitosamente!", 3000);

        resetForm();
        closeModal();

      } catch{
        toast.error("Error al crear proyecto", 3000);
      }
    };

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
            <label className="text-sm text-primary-500 font-medium">
            Título del Proyecto <span className="text-error-500">*</span>
            </label>
            <input
              name="titulo"
              className={`w-full border text-black bg-[#D4DBE2] rounded-md px-3 py-2 text-sm 
              ${errors.titulo ? "border-error-500 ring-error-500 focus-visible:outline-none focus-visible:ring-2" : "border-primary-500 ring-primary-400 focus-visible:outline-none focus-visible:ring-2"}`}
              value={formularioData.title}
              onChange={(e) => { 
                setFormularioData({ ...formularioData, title: e.target.value })
                setErrors((prev) => ({ ...prev, titulo: "" }));
              }}
            />
              {errors.titulo && (
                <p className="text-xs text-error-500">{errors.titulo}</p>
              )}
        </div>

        <div className="space-y-0.5">
          <label className="text-sm text-primary-500 font-medium">
            Descripción
          </label>
          <textarea
            maxLength={160}
            name="descripcion"
            rows={3}
            value={formularioData.descripcion}
            onChange={(e) => { 
              setFormularioData({ ...formularioData, descripcion: e.target.value });
              setErrors((prev) => ({ ...prev, descripcion: "" }));
            }}
            className={`w-full border text-black bg-[#D4DBE2] rounded-md px-3 py-2 text-sm 
              ${errors.descripcion ? "border-error-500 ring-error-500 focus-visible:outline-none focus-visible:ring-2" : "border-primary-500 ring-primary-400 focus-visible:outline-none focus-visible:ring-2"}`}
          />
          <div className='flex justify-between  items-center'>
            {formularioData.descripcion.length === 160 ? (
              <p className="text-xs text-red-500">
                Has alcanzado el límite de caracteres
              </p>
            ) : (
              <span /> // para mantener el espacio
            )}
            <p
              className={`text-xs ${
                formularioData.descripcion.length >= 160
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {formularioData.descripcion.length}/160
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-primary-500 font-medium">
              Fecha de Inicio <span className="text-error-500">*</span>
            </label>
            <input
              name="fechaInicio"
              type="date"
              value={formularioData.startDate}
              onChange={(e) => { 
                setFormularioData({ ...formularioData, startDate: e.target.value })
                setErrors((prev) => ({ ...prev, fechaInicio: "" }));
              }}
              className={`w-full border text-black bg-[#D4DBE2] rounded-md px-3 py-2 text-sm 
              ${errors.fechaInicio ? "border-error-500 ring-error-500 focus-visible:outline-none focus-visible:ring-2" : "border-primary-500 ring-primary-400 focus-visible:outline-none focus-visible:ring-2"}`}
            />
            {errors.fechaInicio && (
              <p className="text-xs text-red-500">{errors.fechaInicio}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-primary-500 font-medium">
              Fecha de Fin <span className="text-error-500">*</span>
            </label>
            <input
              name="fechaFin"
              type="date"
              value={formularioData.endDate}
              onChange={(e) => { 
                setFormularioData({ ...formularioData, endDate: e.target.value })
                setErrors((prev) => ({ ...prev, fechaFin: "" }));
              }}
              className={`w-full border text-black bg-[#D4DBE2] rounded-md px-3 py-2 text-sm 
              ${errors.fechaFin ? "border-error-500 ring-error-500 focus-visible:outline-none focus-visible:ring-2" : "border-primary-500 ring-primary-400 focus-visible:outline-none focus-visible:ring-2"}`}
            />
            {errors.fechaFin && (
              <p className="text-xs text-red-500">{errors.fechaFin}</p>
            )}
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
          <label className="text-sm text-primary-500 font-medium">
            URL del Proyecto
          </label>
          <input
            name="projectUrl"
            type="url"
            value={formularioData.projectUrl}
            onChange={(e) => { 
              setFormularioData({ ...formularioData, projectUrl: e.target.value })
              setErrors((prev) => ({ ...prev, projectUrl: "" }));
            }}
            className={`w-full border text-black bg-[#D4DBE2] rounded-md px-3 py-2 text-sm 
              ${errors.projectUrl ? "border-error-500 ring-error-500 focus-visible:outline-none focus-visible:ring-2" : "border-primary-500 ring-primary-400 focus-visible:outline-none focus-visible:ring-2"}`}
          />
          {errors.projectUrl && (
              <p className="text-xs text-error-500">{errors.projectUrl}</p>
            )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-primary-500 font-medium">
            GitHub URL
          </label>
          <input
            name="githubUrl"
            value={formularioData.githubUrl}
            onChange={(e) => { 
              setFormularioData({ ...formularioData, githubUrl: e.target.value })
              setErrors((prev) => ({ ...prev, githubUrl: "" }));
            }}
            className={`w-full border text-black bg-[#D4DBE2] rounded-md px-3 py-2 text-sm 
              ${errors.githubUrl ? "border-error-500 ring-error-500 focus-visible:outline-none focus-visible:ring-2" : "border-primary-500 ring-primary-400 focus-visible:outline-none focus-visible:ring-2"}`}
          />
          {errors.githubUrl && (
              <p className="text-xs text-error-500">{errors.githubUrl}</p>
            )}
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