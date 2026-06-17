export type HexagonoVariant =
  | "blue" | "purple" | "green" | "orange" | "red" | "cyan";

interface HexagonoProps {
  variant?: HexagonoVariant;
  size?: number;
  cornerRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

function normalize([x, y]: number[]): number[] {
  const len = Math.sqrt(x * x + y * y);
  return [x / len, y / len];
}

function buildHexPath(r: number, cr: number): string {
  const cx = r;
  const cy = r * Math.sqrt(3) / 2;

  const verts = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });

  const n = verts.length;
  const corners = verts.map((v, i) => {
    const prev = verts[(i + n - 1) % n];
    const next = verts[(i + 1) % n];
    const toPrev = normalize([prev[0] - v[0], prev[1] - v[1]]);
    const toNext = normalize([next[0] - v[0], next[1] - v[1]]);
    return {
      p1: [v[0] + toPrev[0] * cr, v[1] + toPrev[1] * cr],
      p2: [v[0] + toNext[0] * cr, v[1] + toNext[1] * cr],
      v,
    };
  });

  return corners
    .map(({ p1, p2, v }, i) =>
      [
        i === 0
          ? `M ${p1[0].toFixed(3)},${p1[1].toFixed(3)}`
          : `L ${p1[0].toFixed(3)},${p1[1].toFixed(3)}`,
        `Q ${v[0].toFixed(3)},${v[1].toFixed(3)} ${p2[0].toFixed(3)},${p2[1].toFixed(3)}`,
      ].join(" ")
    )
    .join(" ") + " Z";
}

export default function Hexagono({
  variant = "blue",
  size = 200,
  cornerRadius = 16,
  className,
  children,
}: HexagonoProps) {
  const gradients: Record<HexagonoVariant, [string, string]> = {
    blue:   ["#60a5fa", "#101941"],
    purple: ["#a855f7", "#ec4899"],
    green:  ["#10b981", "#15803d"],
    orange: ["#fb923c", "#dc2626"],
    red:    ["#FF4D57", "#0E1228"],
    cyan:   ["#22d3ee", "#0284c7"],
  };

  const r  = size;
  const cr = Math.min(cornerRadius, r * 0.45);
  const width  = 2 * r;
  const height = r * Math.sqrt(3);
  const gradId = `hex-grad-${variant}`;

  return (
    <div
      className={`relative flex items-center justify-center ${className ?? ""}`}
      style={{ width, height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={gradients[variant][0]} />
            <stop offset="100%" stopColor={gradients[variant][1]} />
          </linearGradient>
        </defs>

        <path d={buildHexPath(r, cr)} fill={`url(#${gradId})`} />
      </svg>

      <div className="relative z-10 w-full h-full flex items-center justify-center text-white">
        {children}
      </div>
    </div>
  );
}