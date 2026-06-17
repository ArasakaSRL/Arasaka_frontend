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
import { getClicsBlandas, getClicsCertificaciones, getClicsExperiencia, getClicsPerfil, getClicsProyectos, getClicsTecnicas, getCrecimientoMensual, getEstadisticasPortafolio, getHeatmapHabilidadesTecnicas, getHeatmapPerfil, getVisitantes, getVisitasPorMes } from "../apis/reportesApi";
import { PerfilReplica } from "../components/PortafolioReplica/PerfilReplica";
import { ReporteVisitas } from "../components/ReporteVisitas";

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
  const [clicsTecnicas,      setClicsTecnicas]      = useState<{ x: number, y: number, intensidad: number }[]>([])
  const [clicsBlandas,       setClicsBlandas]        = useState<{ x: number, y: number, intensidad: number }[]>([])
  const [clicsExperiencia,   setClicsExperiencia]    = useState<{ x: number, y: number, intensidad: number }[]>([])
  const [clicsProyectos,     setClicsProyectos]      = useState<{ x: number, y: number, intensidad: number }[]>([])
  const [clicsCertificaciones, setClicsCertificaciones] = useState<{ x: number, y: number, intensidad: number }[]>([])
  
  const [visitasPorMes, setVisitasPorMes]       = useState<{ mes: string; visitas: number }[]>([])
  const [crecimientoMensual, setCrecimiento] = useState<{ mes: string; visitas: number }[]>([])

  useEffect(() => {
    getHeatmapPerfil().then(setHeatmapPerfil).catch(console.error)

    getClicsPerfil().then(setClicsPerfil).catch(console.error)
    getClicsTecnicas().then(setClicsTecnicas).catch(console.error)
    getClicsBlandas().then(setClicsBlandas).catch(console.error)
    getClicsExperiencia().then(setClicsExperiencia).catch(console.error)
    getClicsProyectos().then(setClicsProyectos).catch(console.error)
    getClicsCertificaciones().then(setClicsCertificaciones).catch(console.error) 
     
    getHeatmapHabilidadesTecnicas().then(setHeatmapTecnicas).catch(console.error)
    getVisitasPorMes().then(setVisitasPorMes).catch(console.error)
    getCrecimientoMensual()
    .then(data => setCrecimiento(data.map((d: { mes: string; total: number }) => ({
        mes:    d.mes,
        visitas: d.total,
    }))))
    .catch(console.error)
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

  function generarUltimosMeses(n = 6): { mes: string; visitas: number }[] {
      const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
      const hoy   = new Date()
      return Array.from({ length: n }, (_, i) => {
          const d = new Date(hoy.getFullYear(), hoy.getMonth() - (n - 1 - i), 1)
          return {
              mes:    meses[d.getMonth()],
              visitas: 0,
          }
      })
  }

// merge con los datos reales
  function mergearVisitas(
      base: { mes: string; visitas: number }[],
      reales: { mes: string; visitas: number }[]
  ) {
      return base.map(b => {
          const encontrado = reales.find(r => r.mes === b.mes)
          return encontrado ? { ...b, visitas: encontrado.visitas } : b
      })
  }

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
        
        <ReporteVisitas
          visitasPorMes={mergearVisitas(
            generarUltimosMeses(6),
            visitasPorMes
          )}
          crecimientoMensual={mergearVisitas(
            generarUltimosMeses(7),
            crecimientoMensual
          )}
        />

        {/** 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <BoxCantidad nombre="Habilidades Blandas" total={totalBlandas} />
          <BoxCantidad nombre="Habilidades Técnicas" total={totalTecnicas} />
          <BoxCantidad nombre="Proyectos realizados" total={data.proyectos} />
        </div>
          */}
        
      </div>
      <h3 className="w-full text-left mt-12 mb-2 text-base md:text-3xl font-semibold text-black ">
        Mapa de Calor
      </h3>
      <PerfilReplica 
        intensidades={{ perfil: intensidadPerfil, tecnicas: intensidadTecnicas, }}  
        clicsPerfil={clicsPerfil}
        clicsTecnicas={clicsTecnicas}
        clicsBlandas={clicsBlandas}
        clicsExperiencia={clicsExperiencia}
        clicsProyectos={clicsProyectos}
        clicsCertificaciones={clicsCertificaciones}/>
    </DashboardLayout>
  );
}

function calcularIntensidad(valores: (number | null)[]): number {
  const suma = valores.reduce<number>((acc, v) => acc + (v ?? 0), 0)
  return Math.min(suma / 20, 1)
}


