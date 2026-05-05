import { useEffect, useRef } from 'react'
import { getHeatmapCoords } from '../../utils/heatmap'
import apiClient from '@/api/api'

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL//no olvidar colocar el link deploy

interface Props {
    children:      React.ReactNode
    portfolioSlug: string
}

export function PortfolioHeaderTracker({ children, portfolioSlug }: Props) {
    const wrapperRef  = useRef<HTMLDivElement>(null)
    const hoverTimers = useRef<Record<string, number>>({})

    function enviar(campo: string, valor: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        // ── LOG TEMPORAL ──
        console.log('📊 Heatmap track:', {
            campo,
            valor,
            visitor_id:     visitorId,
            portfolio_slug: portfolioSlug,
            timestamp:      new Date().toISOString()
        })
        // ── FIN LOG TEMPORAL ──

        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug,
                campo,
                valor
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(`${API_BASE}/public/heatmap/perfil/track`, payload)
    }

    // ── Clics ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return
        
        function enviarCoordenadas(campo: string, x: number, y: number) {
            const visitorId = localStorage.getItem(VISITOR_KEY)
            if (!visitorId) return

            const payload = new Blob(
                [JSON.stringify({
                    visitor_id:     visitorId,
                    portfolio_slug: portfolioSlug,
                    campo,
                    x,
                    y
                })],
                { type: 'application/json' }
            )

            navigator.sendBeacon(
                `${API_BASE}/public/heatmap/perfil/clic-coords`,
                payload
            )
        }

        function onClic(e: MouseEvent) {
            const el = wrapperRef.current
            if (!el) return

            const coords = getHeatmapCoords(e, el)

            // ── LOG TEMPORAL ──
            console.log('🎯 Clic capturado:', {
                campo:  (e.target as HTMLElement).closest('[data-track]')
                            ? ((e.target as HTMLElement).closest('[data-track]') as HTMLElement).dataset.track
                            : 'fuera de zona',
                x:      coords.x.toFixed(4),
                y:      coords.y.toFixed(4),
                pixel_x: e.clientX,
                pixel_y: e.clientY,
            })
            // ── FIN LOG TEMPORAL ──

            const target = (e.target as HTMLElement).closest('[data-track]')
            if (!target) return

            const campo = (target as HTMLElement).dataset.track!
            enviar(campo, 1)
            enviarCoordenadas(campo, coords.x, coords.y)
        }

        el.addEventListener('click', onClic)
        return () => el.removeEventListener('click', onClic)
    }, [portfolioSlug])

    // ── Hovers ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onEnter(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-hover]')
            if (!target) return
            const zona = (target as HTMLElement).dataset.hover!
            hoverTimers.current[zona] = Date.now()
        }

        function onLeave(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-hover]')
            if (!target) return
            const zona   = (target as HTMLElement).dataset.hover!
            const inicio = hoverTimers.current[zona]
            if (!inicio) return

            const ms = Date.now() - inicio
            delete hoverTimers.current[zona]
            if (ms < 200) return

            enviar(`hover_${zona}_count`, 1)
            enviar(`hover_${zona}_ms`, ms)
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