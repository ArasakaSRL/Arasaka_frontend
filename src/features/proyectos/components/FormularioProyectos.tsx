/* eslint-disable react-hooks/exhaustive-deps */
import { CircleX } from 'lucide-react';
import { useState } from 'react';
import { crearProyecto, editarProyecto,type Proyecto } from '../lib/ProyectosApi';
import { ProyectoSchema } from '../utils/ProyectosSchema';
import { toast } from '../../../components/Alerta';
import { Input } from '@/components/ui/input';
import { useTecnologias } from '../hooks/useTecnologias';
import { useEditarProyecto } from '../hooks/editarProyectos';
import { uploadMultipleImages } from '../../../firebase/firebaseStorage';
import { useEffect } from 'react';
import UploaderImagenes from './SubirImagenes';
import TecnologiasSelector from './MenuTecnologias';
import axios from 'axios';
interface FormularioProps {
    closeModal: () => void;
    onCreated: (nuevoProyecto: Proyecto) => void;
    proyectoEditar: Proyecto | null;
}

type Imagen = {
    file?: File;
    preview: string;
    url?: string;
    isNew?: boolean;
};

export default function FormularioProyectos({closeModal, onCreated, proyectoEditar}:FormularioProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { opciones, agregarTecnologia} = useTecnologias();
    const [imagenes, setImagenes] = useState<Imagen[]>([]);
    const [enCurso, setEnCurso] = useState (false);
    const {
      formularioData,
      setFormularioData,
      tecnologias,
      setTecnologias,
      resetForm,
      isDirty,
      setImagenesActuales,
    } = useEditarProyecto(proyectoEditar);

    useEffect(() => {
      const urls = imagenes.map((img) => img.url ?? img.preview);
      setImagenesActuales(urls);
    }, [imagenes]);

    useEffect(() => {
    if (proyectoEditar) {
      const existentes = proyectoEditar.url_imagen.map((img) => ({
        url: img.url_imagen,
        preview: img.url_imagen,
        isNew: false,
      }));

      setImagenes(existentes);
    }
  }, [proyectoEditar]);

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
        imagenes,
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
        let url_imagen: string[] = [];

        if (!proyectoEditar) {
          const files: File[] = imagenes
            .filter((img) => img.file)
            .map((img) => img.file as File);

          url_imagen =
            files.length > 0
              ? await uploadMultipleImages(files)
              : [];
        } else {
          const nuevas = imagenes.filter(
            (img) => img.isNew && img.file
          );

          const existentes = imagenes.filter(
            (img) => !img.isNew
          );

          const files: File[] = nuevas.map(
            (img) => img.file as File
          );

          const urlsNuevas =
            files.length > 0
              ? await uploadMultipleImages(files)
              : [];

          const urlsExistentes = existentes.map(
            (img) => img.url as string
          );

          url_imagen = [
            ...urlsExistentes,
            ...urlsNuevas,
          ];
        }

        const payload = {
          nombre: formularioData.title,
          descripcion: formularioData.descripcion || undefined,
          fecha_inicio: formularioData.startDate,
          fecha_fin: formularioData.endDate || undefined,
          tecnologias,
          url_demo: formularioData.projectUrl,
          url_github: formularioData.githubUrl,
          url_imagen,
        };

        let proyectoGuardado;

        if (proyectoEditar) {
          proyectoGuardado = await editarProyecto(
            proyectoEditar.id_proyecto,
            payload
          );

          toast.success( "Proyecto editado exitosamente", 3000 );
        } else {
          proyectoGuardado = await crearProyecto(payload);

          toast.success( "Proyecto creado exitosamente", 3000);
        }

        onCreated(proyectoGuardado);
        resetForm();
        closeModal();
      } catch (error) {
        if (axios.isAxiosError(error)){
          const mensaje = error.response?.data?.message || "Error al crear proyecto";

          toast.warning(mensaje, 3000);
        }else{
          toast.warning("Error al crear proyecto", 3000);
        }
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
          <form className="w-full space-y-3 text-left" id="proyecto-form" onSubmit={handleSubmit}>
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
                  required = {!enCurso}
                  disabled={enCurso || !!proyectoEditar}
                />
                <div className="col-span-2 flex items-center gap-2 mt-1">
                  <input
                    id="enCurso"
                    type="checkbox"
                    checked={enCurso}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setEnCurso(checked);

                      if (checked) {
                        setFormularioData((prev) => ({
                          ...prev,
                          endDate: "",
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          fechaFin: "",
                        }));
                      }
                    }}
                  />

                  <label
                    htmlFor="enCurso"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Proyecto en curso
                  </label>
                </div>
            </div>

            <div className='space-y-1'>
              <label className="block text-sm text-black font-medium-ui mb-2">
                Seleccione la(s) Tecnología(s) <span className="text-error-500">*</span>
              </label>
              <TecnologiasSelector
                mode="multiple"
                values={tecnologias}
                onChange={(vals) => {
                  setTecnologias(vals);
                  setErrors((prev) => ({
                    ...prev,
                    tecnologias: "",
                  }));
                }}
                options={opciones}
                agregarTecnologia={agregarTecnologia}
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
          <UploaderImagenes
            imagenes={imagenes}
            setImagenes={setImagenes}
            errors={errors}
            setErrors={setErrors}
          />
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
          form="proyecto-form"
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