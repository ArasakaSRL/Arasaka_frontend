import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import { useEffect, useState } from "react";
import {getTimelineCertificaciones,getTimelineExperiencias,} from "@/features/reportesPersonales/apis/timelineApi";
import { Timeline } from "@/features/reportesPersonales/components/Timeline";
import { SeccionScrollHorizontal } from "@/features/reportesUsuario/components/visibilidad/SeccionScrollHorizontal";
import { BoxCantidad } from "@/features/reportesUsuario/components/BoxCantidad";
import {getEstadisticasPortafolio,} from "@/features/reportesUsuario/apis/reportesApi";
import type { CertificacionTimeline, ExperienciaTimeline } from "@/features/reportesPersonales/types";
import SkillsChart, { type SkillItem } from "@/features/reportesUsuario/components/Skillschart";
import Pastel from "@/features/reportesPersonales/components/Pastel";
import TablaRanking from "@/features/reportesPersonales/components/TablaRanking";
import PortafolioTimeline from "@/features/reportesPersonales/components/LineaTiempo";

const COLOR_MAP: Record<string, string> = {
  Principiante: "#D85A30",
  Intermedio: "#EF9F27",
  Competente: "#1D9E75",
  Avanzado: "#378ADD",
  Experto: "#7F77DD",
};

export default function ReportesPersonales() {
  const [experiencias, setExperiencias] = useState<ExperienciaTimeline[]>([]);
  const [certificaciones, setCertificaciones] = useState<CertificacionTimeline[]>([]);
  const [loading, setIsLoading] = useState(true);

  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);

        const [
          experienciasData,
          certificacionesData,
          estadisticasData,
        ] = await Promise.all([
          getTimelineExperiencias(),
          getTimelineCertificaciones(),
          getEstadisticasPortafolio(),
        ]);

        setExperiencias(experienciasData);
        setCertificaciones(certificacionesData);
        setData(estadisticasData);

      } catch (error) {
        console.error("Error al cargar reportes", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const timelineExperiencias = experiencias
    .map((exp: any) => ({
      id: exp.id ?? exp.id_experiencia,
      fecha: exp.fecha_inicio ?? "",
      titulo: exp.cargo,
      subtitulo: exp.nombre_organizacion,
      tipo: "experiencia" as const,
    }))
    .sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    );

  const timelineCertificaciones = certificaciones
    .map((cert) => ({
      id: cert.id_certificacion,
      fecha: cert.fecha_obtencion ?? "",
      titulo: cert.titulo,
      subtitulo: cert.institucion_emisora,
      tipo: "certificacion" as const,
    }))
    .sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    );

  const getTotalHabilidades = (
    niveles: Record<string, number> | undefined
  ) => {
    if (!niveles) return 0;

    return Object.values(niveles).reduce(
      (sum, val) => sum + (val || 0),
      0
    );
  };

  const totalTecnicas = getTotalHabilidades(data?.habilidades?.tecnica);
  const totalBlandas = getTotalHabilidades(data?.habilidades?.blanda);
  const resumenItems = [
    {
      titulo: "Experiencias Registradas",
      cantidad: experiencias.length,
    },
    {
      titulo: "Certificaciones",
      cantidad: certificaciones.length,
    },
    {
      titulo: "Proyectos",
      cantidad: data?.proyectos ?? 0,
    },
    {
      titulo: "Habilidades Técnicas",
      cantidad: totalTecnicas,
    },
    {
      titulo: "Habilidades Blandas",
      cantidad: totalBlandas,
    },
  ];
  console.log(data);
  const skillsChartData: SkillItem[] = Object.entries(data?.habilidades?.tecnica || {})
    .map(([nivel, cantidad]) => ({
      label: nivel,
      value: cantidad as number,
      color: COLOR_MAP[nivel] || "#CCCCCC",
    }))
    .filter((item) => item.value > 0);

    if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-500">
          Cargando reportes...
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Banner
          titulo="Reportes Personales"
          descripcion=""
        />

        {data && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {skillsChartData.length > 0 ? (
                <Pastel
                  title="Distribución de Habilidades Técnicas"
                  skills={skillsChartData}
                />
              ) : (
                <div className="flex items-center justify-center bg-white rounded-xl border p-6 text-slate-400 text-sm">
                  Sin habilidades técnicas registradas
                </div>
              )}

              <TablaRanking
                titulo="Total Registros"
                items={resumenItems}
              />

            </div>
          </>
        )}

        <div className="space-y-0">
          <PortafolioTimeline />
        </div>

      </div>
    </DashboardLayout>
  );
}