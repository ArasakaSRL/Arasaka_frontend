import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import Dropdown from "@/components/MenuDesplegable";
import { crearHabilidad, editarHabilidad, type HabilidadUI } from "../lib/HabilidadesApi";
import { toast } from "../../../components/Alerta";
import { Input } from "@/components/ui/input";
import { HabilidadSchema } from "../utils/HabilidadSchema";
import { useHabilidadesData } from "../hooks/useHabilidades";

interface HabilidadesProps {
  closeModal: () => void;
  onCreated: (data:HabilidadUI) => void;
  habilidadEditar?: HabilidadUI | null;
}

interface DatosHabilidad {
  categoria_habilidad: string;
  nivel: string;
  id_tecnologia?: string;
  nombre?: string;
}

export default function FormularioHabilidades ({closeModal, onCreated, habilidadEditar}:HabilidadesProps) {
  const [categoria, setCategoria] = useState<string>("");
  const [nivel, setNivel] = useState<string>(""); 
  const [tecnologia, setTecnologia] = useState<string>("");
  const [habilidadBlanda, setHabilidadBlanda] = useState("");
  const { tecnologias } = useHabilidadesData();  
  const [loading, setLoading] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [habilidadesExistentes] = useState<string[]>([]);

  
  const categorias = [
    { label: "Blanda", value: "blanda" },
    { label: "Técnica", value: "tecnica" },
  ];

const niveles = [
  { label: "Principiante", value: "Principiante" },
  { label: "Intermedio", value: "Intermedio" },
  { label: "Competente", value: "Competente" },
  { label: "Avanzado", value: "Avanzado" },
  { label: "Experto", value: "Experto" },
];

useEffect(() => {
  if (!habilidadEditar) return;

  setCategoria(habilidadEditar.categoria.toLowerCase());
  setNivel(habilidadEditar.nivel.toLowerCase());

  if (habilidadEditar.categoria.toLowerCase() === "tecnica") {
    const tech = tecnologias.find(
      (t) => t.label.toLowerCase() === habilidadEditar.nombre.toLowerCase()
    );
    setTecnologia(tech?.value || "");
  } else {
    setHabilidadBlanda(habilidadEditar.nombre);
  }
}, [habilidadEditar, tecnologias]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = HabilidadSchema.safeParse({
      categoria,
      nivel,
      tecnologia,
      habilidad: habilidadBlanda,
      tipo: categoria || "",
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const normalizar = (str: string) => str.trim().toLowerCase();

    const nombreAValidar = normalizar(
      categoria === "tecnica"
        ? tecnologias.find(t => t.value === tecnologia)?.label || ""
        : habilidadBlanda
    );

    const existe = habilidadesExistentes.includes(nombreAValidar);

    if (
      existe &&
      (!habilidadEditar ||
        normalizar(habilidadEditar.nombre) !== nombreAValidar)
    ) {
      toast.error("Esta habilidad ya fue registrada");
      return;
    }

    setLoading(true);

    try {
      const esTecnica = categoria.toLowerCase() === "tecnica";

      const data: DatosHabilidad = {
        categoria_habilidad: categoria,
        nivel: nivel,
      };

      if (esTecnica) {
        data.id_tecnologia = tecnologia;
      } else {
        data.nombre = habilidadBlanda;
      }

      if (habilidadEditar) {
        const updated = await editarHabilidad(
          habilidadEditar.id_habilidad,
          data
        );

        toast.success("Habilidad actualizada correctamente", 3000);

        onCreated(updated);

      } else {
        const created = await crearHabilidad(data);

        toast.success("Habilidad creada exitosamente", 3000);

        onCreated({
          id_habilidad: created.id_habilidad,
          nombre: created.nombre ?? "",
          nivel: created.nivel ?? "",
          categoria: created.categoria ?? "",
        });
      }

      closeModal();

    } catch {
      toast.error("Error al guardar habilidad", 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl w-full shadow-xl">
      <div className="justify-between flex px-6 pt-4 items-center">
        <h2 className="text-base font-semibold text-primary-500">
          {habilidadEditar ? "Editar Habilidad" : "Nueva Habilidad"}
        </h2>
        <button
          onClick={closeModal}
          className="text-primary-500 hover:text-secondary-500 cursor-pointer transition-colors">
            <CircleX />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="px-6 pb-5 space-y-4 text-left">
        <div className="space-y-0.5">
          <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1 -mb-1 w-full text-left pb-1">
            Categoria <span className="text-error-500">*</span>
          </label>
          <Dropdown
          mode="single"
          value={categoria} 
          onChange={(val) => {
            setCategoria(val);
            setErrors((prev) => ({ ...prev, categoria: "" }));
          }}
          options={categorias}
          isOpen={menuAbierto === "categoria"}
          onToggle={() => setMenuAbierto(menuAbierto === "categoria" ? null : "categoria")}
          disabled={!!habilidadEditar}
          />
            {errors.categoria && <p className="text-red-500 text-xs ml-1">{errors.categoria}</p>}
        </div>
        {categoria === "tecnica" && (
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1 -mb-1 w-full text-left pb-1">
              Habilidad <span className="text-error-500">*</span>
            </label>

            <Dropdown
              mode="single"
              value={tecnologia}
              onChange={(val) => {
                setTecnologia(val);
                setErrors((prev) => ({ ...prev, tecnologia: "" }));
              }}
              options={tecnologias}
              searchable
              isOpen={menuAbierto === "tecnologias"}
              onToggle={() => setMenuAbierto(menuAbierto === "tecnologias" ? null : "tecnologias")}
            />
            {errors.tecnologia && <p className="text-red-500 text-xs ml-1">{errors.tecnologia}</p>}
          </div>
        )}

        {categoria === "blanda" && (
          <div className="space-y-1">
            <Input
              value={habilidadBlanda}
              onChange={(value) => {
                setHabilidadBlanda(value);
                setErrors((prev) => ({ ...prev, habilidad: "" }));
              }}
              placeholder="Ej: Comunicación, Liderazgo..." 
              label={"Ingrese la habilidad"} 
              type={"text"}  
              error={errors.habilidad}
              required     
            />
          </div>
        )}
        <div className="space-y-0.5">
          <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1 -mb-1 w-full text-left pb-1">
            Nivel de dominio  <span className="text-error-500">*</span>
          </label>
          <Dropdown 
          mode="single"
            value={nivel} 
            onChange={(val) => {
              setNivel(val);
              setErrors((prev) => ({ ...prev, nivel: "" }));
            }} 
            options={niveles}
            isOpen={menuAbierto === "nivel"}
            onToggle={() => setMenuAbierto(menuAbierto === "nivel" ? null : "nivel")}
          />
          {errors.nivel && <p className="text-red-500 text-xs ml-1">{errors.nivel}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={closeModal}
            className="text-sm px-4 py-2 rounded-md border-2 border-primary-500 text-primary-500 hover:bg-secondary-500 hover:text-white cursor-pointer">
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
            {loading ? "Guardando..." : habilidadEditar ? "Guardar Cambios" : "Crear Habilidad"}
          </button>
        </div>
      </form>
    </div>
    )
};