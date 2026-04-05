import { CircleX } from "lucide-react";
import { useState, useEffect } from "react";
import MenuDesplegable from "./MenuDesplegable";
import { crearHabilidad, obtenerCategorias, obtenerNiveles,obtenerTecnologias, type Nivel, type Categoria, type Tecnologia } from "../lib/HabilidadesApi";
import { toast } from "../../../components/Alerta";

interface HabilidadesProps {
  closeModal: () => void;
}

interface DatosHabilidad {
  id_categoria_habilidad: string;
  id_portafolio: string;
  nivel: string;
  id_tecnologia?: string;
  nombre?: string;
}

export default function FormularioHabilidades ({closeModal}:HabilidadesProps) {
  const [categoria, setCategoria] = useState<string>("");
  const [nivel, setNivel] = useState<string>(""); 
  const [tecnologia, setTecnologia] = useState<string>("");
  const [habilidadBlanda, setHabilidadBlanda] = useState("");

  const [opcionesCategorias, setOpcionesCategorias] = useState<{ label: string; value: string }[]>([]);
  const [opcionesNiveles, setOpcionesNiveles] = useState<{ label: string; value: string }[]>([]);
  const [opcionesTecnologias, setOpcionesTecnologias] = useState<{ label: string; value: string }[]>([]);
  
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorias: Categoria[] = await obtenerCategorias();
        const niveles: Nivel[] = await obtenerNiveles();
        const tecnologias: Tecnologia[] = await obtenerTecnologias();

        setOpcionesCategorias(
          categorias.map((cat) => ({
            label: cat.nombre,
            value: cat.id_categoria_habilidad,
          }))
        );

        setOpcionesNiveles(
          niveles.map((nivel) => ({
            label: nivel.nivel,
            value: nivel.id_nivel_habilidad,
          }))
        );

        setOpcionesTecnologias(
          tecnologias.map((tec) => ({
            label: tec.nombre,
            value: tec.id_tecnologia,
          }))
        );
      } catch (error) {
        console.error("Error cargando datos", error);
      }
    };

    fetchData();
  }, []);

  const categoriaSeleccionada = opcionesCategorias.find(
    (c) => c.value === categoria
  )?.label;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const esTecnica = opcionesCategorias.find(c => c.value === categoria)?.label.toLowerCase() === "Tecnica";

      const data: DatosHabilidad = {
        id_categoria_habilidad: categoria,
        id_portafolio: "27b591bf-4bbe-4818-b364-8201cd086fcb",
        nivel: nivel,
      };

      if(esTecnica){
        data.id_tecnologia = tecnologia;
      } else {
        data.nombre = habilidadBlanda;
      }

      await crearHabilidad(data);
      toast.success("Habilidad creada exitosamente", 3000);
      setCategoria("");
      setNivel("");
      setTecnologia("");
      setHabilidadBlanda("");
      closeModal();
    }catch{
      toast.error("Error al crear habilidad", 3000);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="bg-light-500 rounded-2xl w-full shadow-xl">
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
          <label className="text-sm text-primary-500 font-medium">
          Seleccione la categoria <span className="text-error-500">(*)</span>
          </label>
          <MenuDesplegable value={categoria} onChange={setCategoria} options={opcionesCategorias} placeholder="Seleccione categoría"/>
        </div>
        {categoriaSeleccionada === "Tecnica" && (
          <div className="space-y-1">
            <label className="text-sm text-primary-500 font-medium">
              Seleccione la habilidad <span className="text-error-500">*</span>
            </label>

            <MenuDesplegable
              value={tecnologia}
              onChange={setTecnologia}
              options={opcionesTecnologias}
            />
          </div>
        )}

        {categoriaSeleccionada === "Blanda" && (
          <div className="space-y-1">
            <label className="text-sm text-primary-500 font-medium">
              Ingrese la habilidad <span className="text-error-500">*</span>
            </label>

            <input
              value={habilidadBlanda}
              onChange={(e) => setHabilidadBlanda(e.target.value)}
              className="w-full bg-[#D4DBE2] text-black border border-primary-500 rounded-md px-3 py-2 text-sm"
              placeholder="Ej: Comunicación, Liderazgo..."
            />
          </div>
        )}
        <div className="space-y-0.5">
          <label className="text-sm text-primary-500 font-medium">
          Nivel de dominio  <span className="text-error-500">(*)</span>
          </label>
          <MenuDesplegable value={nivel} onChange={(val) => setNivel(val as string)} options={opcionesNiveles}/>
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