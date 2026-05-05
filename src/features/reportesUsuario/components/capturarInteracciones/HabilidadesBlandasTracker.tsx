// HabilidadesBlandasTracker.tsx

import apiClient from '@/api/api'
import { useEffect, useRef } from 'react'
import React from 'react'

const VISITOR_KEY = 'hf_visitor'
const API_BASE = apiClient.defaults.baseURL?.replace('/api', '') || ''

interface Props {
    children:      React.ReactElement<{ onVisible: (id: string) => void }>
    portfolioSlug: string
}

export function HabilidadesBlandasTracker({ children, portfolioSlug }: Props) {
    const wrapperRef  = useRef<HTMLDivElement>(null)
    const hoverTimers = useRef<Record<string, number>>({})

    function enviar(idHabilidad: string, campo: string, valor: number) {
        const visitorId = localStorage.getItem(VISITOR_KEY)
        if (!visitorId) return

        console.log('📊 Habilidad blanda:', { idHabilidad, campo, valor }) // temporal

        const payload = new Blob(
            [JSON.stringify({
                visitor_id:     visitorId,
                portfolio_slug: portfolioSlug,
                id_habilidad:   idHabilidad,
                campo,
                valor
            })],
            { type: 'application/json' }
        )

        navigator.sendBeacon(
            `${API_BASE}/api/public/heatmap/habilidades-blandas/track`,
            payload
        )
    }

    // ── Visibilidad ──
    function handleVisible(idHabilidad: string) {
        enviar(idHabilidad, 'fue_visible', 1)
    }

    // ── Hovers ──
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return

        function onEnter(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-habilidad-id]')
            if (!target) return
            const id = (target as HTMLElement).dataset.habilidadId!
            hoverTimers.current[id] = Date.now()
        }

        function onLeave(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest('[data-habilidad-id]')
            if (!target) return
            const id     = (target as HTMLElement).dataset.habilidadId!
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

    return (
        <div ref={wrapperRef}>
            {React.cloneElement(children, {
                onVisible: handleVisible  // ← inyecta la función al hijo
            })}
        </div>
    )
}