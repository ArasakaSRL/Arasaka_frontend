import apiClient from '@/api/api'
import { useEffect, useRef } from 'react'
import { getHeatmapCoords } from '../../utils/heatmap'

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''

interface Props {
    children:      React.ReactNode
    portfolioSlug: string
}

export function ProyectosTracker({ children, portfolioSlug }: Props) {
    const wrapperRef  = useRef<HTMLDivElement>(null)
    const hoverTimers = useRef<Record<string, number>>({})

    function enviar(idProyecto: string, campo: string, valor: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        console.log('📊 Proyecto track:', { idProyecto, campo, valor })

        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug,
                id_proyecto:    idProyecto,
                campo,
                valor
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(
            `${API_BASE}/api/public/heatmap/proyecto/track`,
            payload
        )
    }

    function enviarCoordenadas(idProyecto: string, campo: string, x: number, y: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return
        const payload = new Blob(
            [JSON.stringify({ visitor_id: visitorId, portfolio_slug: portfolioSlug, id_proyecto: idProyecto, campo, x, y })],
            { type: 'application/json' }
        )
        navigator.sendBeacon(`${API_BASE}/api/public/heatmap/proyecto/clic-coords`, payload)
    }

    // ── Clics ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onClic(e: MouseEvent) {
            const el = wrapperRef.current
            if (!el) return
            const coords = getHeatmapCoords(e, el)
            const target = (e.target as HTMLElement).closest('[data-proyecto-action]')
            if (!target) return
            

            const accion    = (target as HTMLElement).dataset.proyectoAction!
            const idTarget  = (target as HTMLElement).closest('[data-proyecto-id]')
            if (!idTarget) return
            const id = (idTarget as HTMLElement).dataset.proyectoId!

            enviar(id, accion, 1)
            enviarCoordenadas(id, accion, coords.x, coords.y) 
        }

        el.addEventListener('click', onClic)
        return () => el.removeEventListener('click', onClic)
    }, [portfolioSlug])

    // ── Hovers ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onEnter(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-proyecto-id]')
            if (!target) return
            const id = (target as HTMLElement).dataset.proyectoId!
            hoverTimers.current[id] = Date.now()
        }

        function onLeave(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-proyecto-id]')
            if (!target) return
            const id     = (target as HTMLElement).dataset.proyectoId!
            const inicio = hoverTimers.current[id]
            if (!inicio) return

            const ms = Date.now() - inicio
            delete hoverTimers.current[id]
            if (ms < 200) return

            enviar(id, 'hover_count', 1)
            enviar(id, 'hover_ms', ms)
        }

        el.addEventListener('mouseover', onEnter)
        el.addEventListener('mouseout',  onLeave)
        return () => {
            el.removeEventListener('mouseover', onEnter)
            el.removeEventListener('mouseout',  onLeave)
        }
    }, [portfolioSlug])

    return <div ref={wrapperRef}>{children}</div>
}