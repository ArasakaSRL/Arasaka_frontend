import { useState, useCallback, useRef, useMemo } from "react";
import SeccionHexagono from "@/features/plantillas/components/plantilla2/cards/SeccionHexagono";
import NavbarHorizontal from "@/features/plantillas/components/plantilla2/NavbarHorizontal";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { usePortfolioData } from "@/features/reportesUsuario/hooks/usePortfolioData";
import { useAuthStore } from "@/stores/authStore";
import { ListaCatalogo } from "@/features/plantillas/components/plantilla2/ListaCatalogo";
import PerfilDetalles from "@/features/plantillas/components/plantilla2/cards/PerfilDetalles";


const TOTAL = ORBITA_ITEMS.length;
const STEP_DEG = 360 / TOTAL;


export default function Plantilla2() {
  const [rotation,     setRotation]     = useState(0);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [externalStep, setExternalStep] = useState(0);
  const [targetIndex,  setTargetIndex]  = useState<number>(0);
  const isAdvancingRef = useRef(false);

  const slug = useAuthStore((state) => state.portafolioSeleccionado?.slug);
  const { data, loading, noDisponible } = usePortfolioData(slug);

  const advance = useCallback((steps: number) => {
    isAdvancingRef.current = true;
    setActiveIndex((prev) => {
      const newIndex = ((prev + steps) % TOTAL + TOTAL) % TOTAL;
      setRotation((r) => r + steps * STEP_DEG);
      setExternalStep((s) => s + steps);
      setTargetIndex(newIndex);
      return newIndex;
    });
    setTimeout(() => { isAdvancingRef.current = false; }, 300);
  }, []);

  const handleRotate = () => advance(1);

  const handleSectionChange = (index: number) => {
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      const stepsForward  = ((index - prev) + TOTAL) % TOTAL;
      const stepsBackward = stepsForward - TOTAL;
      const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
      setRotation((r) => r + steps * STEP_DEG);
      setTargetIndex(index);
      return index;
    });
  };

  const handleOrbitaChange = useCallback((id: string) => {
    if (isAdvancingRef.current) return;
    const index = ORBITA_ITEMS.findIndex((item) => item.id === id);
    if (index === -1) return;
    setActiveIndex((prev) => {
      if (index === prev) return prev;
      const stepsForward  = ((index - prev) + TOTAL) % TOTAL;
      const stepsBackward = stepsForward - TOTAL;
      const steps = stepsForward <= TOTAL / 2 ? stepsForward : stepsBackward;
      setRotation((r) => r + steps * STEP_DEG);
      return index;
    });
  }, []);

  const itemsAdaptados = useMemo(() => {
    if (!data) return [];
    
    const seccionActual = ORBITA_ITEMS[activeIndex]?.id?.toLowerCase() || "";

    switch (seccionActual) {
      
      // HABILIDADES BLANDAS
      case "habilidades blandas":
      case "habilidades-blandas":
      case "habilidadesblandas":
      case "blandas":
        return (data.habilidadesBlandas || []).map((hab, index: number) => ({
          id: hab.id_habilidad || `blanda-${index}`,
          indexLabel: `#${index + 1}`,
          titulo: hab.nombre || "Habilidad",
          descripcion: `Nivel: ${hab.nivel || "No especificado"}`,
        }));

      // EXPERIENCIA
      case "experiencia":
      case "experiencias":
        return (data.experiencias || []).map((exp) => ({
          id: exp.id_experiencia,
          titulo: exp.cargo,
          descripcion: exp.Nombre_empresa,
          detalle: `De: ${exp.fecha_inicio} a: ${exp.fecha_fin || "Actualidad"}`,
          imagen: null, // Tu tipo "experiencias" no tiene logo de empresa actualmente
        }));

      // PROYECTOS
      case "proyectos":
      case "proyecto":
        return (data.proyectos || []).map((proy) => ({
          id: proy.id_proyecto,
          titulo: proy.nombre,
          descripcion: proy.descripcion,
          // Extraemos los nombres de las tecnologías usadas para mostrarlas como detalle
          detalle: proy.tecnologias?.length 
            ? `Tech: ${proy.tecnologias.map(t => t.nombre).join(", ")}` 
            : "",
          // Tomamos la primera imagen del array de imagenes
          imagen: proy.imagenes?.[0]?.url || null,
        }));

      // CERTIFICACIONES
      case "certificaciones":
      case "certificacion":
        return (data.certificaciones || []).map((cert) => ({
          id: cert.id_certificacion,
          titulo: cert.titulo,
          descripcion: cert.institucion,
          imagen: cert.url_certificado || null,
        }));

      // HABILIDADES TÉCNICAS
      case "habilidades tecnicas": 
      case "habilidades-tecnicas":
      case "habilidadestecnicas":
      case "tecnicas":
        return (data.habilidadesTecnicas || []).map((hab) => ({
          id: hab.id_habilidad,
          titulo: hab.nombre || "Habilidad Técnica",
          descripcion: `Nivel: ${hab.nivel || "No especificado"}`,
          // Tomamos el logo de la primera tecnología asociada a esta habilidad
          imagen: hab.tecnologias?.[0]?.logo || null,
        }));

      case "perfil":
      case "sobre mi":
      case "sobre-mi":
        return [];

      default:
        console.warn(`⚠️ Sección no reconocida en el switch: "${seccionActual}"`);
        return [];
    }
  }, [data, activeIndex]);
  
  if (!slug)        return <div>No tienes un portafolio asignado.</div>;
  if (loading)      return <div>Cargando...</div>;
  if (noDisponible || !data) return <div>Portafolio no disponible.</div>;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F0EAD6]">
      <SeccionHexagono
        rotation={rotation}
        activeIndex={activeIndex}
        externalStep={externalStep}
        targetIndex={targetIndex}
        titulo={ORBITA_ITEMS[activeIndex]?.titulo}
        onRotate={handleRotate}
        onActiveChange={handleOrbitaChange}
      />

      {/* 2. Arreglo de Sombras: Contenedor principal sin overflow */}
      <div
        className="absolute z-50 flex flex-col gap-3 w-[500px]"
        style={{
          top: "10%",
          left: "65%",
          transform: "translateX(-50%)",
          maxHeight: "80vh", 
        }}
      >
        <div className="flex flex-col gap-3 shrink-0">
          <h1 className="text-black text-2xl font-bold">Mi Portafolio</h1>
          <NavbarHorizontal
            activeIndex={activeIndex}
            onChange={handleSectionChange}
          />
        </div>

        {/* Contenedor dinámico (Scroll y Padding) */}
        <div className="overflow-y-auto flex-1 px-4 py-4 -mx-4">
          
          {ORBITA_ITEMS[activeIndex]?.id?.toLowerCase() === "perfil" ? (
          
            <PerfilDetalles
              nombre={`${data.usuario.nombre} ${data.usuario.apellido}`}
              pais={data.usuario.pais || "No especificado"}
              // Tomamos la primera profesión de tu array, si no hay, ponemos un default
              profesion={data.usuario.profesiones?.[0]?.nombre || "Profesional"} 
              correo={data.usuario.correo}
              foto={data.usuario.foto_perfil || undefined}
            />

          ) : (
            
            <ListaCatalogo
              items={itemsAdaptados}
              activeIndex={-1} 
              onItemClick={(index) => {
                console.log("Hiciste clic en:", itemsAdaptados[index].titulo);
              }}
            />

          )}
          
        </div>
      </div>
    </div>
  );
}