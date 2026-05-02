import React from "react";

interface DataItem {
  mes: string;
  visitas: number;
}

interface Props {
  data: DataItem[];
}

export function BarChartVisitas({ data }: Props) {
  const width = 600;
  const height = 300;

  const padding = 40;

  const maxValue = Math.max(...data.map(d => d.visitas));

  const barWidth = (width - padding * 2) / data.length;

  return (
    <svg width={width} height={height}>
      {/* Grid horizontal */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = height - padding - p * (height - padding * 2);
        return (
          <line
            key={i}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="#e5e7eb"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Barras */}
      {data.map((d, i) => {
  const barHeight = (d.visitas / maxValue) * (height - padding * 2);

  const x = padding + i * barWidth + barWidth * 0.2;
  const y = height - padding - barHeight;

  return (
    <g key={i}>
      <rect
        x={x}
        y={y}
        width={barWidth * 0.6}
        height={barHeight}
        rx={8}
        fill="#4f46e5" // 🔥 color sólido
      />

      <text
        x={x + barWidth * 0.3}
        y={height - 10}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
      >
        {d.mes}
      </text>
    </g>
  );
})}

      {/* Definición gradiente */}
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}