import { useEffect, useRef, useState } from "react";
import type { CertificacionTimeline, ExperienciaTimeline } from "../types";
import { getTimelineCertificaciones, getTimelineExperiencias } from "../apis/timelineApi";

// ── helpers ──────────────────────────────────────────────────────────────────
const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const EXP_COLORS = ["#534AB7","#0F6E56","#993C1D","#993556","#185FA5","#3B6D11","#633806"];
const CERT_COLOR = "#BA7517";

function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const [y, m] = s.split("-");
  return new Date(+y, (+m || 1) - 1, 1);
}

function fmtDate(s: string | null): string {
  if (!s) return "Presente";
  const [y, m] = s.split("-");
  return `${MONTHS[(+m || 1) - 1]} ${y}`;
}

// ── sub-components ────────────────────────────────────────────────────────────
interface TooltipData {
  title: string;
  subtitle: string;
  dates: string;
  badge?: string;
  x: number;
  y: number;
}

function Tooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: Math.min(data.x + 14, window.innerWidth - 260),
        top: data.y - 10,
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-secondary)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
        zIndex: 1000,
        maxWidth: 240,
        pointerEvents: "none",
      }}
    >
      <p style={{ fontWeight: 500, marginBottom: 4, fontSize: 13, color: "var(--color-text-primary)" }}>
        {data.title}
      </p>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 6 }}>{data.subtitle}</p>
      <p style={{ color: "var(--color-text-tertiary)" }}>{data.dates}</p>
      {data.badge && (
        <span
          style={{
            display: "inline-block",
            marginTop: 6,
            fontSize: 10,
            padding: "2px 7px",
            borderRadius: 4,
            fontWeight: 500,
            background: "#E1F5EE",
            color: "#0F6E56",
          }}
        >
          {data.badge}
        </span>
      )}
    </div>
  );
}

// ── axis ticks ────────────────────────────────────────────────────────────────
function AxisTicks({
  minDate,
  maxDate,
  toPercent,
}: {
  minDate: Date;
  maxDate: Date;
  toPercent: (d: Date) => number;
}) {
  const ticks: number[] = [];
  for (let y = minDate.getFullYear(); y <= maxDate.getFullYear() + 1; y++) {
    const d = new Date(y, 0, 1);
    if (d < minDate || d > maxDate) continue;
    ticks.push(y);
  }
  return (
    <div
      style={{
        position: "relative",
        height: 28,
        marginLeft: 120,
        marginRight: 8,
        borderBottom: "0.5px solid var(--color-border-secondary)",
      }}
    >
      {ticks.map((y) => {
        const pct = toPercent(new Date(y, 0, 1));
        return (
          <div
            key={y}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${pct}%`,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{ width: "0.5px", height: 6, background: "var(--color-border-secondary)" }}
            />
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", transform: "translateY(100%) translateY(2px)" }}>
              {y}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── now line ──────────────────────────────────────────────────────────────────
function NowLine({ pct }: { pct: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -8,
        bottom: 0,
        left: `${pct}%`,
        width: 1,
        background: "var(--color-text-danger, #E24B4A)",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -16,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 9,
          color: "var(--color-text-danger, #E24B4A)",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        hoy
      </span>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function PortafolioTimeline() {
  const [experiencias, setExperiencias] = useState<ExperienciaTimeline[]>([]);
  const [certificaciones, setCertificaciones] = useState<CertificacionTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
    Promise.all([getTimelineExperiencias(), getTimelineCertificaciones()])
      .then(([exp, cert]) => {
        setExperiencias(exp);
        setCertificaciones(cert);
      })
      .catch(() => setError("No se pudo cargar la línea de tiempo."))
      .finally(() => setLoading(false));
  }, []);

  // ── date range ──────────────────────────────────────────────────────────────
  const now = new Date();

  const allDates: Date[] = [now];
  experiencias.forEach((e) => {
    const s = parseDate(e.fecha_inicio);
    const f = parseDate(e.fecha_fin);
    if (s) allDates.push(s);
    if (f) allDates.push(f);
  });
  certificaciones.forEach((c) => {
    const d = parseDate(c.fecha_obtencion);
    if (d) allDates.push(d);
  });

  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  minDate.setMonth(minDate.getMonth() - 3);
  maxDate.setMonth(maxDate.getMonth() + 2);
  const span = maxDate.getTime() - minDate.getTime();

  function toPercent(d: Date): number {
    return Math.max(0, Math.min(100, ((d.getTime() - minDate.getTime()) / span) * 100));
  }

  const nowPct = toPercent(now);

  // ── loading / error ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "var(--color-text-secondary)", fontSize: 14 }}>
        Cargando línea de tiempo…
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ padding: "2rem", color: "var(--color-text-danger)", fontSize: 14 }}>
        {error}
      </div>
    );
  }

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0 2rem" }}>
      <Tooltip data={tooltip} />

      {/* Header */}
      <div style={{
                marginBottom: "1.5rem",
                textAlign: "left",
            }}>
        <p style={{ fontSize: 18, fontWeight: 500, color: "#000" }}>
          Línea de tiempo del portafolio
        </p>
      </div>

      {/* ── Experiencias ── */}
      <section style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#000",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Experiencia profesional
        </p>

        <AxisTicks minDate={minDate} maxDate={maxDate} toPercent={toPercent} />

        <div style={{ position: "relative", marginLeft: 120, marginRight: 8, paddingTop: 8 }}>
          <NowLine pct={nowPct} />

          {experiencias.map((exp, i) => {
            const start = parseDate(exp.fecha_inicio) ?? minDate;
            const end = exp.vigente ? now : (parseDate(exp.fecha_fin) ?? now);
            const left = toPercent(start);
            const width = toPercent(end) - left;
            const color = EXP_COLORS[i % EXP_COLORS.length];

            return (
              <div key={exp.id_experiencia} style={{ position: "relative", height: 38, marginBottom: 6 }}>
                {/* Row label */}
                <div
                  title={exp.nombre_organizacion}
                  style={{
                    position: "absolute",
                    left: -120,
                    width: 112,
                    top: "50%",
                    transform: "translateY(-50%)",
                    textAlign: "right",
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                    paddingRight: 10,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1.3,
                  }}
                >
                  {exp.nombre_organizacion}
                </div>

                {/* Bar */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: `${left}%`,
                    width: `${Math.max(width, 0.5)}%`,
                    height: 26,
                    borderRadius: 6,
                    background: color,
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      title: exp.cargo,
                      subtitle: exp.nombre_organizacion,
                      dates: `${fmtDate(exp.fecha_inicio)} → ${fmtDate(exp.fecha_fin)}`,
                      badge: exp.vigente ? "Vigente" : undefined,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) => prev && { ...prev, x: e.clientX, y: e.clientY })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  {exp.vigente && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.85)",
                        marginLeft: 8,
                        marginRight: 5,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#fff",
                      padding: "0 8px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {exp.cargo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "var(--color-border-tertiary)", margin: "1.5rem 0" }} />

      {/* ── Certificaciones ── */}
      <section style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#000",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Certificaciones
        </p>

        <AxisTicks minDate={minDate} maxDate={maxDate} toPercent={toPercent} />

        <div style={{ position: "relative", marginLeft: 120, marginRight: 8, paddingTop: 8 }}>
          <NowLine pct={nowPct} />

          {certificaciones.map((cert) => {
            const d = parseDate(cert.fecha_obtencion);
            if (!d) return null;
            const pct = toPercent(d);

            return (
              <div key={cert.id_certificacion} style={{ position: "relative", height: 38, marginBottom: 6 }}>
                {/* Row label */}
                <div
                  title={cert.institucion_emisora}
                  style={{
                    position: "absolute",
                    left: -120,
                    width: 112,
                    top: "50%",
                    transform: "translateY(-50%)",
                    textAlign: "right",
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                    paddingRight: 10,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cert.institucion_emisora}
                </div>

                {/* Track line */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: 0,
                    width: `${pct}%`,
                    height: 3,
                    background: CERT_COLOR,
                    opacity: 0.25,
                    borderRadius: 2,
                  }}
                />

                {/* Diamond marker */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${pct}%`,
                    transform: "translateY(-50%) translateX(-50%)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      title: cert.titulo,
                      subtitle: cert.institucion_emisora,
                      dates: `Obtenida: ${fmtDate(cert.fecha_obtencion)}`,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) => prev && { ...prev, x: e.clientX, y: e.clientY })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <polygon
                      points="11,2 20,11 11,20 2,11"
                      fill={CERT_COLOR}
                      stroke="var(--color-background-primary)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingLeft: 120 }}>
        {experiencias.map((exp, i) => (
          <div key={exp.id_experiencia} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: EXP_COLORS[i % EXP_COLORS.length], display: "inline-block", flexShrink: 0 }} />
            {exp.cargo}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
            <polygon points="6,1 11,6 6,11 1,6" fill={CERT_COLOR} />
          </svg>
          Certificaciones
        </div>
      </div>
    </div>
  );
}