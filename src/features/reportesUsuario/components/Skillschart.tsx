"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SkillItem {
  label: string;
  value: number;
  color: string;
}

interface SkillsChartProps {
  title?: string;
  skills: SkillItem[];
  /** Stroke thickness — thicker = smaller hole (default: 56) */
  strokeWidth?: number;
  /** Semicircle radius (default: 130) */
  radius?: number;
}

// ─── SVG layout ───────────────────────────────────────────────────────────────

const CX = 170;
const CY = 185;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SkillsChart({
  title = "Habilidades desarrolladas",
  skills,
  strokeWidth = 56,
  radius = 130,
}: SkillsChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const total = skills.reduce((sum, s) => sum + s.value, 0);
  const semiCirc = Math.PI * radius;
  const arcPath = `M ${CX - radius} ${CY} A ${radius} ${radius} 0 0 1 ${CX + radius} ${CY}`;

  // Inner hole: radius shrunk by the stroke so it stays inside the band
  const holeR = radius - strokeWidth * 0.78;
  const holePath = `M ${CX - holeR} ${CY} A ${holeR} ${holeR} 0 0 1 ${CX + holeR} ${CY}`;

  const pct = (v: number) => Math.round((v / total) * 100);
  const dashLen = (v: number) => (v / total) * semiCirc;

  const sorted = [...skills].sort((a, b) => b.value - a.value);
  const active = hovered
    ? (skills.find((s) => s.label === hovered) ?? sorted[0])
    : sorted[0];

  // Text sits just above the baseline, well inside the small hole
  const textY = CY - 18;
  const svgHeight = CY + 20;

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto select-none">

      {/* Title */}
      <p className="self-start text-sm font-medium text-gray-500 mb-3">{title}</p>

      {/* Arc */}
      <div className="w-full" style={{ height: svgHeight }}>
        <svg
          viewBox={`0 0 ${CX * 2} ${svgHeight}`}
          width="100%"
          height={svgHeight}
          role="img"
          aria-label={`Gráfico de ${title}`}
        >
          {/* Background track */}
          <path
            d={arcPath}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Skill arcs — largest first (bottom), smallest last (top) */}
          {sorted.map((skill) => {
            const isActive = hovered === skill.label;
            return (
              <path
                key={skill.label}
                d={arcPath}
                fill="none"
                stroke={skill.color}
                strokeWidth={isActive ? strokeWidth + 5 : strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dashLen(skill.value)} ${semiCirc}`}
                pathLength={semiCirc}
                opacity={hovered && !isActive ? 0.25 : 1}
                className="cursor-pointer"
                style={{ transition: "opacity 0.2s ease, stroke-width 0.15s ease" }}
                onMouseEnter={() => setHovered(skill.label)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          {/* White mask — carves out the small donut hole */}
          <path
            d={holePath}
            fill="none"
            stroke="white"
            strokeWidth={strokeWidth * 0.45}
          />

          {/* Center label — safely inside the hole */}
          <text
            x={CX}
            y={textY}
            textAnchor="middle"
            fontSize={18}
            fontWeight="600"
            fill={active.color}
            fontFamily="sans-serif"
            style={{ transition: "fill 0.2s ease" }}
          >
            {active.value}
          </text>
          <text
            x={CX}
            y={textY + 14}
            textAnchor="middle"
            fontSize={9}
            fill="#9CA3AF"
            fontFamily="sans-serif"
          >
            {active.label.toLowerCase()} · {pct(active.value)}%
          </text>
        </svg>
      </div>

      {/* Top 2 badges */}
      <div className="flex gap-2 w-full mt-2 mb-4">
        {sorted.slice(0, 2).map((skill) => (
          <button
            key={skill.label}
            type="button"
            className="flex items-center gap-2 flex-1 rounded-xl px-3 py-2.5 bg-gray-50 transition-all cursor-pointer"
            style={{
              outline:
                hovered === skill.label
                  ? `2px solid ${skill.color}`
                  : "2px solid transparent",
            }}
            onMouseEnter={() => setHovered(skill.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: skill.color }}
            />
            <div className="text-left">
              <p
                className="text-base font-semibold leading-none"
                style={{ color: skill.color }}
              >
                {skill.value}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {skill.label} · {pct(skill.value)}%
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Full legend */}
      <div className="flex flex-col gap-0.5 w-full">
        {sorted.map((skill) => (
          <div
            key={skill.label}
            className="flex items-center justify-between text-xs rounded-lg px-2 py-1.5 cursor-pointer transition-colors"
            style={{
              backgroundColor:
                hovered === skill.label ? `${skill.color}18` : "transparent",
            }}
            onMouseEnter={() => setHovered(skill.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ backgroundColor: skill.color }}
              />
              <span className="text-gray-600">{skill.label}</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct(skill.value)}%`,
                    backgroundColor: skill.color,
                  }}
                />
              </div>
              <span className="text-gray-400 w-16 text-right tabular-nums">
                {skill.value} · {pct(skill.value)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="w-full flex justify-between text-[11px] text-gray-400 border-t border-gray-100 mt-3 pt-2.5">
        <span>Total</span>
        <span className="font-medium text-gray-500 tabular-nums">{total} · 100%</span>
      </div>
    </div>
  );
}