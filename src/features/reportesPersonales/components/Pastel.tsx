import { useState } from "react";

export interface SkillItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  title?: string;
  skills: SkillItem[];
}

interface Arc {
  label: string;
  value: number;
  color: string;
  startAngle: number;
  endAngle: number;
  pct: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildArcs(skills: SkillItem[]): Arc[] {
  const total = skills.reduce((s, i) => s + i.value, 0);
  if (total === 0) return [];
  let cursor = 0;
  return skills
    .filter((s) => s.value > 0)
    .map((s) => {
      const pct = s.value / total;
      const arc: Arc = {
        ...s,
        pct: Math.round(pct * 100),
        startAngle: cursor * 360,
        endAngle: (cursor + pct) * 360,
      };
      cursor += pct;
      return arc;
    });
}

function DonutPath({
  arc,
  cx,
  cy,
  outerR,
  innerR,
  isHovered,
  onEnter,
  onLeave,
}: {
  arc: Arc;
  cx: number;
  cy: number;
  outerR: number;
  innerR: number;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const r = isHovered ? outerR + 6 : outerR;
  const gap = 1.5;
  const start = arc.startAngle + gap / 2;
  const end = arc.endAngle - gap / 2;
  const largeArc = end - start > 180 ? 1 : 0;

  const s1 = polarToCartesian(cx, cy, r, start);
  const e1 = polarToCartesian(cx, cy, r, end);
  const s2 = polarToCartesian(cx, cy, innerR, end);
  const e2 = polarToCartesian(cx, cy, innerR, start);

  const d = [
    `M ${s1.x} ${s1.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");

  return (
    <path
      d={d}
      fill={isHovered ? arc.color : arc.color + (isHovered ? "" : "DD")}
      style={{
        transition: "all .2s ease",
        cursor: "pointer",
        opacity: isHovered === false ? 0.85 : 1,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    />
  );
}

export default function SkillsChart({
  title = "Habilidades técnicas",
  skills,
}: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = skills.reduce((s, i) => s + i.value, 0);
  const arcs = buildArcs(skills);

  const cx = 110;
  const cy = 110;
  const outerR = 90;
  const innerR = 58;

  const centerDisplay =
    hoveredIdx !== null
      ? { value: skills[hoveredIdx].value, sub: skills[hoveredIdx].label }
      : { value: total, sub: "total" };

  const topSkill =
    skills.length > 0 ? skills.reduce((a, b) => (b.value > a.value ? b : a)) : null;

  const activeSkills = skills.filter((s) => s.value > 0).length;

  if (skills.length === 0) {
    return (
      <div className="flex items-center justify-center bg-white rounded-xl border p-6 text-slate-400 text-sm">
        Sin habilidades técnicas registradas
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
      <p className="text-[15px] text-left font-medium text-slate-800">{title}</p>

      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Donut SVG */}
        <div className="flex justify-center">
          <svg
            width={220}
            height={220}
            viewBox="0 0 220 220"
            role="img"
            aria-label={`Gráfico de dona: ${skills.map((s) => `${s.label} ${s.value}`).join(", ")}`}
          >
            {arcs.map((arc, i) => (
              <DonutPath
                key={arc.label}
                arc={arc}
                cx={cx}
                cy={cy}
                outerR={outerR}
                innerR={innerR}
                isHovered={hoveredIdx === i}
                onEnter={() => setHoveredIdx(i)}
                onLeave={() => setHoveredIdx(null)}
              />
            ))}
            {/* Centro */}
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fontSize={hoveredIdx !== null ? 22 : 28}
              fontWeight={500}
              fill="currentColor"
              style={{ transition: "font-size .15s" }}
            >
              {centerDisplay.value}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              fontSize={11}
              fill="#94a3b8"
            >
              {centerDisplay.sub}
            </text>
          </svg>
        </div>

        {/* Leyenda */}
        <div className="flex flex-col gap-1">
          {skills.map((s, idx) => {
            const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
            const isActive = hoveredIdx === idx;
            return (
              <div
                key={s.label}
                className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg cursor-pointer transition-colors"
                style={{ background: isActive ? "#f8fafc" : "transparent" }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0 transition-transform"
                  style={{
                    background: s.color,
                    transform: isActive ? "scale(1.25)" : "scale(1)",
                  }}
                />
                <span className="text-[13px] text-slate-500 flex-1">{s.label}</span>
                <span className="text-[13px] font-medium text-slate-700">{s.value}</span>
                <span className="text-[12px] text-slate-400 w-9 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div
            className="text-[16px] font-medium text-slate-800 truncate"
            title={topSkill?.label}
          >
            {topSkill?.label ?? "—"}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">nivel más común</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-[18px] font-medium text-slate-800">
            {topSkill && total > 0
              ? Math.round((topSkill.value / total) * 100) + "%"
              : "—"}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">mayor cobertura</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <div className="text-[18px] font-medium text-slate-800">
            {activeSkills} / {skills.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">niveles activos</div>
        </div>
      </div>
    </div>
  );
}