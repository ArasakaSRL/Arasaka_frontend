import DashboardLayout from "@/layout/DashboardLayout";
import { Banner } from "@/components/Banner";
import { useEffect, useState } from "react";
import {getTimelineCertificaciones,getTimelineExperiencias,} from "@/features/reportesPersonales/apis/timelineApi";
import { Timeline } from "@/features/reportesPersonales/components/Timeline";
import { SeccionScrollHorizontal } from "@/features/reportesUsuario/components/visibilidad/SeccionScrollHorizontal";
import { BoxCantidad } from "@/features/reportesUsuario/components/BoxCantidad";
import { TotalVisitas } from "@/features/reportesUsuario/components/TotalVisitas";
import {getEstadisticasPortafolio,getVisitantes,} from "@/features/reportesUsuario/apis/reportesApi";
import type { CertificacionTimeline, ExperienciaTimeline } from "@/features/reportesPersonales/types";
import SkillsChart, { type SkillItem } from "@/features/reportesUsuario/components/Skillschart";

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

  const [visitantes, setVisitantes] = useState(0);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getTimelineExperiencias()
      .then(setExperiencias)
      .catch(console.error);

    getTimelineCertificaciones()
      .then(setCertificaciones)
      .catch(console.error);


    getVisitantes()
      .then((data) =>
        setVisitantes(data.total_visitantes ?? 0)
      )
      .catch(console.error);

    getEstadisticasPortafolio()
      .then(setData)
      .catch(console.error);
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
  const totalBlandas = getTotalHabilidades(data?.habilidades?.Blandas);
  const skillsChartData: SkillItem[] = Object.entries(data?.habilidades?.tecnica || {})
    .map(([nivel, cantidad]) => ({
      label: nivel,
      value: cantidad as number,
      color: COLOR_MAP[nivel] || "#CCCCCC",
    }))
    .filter((item) => item.value > 0);

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
                <SkillsChart
                  title="Distribución de Habilidades Técnicas"
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <BoxCantidad
                nombre="Habilidades Blandas"
                total={totalBlandas}
              />

              <BoxCantidad
                nombre="Habilidades Técnicas"
                total={totalTecnicas}
              />

              <BoxCantidad
                nombre="Proyectos realizados"
                total={data.proyectos}
              />
            </div>

          </>
        )}

        <div className="space-y-0">
          <SeccionScrollHorizontal titulo="Experiencia Profesional" height="100">
            {timelineExperiencias.length > 0 ? (
              <Timeline items={timelineExperiencias} />
            ) : (
              <div className="bg-white border rounded-xl p-6 text-center text-slate-400">
                No existen experiencias registradas.
              </div>
            )}
          </SeccionScrollHorizontal>

          <SeccionScrollHorizontal titulo="Certificaciones Obtenidas">
            {timelineCertificaciones.length > 0 ? (
              <Timeline items={timelineCertificaciones} />
            ) : (
              <div className="bg-white border rounded-xl p-6 text-center text-slate-400">
                No existen certificaciones registradas.
              </div>
            )}
          </SeccionScrollHorizontal>
        </div>

      </div>
    </DashboardLayout>
  );
}