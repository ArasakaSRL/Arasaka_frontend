import React from "react";

interface Point {
  x: string;
  y: number;
}

interface Props {
  data: Point[];
  width?: number;
  height?: number;
}

export function LineChart({ data, width = 600, height = 300 }: Props) {
  const padding = 40;

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const stepX = chartWidth / (data.length - 1);

  // 🔵 convertir puntos a coordenadas SVG
  const points = data.map((d, i) => {
    const x = padding + i * stepX;

    const y =
      height -
      padding -
      ((d.y - minY) / (maxY - minY || 1)) * chartHeight;

    return { x, y, value: d.y, label: d.x };
  });

  // 🔵 path de la línea
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // 🔵 área debajo
  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${height - padding}
    L ${points[0].x} ${height - padding}
    Z
  `;

  return (
    <svg width={width} height={height}>
      {/* Gradiente */}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Área */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Línea */}
      <path
        d={linePath}
        fill="none"
        stroke="#4f46e5"
        strokeWidth={2}
      />

      {/* Puntos */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="white"
          stroke="#4f46e5"
          strokeWidth={2}
        />
      ))}

      {/* Labels X */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={height - 10}
          textAnchor="middle"
          fontSize="10"
          fill="#6b7280"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}