import { useMemo, useState, type ReactNode, type CSSProperties } from "react";
import { useAnalytics } from "../hooks/useAnalisis";
import type {
  InteraccionCertificacionAPI,
  InteraccionExperienciaAPI,
  InteraccionHabilidadBlandaAPI,
  InteraccionHabilidadTecnicaAPI,
  InteraccionPerfilAPI,
  InteraccionProyectoAPI,
  VisitanteAPI,
} from "../types/analisis";

// ─── design tokens ───────────────────────────────────────────────────────────
// Acentos de marca/categoría en hex fijo (consistente con tu paleta original).
// El resto usa hex de gris neutro + var(--font-sans), que ya apunta a Poppins
// vía tu @theme en index.css.
const C = {
  violet: "#534AB7",
  violetSoft: "#EEEDFE",
  violetSoftDark: "#3D3870",
  teal: "#0F6E56",
  tealSoft: "#E1F5EE",
  tealSoftDark: "#164E47",
  amber: "#BA7517",
  amberSoft: "#FAEEDA",
  coral: "#993C1D",
  coralSoft: "#FAECE7",
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmtNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function fmtMs(ms: number): string {
  if (ms < 1000) return ms + "ms";
  return (ms / 1000).toFixed(1) + "s";
}

function parseHour(dateStr: string): number {
  return new Date(dateStr).getHours();
}

function parseMonth(dateStr: string): number {
  return new Date(dateStr).getMonth();
}

const MONTH_NAMES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function hourLabel(h: number): string {
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

// ─── primitives ───────────────────────────────────────────────────────────────

function StatusDot({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function SectionHead({
  title,
  sub,
  color = C.violet,
}: {
  title: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
      <StatusDot color={color} />
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#1A1B1F", letterSpacing: "0.04em" }}>
        {title}
      </span>
      {sub && (
        <span style={{ fontSize: 11, color: "#9A9CA5" }}>{sub}</span>
      )}
    </div>
  );
}

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E4E3DD",
        borderRadius: 10,
        padding: "18px 20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E4E3DD",
        borderRadius: 10,
        padding: "16px 18px",
      }}
    >
      <p style={{ fontSize: 11, color: "#9A9CA5", marginBottom: 10, letterSpacing: "0.03em" }}>
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 28,
          fontWeight: 500,
          color: accent ?? "#1A1B1F",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </p>
      {sub && <p style={{ fontSize: 11, color: "#9A9CA5", marginTop: 8 }}>{sub}</p>}
    </div>
  );
}

function MetricRow({
  label,
  value,
  max,
  color,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
      <span
        style={{
          fontSize: 12,
          color: "#6B6D78",
          width: 108,
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 4, background: "#F4F4F1", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 2,
            transition: "width .5s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "#6B6D78",
          width: 40,
          textAlign: "right",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}{suffix}
      </span>
    </div>
  );
}

function Tag({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 10,
        padding: "2px 7px",
        borderRadius: 4,
        background: bg,
        color,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 12, color: "#9A9CA5", padding: "0.5rem 0" }}>{text}</p>
  );
}

// ─── signature element: pulso horario ──────────────────────────────────────
function HourPulse({
  visitantes,
  selectedMonth,
}: {
  visitantes: VisitanteAPI[];
  selectedMonth: number | null;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const data = useMemo(() => {
    const filtered = selectedMonth === null
      ? visitantes
      : visitantes.filter(v => parseMonth(v.primera_visita) === selectedMonth);

    return Array.from({ length: 24 }, (_, h) => {
      const total = filtered.filter(v => parseHour(v.ultima_visita) === h).length;
      const recurring = filtered.filter(
        v => parseHour(v.ultima_visita) === h && v.primera_visita !== v.ultima_visita
      ).length;
      return { h, total, recurring };
    });
  }, [visitantes, selectedMonth]);

  const hasData = data.some(d => d.total > 0);
  if (!hasData) return <Empty text="Sin datos para este período." />;

  const width = 640;
  const height = 110;
  const padX = 24;
  const maxVal = Math.max(...data.map(d => d.total), 1);
  const slotW = (width - padX * 2) / 24;

  const points = data.map(d => ({
    ...d,
    x: padX + d.h * slotW + slotW / 2,
    y: height - 24 - (d.total / maxVal) * (height - 48),
  }));

  const peak = points.reduce((a, b) => (b.total > a.total ? b : a), points[0]);
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - 24} L ${points[0].x} ${height - 24} Z`;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
        <line x1={padX} y1={height - 24} x2={width - padX} y2={height - 24} stroke="#E4E3DD" strokeWidth="1" />

        <defs>
          <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.violet} stopOpacity="0.14" />
            <stop offset="100%" stopColor={C.violet} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#pulseFill)" stroke="none" />
        <path d={linePath} fill="none" stroke={C.violet} strokeWidth="1.5" />

        {points.map(p => (
          <g key={p.h}>
            <rect
              x={p.x - slotW / 2}
              y={0}
              width={slotW}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHovered(p.h)}
              onMouseLeave={() => setHovered(null)}
            />
            {p.total > 0 && (
              <circle
                cx={p.x}
                cy={p.y}
                r={p.h === peak.h ? 4 : hovered === p.h ? 3.5 : 2.5}
                fill={p.h === peak.h ? C.amber : C.violet}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            )}
            {p.total > 0 && (
              <text
                x={p.x}
                y={height - 6}
                textAnchor="middle"
                fontFamily="var(--font-sans)"
                fontSize="9"
                fill="#9A9CA5"
              >
                {hourLabel(p.h)}
              </text>
            )}
          </g>
        ))}
      </svg>

      {hovered !== null && (() => {
        const p = points.find(pt => pt.h === hovered);
        if (!p || p.total === 0) return null;
        return (
          <div
            style={{
              position: "absolute",
              left: `${(p.x / width) * 100}%`,
              top: 0,
              transform: "translate(-50%, -100%)",
              background: "#FFFFFF",
              border: "1px solid #D1D0C8",
              borderRadius: 6,
              padding: "8px 10px",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              marginTop: -8,
              zIndex: 10,
            }}
          >
            <div style={{ color: "#1A1B1F", marginBottom: 4 }}>{hourLabel(p.h)}</div>
            <div style={{ color: C.violet }}>total {p.total}</div>
            <div style={{ color: C.teal }}>recurrente {p.recurring}</div>
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9A9CA5" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber, display: "inline-block" }} />
          pico de actividad — {hourLabel(peak.h)} · {peak.total} visitas
        </div>
      </div>
    </div>
  );
}

// ─── Sección: Perfil ──────────────────────────────────────────────────────────
function PerfilSection({ data }: { data: InteraccionPerfilAPI[] }) {
  if (!data.length) return null;

  const totals = data.reduce(
    (acc, p) => ({
      hover_foto: acc.hover_foto + p.hover_foto_count,
      hover_correo: acc.hover_correo + p.hover_correo_count,
      clic_foto: acc.clic_foto + p.clic_foto_perfil,
      clic_correo: acc.clic_correo + p.clic_correo,
      clic_linkedin: acc.clic_linkedin + p.clic_linkedin,
      clic_github: acc.clic_github + p.clic_github,
      clic_contactar: acc.clic_contactar + p.clic_contactar,
      clic_cv: acc.clic_cv + p.clic_descargar_cv,
      hover_foto_ms: acc.hover_foto_ms + p.hover_foto_ms,
      hover_correo_ms: acc.hover_correo_ms + p.hover_correo_ms,
    }),
    {
      hover_foto: 0, hover_correo: 0, clic_foto: 0, clic_correo: 0,
      clic_linkedin: 0, clic_github: 0, clic_contactar: 0, clic_cv: 0,
      hover_foto_ms: 0, hover_correo_ms: 0,
    }
  );

  const clics = [
    { label: "Descargar CV", value: totals.clic_cv },
    { label: "Contactar", value: totals.clic_contactar },
    { label: "LinkedIn", value: totals.clic_linkedin },
    { label: "GitHub", value: totals.clic_github },
    { label: "Correo", value: totals.clic_correo },
    { label: "Foto de perfil", value: totals.clic_foto },
  ];
  const maxClic = Math.max(...clics.map(c => c.value), 1);

  return (
    <Panel>
      <SectionHead title="perfil" sub="interacción con datos personales" color={C.violet} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        <div>
          <p style={{ fontSize: 10, color: "#9A9CA5", marginBottom: 4 }}>tiempo en foto</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 18, color: "#1A1B1F", fontVariantNumeric: "tabular-nums" }}>
            {fmtMs(Math.round(totals.hover_foto_ms / Math.max(data.length, 1)))}
          </p>
          <p style={{ fontSize: 10, color: "#9A9CA5", marginTop: 2 }}>{totals.hover_foto} hovers</p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: "#9A9CA5", marginBottom: 4 }}>tiempo en correo</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 18, color: "#1A1B1F", fontVariantNumeric: "tabular-nums" }}>
            {fmtMs(Math.round(totals.hover_correo_ms / Math.max(data.length, 1)))}
          </p>
          <p style={{ fontSize: 10, color: "#9A9CA5", marginTop: 2 }}>{totals.hover_correo} hovers</p>
        </div>
      </div>
      <div>
        {clics.map(c => (
          <MetricRow key={c.label} label={c.label} value={c.value} max={maxClic} color={C.violet} />
        ))}
      </div>
    </Panel>
  );
}

// ─── Sección: Proyectos ───────────────────────────────────────────────────────
function ProyectosSection({ data }: { data: InteraccionProyectoAPI[] }) {
  if (!data.length) return null;

  const byProject = Object.entries(
    data.reduce<Record<string, { github: number; demo: number; detalle: number; hover_ms: number; clics: number }>>((acc, p) => {
      if (!acc[p.id_proyecto]) acc[p.id_proyecto] = { github: 0, demo: 0, detalle: 0, hover_ms: 0, clics: 0 };
      acc[p.id_proyecto].github += p.clic_github;
      acc[p.id_proyecto].demo += p.clic_demo;
      acc[p.id_proyecto].detalle += p.clic_detalle;
      acc[p.id_proyecto].hover_ms += p.hover_ms;
      acc[p.id_proyecto].clics += p.clic_general;
      return acc;
    }, {})
  )
    .map(([id, vals]) => ({ id, ...vals }))
    .sort((a, b) => b.clics - a.clics);

  const maxClics = Math.max(...byProject.map(p => p.clics), 1);

  return (
    <Panel>
      <SectionHead title="proyectos" sub="engagement por repo" color={C.teal} />
      {byProject.map(p => (
        <div
          key={p.id}
          style={{
            marginBottom: 12,
            background: "#F4F4F1",
            border: "1px solid #E4E3DD",
            borderRadius: 8,
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#1A1B1F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.id}
            </span>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {p.github > 0 && <Tag label={`github ×${p.github}`} color={C.violet} bg={C.violetSoft} />}
              {p.demo > 0 && <Tag label={`demo ×${p.demo}`} color={C.teal} bg={C.tealSoft} />}
              {p.detalle > 0 && <Tag label={`detalle ×${p.detalle}`} color={C.amber} bg={C.amberSoft} />}
            </div>
          </div>
          <MetricRow label="clics totales" value={p.clics} max={maxClics} color={C.teal} />
          <p style={{ fontSize: 11, color: "#9A9CA5" }}>
            hover acumulado: {fmtMs(p.hover_ms)}
          </p>
        </div>
      ))}
    </Panel>
  );
}

// ─── Sección: Certificaciones ─────────────────────────────────────────────────
function CertificacionesSection({ data }: { data: InteraccionCertificacionAPI[] }) {
  if (!data.length) return null;

  const byCert = Object.entries(
    data.reduce<Record<string, { hovers: number; hover_ms: number; modal: number; credencial: number }>>((acc, c) => {
      if (!acc[c.id_certificacion]) acc[c.id_certificacion] = { hovers: 0, hover_ms: 0, modal: 0, credencial: 0 };
      acc[c.id_certificacion].hovers += c.hover_count;
      acc[c.id_certificacion].hover_ms += c.hover_ms;
      acc[c.id_certificacion].modal += c.clic_abrir_modal;
      acc[c.id_certificacion].credencial += c.clic_ver_credencial;
      return acc;
    }, {})
  )
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.credencial - a.credencial);

  const maxCredencial = Math.max(...byCert.map(c => c.credencial), 1);

  return (
    <Panel>
      <SectionHead title="certificaciones" sub="interés por credencial" color={C.amber} />
      {byCert.map(c => (
        <div key={c.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6B6D78", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.id}
            </span>
            {c.modal > 0 && <Tag label={`modal ×${c.modal}`} color={C.violet} bg={C.violetSoft} />}
          </div>
          <MetricRow label="ver credencial" value={c.credencial} max={maxCredencial} color={C.amber} />
        </div>
      ))}
    </Panel>
  );
}

// ─── Sección: Experiencias ────────────────────────────────────────────────────
function ExperienciasSection({ data }: { data: InteraccionExperienciaAPI[] }) {
  if (!data.length) return null;

  const byExp = Object.entries(
    data.reduce<Record<string, { visible: number; total: number; hovers: number; hover_ms: number; clics: number }>>((acc, e) => {
      if (!acc[e.id_experiencia]) acc[e.id_experiencia] = { visible: 0, total: 0, hovers: 0, hover_ms: 0, clics: 0 };
      if (e.fue_visible) acc[e.id_experiencia].visible++;
      acc[e.id_experiencia].total++;
      acc[e.id_experiencia].hovers += e.hover_count;
      acc[e.id_experiencia].hover_ms += e.hover_ms;
      acc[e.id_experiencia].clics += e.clic_general;
      return acc;
    }, {})
  )
    .map(([id, v]) => ({ id, visibilidad: v.total > 0 ? Math.round((v.visible / v.total) * 100) : 0, ...v }))
    .sort((a, b) => b.hovers - a.hovers);

  const maxHovers = Math.max(...byExp.map(e => e.hovers), 1);

  return (
    <Panel>
      <SectionHead title="experiencia" sub="atención por entrada" color={C.coral} />
      {byExp.map(e => (
        <div key={e.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6B6D78", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {e.id}
            </span>
            <Tag
              label={`${e.visibilidad}% visible`}
              color={e.visibilidad > 60 ? C.teal : C.amber}
              bg={e.visibilidad > 60 ? C.tealSoft : C.amberSoft}
            />
          </div>
          <MetricRow label={fmtMs(e.hover_ms)} value={e.hovers} max={maxHovers} color={C.coral} suffix=" hv" />
        </div>
      ))}
    </Panel>
  );
}

// ─── Sección: Habilidades ─────────────────────────────────────────────────────
function HabilidadesSection({
  blandas,
  tecnicas,
}: {
  blandas: InteraccionHabilidadBlandaAPI[];
  tecnicas: InteraccionHabilidadTecnicaAPI[];
}) {
  const [tab, setTab] = useState<"blandas" | "tecnicas">("tecnicas");

  const byBlanda = Object.entries(
    blandas.reduce<Record<string, { hovers: number; hover_ms: number; visible: number; total: number }>>((acc, h) => {
      if (!acc[h.id_habilidad]) acc[h.id_habilidad] = { hovers: 0, hover_ms: 0, visible: 0, total: 0 };
      acc[h.id_habilidad].hovers += h.hover_count;
      acc[h.id_habilidad].hover_ms += h.hover_ms;
      if (h.fue_visible) acc[h.id_habilidad].visible++;
      acc[h.id_habilidad].total++;
      return acc;
    }, {})
  )
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.hovers - a.hovers);

  const byTecnica = Object.entries(
    tecnicas.reduce<Record<string, { expandir: number; cerrar: number; clics: number }>>((acc, h) => {
      if (!acc[h.id_habilidad]) acc[h.id_habilidad] = { expandir: 0, cerrar: 0, clics: 0 };
      acc[h.id_habilidad].expandir += h.clic_expandir;
      acc[h.id_habilidad].cerrar += h.clic_cerrar;
      acc[h.id_habilidad].clics += h.clic_general;
      return acc;
    }, {})
  )
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.expandir - a.expandir);

  const maxB = Math.max(...byBlanda.map(h => h.hovers), 1);
  const maxT = Math.max(...byTecnica.map(h => h.expandir), 1);

  if (!byBlanda.length && !byTecnica.length) return null;

  return (
    <Panel>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <StatusDot color={C.violet} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#1A1B1F", letterSpacing: "0.04em" }}>
            habilidades
          </span>
          <span style={{ fontSize: 11, color: "#9A9CA5" }}>engagement por skill</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["tecnicas", "blandas"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                padding: "4px 9px",
                borderRadius: 6,
                border: `1px solid ${tab === t ? C.violet : "#E4E3DD"}`,
                background: tab === t ? C.violetSoft : "transparent",
                color: tab === t ? C.violet : "#6B6D78",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              {t === "tecnicas" ? "técnicas" : "blandas"}
            </button>
          ))}
        </div>
      </div>

      {tab === "tecnicas" && (byTecnica.length
        ? byTecnica.map(h => (
            <div key={h.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
                <span style={{ fontSize: 12, color: "#6B6D78", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {h.id}
                </span>
                {h.expandir > 0 && <Tag label={`expandida ×${h.expandir}`} color={C.violet} bg={C.violetSoft} />}
              </div>
              <MetricRow label="expansiones" value={h.expandir} max={maxT} color={C.violet} />
            </div>
          ))
        : <Empty text="Sin interacciones registradas." />
      )}

      {tab === "blandas" && (byBlanda.length
        ? byBlanda.map(h => (
            <div key={h.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
                <span style={{ fontSize: 12, color: "#6B6D78", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {h.id}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#9A9CA5" }}>{fmtMs(h.hover_ms)}</span>
              </div>
              <MetricRow label="hovers" value={h.hovers} max={maxB} color={C.teal} />
            </div>
          ))
        : <Empty text="Sin interacciones registradas." />
      )}
    </Panel>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardReportes() {
  const { visitantes, interacciones, isLoadingAnalytics, isErrorAnalytics, refetchAnalytics } =
    useAnalytics();

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const availableMonths = useMemo(() => {
    const months = new Set(visitantes.map(v => parseMonth(v.primera_visita)));
    return Array.from(months).sort((a, b) => a - b);
  }, [visitantes]);

  const kpis = useMemo(() => {
    const filtered =
      selectedMonth === null
        ? visitantes
        : visitantes.filter(v => parseMonth(v.primera_visita) === selectedMonth);

    const total = filtered.length;
    const recurring = filtered.filter(v => v.primera_visita !== v.ultima_visita).length;
    const retentionRate = total > 0 ? Math.round((recurring / total) * 100) : 0;

    return { total, recurring, retentionRate };
  }, [visitantes, selectedMonth]);

  // ── Loading ──
  if (isLoadingAnalytics) {
    return (
      <div
        style={{
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          color: "#9A9CA5",
          fontSize: 13,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            border: "2px solid #D1D0C8",
            borderTop: `2px solid ${C.violet}`,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        cargando analíticas…
      </div>
    );
  }

  // ── Error ──
  if (isErrorAnalytics) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#6B6D78", marginBottom: 12 }}>
          No se pudieron cargar las analíticas.
        </p>
        <button
          onClick={refetchAnalytics}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            padding: "7px 16px",
            borderRadius: 8,
            border: "1px solid #D1D0C8",
            background: "transparent",
            color: "#1A1B1F",
            cursor: "pointer",
          }}
        >
          reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem 0 3rem" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusDot color={C.teal} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#1A1B1F", letterSpacing: "0.03em" }}>
              analíticas / portafolio
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#9A9CA5", marginTop: 6, marginLeft: 14 }}>
            {visitantes.length.toLocaleString()} visitantes registrados
          </p>
        </div>

        {/* Month filter */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedMonth(null)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              padding: "5px 10px",
              borderRadius: 6,
              border: `1px solid ${selectedMonth === null ? C.violet : "#E4E3DD"}`,
              background: selectedMonth === null ? C.violetSoft : "transparent",
              color: selectedMonth === null ? C.violet : "#6B6D78",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            todo
          </button>
          {availableMonths.map(m => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 6,
                border: `1px solid ${selectedMonth === m ? C.violet : "#E4E3DD"}`,
                background: selectedMonth === m ? C.violetSoft : "transparent",
                color: selectedMonth === m ? C.violet : "#6B6D78",
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              {MONTH_NAMES[m]}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.75rem" }}>
        <Kpi
          label="visitantes totales"
          value={fmtNum(kpis.total)}
          sub={selectedMonth !== null ? MONTH_NAMES[selectedMonth] : "todos los meses"}
        />
        <Kpi
          label="recurrentes"
          value={fmtNum(kpis.recurring)}
          sub={`${kpis.retentionRate}% de retención`}
          accent={C.violet}
        />
        <Kpi
          label="solo una visita"
          value={fmtNum(kpis.total - kpis.recurring)}
          sub="visitantes nuevos"
        />
      </div>

      {/* ── Pulso horario (signature) ── */}
      <Panel style={{ marginBottom: "1.5rem" }}>
        <SectionHead title="pulso horario" sub="actividad por hora del día" color={C.violet} />
        <HourPulse visitantes={visitantes} selectedMonth={selectedMonth} />
      </Panel>

      {/* ── Two-column engagement grid ── */}
      {interacciones && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PerfilSection data={interacciones.interaccion_perfil} />
            <ExperienciasSection data={interacciones.interaccion_experiencia} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <ProyectosSection data={interacciones.interaccion_proyectos} />
            <CertificacionesSection data={interacciones.interaccion_certificacion} />
            <HabilidadesSection
              blandas={interacciones.interaccion_habilidad_blanda}
              tecnicas={interacciones.interaccion_habilidad_tecnica}
            />
          </div>
        </div>
      )}
    </div>
  );
}