import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import MenuDesplegable from "./MenuDesplegable";
import { crearHabilidad,obtenerHabilidades, type HabilidadUI } from "../lib/HabilidadesApi";
import { toast } from "../../../components/Alerta";
import { Input } from "@/components/ui/input";
import { HabilidadSchema } from "../utils/HabilidadSchema";
import { useHabilidadesData } from "../hooks/useHabilidades";

interface HabilidadesProps {
  closeModal: () => void;
  onCreated: (nuevaHabilidad: HabilidadUI) => void; 
}

interface DatosHabilidad {
  id_categoria_habilidad: string;
  id_portafolio: string;
  nivel: string;
  id_tecnologia?: string;
  nombre?: string;
}

export default function FormularioHabilidades ({closeModal, onCreated}:HabilidadesProps) {
  const [categoria, setCategoria] = useState<string>("");
  const [nivel, setNivel] = useState<string>(""); 
  const [tecnologia, setTecnologia] = useState<string>("");
  const [habilidadBlanda, setHabilidadBlanda] = useState("");
  const { categorias, niveles, tecnologias } = useHabilidadesData();  
  const [loading, setLoading] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const categoriaLabel = categorias.find(c => c.value === categoria)?.label;
  const [habilidadesExistentes, setHabilidadesExistentes] = useState<string[]>([]);

  const categoriaSeleccionada = categorias.find(
    (c) => c.value === categoria
  )?.label;

  useEffect(() => {
  const fetch = async () => {
    try {
      const data = await obtenerHabilidades();

      const nombres = data.map(h => h.nombre.toLowerCase());
      setHabilidadesExistentes(nombres);

    } catch (error) {
      console.error(error);
    }
  };

  fetch();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = HabilidadSchema.safeParse({
      categoria,
      nivel,
      tecnologia,
      habilidad: habilidadBlanda,
      tipo: categoriaSeleccionada || "",
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

const nombreAValidar =
  categoriaSeleccionada === "Tecnica"
    ? tecnologias.find(t => t.value === tecnologia)?.label.toLowerCase()
    : habilidadBlanda.toLowerCase();

if (habilidadesExistentes.includes(nombreAValidar || "")) {
  toast.error("Esta habilidad ya fue registrada");
  return;
}
    
    setLoading(true);
    try{
      const esTecnica = categoriaLabel?.toLowerCase() === "tecnica";

      const data: DatosHabilidad = {
        id_categoria_habilidad: categoria,
        id_portafolio: "",
        nivel: nivel,
      };

      if(esTecnica){
        data.id_tecnologia = tecnologia;
      } else {
        data.nombre = habilidadBlanda;
      }

      const nuevaHabilidad = await crearHabilidad(data);
      const nuevaUI: HabilidadUI = {
        id_habilidad: crypto.randomUUID(),
        nombre: nuevaHabilidad.nombre || "",
        nivel: nuevaHabilidad.nivel,
        categoria: categoriaSeleccionada || "",
      };
      setCategoria("");
      setNivel("");
      setTecnologia("");
      setHabilidadBlanda("");
      toast.success("Habilidad creada exitosamente", 3000);
      onCreated(nuevaUI);
      closeModal();


    }catch{
      toast.error("Error al crear habilidad", 3000);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl w-full shadow-xl">
      <div className="justify-between flex px-6 pt-4 items-center">
        <h2 className="text-base text-left font-semibold text-primary-500"> Nueva Habilidad</h2>
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
          <MenuDesplegable 
          value={categoria} 
          onChange={(val) => {
            setCategoria(val);
            setErrors((prev) => ({ ...prev, categoria: "" }));
          }}
          options={categorias} 
          placeholder="Seleccione categoría"
          isOpen={menuAbierto === "categoria"} 
          onToggle={() => setMenuAbierto(menuAbierto === "categoria" ? null : "categoria")}/>
            {errors.categoria && <p className="text-red-500 text-xs ml-1">{errors.categoria}</p>}
        </div>
        {categoriaSeleccionada === "Tecnica" && (
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-black font-semibold text-[14px] ml-1 -mb-1 w-full text-left pb-1">
              Habilidad <span className="text-error-500">*</span>
            </label>

            <MenuDesplegable
              value={tecnologia}
              onChange={(val) => {
                setTecnologia(val);
                setErrors((prev) => ({ ...prev, tecnologia: "" }));
              }}
              options={tecnologias}
              placeholder="Seleccione tecnología"
              isOpen={menuAbierto === "tecnologia"}
              onToggle={() => setMenuAbierto(menuAbierto === "tecnologia" ? null : "tecnologia")}
            />
            {errors.tecnologia && <p className="text-red-500 text-xs ml-1">{errors.tecnologia}</p>}
          </div>
        )}

        {categoriaSeleccionada === "Blanda" && (
          <div className="space-y-1">
            <Input
              value={habilidadBlanda}
              onChange={(val) => {
                setHabilidadBlanda(val);
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
          <MenuDesplegable 
            value={nivel} 
            onChange={(val) => {
              setNivel(val);
              setErrors((prev) => ({ ...prev, nivel: "" }));
            }} 
            options={niveles}
            placeholder="Seleccione nivel de dominio"
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
            {loading ? "Creando..." : "Crear Habilidad"}
          </button>
        </div>
      </form>
    </div>
    )
}