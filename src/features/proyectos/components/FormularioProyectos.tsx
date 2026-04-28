import { CircleX } from 'lucide-react';
import { useState } from 'react';
import Dropdown from '../../../components/MenuDesplegable';
import { crearProyecto, editarProyecto,type Proyecto } from '../lib/ProyectosApi';
import { ProyectoSchema } from '../utils/ProyectosSchema';
import { toast } from '../../../components/Alerta';
import { Input } from '@/components/ui/input';
import { useTecnologias } from '../hooks/useTecnologias';
import { useEditarProyecto } from '../hooks/editarProyectos';

interface FormularioProps {
    closeModal: () => void;
    onCreated: (nuevoProyecto: Proyecto) => void;
    proyectoEditar: Proyecto | null;
}

type Imagen = {
    file: File;
    preview: string;
};

export default function FormularioProyectos({closeModal, onCreated, proyectoEditar}:FormularioProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { opciones} = useTecnologias();
    const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
    const [imagenes, setImagenes] = useState<Imagen[]>([]);
    const {
      formularioData,
      setFormularioData,
      tecnologias,
      setTecnologias,
      resetForm,
      isDirty,
    } = useEditarProyecto(proyectoEditar);

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
      setLoading(true);
      try {
        const payload = {
          nombre: formularioData.title,
          descripcion: formularioData.descripcion || undefined,
          fecha_inicio: formularioData.startDate,
          fecha_fin: formularioData.endDate || undefined,
          tecnologias: tecnologias,
          url_demo: formularioData.projectUrl,
          url_github: formularioData.githubUrl,
        };
        let proyectoGuardado;
        console.log("Payload enviado:", payload);
        if (proyectoEditar) {
          proyectoGuardado = await editarProyecto(
            proyectoEditar.id_proyecto,
            payload
          );

          toast.success("Proyecto editado exitosamente", 3000);
          onCreated(proyectoGuardado); 
        } else {
          proyectoGuardado = await crearProyecto(payload);
          toast.success("Proyecto creado exitosamente", 3000);
          onCreated(proyectoGuardado);
        }

        resetForm();
        closeModal();

      } catch {
        toast.warning("Error al crear proyecto", 3000);
      } finally {
        setLoading(false);
      }
    };
    
  return(
    <div className="bg-white rounded-2xl shadow-xl w-full">
      <div className="px-6 pt-4 flex justify-between items-center">
          <h2 className="text-base text-left font-semibold text-primary-500">
            {proyectoEditar ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h2>
          <button 
          onClick={cerrarForm}
          className="text-primary-500 hover:text-shadow-secondary-500 cursor-pointer transition-colors">
              <CircleX />
          </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 px-6 pb-6">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
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
              disabled={!!proyectoEditar}
            />

            <Input
              label="Descripción del Proyecto"
              type="textarea"
              placeholder="Describe el proyecto, sus funcionalidades y tecnologías utilizadas" 
              value={formularioData.descripcion}
              onChange={(val) => {
                setFormularioData({ ...formularioData, descripcion: val });

                validateField("descripcion", val);
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
                disabled={!!proyectoEditar}
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
                  disabled={!!proyectoEditar}
                />
            </div>
            <div className='space-y-1'>
              <label className="block text-sm text-black font-medium-ui mb-2">
                Seleccione la(s) Tecnología(s) <span className="text-error-500">*</span>
              </label>
              <Dropdown
                mode="multiple"
                values={tecnologias}
                onChange={(vals) => {
                  setTecnologias(vals);
                  setErrors((prev) => ({ ...prev, tecnologias: "" }));
                }}
                options={opciones}
                searchable
                isOpen={menuAbierto === "tecnologias"}
                onToggle={() => setMenuAbierto(menuAbierto === "tecnologias" ? null : "tecnologias")}
                disabled={!!proyectoEditar}
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
          </form>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="w-full border-2 border-dashed border-gray-300 rounded-xl min-h-80 flex flex-col items-center justify-center text-center p-6">
            <p className="text-gray-500 text-sm mb-2">
              Arrastra las imágenes aquí
            </p>
            <p className="text-gray-400 text-xs mb-4">
              o
            </p>

            <label className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 text-sm">
              Seleccionar imágenes
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];

                  const nuevas = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                  }));

                  setImagenes((prev) => {
                    const combinado = [...prev, ...nuevas];
                    return combinado.slice(0, 5);
                  });
                }}
              />
            </label>
            <p className="text-xs text-gray-400 mt-4">
              Máximo 5 imágenes (la primera será la portada)
            </p>
          </div>
            {imagenes.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {imagenes.map((img, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden border"
                  >
                    <img
                      src={img.preview}
                      alt="preview"
                      className="w-full h-24 object-cover"
                    />

                    {/* etiqueta portada */}
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded">
                        Portada
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setImagenes((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
      <div className="flex justify-end gap-2 px-6 pb-4">
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
          disabled={loading || (!!proyectoEditar && !isDirty)}
          className={`text-sm px-4 py-2 rounded-md text-white 
          ${
            loading || (proyectoEditar && !isDirty)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-500 hover:bg-secondary-500 cursor-pointer"
          }`}
        >
          {loading
            ? "Procesando..."
            : proyectoEditar
            ? "Editar Proyecto"
            : "Crear Proyecto"}
        </button>
      </div>
    </div>
  )
}