// components/PortafolioReplica/HeatSection.tsx
import { useRef, useEffect } from 'react';

interface HeatPoint {
  x: number;  // coordenada en píxeles
  y: number;
}

interface HeatSectionProps {
  children: React.ReactNode;
  points?: HeatPoint[];  // por ahora vacío, lo conectamos en paso 2
}

interface HeatSectionProps {
  children: React.ReactNode
  intensidad?: number  // 0 a 1
}

export function HeatmapSeccion({ children,intensidad = 0}: HeatSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    if (!container || !canvas || intensidad === 0) return

    canvas.width  = container.offsetWidth
    canvas.height = container.offsetHeight

    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // pinta un gradiente radial centrado que cubre toda la sección
    const cx = canvas.width  / 2
    const cy = canvas.height / 2
    const r  = Math.max(cx, cy)

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0,   `rgba(255, 80,  0, ${0.6 * intensidad})`)
    grad.addColorStop(0.5, `rgba(255, 180, 0, ${0.4 * intensidad})`)
    grad.addColorStop(1,   `rgba(53,  130, 220, ${0.15 * intensidad})`)

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [intensidad])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
    </div>
  )
}