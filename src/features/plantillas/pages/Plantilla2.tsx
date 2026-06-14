import { useState, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom"; 
import SeccionHexagono from "@/features/plantillas/components/plantilla2/cards/SeccionHexagono";
import NavbarHorizontal from "@/features/plantillas/components/plantilla2/NavbarHorizontal";
import { ORBITA_ITEMS } from "@/features/plantillas/service/orbitaData";
import { usePortfolioData } from "@/features/reportesUsuario/hooks/usePortfolioData";
import { ListaCatalogo } from "@/features/plantillas/components/plantilla2/ListaCatalogo";
import PerfilDetalles from "@/features/plantillas/components/plantilla2/cards/PerfilDetalles";

import { generateCV } from "@/features/portafolio/lib/cv.generator";
import { toast } from "@/components/Alerta";

const TOTAL = ORBITA_ITEMS.length;
const STEP_DEG = 360 / TOTAL;

export default function Plantilla2() {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [externalStep, setExternalStep] = useState(0);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const isAdvancingRef = useRef(false);
  const [descargandoCV, setDescargandoCV] = useState(false);

  //Obtenemos el slug directamente de la URL pública
  const { slug } = useParams<{ slug: string }>();
  

  // El hook usará el slug de la URL para traer los datos públicos
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
        return (data.habilidadesBlandas || []).map((hab, index) => ({
          id: hab.id_habilidad || `blanda-${index}`,
          izquierda: <span className="font-semibold text-gray-500">#{index + 1}</span>,
          centro: <span className="font-medium">{hab.nombre || "Habilidad"}</span>,
          derecha: <span className="text-sm text-gray-500">{hab.nivel || "No especificado"}</span>,
        }));

      // EXPERIENCIA
      case "experiencia":
      case "experiencias":
        return (data.experiencias || []).map((exp) => ({
          id: exp.id_experiencia,
          izquierda: <span className="font-medium">{exp.cargo}</span>,
          centro: <span>{exp.Nombre_empresa}</span>,
          derecha: (
            <div className="text-xs text-right">
              <div>{exp.fecha_inicio}</div>
              <div>{exp.fecha_fin || "Actualidad"}</div>
            </div>
          ),
        }));

      // PROYECTOS
      case "proyectos":
      case "proyecto":
        return (data.proyectos || []).map((proy) => ({
          id: proy.id_proyecto,
          izquierda: <span className="font-medium">{proy.nombre}</span>,
          centro: <span className="line-clamp-2">{proy.descripcion}</span>,
          derecha: (
            <span className="text-xs text-right">
              {proy.tecnologias?.length
                ? proy.tecnologias.map((t) => t.nombre).join(", ")
                : "-"}
            </span>
          ),
        }));

      // CERTIFICACIONES
      case "certificaciones":
      case "certificacion":
        return (data.certificaciones || []).map((cert) => ({
          id: cert.id_certificacion,
          izquierda: <span className="font-medium">{cert.titulo}</span>,
          centro: <span>{cert.institucion}</span>,
          derecha: cert.url_certificado ? (
            <img src={cert.url_certificado} alt={cert.titulo} className="w-10 h-10 rounded object-cover" />
          ) : (
            <span>-</span>
          ),
        }));

      // HABILIDADES TÉCNICAS
      case "habilidades tecnicas":
      case "habilidades-tecnicas":
      case "habilidadestecnicas":
      case "tecnicas":
        return (data.habilidadesTecnicas || []).map((hab) => ({
          id: hab.id_habilidad,
          izquierda: <span className="font-medium">{hab.nombre || "Habilidad Técnica"}</span>,
          centro: <span>{hab.nivel || "No especificado"}</span>,
          derecha: hab.tecnologias?.[0]?.logo ? (
            <img src={hab.tecnologias[0].logo} alt={""+hab.nombre} className="w-10 h-10 object-contain" />
          ) : (
            <span>-</span>
          ),
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
  
  if (!slug)        return <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center text-black">URL inválida o portafolio no encontrado.</div>;
  if (loading)      return <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center text-black">Cargando portafolio...</div>;
  if (noDisponible || !data) return <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center text-black">Este portafolio no está disponible.</div>;

  const handleDescargarCV = async () => {
    if (descargandoCV) return;

    setDescargandoCV(true);

    try {
      await generateCV({
        usuario: data.usuario,
        proyectos: data.proyectos ?? [],
        tecnicas: data.habilidadesTecnicas ?? [],
        blandas: data.habilidadesBlandas ?? [],
        experiencias: data.experiencias ?? [],
        certificaciones: data.certificaciones ?? [],
      });

      toast.success("PDF generado con éxito");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al generar el PDF");
    } finally {
      setDescargandoCV(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F0EAD6] overflow-x-hidden">
      <SeccionHexagono
        rotation={rotation}
        activeIndex={activeIndex}
        externalStep={externalStep}
        targetIndex={targetIndex}
        titulo={ORBITA_ITEMS[activeIndex]?.titulo}
        onRotate={handleRotate}
        onActiveChange={handleOrbitaChange}
      />

      {/* Arreglo de Sombras: Contenedor principal sin overflow */}
      <div
        className="
          z-50 flex flex-col gap-3
          w-full max-w-[500px]
          mx-auto
          bg-transparent
          lg:absolute
        "
        style={{
          ...(window.innerWidth >= 1024 && {
            top: "2%",
            left: "65%",
            transform: "translateX(-50%)",
            maxHeight: "80vh",
          }),
        }}
      >
        <div className="flex flex-col gap-3 shrink-0">
          <h1 className="inline-block bg-transparent text-black text-2xl font-black">
            Mi Portafolio
          </h1>
          <NavbarHorizontal
            activeIndex={activeIndex}
            onChange={handleSectionChange}
          />
        </div>

        {/* Contenedor dinámico con scroll invisible */}
        <div
          className="
            z-50 flex flex-col gap-3
            w-full max-w-[500px]
            mx-auto mt-6 
            lg:absolute
            lg:left-[50%]
            lg:top-[100%]
            lg:-translate-x-1/2
          "
          style={{
            maxHeight: "80vh",
          }}
        >
          
          {ORBITA_ITEMS[activeIndex]?.id?.toLowerCase() === "perfil" ? (
            <PerfilDetalles
              nombre={`${data.usuario.nombre} ${data.usuario.apellido}`}
              pais={data.usuario.pais || "No especificado"}
              profesion={data.usuario.profesiones?.[0]?.nombre || "Profesional"}
              correo={data.usuario.correo}
              foto={data.usuario.foto_perfil || undefined}
              onDescargarCV={handleDescargarCV}
              descargandoCV={descargandoCV}
            />
          ) : (
            <ListaCatalogo
              items={itemsAdaptados}
              activeIndex={-1} 
              onItemClick={(index) => {
                console.log("Hiciste clic en item:", index);
              }}
            />
          )}
          
        </div>
      </div>
    </div>
  );
}