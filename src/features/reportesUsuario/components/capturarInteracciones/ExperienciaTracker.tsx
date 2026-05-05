// src/features/reportesUsuario/components/capturarInteracciones/ExperienciaTracker.tsx

import apiClient from '@/api/api'
import { useEffect, useRef } from 'react'
import { getHeatmapCoords } from '../../utils/heatmap'

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''

interface Props {
    children:      React.ReactNode
    portfolioSlug: string
}

export function ExperienciaTracker({ children, portfolioSlug }: Props) {
    const wrapperRef  = useRef<HTMLDivElement>(null)
    const hoverTimers = useRef<Record<string, number>>({})

    function enviar(idExperiencia: string, campo: string, valor: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        console.log('📊 Experiencia track:', {
            idExperiencia,
            campo,
            valor,
            portfolio_slug: portfolioSlug,
        })

        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug,
                id_experiencia: idExperiencia,
                campo,
                valor
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(
            `${API_BASE}/api/public/heatmap/experiencia/track`,
            payload
        )
    }

    function enviarCoordenadas(idExperiencia: string, campo: string, x: number, y: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return
        const payload = new Blob(
            [JSON.stringify({ visitor_id: visitorId, portfolio_slug: portfolioSlug, id_experiencia: idExperiencia, campo, x, y })],
            { type: 'application/json' }
        )
        navigator.sendBeacon(`${API_BASE}/api/public/heatmap/experiencia/clic-coords`, payload)
    }

    // ── Hovers ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onClic(e: MouseEvent) {
            const el = wrapperRef.current
            if (!el) return
            const coords = getHeatmapCoords(e, el)
            const target = (e.target as HTMLElement).closest('[data-experiencia-id]')
            if (!target) return
            const id = (target as HTMLElement).dataset.experienciaId!
            enviarCoordenadas(id, 'clic_general', coords.x, coords.y)
        }

        function onEnter(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-experiencia-id]')
            if (!target) return
            const id = (target as HTMLElement).dataset.experienciaId!
            hoverTimers.current[id] = Date.now()
        }

        function onLeave(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-experiencia-id]')
            if (!target) return
            const id     = (target as HTMLElement).dataset.experienciaId!
            const inicio = hoverTimers.current[id]
            if (!inicio) return

            const ms = Date.now() - inicio
            delete hoverTimers.current[id]
            if (ms < 200) return

            enviar(id, 'hover_count', 1)
            enviar(id, 'hover_ms', ms)
        }

       
        el.addEventListener('click', onClic)
        el.addEventListener('mouseover', onEnter)
        el.addEventListener('mouseout',  onLeave)
        return () => {
            el.removeEventListener('click', onClic)
            el.removeEventListener('mouseover', onEnter)
            el.removeEventListener('mouseout',  onLeave)
        }
    }, [portfolioSlug])

    // ── Visibilidad ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        const yaVistos = new Set<string>()

        const items = el.querySelectorAll('[data-experiencia-id]')

        items.forEach(item => {
            const id = (item as HTMLElement).dataset.experienciaId!

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !yaVistos.has(id)) {
                        yaVistos.add(id)
                        enviar(id, 'fue_visible', 1)
                        observer.disconnect()
                    }
                },
                { threshold: 0.15 }
            )

            observer.observe(item)
        })
    }, [portfolioSlug])

    return <div ref={wrapperRef}>{children}</div>
}