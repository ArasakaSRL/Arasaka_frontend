import DashboardLayout from "@/layout/DashboardLayout";
import { BoxCantidad } from "../components/BoxCantidad";
import { Banner } from "@/components/Banner";
import { TotalVisitas } from "../components/TotalVisitas";
import SkillsChart, { type SkillItem } from "../components/Skillschart";
import { BarChartVisitas } from "../components/BarChartVisitas";
import { LineChart } from "../components/LineChart";
import { SeccionScrollHorizontal } from "../components/visibilidad/SeccionScrollHorizontal";
import { useEffect, useState } from "react";
import type { EstadisticasData, HeatmapHabilidadesTecnicas, HeatmapPerfil, NivelesHabilidad } from "../types/reportes";
import { getClicsPerfil, getEstadisticasPortafolio, getHeatmapHabilidadesTecnicas, getHeatmapPerfil, getVisitantes } from "../apis/reportesApi";
import { PerfilReplica } from "../components/PortafolioReplica/PerfilReplica";

const COLOR_MAP: Record<string, string> = {
  Principiante: "#D85A30",
  Intermedio: "#EF9F27",
  Competente: "#1D9E75",
  Avanzado: "#378ADD",
  Experto: "#7F77DD",
};

export default function ReportesUsr() {
  const [heatmapPerfil, setHeatmapPerfil] = useState<HeatmapPerfil | null>(null)
  const [heatmapTecnicas, setHeatmapTecnicas] = useState<HeatmapHabilidadesTecnicas | null>(null)

  const [data, setData] = useState<EstadisticasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitantes, setVisitantes] = useState<number>(0)
  const [clicsPerfil, setClicsPerfil] = useState<{ x: number, y: number, intensidad: number }[]>([])

  
  useEffect(() => {
    getHeatmapPerfil().then(setHeatmapPerfil).catch(console.error)
    getClicsPerfil().then(setClicsPerfil).catch(console.error)  
    getHeatmapHabilidadesTecnicas().then(setHeatmapTecnicas).catch(console.error)
    const fetchReportes = async () => {
        try {
            // Separadas — si una falla no rompe la otra
            const stats = await getEstadisticasPortafolio()
            setData(stats)
        } catch (error) {
            console.error("Error al cargar estadísticas:", error)
        }

        try {
            const visitas = await getVisitantes()
            setVisitantes(visitas.total_visitantes ?? 0)
        } catch (error) {
            console.error("Error al cargar visitantes:", error)
            setVisitantes(0)  // valor por defecto
        }

        setLoading(false)
    }
    fetchReportes()
}, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-500">
          Cargando reportes...
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  const getTotalHabilidades = (niveles: NivelesHabilidad | undefined) => {
    if (!niveles) return 0;
    return Object.values(niveles).reduce((sum, val) => sum + (val || 0), 0);
  };

  const totalTecnicas = getTotalHabilidades(data.habilidades.tecnica);
  const totalBlandas = getTotalHabilidades(data.habilidades.blanda);

  const skillsChartData: SkillItem[] = Object.entries(
    data.habilidades.tecnica || {}
).map(([nivel, cantidad]) => ({
    label: nivel,
    value: cantidad as number,
    color: COLOR_MAP[nivel] || "#CCCCCC",
})).filter(item => item.value > 0)

console.log('skillsChartData:', skillsChartData)  

    const intensidadPerfil = heatmapPerfil
      ? calcularIntensidad([
          heatmapPerfil.clic_foto_perfil,
          heatmapPerfil.clic_correo,
          heatmapPerfil.clic_linkedin,
          heatmapPerfil.clic_github,
          heatmapPerfil.clic_contactar,
          heatmapPerfil.clic_descargar_cv,
          heatmapPerfil.hover_foto_count,
          heatmapPerfil.hover_correo_count,
        ])
      : 0
    
    const intensidadTecnicas = heatmapTecnicas
    ? calcularIntensidad([
        heatmapTecnicas.clic_expandir,
        heatmapTecnicas.clic_cerrar,
      ])
    : 0
    
  return (
    <DashboardLayout>
      <Banner titulo="Reportes y Estadisticas" descripcion="" />

      <div className="flex flex-col gap-6 mt-6">
     
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TotalVisitas nombre="Visitas al Portafolio" total={visitantes} />
           {skillsChartData.length > 0 ? (  // ← agregar condición
                <SkillsChart
                    title="Habilidades desarrolladas (Técnicas)"
                    skills={skillsChartData}
                    strokeWidth={32}
                    radius={130}
                />
            ) : (
                <div className="flex items-center justify-center bg-white rounded-xl border p-6 text-slate-400 text-sm">
                    Sin habilidades técnicas registradas
                </div>
            )}
        </div>


        <SeccionScrollHorizontal titulo="Estadísticas de Visitas">
          <BarChartVisitas
            data={[
              { mes: "Ene", visitas: 2000 },
              { mes: "Feb", visitas: 5000 },
              { mes: "Mar", visitas: 8000 },
              { mes: "Abr", visitas: 4000 },
              { mes: "May", visitas: 10000 },
              { mes: "Jun", visitas: 3000 },
            ]}
          />
        </SeccionScrollHorizontal>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <BoxCantidad nombre="Habilidades Blandas" total={totalBlandas} />
          <BoxCantidad nombre="Habilidades Técnicas" total={totalTecnicas} />
          <BoxCantidad nombre="Proyectos realizados" total={data.proyectos} />
        </div>

        <SeccionScrollHorizontal titulo="Crecimiento Mensual">
          <LineChart
            data={[
              { x: "Ene", y: 2000 },
              { x: "Feb", y: 800 },
              { x: "Mar", y: 1500 },
              { x: "Abr", y: 1200 },
              { x: "May", y: 2500 },
              { x: "Jun", y: 900 },
              { x: "Jul", y: 1800 },
            ]}
          />
        </SeccionScrollHorizontal>
      </div>
      <PerfilReplica intensidades={{ perfil: intensidadPerfil, tecnicas: intensidadTecnicas, }}  clicsPerfil={clicsPerfil}/>
    </DashboardLayout>
  );
}

function calcularIntensidad(valores: (number | null)[]): number {
  const suma = valores.reduce<number>((acc, v) => acc + (v ?? 0), 0)
  return Math.min(suma / 20, 1)
}
