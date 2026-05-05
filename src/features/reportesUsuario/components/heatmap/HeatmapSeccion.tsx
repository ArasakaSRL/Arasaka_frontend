import { useEffect, useRef } from "react"

// HeatmapSeccion — actualizar para recibir puntos con coordenadas
interface HeatPoint {
    x:          number  // 0.0 a 1.0 relativo al contenedor
    y:          number
    intensidad: number  // cantidad de clics en ese punto
}

interface Props {
    children:   React.ReactNode
    puntos?:    HeatPoint[]
    maxIntensidad?: number
}

export function HeatmapSeccion({ children, puntos = [], maxIntensidad = 1 }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef    = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const canvas    = canvasRef.current
        if (!container || !canvas) return

        canvas.width  = container.offsetWidth
        canvas.height = container.offsetHeight

        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (puntos.length === 0) return

        puntos.forEach(punto => {
            // Convierte coordenadas relativas a píxeles del canvas
            const cx = punto.x * canvas.width
            const cy = punto.y * canvas.height
            const r  = 60  // radio del punto de calor en px

            const ratio = maxIntensidad > 0 ? punto.intensidad / maxIntensidad : 0

            // Color según intensidad
            let colorCore: string
            let colorMid:  string
            if (ratio >= 0.66) {
                colorCore = `rgba(239, 68,  68,  ${0.8 * ratio})`  // rojo
                colorMid  = `rgba(245, 158, 11,  ${0.4 * ratio})`  // amarillo
            } else if (ratio >= 0.33) {
                colorCore = `rgba(245, 158, 11,  ${0.8 * ratio})`  // amarillo
                colorMid  = `rgba(34,  197, 94,  ${0.4 * ratio})`  // verde
            } else {
                colorCore = `rgba(34,  197, 94,  ${0.8 * ratio})`  // verde
                colorMid  = `rgba(34,  197, 94,  ${0.2 * ratio})`
            }

            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
            grad.addColorStop(0,   colorCore)
            grad.addColorStop(0.5, colorMid)
            grad.addColorStop(1,   'rgba(0,0,0,0)')

            ctx.fillStyle = grad
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        })

    }, [puntos, maxIntensidad])

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