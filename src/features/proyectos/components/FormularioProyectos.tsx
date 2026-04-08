import { CircleX } from 'lucide-react';
import { useState } from 'react';
import DropdownCheckbox from './MenuTecnologias';
import { crearProyecto, type Proyecto } from '../lib/ProyectosApi';
import { ProyectoSchema } from '../utils/ProyectosSchema';
import { toast } from '../../../components/Alerta';
import { Input } from '@/components/ui/input';
import { useTecnologias } from '../hooks/useTecnologias';

interface FormularioProps {
    closeModal: () => void;
    onCreated: (nuevoProyecto: Proyecto) => void;
}

export default function FormularioProyectos({closeModal, onCreated}:FormularioProps) {
    const [tecnologias, setTecnologias] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { opciones} = useTecnologias();

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

    const validateField = (name: string, value: string) => {
      const fieldSchema = ProyectoSchema.shape[name as keyof typeof ProyectoSchema.shape];

      if (!fieldSchema) return;

      const result = fieldSchema.safeParse(value);

      setErrors((prev) => ({
        ...prev,
        [name]: result.success ? "" : result.error.issues[0].message,
      }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const result = ProyectoSchema.safeParse({
        titulo: formularioData.title,
        descripcion: formularioData.descripcion,
        fechaInicio: formularioData.startDate,
        fechaFin: formularioData.endDate,
        tecnologias: tecnologias.map(id => ({ id_tecnologia: id })),
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
      setLoading(true);
      try {
        const payload = {
          nombre: formularioData.title,
          descripcion: formularioData.descripcion || undefined,
          fecha_inicio: formularioData.startDate,
          fecha_fin: formularioData.endDate || undefined,
          tecnologias: tecnologias.map(id => ({ id_tecnologia: id })),
          url_proyecto: formularioData.projectUrl || undefined,
          url_repositorio: formularioData.githubUrl || undefined,
        };

       const nuevoProyecto = await crearProyecto(payload);
      toast.success("Proyecto creado exitosamente", 3000);
        resetForm();
        closeModal();
        onCreated(nuevoProyecto);

      } catch {
        toast.warning("Error al crear proyecto", 3000);
      } finally {
        setLoading(false);
      }
    };
    
    return(
    <div className="bg-white rounded-2xl shadow-xl w-full">

      <div className="px-7 pt-4 flex justify-between items-center">
        <h2 className="text-base text-left font-semibold text-primary-500">
          Nuevo Proyecto
        </h2>
        <button 
        onClick={cerrarForm}
        className="text-primary-500 hover:text-shadow-secondary-500 cursor-pointer transition-colors">
             <CircleX />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pb-5 space-y-4 text-left">
          <Input 
            label="Título del Proyecto"
            type="text"
            placeholder="Ingrese el título del proyecto"
            value={formularioData.title}
            onChange={(val) => {
              setFormularioData({ ...formularioData, title: val });
              validateField("titulo", val);

            }}
            error={errors.titulo}
            required
          />

          <Input
            label="Descripción del Proyecto"
            type="textarea"
            placeholder="Describe el proyecto, sus funcionalidades y tecnologías utilizadas" 
            value={formularioData.descripcion}
            onChange={(val) => {
              setFormularioData({ ...formularioData, descripcion: val });
            }}
            error={errors.descripcion}
            maxLength={160}
            showCounter
            required
          />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Fecha de Inicio"
            type="date"
            placeholder=''
            value={formularioData.startDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(val) => {
            if (formularioData.endDate && formularioData.endDate < val) {
              setFormularioData((prev) => ({
                ...prev,
                startDate: val,
                endDate: "",
              }));
            } else {
              setFormularioData({ ...formularioData, startDate: val });
            }

            setErrors((prev) => ({ ...prev, fechaInicio: "" }));
          }}
            error={errors.fechaInicio}
            required
          />
            <Input
              label="Fecha de Fin"
              type="date"
              value={formularioData.endDate}
              placeholder=''
              min={formularioData.startDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(val) => {
                setFormularioData({ ...formularioData, endDate: val });
                setErrors((prev) => ({ ...prev, fechaFin: "" }));
              }}
              error={errors.fechaFin}
              required
            />
        </div>
        <div className='space-y-1'>
          <label className="block text-sm text-black font-medium-ui mb-2">
            Seleccione la(s) Tecnología(s) <span className="text-error-500">*</span>
          </label>
          <DropdownCheckbox
            values={tecnologias}
            onChange={(vals) => {
              setTecnologias(vals);
              setErrors((prev) => ({ ...prev, tecnologias: "" }));
            }}
            options={opciones}
          />
          {errors.tecnologias && (
            <p className="text-red-500 text-xs ml-1">
              {errors.tecnologias}
            </p>
          )}
        </div>

          <Input
            label="URL del Proyecto"
            type="text"
            placeholder="https://..."
            value={formularioData.projectUrl}
            onChange={(val) => {
              setFormularioData({ ...formularioData, projectUrl: val });
              validateField("projectUrl", val);
            }}
            error={errors.projectUrl}
          />

          <Input
            label="GitHub URL"
            type="text"
            placeholder="https://github.com/..."
            value={formularioData.githubUrl}
            onChange={(val) => {
              setFormularioData({ ...formularioData, githubUrl: val });
              validateField("githubUrl", val);
            }}
            error={errors.githubUrl}
          />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={cerrarForm}
            disabled={loading}
            className="text-sm px-4 py-2 rounded-md border-2 border-primary-500 text-primary-500 hover:bg-secondary-500 hover:text-white cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`text-sm px-4 py-2 rounded-md text-white 
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-primary-500 hover:bg-secondary-500 cursor-pointer"
            }`}
          >
            {loading ? "Creando..." : "Crear Proyecto"}
          </button>
        </div>

      </form>
    </div>
    )
}