"use client";

import { useState } from "react";

export interface SkillItem {
  label: string;
  value: number;
  color: string;
}

interface SkillsChartProps {
  title?: string;
  skills: SkillItem[];
  strokeWidth?: number;
  radius?: number;
}

const CX = 170;
const CY = 185;

export default function SkillsChart({
  title = "Habilidades desarrolladas",
  skills,
  strokeWidth = 56,
  radius = 130,
}: SkillsChartProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // 🔹 Total real
  const total = skills.reduce((sum, s) => sum + s.value, 0);

  const semiCirc = Math.PI * radius;

  const arcPath = `M ${CX - radius} ${CY} A ${radius} ${radius} 0 0 1 ${CX + radius} ${CY}`;

  const holeR = radius - strokeWidth * 0.78;
  const holePath = `M ${CX - holeR} ${CY} A ${holeR} ${holeR} 0 0 1 ${CX + holeR} ${CY}`;

  const pct = (v: number) => Math.round((v / total) * 100);
  const dashLen = (v: number) => (v / total) * semiCirc;

  // 🔹 Orden: mayor atrás
  const sorted = [...skills].sort((a, b) => b.value - a.value);

  // 🔹 Estado activo (NULL = modo total)
  const active = hovered
    ? skills.find((s) => s.label === hovered) ?? null
    : null;

  const textY = CY - 18;
  const svgHeight = CY + 20;

  return (
    <div className="flex flex-col items-start w-full max-w-xs select-none">

      {/* Title */}
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>

      <div className="w-full" style={{ height: svgHeight }}>
        <svg
          viewBox={`0 0 ${CX * 2} ${svgHeight}`}
          width="100%"
          height={svgHeight}
        >
          {/* Fondo */}
          <path
            d={arcPath}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Arcos */}
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
                style={{
                  transition: "opacity 0.2s ease, stroke-width 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHovered(skill.label)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          {/* Donut interno */}
          <path
            d={holePath}
            fill="none"
            stroke="white"
            strokeWidth={strokeWidth * 0.45}
          />

          {/* 🔥 TEXTO CENTRAL CORREGIDO */}
          <text
            x={CX}
            y={textY}
            textAnchor="middle"
            fontSize={40}
            fontWeight="600"
            fill={active ? active.color : "#374151"}
            fontFamily="sans-serif"
            style={{ transition: "fill 0.2s ease" }}
          >
            {active ? active.value : total}
          </text>

          <text
            x={CX}
            y={textY + 16}
            textAnchor="middle"
            fontSize={15}
            fill="#9CA3AF"
            fontFamily="sans-serif"
          >
            {active
              ? `${active.label.toLowerCase()} · ${pct(active.value)}%`
              : `total habilidades · 100%`}
          </text>
        </svg>
      </div>
    </div>
  );
}